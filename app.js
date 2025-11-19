// Futuristic Movie DB — Full JS Logic
// Author: Anthony

const API_KEY = "c9f7240a";

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button"); // optional button
  const cardsContainer = document.getElementById("cards");
  const chips = document.querySelectorAll("#genreChips .chip");

  const navHome = document.getElementById("nav-home");
  const navTopRated = document.getElementById("nav-top-rated");
  const navPopular = document.getElementById("nav-popular");
  const navGenres = document.getElementById("nav-genres");

  // ==========================
  // SEARCH MOVIES (OMDb API)
  // ==========================
  async function searchMovies(query) {
    const url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.Response === "True") {
        renderGallery(data.Search);
      } else {
        cardsContainer.innerHTML = `<p>No results found for "${query}".</p>`;
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      cardsContainer.innerHTML = `<p>Something went wrong. Please try again.</p>`;
    }
  }

  // ==========================
  // RENDER MOVIE CARDS
  // ==========================
  function renderGallery(movies) {
    cardsContainer.innerHTML = "";
    movies.forEach(movie => {
      const card = document.createElement("article");
      card.classList.add("card");
      card.dataset.genre = "Unknown";
      card.dataset.year = movie.Year;
      card.dataset.rating = 0;
      card.innerHTML = `
        <div class="card__poster">
          <img src="${movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg"}" alt="${movie.Title}">
        </div>
        <div class="card__body">
          <div class="card__title">${movie.Title}</div>
          <div class="card__meta">${movie.Year}</div>
          <button class="btn-trailer" data-title="${movie.Title}">Watch Trailer</button>
        </div>
      `;
      cardsContainer.appendChild(card);
    });
    attachTrailerEvents();
  }

  // ==========================
  // TRAILER INLINE LOGIC
  // ==========================
  function attachTrailerEvents() {
    const buttons = document.querySelectorAll(".btn-trailer");
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        const title = btn.getAttribute("data-title");
        const cardBody = btn.closest(".card__body");

        // Prevent multiple iframes stacking
        const existingIframe = cardBody.querySelector("iframe");
        if (existingIframe) existingIframe.remove();

        cardBody.innerHTML += `
          <iframe width="300" height="200"
            src="https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(title + " trailer")}"
            frameborder="0" allowfullscreen>
          </iframe>
        `;
      });
    });
  }

  // ==========================
  // NAVIGATION LINKS
  // ==========================
  function getCards() {
    return Array.from(cardsContainer.querySelectorAll(".card"));
  }
  function renderCards(cards) {
    cardsContainer.innerHTML = "";
    cards.forEach(card => cardsContainer.appendChild(card));
  }

  navHome.addEventListener("click", e => {
    e.preventDefault();
    renderCards(getCards()); // reset to DOM order
  });

  navTopRated.addEventListener("click", e => {
    e.preventDefault();
    const sorted = getCards().sort((a, b) =>
      parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating)
    );
    renderCards(sorted);
  });

  navPopular.addEventListener("click", e => {
    e.preventDefault();
    const sorted = getCards().sort((a, b) =>
      parseInt(b.dataset.year) - parseInt(a.dataset.year)
    );
    renderCards(sorted);
  });

  navGenres.addEventListener("click", e => {
    e.preventDefault();
    document.getElementById("genreChips").scrollIntoView({ behavior: "smooth" });
  });

  // ==========================
  // FILTER BY GENRE (chips)
  // ==========================
  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      chips.forEach(c => c.classList.remove("chip--active"));
      chip.classList.add("chip--active");

      const selectedGenre = chip.dataset.genre.toLowerCase();
      const cards = getCards();
      cards.forEach(card => {
        const cardGenre = card.dataset.genre.toLowerCase();
        card.style.display =
          selectedGenre === "all" || cardGenre === selectedGenre ? "" : "none";
      });
    });
  });

  // ==========================
  // SEARCH BAR EVENTS
  // ==========================
  searchInput.addEventListener("keyup", e => {
    if (e.key === "Enter") {
      const query = searchInput.value.trim();
      if (query) searchMovies(query);
    }
  });

  if (searchButton) {
    searchButton.addEventListener("click", () => {
      const query = searchInput.value.trim();
      if (query) searchMovies(query);
    });
  }
});
