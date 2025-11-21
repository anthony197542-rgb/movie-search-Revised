
 // This will store the movies we get from the API
let currentMovies = [];


async function searchMovies() {
  const query = document.getElementById("searchInput").value;

  // Stop if empty
  if (!query) {
    alert("Please type a movie name first.");
    return;
  }

  try {
    const response = await fetch(`https://www.omdbapi.com/?apikey=c9f7240a&s=${query}`);
    const data = await response.json();

    const resultsContainer = document.querySelector(".results");

    // If no movies found
    if (!data.Search) {
      resultsContainer.innerHTML = "<p>No movies found.</p>";
      currentMovies = []; // reset
      return;
    }

    // Save the movies so sorting can use them
    currentMovies = data.Search;

    // Display the movies
    displayMovies(currentMovies);

  } catch (error) {
    console.error("API error:", error);
  }
}


function displayMovies(moviesArray) {
  const resultsContainer = document.querySelector(".results");

  resultsContainer.innerHTML = moviesArray
    .map(movie => {
      return `
        <div class="movie-item">
          <img class="movie_img" src="${movie.Poster}" width="120">
          <h3>${movie.Title}</h3>
          <p>${movie.Year}</p>
        </div>
      `;
    })
    .join("");
}


function sortChange(event) {
  const choice = event.target.value;

  // Copy the movies array
  let sorted = [...currentMovies];

  if (choice === "newest") {
    sorted.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
  }

  if (choice === "oldest") {
    sorted.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
  }

  displayMovies(sorted);
}
