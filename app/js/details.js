window.addEventListener('load', async function () {
  const moviesData = await getMovies();
  const imagesData = await getImages(moviesData);
  const pricesData = getMoviesPrice(moviesData);

  // update ui
  // updateUI(moviesData, imagesData, priceData);
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

// Details Click
const cardPoster = document.querySelector('.card-poster');
console.log(cardPoster);
// cardPoster.forEach(card => {
//   card.addEventListener('click', (e) => {
//     console.log(e.target);
//   });
// });