import UNSPLASH_ACCESS_KEY from "./env.js";

const randomButton = document.getElementById("random-button");
const inputBox = document.getElementById("input-box");
const searchButton = document.getElementById("search-button");
const nextButton = document.getElementById("next-button");
const prevButton = document.getElementById("prev-button");
const websiteTitle = document.getElementById("web-title");
const grid = document.getElementById("grid");

let currentPage = 1;
let currentQuery = "";
let isRandomMode = true;

// Function to fetch photos based on a topic and page
const fetchPhotosByTopic = async (topic, page = 1) => {
  prevButton.disabled = true;
  try {
    const response = await axios.get(`https://api.unsplash.com/search/photos`, {
      params: {
        query: topic,
        per_page: 12,
        page,
        client_id: UNSPLASH_ACCESS_KEY,
      },
    });
    if (response.data.results.length === 0) {
      toastr.error("Failed topic: No related photos found.", "Error", {
        onHidden: () => {
          inputBox.value = "";
          currentQuery = "";
          currentPage = 1;
          isRandomMode = true;
        },
      });
    } else {
      displayImages(response.data.results);
    }
  } catch (error) {
    console.error("Error fetching topic-related images:", error);
  }
};

// Function to fetch 12 random photos
const fetchRandomPhotos = async (page = 1) => {
  prevButton.disabled = true;
  try {
    const response = await axios.get(`https://api.unsplash.com/photos`, {
      params: {
        client_id: UNSPLASH_ACCESS_KEY,
        per_page: 12,
        page,
      },
    });
    displayImages(response.data);
  } catch (error) {
    console.error("Error fetching random images:", error);
  }
};

// Function to display the images in the grid
const displayImages = (images) => {
  grid.innerHTML = "";
  images.forEach((image) => {
    const imgWrapper = document.createElement("a");
    imgWrapper.href = image.links.download || "#";
    imgWrapper.target = "_blank";

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
    imgWrapper.appendChild(imgElement);
    grid.appendChild(imgWrapper);
  });
};

// Function to handle the random button click
randomButton.addEventListener("click", async () => {
  try {
    const response = await axios.get(`https://api.unsplash.com/photos/random`, {
      params: {
        client_id: UNSPLASH_ACCESS_KEY,
      },
    });
    const photo = response.data;
    const topic =
      photo.tags && photo.tags.length > 0 ? photo.tags[0].title : "nature";
    inputBox.value = topic;
    currentQuery = topic;
    currentPage = 1;
    isRandomMode = false;
    fetchPhotosByTopic(topic, currentPage);
  } catch (error) {
    console.error("Error fetching a random topic:", error);
  }
});

// Event listener for the search button
searchButton.addEventListener("click", () => {
  const query = inputBox.value.trim();
  if (query) {
    currentQuery = query;
    currentPage = 1;
    isRandomMode = false;
    fetchPhotosByTopic(query, currentPage);
  } else {
    isRandomMode = true;
    currentPage = 1;
    fetchRandomPhotos(currentPage);
  }
});

// Event listener for the next button
nextButton.addEventListener("click", () => {
  currentPage++;
  if (isRandomMode) {
    fetchRandomPhotos(currentPage);
  } else {
    fetchPhotosByTopic(currentQuery, currentPage);
  }
  prevButton.disabled = currentPage === 1;
});

// Event listener for the previous button
prevButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    if (isRandomMode) {
      fetchRandomPhotos(currentPage);
    } else {
      fetchPhotosByTopic(currentQuery, currentPage);
    }
    prevButton.disabled = currentPage === 1;
  }
});
// Fetch initial set of random images on load
window.onload = () => {
  fetchRandomPhotos();
  prevButton.disabled = true;
};
websiteTitle.addEventListener("click", () => {
  inputBox.value = "";
  currentQuery = "";
  currentPage = 1;
  isRandomMode = true;
  fetchRandomPhotos();
  prevButton.disabled = true;
});
