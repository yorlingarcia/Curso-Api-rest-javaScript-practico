const api = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  headers: {
    "Content-Type": "application/json,charset=utf-8",
  },
  params: {
    api_key: API_KEY,
  },
});

// aux

function createMovies(movies, container) {
  container.innerHTML = "";
  movies.forEach((movie) => {
    const movieContainer = document.createElement("div");
    movieContainer.classList.add("movie-container");
    const movieImg = document.createElement("img");
    movieImg.classList.add("movie-img");
    movieImg.setAttribute("alt", movie.title);
    movieImg.setAttribute(
      "src",
      "https://image.tmdb.org/t/p/w300" + movie.poster_path
    );
    movieContainer.appendChild(movieImg);
    container.appendChild(movieContainer);
  });
}

async function getTrendingMoviesPreview() {
  const { data } = await api("trending/movie/day");
  //const response = await fetch(
  //  "https://api.themoviedb.org/3/trending/movie/day?api_key=" + API_KEY
  //);
  //const data = await response.json();
  //trendingMoviesPreviewList.innerHTML = "";
  createMovies(data.results, trendingMoviesPreviewList);
  // const movies = data.results;
  // movies.forEach((movie) => {
  //   const movieContainer = document.createElement("div");
  //   movieContainer.classList.add("movie-container");
  //   const movieImg = document.createElement("img");
  //   movieImg.classList.add("movie-img");
  //   movieImg.setAttribute("alt", movie.title);
  //   movieImg.setAttribute(
  //     "src",
  //     "https://image.tmdb.org/t/p/w300" + movie.poster_path
  //   );
  //   movieContainer.appendChild(movieImg);
  //   trendingMoviesPreviewList.appendChild(movieContainer);
  // });
}

async function getCategoriesPreview() {
  // const response = await fetch(
  //   "https://api.themoviedb.org/3/genre/movie/list?api_key=" + API_KEY
  // );
  const { data } = await api("genre/movie/list");
  //const data = await response.json();
  const categories = data.genres;
  categoriesPreviewList.innerHTML = "";
  categories.forEach((category) => {
    //const categoriesPreviewList = document.querySelector(
    //  "#categoriesPreview .categoriesPreview-list"
    //);
    const categoryContainer = document.createElement("div");
    categoryContainer.classList.add("categorie-container");
    const categoryTitle = document.createElement("h3");
    categoryTitle.classList.add("category-title");
    categoryTitle.setAttribute("id", "id" + category.id);
    categoryTitle.addEventListener("click", () => {
      location.hash = `#category=${category.id}-${category.name}`;
    });
    const categoryTitleText = document.createTextNode(category.name);

    categoryTitle.appendChild(categoryTitleText);
    categoryContainer.appendChild(categoryTitle);
    categoriesPreviewList.appendChild(categoryContainer);
  });
}

async function getMoviesByCategory(id) {
  const { data } = await api("discover/movie", {
    params: {
      with_genres: id,
    },
  });
  //genericSection.innerHTML = "";
  createMovies(data.results, genericSection);
  // const movies = data.results;
  // movies.forEach((movie) => {
  //   const movieContainer = document.createElement("div");
  //   movieContainer.classList.add("movie-container");
  //   const movieImg = document.createElement("img");
  //   movieImg.classList.add("movie-img");
  //   movieImg.setAttribute("alt", movie.title);
  //   movieImg.setAttribute(
  //     "src",
  //     "https://image.tmdb.org/t/p/w300" + movie.poster_path
  //   );
  //   movieContainer.appendChild(movieImg);
  //   genericSection.appendChild(movieContainer);
  // });
}
