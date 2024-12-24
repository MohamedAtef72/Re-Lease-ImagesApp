// Get reference to the elements in the website
const inputBox = document.getElementById("input-box");
const searchButton = document.getElementById("search-button");
const grid = document.getElementById("grid");

const UNSPLASH_ACCESS_KEY = "xvXn0NX8qlFywdLwjQSXNAwh-4lBF2pdWwQm0yeAlyU";

// Get the images from the api
const fetchImages = async (query) => {
  try {
    const response = await axios.get(`https://api.unsplash.com/search/photos`, {
      params: {
        query: query,
        per_page: 12,
      },
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });

    displayImages(response.data.results);
  } catch (error) {
    console.error("Error fetching images:", error);
  }
};

// Display the images on the website
const displayImages = (images) => {
  grid.innerHTML = "";
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

// Event Listener for the searchButton
searchButton.addEventListener("click", () => {
  const query = inputBox.value.trim();
  if (query) {
    fetchImages(query);
  }
});
