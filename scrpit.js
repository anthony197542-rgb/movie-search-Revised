const API_KEY = "c9f7240a";

// Global state
let currentMovies = [];

// Function to display movies in the gallery
function displayMovies(movies) {
  const gallery = document.querySelector(".movie-gallery");
  gallery.innerHTML = ""; // Clear previous results

  if (!movies || movies.length === 0) {
    gallery.innerHTML = "<p>No movies found.</p>";
    return;
  }

  movies.forEach(movie => {
    const card = document.createElement("div");
    card.classList.add("movie-card");

    card.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/150"}" 
           alt="${movie.Title}" class="movie-poster"/>
      <h3>${movie.Title}</h3>
      <p>${movie.Year}</p>
    `;

    // Attach click event for modal
    card.addEventListener("click", async () => {
      try {
        const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`);
        const details = await res.json();
        showMovieModal(details);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    });

    gallery.appendChild(card);
  });
}

// Function to search movies
async function searchMovies() {
  const query = document.getElementById("search-input").value.trim();
  const gallery = document.querySelector(".movie-gallery");

  if (!query) {
    gallery.innerHTML = "<p>Please enter a movie title.</p>";
    return;
  }

  // Show loading state
  gallery.innerHTML = "<h2>Loading...</h2>";

  try {
    const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`);
    const data = await response.json();

    if (data.Response === "True") {
      currentMovies = data.Search;
      displayMovies(currentMovies);
    } else {
      gallery.innerHTML = "<p>No movies found. Try a different search term.</p>";
    }
  } catch (error) {
    console.error("API error:", error);
    gallery.innerHTML = "<p>Something went wrong. Please try again later.</p>";
  }
}

// Function to show modal with movie details
function showMovieModal(details) {
  const modal = document.getElementById("movie-modal");
  const modalBody = document.getElementById("modal-body");
  const closeBtn = document.getElementById("modal-close");

  modalBody.innerHTML = `
    <h2>${details.Title} (${details.Year})</h2>
    <img src="${details.Poster !== "N/A" ? details.Poster : "https://via.placeholder.com/150"}" 
         alt="${details.Title}" class="modal-poster"/>
    <p><strong>Genre:</strong> ${details.Genre}</p>
    <p><strong>Director:</strong> ${details.Director}</p>
    <p><strong>Plot:</strong> ${details.Plot}</p>
    <p><strong>IMDB Rating:</strong> ${details.imdbRating}</p>
  `;

  modal.style.display = "block";

  // Close modal when clicking X
  closeBtn.onclick = () => {
    modal.style.display = "none";
  };

  // Close modal when clicking outside
  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
}

// Function to sort movies
function setupSorting() {
  const sortSelect = document.getElementById("sort-select");
  if (!sortSelect) return;

  sortSelect.addEventListener("change", (e) => {
    const value = e.target.value;
    let sortedMovies = [...currentMovies];

    if (value === "newest") {
      sortedMovies.sort((a, b) => b.Year.localeCompare(a.Year));
    } else if (value === "oldest") {
      sortedMovies.sort((a, b) => a.Year.localeCompare(b.Year));
    } else if (value === "title") {
      sortedMovies.sort((a, b) => a.Title.localeCompare(b.Title));
    }

    displayMovies(sortedMovies);
  });
}

// Setup event listeners once DOM is ready
window.addEventListener("DOMContentLoaded", () => {
  const searchButton = document.getElementById("search-button");
  const searchInput = document.getElementById("search-input");

  if (searchButton) {
    searchButton.addEventListener("click", searchMovies);
  }

  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        searchMovies();
      }
    });
  }

  setupSorting();
});





