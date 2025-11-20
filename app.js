const moviesWrapper = document.querySelector(".movies");
const searchName = document.querySelector(".searchName");

let currentMovies = [];
let currentSearch = "";    // current search term
let currentFilter = "all";

// Handle search input
function searchChange(event) {
  renderMovies(event.target.value);
  searchName.innerHTML = event.target.value;
  applyFilters();
}

// Fetch movies from OMDb API
async function renderMovies(searchTerm) {
  try {
    const response = await fetch(
      `https://omdbapi.com/?s=${searchTerm}&apikey=c9f7240a`
    );
    const data = await response.json();

    if (data.Search) {
      currentMovies = data.Search;
      displayMovies(currentMovies);
    } else {
      moviesWrapper.innerHTML = "<p>No movies found.</p>";
    }
  } catch (error) {
    console.error("Error fetching movies:", error);
    moviesWrapper.innerHTML = "<p>Something went wrong. Try again later.</p>";
  }
}

// Render movie cards
function displayMovies(movielist) {
  moviesWrapper.innerHTML = movielist
    .slice(0, 6) // limit to 6 movies
    .map((movie) => {
      return `
        <div class="movie">
          <img src="${movie.Poster}" alt="${movie.Title}" />
          <h2>${movie.Title}</h2>
          <h4>${movie.Year}</h4>
          <button>Learn More</button>
        </div>
      `;
    })
    .join("");
}
// Sort dropdown
function sortChange(event) {
  const sortOption = event.target.value;
  let sortedMovies = [...currentMovies];

  if (sortOption === "newest") {
    sortedMovies.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
  } else if (sortOption === "oldest") {
    sortedMovies.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
  }

  displayMovies(sortedMovies);
}

// Genre filter buttons
function filterChange(genre) {
  if (!genre || genre.toLowerCase() === "all") {
    currentMovies = [...baseMovies];
    return displayMovies(currentMovies);
  }

  const filtered = baseMovies.filter((movie) =>
    (movie.Type || "").toLowerCase().includes(genre.toLowerCase())
  );

  currentMovies = filtered;
  displayMovies(currentMovies);
}