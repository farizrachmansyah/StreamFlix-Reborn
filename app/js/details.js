window.addEventListener('load', async function () {
  const moviesData = await getMovies();
  const imagesData = await getImages(moviesData);
  const pricesData = getMoviesPrice(moviesData);
  const videosData = await getVideo(moviesData);

  console.log(videosData);

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

function getVideo(moviesdata) {
  const videosurl = [];
  moviesdata.forEach(async data => {
    let VIDEO_URL = `https://api.themoviedb.org/3/movie/${data.id}/videos?api_key=c1042292167adc9dc2dbe3a920a743d2&append_to_response=videos`

    const res = await fetch(VIDEO_URL);
    const res_1 = await res.json();

    if (res_1.results[0] === undefined) {
      videosurl.push(undefined);
    } else {
      videosurl.push(res_1.results[0].key);
    }
  });

  // console.log(videosurl);
  return videosurl;
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