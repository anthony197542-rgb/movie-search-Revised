const moviesWrapper = document.querySelector(".movies");
const searchName = document.querySelector(".searchName");

let currentMovies = [];
let currentFilter = "all";

// Handle search input
function searchChange(event) {
  const searchTerm = event.target.value;
  searchName.innerHTML = searchTerm; // show current search term
  renderMovies(searchTerm);           // fetch movies from API
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
function searchMovies() {
  const query = document.getElementById("searchInput").value;

  fetch(`https://www.omdbapi.com/?apikey=c9f7240a&s=${query}`)
    .then(res => res.json())
    .then(data => {
      const results = document.querySelector(".results");
      results.innerHTML = data.Search
        .map(movie => `<h3>${movie.Title}</h3>`)
        .join("");
    });
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
    return displayMovies(currentMovies);
  }

  const filtered = currentMovies.filter((movie) =>
    (movie.Type || "").toLowerCase().includes(genre.toLowerCase())
  );

  displayMovies(filtered);
}

// --- HOOK UP SEARCH BAR ---
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", searchChange);

// Initial render (optional default search)
renderMovies("Batman");



 