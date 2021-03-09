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
    const castData = await getMovieActors(selectedMovieID);
    const backdropData = getBackdrop(detailMoviesData);
    const genreData = getGenre(detailMoviesData);
    const yearData = getYearRelease(detailMoviesData);

    // update ui
    updateDetailsUI(selectedMoviePrice, detailMoviesData, castData, backdropData, genreData, yearData);
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
      const priceButton = e.target.nextElementSibling;
      const movieID = e.target.dataset.movieid;
      const moviePrice = priceButton.dataset.strprice;

      localStorage.setItem('movieid', movieID);
      localStorage.setItem('movieprice', moviePrice);
    } else if (e.target.classList.contains('card-title')) {
      // kalo yang di klik card-title, ambil element card-poster sama button price dulu
      const movieCard = e.target.parentNode;  // a tag
      const priceButton = movieCard.nextElementSibling; // button tag

      // abis itu ambil datasetnya
      const movieID = movieCard.dataset.movieid;
      const moviePrice = priceButton.dataset.strprice;

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

function getMovieActors(movieid) {
  const CAST_URL = `https://api.themoviedb.org/3/movie/${movieid}/credits?api_key=c1042292167adc9dc2dbe3a920a743d2&language=en-US`;

  return fetch(CAST_URL)
    .then(res => res.json())
    .then(res => res.cast)
    .then(res => {
      const castName = res.map(cast => cast.name);
      return castName;
    });
};

function getBackdrop(selectedmovie) {
  const BACKDROP_URL = 'https://image.tmdb.org/t/p/original';

  const backdropLink = `${BACKDROP_URL}${selectedmovie.backdrop_path}`;

  return backdropLink;
}

function getGenre(detailmovie) {
  const genreList = detailmovie.genres.map(genre => {
    return genre.name;
  });

  return genreList;
}

function getYearRelease(detailmovie) {
  const releaseDate = detailmovie.release_date;
  const yearDate = releaseDate.substring(0, 4);

  return yearDate;
}

function updateDetailsUI(price, detailmovie, cast, backdrop, genrelist, yeardate) {
  const detailsMain = document.querySelector('.details-main');

  const contentElements = `
    <div class="details-main__backdrop"></div>
    <div class="details-main__content container--px">
      <h1 class="details-main__content__title">${detailmovie.title}</h1>
      <div class="details-main__content__about">
        <h2 class="details-main__content__about__price">Rp ${price}</h2>
        <div class="details-main__content__about__info">
          <span class="info-rating">${detailmovie.vote_average}</span>
          <span class="info-spacer">|</span>
          <span class="info-year">${yeardate}</span>
          <span class="info-spacer">|</span>
          <span class="info-genre">${genrelist.join(', ')}</span>
        </div>
        <p class="details-main__content__about__overview">
          ${detailmovie.overview}
        </p>
        <div class="details-main__content__about__credits">
          <p class="credits-cast"><span>Starring:</span> ${cast.join(', ')}</p>
        </div>
      </div>
      <div class="details-main__content__button">
        <button class="button-watch">watch</button>
        <button class="button-buy">buy</button>
      </div>
    </div>
  `;

  detailsMain.innerHTML = contentElements;

  setBackdrop(backdrop);
}

function setBackdrop(backdropImage) {
  const detailsBackdrop = document.querySelector('.details-main__backdrop');
  const detailsContent = document.querySelector('.details-main__content');

  if (window.innerWidth < 1025) {
    detailsBackdrop.style.backgroundImage = `url(${backdropImage})`;
  } else {
    detailsContent.style.backgroundImage = `url(${backdropImage})`;
  }
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