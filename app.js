const moviesWrapper = document.querySelector(".movies");
const searchName = document.querySelector('.searchName');



function searchChange(event) {
 renderMovies(event.target.value)
 searchName.innerHTML = event.target.value;
}
let currentMovies = [];

async function renderMovies(searchTerm) {
  const respone = await fetch(
    'https://omdbapi.com/?s={searchTerm}&apikey= c9f7240a'
  );
  const data = await response.json();
currentMovies = data.search;
 displayMovies(currentMovies)

}
        function displayMovies(movielist) {
       moviesWrapper.innerHTML = moviesArr
  .slice(0, 6)
  .map((movie) => {
    return `
    <div class="movie">
      <img src=${movie.Poster} alt="" />
      <h2>${movie.Title</h2>
      <h4>${movie.Year</h4>
        <button>Learn More</button>
        </div>
      `;
        .join("");
        }