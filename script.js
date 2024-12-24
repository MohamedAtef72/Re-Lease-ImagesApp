const inputBox = document.getElementById("input-box");
const searchButton = document.getElementById("search-button");
const grid = document.getElementById("grid");

const UNSPLASH_ACCESS_KEY = "xvXn0NX8qlFywdLwjQSXNAwh-4lBF2pdWwQm0yeAlyU";

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

const displayImages = (images) => {
  grid.innerHTML = "";
  images.forEach((image) => {
    const imgElement = document.createElement("div");
    imgElement.classList.add("img");
    imgElement.style.backgroundImage = `url(${image.urls.small})`;
    imgElement.title = image.alt_description || "Image";
    grid.appendChild(imgElement);
  });
};

searchButton.addEventListener("click", () => {
  const query = inputBox.value.trim();
  if (query) {
    fetchImages(query);
  }
});
