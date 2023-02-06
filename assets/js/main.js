console.log("Hello world!");

async function getTrendingMoviesPreview() {
  const response = await fetch(
    "https://api.themoviedb.org/3/trending/movie/day?api_key=" + API_KEY
  );
  const data = await response.json();
  const movies = data.results;
  movies.forEach((movie) => {
    const trendingPreviewMoviesContainer = document.querySelector(
      "#trendingPreview .trendingPreview-movieList"
    );
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
    trendingPreviewMoviesContainer.appendChild(movieContainer);
  });

  console.log({ data, movies });
}

async function getCategoriesPreview() {
  const response = await fetch(
    "https://api.themoviedb.org/3/genre/movie/list?api_key=" + API_KEY
  );
  const data = await response.json();
  const categories = data.genres;
  categories.forEach((category) => {
    const previewCategoriesMovies = document.querySelector(
      "#categoriesPreview .categoriesPreview-list"
    );
    const categoryContainer = document.createElement("div");
    categoryContainer.classList.add("categorie-container");
    const categoryTitle = document.createElement("h3");
    categoryTitle.classList.add("category-title");
    categoryTitle.setAttribute("id", "id" + category.id);
    const categoryTitleText = document.createTextNode(category.name);

    categoryTitle.appendChild(categoryTitleText);
    categoryContainer.appendChild(categoryTitle);
    previewCategoriesMovies.appendChild(categoryContainer);
  });
}

getCategoriesPreview();
getTrendingMoviesPreview();
