let currentImageIndex = 0;
let imageCount = 0;
const mainImage = document.querySelector('.main-image img');
const titleElement = document.querySelector('.title');
const authorElement = document.querySelector('.author');
const thumbnailContainer = document.getElementById('thumbnail-container');
const data = {}; // To store the JSON data

async function loadImageData() {
  try {
    const response = await fetch('images.json');
    const jsonData = await response.json();
    Object.assign(data, jsonData); // Store the JSON data

    const filenames = Object.keys(data);
    imageCount = filenames.length;

    for (const filename of filenames) {
      const { author, title, thumbnail } = data[filename];
      const thumbnailSrc = getThumbnailPath(thumbnail); // Construct the thumbnail path

      const thumbnailElement = document.createElement('img');
      thumbnailElement.src = thumbnailSrc;
      thumbnailElement.alt = filename;
      thumbnailElement.onclick = () => setMainImage(filename, author, title);

      thumbnailContainer.appendChild(thumbnailElement);
    }
    console.log(data);
    const firstImage = filenames[0];
    const { author, title } = data[firstImage];
    setMainImage(firstImage, author, title);
  } catch (error) {
    console.error('Error fetching or parsing images.json:', error);
  }
}

function getThumbnailPath(thumbnailFilename) {
  const thumbnailDirectory = isWindows() ? 'images\\thumbnails' : 'images/thumbnails';
  return `${thumbnailDirectory}/${thumbnailFilename}`;
}

function isWindows() {
  return navigator.platform.startsWith('Win');
}

function changeImage(direction) {
  currentImageIndex = (currentImageIndex + direction + imageCount) % imageCount;
  const filename = `image${currentImageIndex + 1}`;
  const { author, title } = data[filename];
  setMainImage(filename, author, title);
}

function setMainImage(filename, author, title) {
  const { filename: largeImageFilename } = data[filename];
  const largeImagePath = `images/${largeImageFilename}`;
  mainImage.src = largeImagePath;
  titleElement.textContent = title;
  authorElement.textContent = author;
}

// Load image data and set initial image
loadImageData();
