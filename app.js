// ===== Custom Movies =====
const customMovies = [
  {
    Title: "Gladiator",
    Year: "2000",
    Poster: "images/gladiator.jpg"
  },
  {
    Title: "Batman",
    Year: "1989",
    Poster: "images/batman.jpg"
  },
  {
    Title: "Spider-Man",
    Year: "2002",
    Poster: "images/spiderman.jpg"
  },
  {
    Title: "The Polar Express",
    Year: "2004",
    Poster: "images/polarexpress.jpg"
  },
  {
    Title: "Friday the 13th",
    Year: "1980",
    Poster: "images/friday13th.jpg"
  },
  {
    Title: "The Muppets",
    Year: "2011",
    Poster: "images/muppets.jpg"
  },
  {
    Title: "Veil",
    Year: "2023",
    Poster: "images/veil.jpg"
  },
  {
    Title: "The Goonies",
    Year: "1985",
    Poster: "images/goonies.jpg"
  }
];

// This will store the movies we get from the API + custom ones
let currentMovies = [];

// ===== Search Movies via OMDb =====
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
    currentMovies = [...data.Search, ...customMovies];

    // Display the movies
    displayMovies(currentMovies);

  } catch (error) {
    console.error("API error:", error);
  }
}

// ===== Display Movies =====
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

// ===== Sorting Logic =====
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

// ===== Show Custom Movies on Page Load =====
window.addEventListener("DOMContentLoaded", () => {
  currentMovies = [...customMovies];
  displayMovies(currentMovies);
});

