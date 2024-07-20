document.getElementById('downloadForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const url = document.getElementById('url').value;
  const type = document.getElementById('type').value;
  const resultsContainer = document.querySelector('.results-container'); // Memilih container hasil

  try {
    // Kode untuk fetch data dari server
    const response = await fetch('/download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url, type })
    });

    const result = await response.json();

    if (response.status !== 200) {
      resultsContainer.innerHTML = `<div class="alert alert-danger">${result.message}</div>`;
      return;
    }

    resultsContainer.innerHTML = ''; // Kosongkan konten sebelum menambahkan hasil

    // Logika untuk menampilkan hasil download
    if (type === 'instagram') {
      result.forEach(media => {
        const mediaType = media.type;
        const mediaURL = media.url_download;
        const mediaElement = document.createElement(mediaType === 'image' ? 'img' : 'video');
        const downloadButton = document.createElement('a');

        if (mediaType === 'video') {
          mediaElement.controls = true;
        }

        mediaElement.src = mediaURL;
        mediaElement.className = 'img-fluid';
        mediaElement.style.margin = '10px 0';

        downloadButton.href = mediaURL;
        downloadButton.textContent = 'Download';
        downloadButton.className = 'btn btn-success btn-block';
        downloadButton.download = '';
        downloadButton.style.margin = '10px 0';

        resultsContainer.appendChild(mediaElement);
        resultsContainer.appendChild(downloadButton);
      });
      } else if (type === 'spotify') {
        const { coverImage, name, slink, audioFilePath } = result;
        const imgElement = document.createElement('img');
        imgElement.src = coverImage;
        imgElement.className = 'img-fluid';
        imgElement.style.margin = '10px 0';
  
        const nameElement = document.createElement('p');
        nameElement.textContent = `Title: ${name}`;
  
        const linkElement = document.createElement('a');
        linkElement.href = slink;
        linkElement.textContent = 'Spotify Link';
        linkElement.target = '_blank';
  
        const audioElement = document.createElement('audio');
        audioElement.controls = true;
        audioElement.src = `/downloaded_audio/${encodeURIComponent(name)}.mp3`;
  
        const downloadButton = document.createElement('a');
        downloadButton.href = `/downloaded_audio/${encodeURIComponent(name)}.mp3`;
        downloadButton.textContent = 'Download';
        downloadButton.className = 'btn btn-success btn-block';
        downloadButton.download = '';
        downloadButton.style.margin = '10px 0';
  
        resultsDiv.appendChild(imgElement);
        resultsDiv.appendChild(nameElement);
        resultsDiv.appendChild(linkElement);
        resultsDiv.appendChild(audioElement);
        resultsDiv.appendChild(downloadButton);
      } else if (type === 'spotify2') {
        const { title, artists, album, releaseDate, coverUrl, audioFilePath } = result;
        const imgElement = document.createElement('img');
        imgElement.src = coverUrl;
        imgElement.className = 'img-fluid';
        imgElement.style.margin = '10px 0';
  
        const titleElement = document.createElement('p');
        titleElement.textContent = `Title: ${title}`;
  
        const artistsElement = document.createElement('p');
        artistsElement.textContent = `Artists: ${artists}`;
  
        const albumElement = document.createElement('p');
        albumElement.textContent = `Album: ${album}`;
  
        const releaseDateElement = document.createElement('p');
        releaseDateElement.textContent = `Release Date: ${releaseDate}`;
  
        const audioElement = document.createElement('audio');
        audioElement.controls = true;
        audioElement.src = `/downloaded_audio/${encodeURIComponent(title)}.mp3`;
  
        const downloadButton = document.createElement('a');
        downloadButton.href = `/downloaded_audio/${encodeURIComponent(title)}.mp3`;
        downloadButton.textContent = 'Download';
        downloadButton.className = 'btn btn-success btn-block';
        downloadButton.download = '';
        downloadButton.style.margin = '10px 0';
  
        resultsDiv.appendChild(imgElement);
        resultsDiv.appendChild(titleElement);
        resultsDiv.appendChild(artistsElement);
        resultsDiv.appendChild(albumElement);
        resultsDiv.appendChild(releaseDateElement);
        resultsDiv.appendChild(audioElement);
        resultsDiv.appendChild(downloadButton);
      }
    } catch (error) {
      Swal.fire({
        imageUrl: 'https://telegra.ph/file/1890716217938ad30de0b.png',
        imageWidth: 200,
        imageHeight: 200,
        title: 'Maaf',
        text: 'Server Data Tidak Di Temukan!',
      });
    }
  });
  
  document.getElementById('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('night-mode');
    document.body.classList.toggle('light-mode');
  });
  