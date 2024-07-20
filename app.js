const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const os = require('os');
const fs = require('fs');
const Spotify = require('./lib/spotify.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

app.post('/download', async (req, res) => {
  const { url, type } = req.body;

  if (type === 'instagram') {
    try {
      const apiResponse = await fetch(`https://www.guruapi.tech/api/igdlv1?url=${url}`);
      const data = await apiResponse.json();

      if (!data || !data.data) {
        return res.status(404).json({ message: 'Tidak ada video atau gambar yang ditemukan coba lagi.' });
      }

      res.json(data.data);
    } catch (error) {
      res.status(500).json({ message: `An error occurred: ${error.message}` });
    }
  } else if (type === 'spotify') {
    try {
      const apiUrl = `https://www.guruapi.tech/api/spotifyinfo?text=${encodeURIComponent(url)}`;
      const response = await fetch(apiUrl);
      if (!response.ok) {
        return res.status(500).json({ message: 'Error searching for song' });
      }
      const data = await response.json();
      const coverImage = data.spty.results.thumbnail;
      const name = data.spty.results.title;
      const slink = data.spty.results.url;
      const dlapi = `https://www.guruapi.tech/api/spotifydl?text=${encodeURIComponent(url)}`;
      const audioResponse = await fetch(dlapi);
      if (!audioResponse.ok) {
        return res.status(500).json({ message: 'Error fetching audio' });
      }
      const audioBuffer = await audioResponse.buffer();
      const tempDir = os.tmpdir();
      const audioFilePath = path.join(tempDir, `${name}.mp3`);

      fs.writeFileSync(audioFilePath, audioBuffer);

      res.json({
        coverImage,
        name,
        slink,
        audioFilePath
      });
    } catch (error) {
      res.status(500).json({ message: `An error occurred: ${error.message}` });
    }
  } else if (type === 'spotify2') {
    try {
      const spotify = new Spotify(url);
      const info = await spotify.getInfo();

      if (info.error) {
        return res.status(400).json({ message: 'Invalid Spotify link' });
      }

      const { name, artists, album_name, release_date, cover_url } = info;
      const details = {
        title: name,
        artists: artists.join(', '),
        album: album_name,
        releaseDate: release_date,
        coverUrl: cover_url
      };

      const audioBuffer = await spotify.download();
      const tempDir = os.tmpdir();
      const audioFilePath = path.join(tempDir, `${name}.mp3`);

      fs.writeFileSync(audioFilePath, audioBuffer);

      res.json({
        ...details,
        audioFilePath
      });
    } catch (error) {
      res.status(500).json({ message: `An error occurred: ${error.message}` });
    }
  } else {
    res.status(400).json({ message: 'Invalid type' });
  }
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
