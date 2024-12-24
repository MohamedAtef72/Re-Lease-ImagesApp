const randomButton = document.getElementById("random-button");
const inputBox = document.getElementById("input-box");
const searchButton = document.getElementById("search-button");
const grid = document.getElementById("grid");

const UNSPLASH_ACCESS_KEY = "xvXn0NX8qlFywdLwjQSXNAwh-4lBF2pdWwQm0yeAlyU";

// Function to fetch 12 random photos
const fetchRandomPhotos = async () => {
  try {
    const response = await axios.get(`https://api.unsplash.com/photos/random`, {
      params: {
        client_id: UNSPLASH_ACCESS_KEY,
        count: 12,
      },
    });
    displayImages(response.data);
  } catch (error) {
    console.error("Error fetching random images:", error);
  }
};

// Function to fetch photos based on a topic
const fetchPhotosByTopic = async (topic) => {
  try {
    const response = await axios.get(`https://api.unsplash.com/search/photos`, {
      params: {
        query: topic,
        per_page: 12,
        client_id: UNSPLASH_ACCESS_KEY,
      },
    });
    displayImages(response.data.results);
  } catch (error) {
    console.error("Error fetching topic-related images:", error);
  }
};

// Function to display the images in the grid
const displayImages = (images) => {
  grid.innerHTML = "";  // Clear previous images
  images.forEach((image) => {
    const imgElement = document.createElement("div");
    imgElement.classList.add("img");
    imgElement.style.backgroundImage = `url(${image.urls.small})`;

    const overlay = document.createElement("div");
    overlay.classList.add("overlay");

    const artist = document.createElement("div");
    artist.classList.add("artist");
    artist.textContent = image.user.name || "Unknown Artist";

    const downloadLink = document.createElement("a");
    downloadLink.classList.add("download-link");
    downloadLink.href = image.links.download || "#";
    downloadLink.textContent = "Download";
    downloadLink.target = "_blank";

    overlay.appendChild(artist);
    overlay.appendChild(downloadLink);
    imgElement.appendChild(overlay);

    grid.appendChild(imgElement);
  });
};

// Function to handle the random button click
randomButton.addEventListener("click", async () => {
  try {
    const response = await axios.get(`https://api.unsplash.com/photos/random`, {
      params: {
        client_id: UNSPLASH_ACCESS_KEY,
        count: 1,
      },
    });
    const photo = response.data[0];
    const topic = photo.tags && photo.tags.length > 0
      ? photo.tags[0].title
      : "nature";
    inputBox.value = topic;
    fetchPhotosByTopic(topic);
  } catch (error) {
    console.error("Error fetching a random topic:", error);
  }
});

// Event listener for the searchButton
searchButton.addEventListener("click", () => {
  const query = inputBox.value.trim();
  if (query) {
    fetchPhotosByTopic(query);
  }
});

// Fetch initial set of random images on load
window.onload = () => {
  fetchRandomPhotos();
};