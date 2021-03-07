if (document.title == 'StreamFlix | Best movie shop on planet') {
  window.addEventListener('load', async function () {
    const moviesData = await getMovies();
    const imagesData = await getImages(moviesData);
    const pricesData = getMoviesPrice(moviesData);

    // update ui
    updateUI(moviesData, imagesData, pricesData);

    // Event binding for card-poster, and save the movieid into local storage
    cardClicked();
  });
} else {
  window.addEventListener('load', async function () {
    const selectedMovieID = localStorage.getItem('movieid');
    const selectedMoviePrice = localStorage.getItem('movieprice')
    const detailMoviesData = await getDetailMovies(selectedMovieID);
    const backdropData = await getBackdrop(detailMoviesData);

    console.log(detailMoviesData);
    // update ui
    updateDetailsUI(selectedMoviePrice, detailMoviesData, backdropData);
  });
}

// HOME PAGE -------------------------------
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

function getMoviesPrice(moviesdata) {
  const prices = [];

  moviesdata.forEach(data => {
    if (data.vote_average <= 3) {
      prices.push(3500);
    } else if (data.vote_average <= 6) {
      prices.push(8250);
    } else if (data.vote_average <= 8) {
      prices.push(16350);
    } else if (data.vote_average <= 10) {
      prices.push(21250);
    }
  });

  return prices;
}

function updateUI(movies, images, prices) {
  // Convert the price into string
  const convertedPrices = prices.map(String);
  // Modify the price with adding a period
  const strPrices = convertedPrices.map(str => {
    let splitPrice = str.split('');
    splitPrice.splice(-3, 0, '.');

    return splitPrice.join('');
  });

  const mainContent = document.querySelector('.main__content');
  let cards = '';

  movies.forEach((movie, index) => {
    cards += createMovieCard(movie, images[index], strPrices[index]);
  });

  mainContent.innerHTML = cards;
}

function createMovieCard(dataMovie, dataImage, dataPrice) {
  return `
    <div class="main__content__card">
      <a href="./movie-details.html" data-movieid="${dataMovie.id}" class="card-poster flex" style="background-image: url('${dataImage}')">
        <h1 class="card-title">${dataMovie.title}</h1>
      </a>
      <button class="card-button" data-strprice="${dataPrice}">Rp ${dataPrice}</button>
    </div>
  `;
}

function cardClicked() {
  // Event binding untuk card-poster element
  document.addEventListener('click', function (e) {
    // jika yang di klik adalah element dengan class tertentu
    if (e.target.classList.contains('card-poster')) {
      const buttonPrice = e.target.nextElementSibling;
      const movieID = e.target.dataset.movieid;
      const moviePrice = buttonPrice.dataset.strprice;

      localStorage.setItem('movieid', movieID);
      localStorage.setItem('movieprice', moviePrice);
    }
  });
}

// DETAILS PAGE -------------------------------
function getDetailMovies(movieid) {
  const API_URL = `https://api.themoviedb.org/3/movie/${movieid}?api_key=c1042292167adc9dc2dbe3a920a743d2&language=en-US`;

  return fetch(API_URL)
    .then(res => res.json())
    .then(res => res);
}

function getBackdrop(selectedmovie) {
  const BACKDROP_URL = 'https://image.tmdb.org/t/p/original';

  const backdropLink = `${BACKDROP_URL}${selectedmovie.backdrop_path}`;

  return backdropLink;
}

function updateDetailsUI(price, detailmovie, backdrop) {
  // console.log(movies);
}

// ANOTHER STUFF -------------------------------
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
    body.style.overflow = 'visible';
  } else {
    nav.classList.add('open');
    burgerLine.forEach(line => {
      line.style.backgroundColor = '#0a0400';
    });
    logoSpan.style.color = '#d0581c';
    overlay.style.width = '100%';
    body.style.overflow = 'hidden';
  }
});