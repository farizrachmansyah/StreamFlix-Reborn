window.addEventListener('load', async function () {
  const moviesData = await getMovies();
  const imagesData = await getImages(moviesData);

  // update ui
  updateUI(moviesData, imagesData);
});

function getMovies() {
  const API_URL = 'https://api.themoviedb.org/3/movie/now_playing?api_key=c1042292167adc9dc2dbe3a920a743d2&language=en-US&region=ID';

  return fetch(API_URL)
    .then(res => res.json())
    .then(res => res.results);
}

function getImages(moviesdata) {
  const IMG_URL = 'https://image.tmdb.org/t/p/w500';

  let imagesData = moviesdata.map(data => `${IMG_URL}${data.poster_path}`);

  return imagesData;
}

function updateUI(movies, images) {
  const mainContent = document.querySelector('.main__content');
  let cards = '';

  movies.forEach((movie, index) => {
    cards += createMovieCard(movie, images[index]);
  });

  mainContent.innerHTML = cards;
}

// creates the card element
function createMovieCard(dataMovie, dataImage) {
  return `
    <a href="#" class="main__content__card flex" style="background-image: url('${dataImage}')">
      <h1 class="card-title">${dataMovie.title}</h1>
      <p class="card-price">Rp 0000</p>
      <button class="card-button">Buy</button>
    </a>
  `;
}

// Burger Button
const body = document.querySelector('body');
const nav = document.querySelector('.header__nav');
const logoSpan = document.querySelector('.logo-span');
const burgerButton = document.querySelector('.header__nav__burger');
const burgerLine = document.querySelectorAll('.burger-line');
const overlay = document.querySelector('.overlay');

burgerButton.addEventListener('click', () => {
  if (nav.classList.contains('open')) {
    overlay.style.width = '0px';
    logoSpan.style.color = '#fbb023';
    burgerLine.forEach(line => {
      line.style.backgroundColor = '#fbb023';
    });
    nav.classList.remove('open');
  } else {
    nav.classList.add('open');
    burgerLine.forEach(line => {
      line.style.backgroundColor = '#0a0400';
    });
    logoSpan.style.color = '#d0581c';
    overlay.style.width = '100%';
  }
});