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

function createMovies(
  movies,
  container,
  { lazyLoad = false, clean = true } = {}
) {
  if (clean) {
    container.innerHTML = "";
  }

  movies.forEach((movie) => {
    const movieContainer = document.createElement("div");
    movieContainer.classList.add("movie-container");

    const movieImg = document.createElement("img");
    movieImg.classList.add("movie-img");
    movieImg.setAttribute("alt", movie.title);
    movieImg.addEventListener("error", () => {
      movieImg.setAttribute(
        "src",
        "https://i.blogs.es/886c06/color-24-rojo-turco-textoner/1366_2000.jpg"
      );
    });
    movieImg.addEventListener("click", () => {
      location.hash = "#movie=" + movie.id;
    });
    movieImg.setAttribute(
      lazyLoad ? "data-img" : "src",
      "https://image.tmdb.org/t/p/w300" + movie.poster_path
    );
    const movieButton = document.createElement("button");
    movieButton.classList.add("movie-btn");
    movieButton.addEventListener("click", () => {
      movieButton.classList.toggle("movie-btn--liked");
      // guardar pelicula en localStorage
    });

    if (lazyLoad) {
      lazyLoader.observe(movieImg);
    }

    movieContainer.appendChild(movieImg);
    movieContainer.appendChild(movieButton);
    container.appendChild(movieContainer);
  });
}

const lazyLoader = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    //console.log(entry.target.setAttribute);
    if (entry.isIntersecting) {
      const url = entry.target.getAttribute("data-img");
      entry.target.setAttribute("src", url);
    }
  });
});

function createCategories(categories, container) {
  container.innerHTML = "";
  categories.forEach((category) => {
    //const categoriesPreviewList = document.querySelector(
    //  "#categoriesPreview .categoriesPreview-list"
    //);
    const categoryContainer = document.createElement("div");
    categoryContainer.classList.add("category-container");
    const categoryTitle = document.createElement("h3");
    categoryTitle.classList.add("category-title");
    categoryTitle.setAttribute("id", "id" + category.id);
    categoryTitle.addEventListener("click", () => {
      location.hash = `#category=${category.id}-${category.name}`;
    });
    const categoryTitleText = document.createTextNode(category.name);

    categoryTitle.appendChild(categoryTitleText);
    categoryContainer.appendChild(categoryTitle);
    container.appendChild(categoryContainer);
  });
}

async function getTrendingMoviesPreview() {
  const { data } = await api("trending/movie/day");
  //const response = await fetch(
  //  "https://api.themoviedb.org/3/trending/movie/day?api_key=" + API_KEY
  //);
  //const data = await response.json();
  //trendingMoviesPreviewList.innerHTML = "";
  const movies = data.results;
  createMovies(movies, trendingMoviesPreviewList, {
    lazyLoad: true,
    clean: true,
  });
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
  createCategories(categories, categoriesPreviewList);
  // categoriesPreviewList.innerHTML = "";
  // categories.forEach((category) => {
  //   //const categoriesPreviewList = document.querySelector(
  //   //  "#categoriesPreview .categoriesPreview-list"
  //   //);
  //   const categoryContainer = document.createElement("div");
  //   categoryContainer.classList.add("category-container");
  //   const categoryTitle = document.createElement("h3");
  //   categoryTitle.classList.add("category-title");
  //   categoryTitle.setAttribute("id", "id" + category.id);
  //   categoryTitle.addEventListener("click", () => {
  //     location.hash = `#category=${category.id}-${category.name}`;
  //   });
  //   const categoryTitleText = document.createTextNode(category.name);

  //   categoryTitle.appendChild(categoryTitleText);
  //   categoryContainer.appendChild(categoryTitle);
  //   categoriesPreviewList.appendChild(categoryContainer);
  // });
}

async function getMoviesByCategory(id) {
  const { data } = await api("discover/movie", {
    params: {
      with_genres: id,
    },
  });
  maxPage = data.total_pages;
  //genericSection.innerHTML = "";
  createMovies(data.results, genericSection, { lazyLoad: true, clean: true });
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
function getPaginatedMoviesBycategory(id) {
  return async function () {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    const scrollIsBottom = scrollTop + clientHeight >= scrollHeight - 15;
    const pageIsNotMax = page < maxPage;
    if (scrollIsBottom && pageIsNotMax) {
      page++;
      const { data } = await api("discover/movie", {
        params: {
          with_genres: id,
        },
      });

      const movies = data.results;
      createMovies(movies, genericSection, { lazyLoad: true, clean: false });
    }
  };
}

async function getMoviesBySearch(query) {
  const { data } = await api("search/movie", {
    params: {
      query,
    },
  });
  maxPage = data.total_pages;
  createMovies(data.results, genericSection);
}

async function getTrendingMovies() {
  const { data } = await api("trending/movie/day");
  createMovies(data.results, genericSection);
  headerCategoryTitle.innerHTML = "Tendencias";
  maxPage = data.total_pages;
  // const btnLoadMore = document.createElement("button");
  // btnLoadMore.innerText = "Cargar mas";
  // btnLoadMore.addEventListener("click", getPaginatedTrendingMovies, {
  //   lazyLoad: true,
  //   clean: true,
  // });
  // genericSection.appendChild(btnLoadMore);
}

async function getMovieById(id) {
  const { data: movie } = await api("movie/" + id);

  const movieUrl = "https://image.tmdb.org/t/p/w300" + movie.poster_path;
  headerSection.style.background = `linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.35) 19.27%,
      rgba(0, 0, 0, 0) 29.17%
    ),
    url(${movieUrl})`;

  movieDetailTitle.textContent = movie.title;
  movieDetailDescription.textContent = movie.overview;
  movieDetailScore.textContent = movie.vote_average;

  createCategories(movie.genres, movieDetailCategoriesList);
  getRelatedMovieById(id);
}

async function getRelatedMovieById(id) {
  const { data } = await api(`movie/${id}/recommendations`);
  const relatedMovies = data.results;
  createMovies(relatedMovies, relatedMoviesContainer);
}

async function getPaginatedTrendingMovies() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  const scrollIsBottom = scrollTop + clientHeight >= scrollHeight - 15;
  const pageIsNotMax = page < maxPage;
  if (scrollIsBottom && pageIsNotMax) {
    page++;
    const { data } = await api("trending/movie/day", {
      params: {
        page,
      },
    });

    const movies = data.results;
    createMovies(movies, genericSection, { lazyLoad: true, clean: false });
    // const btnLoadMore = document.createElement("button");
    // btnLoadMore.innerText = "Cargar mas";
    // btnLoadMore.addEventListener("click", getPaginatedTrendingMovies, {
    //   lazyLoad: true,
    //   clean: true,
    // });
    // genericSection.appendChild(btnLoadMore);
  }
}

function getPaginatedMoviesBySearch(query) {
  return async function () {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    const scrollIsBottom = scrollTop + clientHeight >= scrollHeight - 15;
    const pageIsNotMax = page < maxPage;
    if (scrollIsBottom && pageIsNotMax) {
      page++;
      const { data } = await api("search/movie", {
        params: {
          query,
          page,
        },
      });

      const movies = data.results;
      createMovies(movies, genericSection, { lazyLoad: true, clean: false });
    }
  };
}
