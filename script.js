const randomButton = document.getElementById("random-button");
const inputBox = document.getElementById("input-box");
const grid = document.getElementById("grid");
window.onload = () => {
    clearGrid();
    // Unsplash API URL for 12 random photos
    const url = `https://api.unsplash.com/photos/random?client_id=z5LUKk3Qbky4069Ni_IhrgBj5Nm2Ml1LQG3JHUeOZH8&count=12`;
    axios.get(url)
        .then(response => {
            // Pass the response data to load images
            loadImages(response.data);
        })
        .catch(error => console.log("Error fetching images:", error));
};
// Function to load images into the grid
const loadImages = (photos) => {
    photos.forEach(photo => {
        // Create a div for each image
        const image = document.createElement("div");
        image.className = "img";
        image.style.backgroundImage = `url(${photo.urls.regular}&w=1366&h=768)`;
        // Open the image download link on double-click
        image.addEventListener("dblclick", function () {
            window.open(photo.links.download, '_blank');
        });
        document.querySelector("#grid").appendChild(image);
    });
};
// Event listener for the button
randomButton.addEventListener("click", () => {
    fetchRandomTopic();
});
// Function to fetch one random photo and extract a topic
const fetchRandomTopic = () => {
    const randomUrl = `https://api.unsplash.com/photos/random?client_id=z5LUKk3Qbky4069Ni_IhrgBj5Nm2Ml1LQG3JHUeOZH8`;
    axios.get(randomUrl)
        .then(response => {
            const photo = response.data[0];
            // Extract a tag or fallback to 'nature' if no tags are available
            const topic = photo.tags && photo.tags.length > 0
                ? photo.tags[0].title
                : "nature";
            // Set the topic in the input box
            inputBox.value = topic;
            // Fetch 12 photos related to this topic
            fetchPhotosByTopic(topic);
        })
        .catch(error => console.log("Error fetching a random topic:", error));
};
// Function to fetch 12 photos by topic
const fetchPhotosByTopic = (topic) => {
    clearGrid();
    const url = `https://api.unsplash.com/search/photos?client_id=z5LUKk3Qbky4069Ni_IhrgBj5Nm2Ml1LQG3JHUeOZH8&query=${topic}&per_page=12`;
    axios.get(url)
        .then(response => {
            const photos = response.data.results;
            loadImages(photos);
        })
        .catch(error => console.log("Error fetching topic-related images:", error));
};
// Function to clear the grid
const clearGrid = () => {
    grid.textContent = ""; 
};