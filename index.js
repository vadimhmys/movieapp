"use strict"

const MAIN = document.querySelector('.main');
const START_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=af1adc0f99e72c0231abd0e6585a0980';
let img;

async function getData(url) {
    const res = await fetch(url);
    const data = await res.json();
    showData(data.results);
  }
  
getData(START_URL);

let search = document.forms.search;
const CROSS = document.querySelector('.erasing');

CROSS.addEventListener('click', e => {
  search.firstElementChild.value = '';
  search.firstElementChild.focus();
});

search.addEventListener('submit', e => {
  e.preventDefault();
  MAIN.innerHTML = '';
  let keyWord = e.target.firstElementChild.value;
  if(keyWord === '') {
    let messageEmptySearch = document.createElement('p');
      messageEmptySearch.textContent = `Please, enter something in the search bar!`;
      messageEmptySearch.classList.add('message');
      MAIN.append(messageEmptySearch);
      return; 
  }
  let url = `https://api.themoviedb.org/3/search/movie?query=${keyWord}&api_key=af1adc0f99e72c0231abd0e6585a0980`;
  getData(url);
}); 

function showData(arr) {
    if(arr.length === 0) {
      let messageNotFound = document.createElement('p');
      messageNotFound.textContent = `Sorry, but I can't find movies with these words!`;
      messageNotFound.classList.add('message');
      MAIN.append(messageNotFound); 
    }

    arr.map((item, index, array) => {
    let card = document.createElement('div');
    card.classList.add('movie');
  
    let urlImg = `https://image.tmdb.org/t/p/w300${array[index].poster_path}`;
    img = new Image();
    img.src = urlImg;
    img.onload = () => {card.style.backgroundImage = `url(${urlImg})`};
    img.onerror = () => {
      let missingPostermessage = document.createElement('p');
      missingPostermessage.classList.add('poster__notfound');
      missingPostermessage.textContent = "Poster not found";
      card.append(missingPostermessage);
    };

    let movieData = document.createElement('div');
    movieData.classList.add('movie__data');
    let movieTitle = document.createElement('h3');
    movieTitle.classList.add('movie__title');
    movieTitle.textContent = `${array[index].original_title}`;
    movieData.append(movieTitle);
    
    let rating = document.createElement('div');
    rating.classList.add('movie__rating');
    rating.innerHTML = `
    <div class="star__rating">
      <svg class="star" fill="black"><use xlink:href="assets/svg/star.svg#star"></use></svg>
      <svg class="star" fill="black"><use xlink:href="assets/svg/star.svg#star"></use></svg>
      <svg class="star" fill="black"><use xlink:href="assets/svg/star.svg#star"></use></svg>
      <svg class="star" fill="black"><use xlink:href="assets/svg/star.svg#star"></use></svg>
      <svg class="star" fill="black"><use xlink:href="assets/svg/star.svg#star"></use></svg>
    </div>
    <div class="numericRating"></div>
    `;

    let voteCounter = document.createElement('div');
    voteCounter.classList.add('vote__counter');
    voteCounter.textContent = `views: ${array[index].vote_count}`;
    
    movieData.append(rating);
    movieData.append(voteCounter);
    card.append(movieData);

    let overview = document.createElement('div');
    let overviewTitle = document.createElement('h3');
    overviewTitle.textContent = 'Overview';
    let overviewContent = document.createElement('p');
    if(!array[index].overview) {
      overviewContent.textContent = `Overview not found`;
    } else {
      overviewContent.textContent = `${array[index].overview}`;
    }    
    overviewContent.classList.add('overview__content');
    overview.classList.add('overview');
    overview.append(overviewTitle);
    overview.append(overviewContent);
    card.append(overview);

    card.setAttribute('data-rating', array[index].vote_average);   
    card.setAttribute('data-views', array[index].vote_count);

    MAIN.append(card);

    let vote = array[index].vote_average;
    let stars = document.querySelectorAll('.movie:last-child .star');
    let numericRating = document.querySelector('.movie:last-child .numericRating');
    showRating(stars, vote, numericRating);
  });
}

function showRating(stars, vote, numeric) { 
  numeric.textContent = vote;
  let amountStars;
  switch (Math.floor(vote)) {
    case 1:
    case 2:
      amountStars = 1;
      numeric.style.color = "red";
      break;
    case 3:
    case 4:
      amountStars = 2;
      numeric.style.color = "gray";
      break;
    case 5:
    case 6:
      amountStars = 3;
      numeric.style.color = "green";
      break;
    case 7:
      amountStars = 4;
      numeric.style.color = "orange";
      break;
    case 8:
    case 9:
    case 10:
      amountStars = 5;
      numeric.style.color = `yellow`;
      break;
    default:
      amountStars = 0;
      break;
  }

  for(let i = 0; i < amountStars; i++) {
    stars[i].classList.add('star__color');
  }

}

const SORT_RATING_BTN = document.querySelector('.sort__rating__btn');
const SORT_VIEWS_BTN = document.querySelector('.sort__views__btn');

SORT_RATING_BTN.addEventListener('click', () => {
  let cards = Array.from(document.querySelectorAll('.movie'));
  cards.sort( (a, b) => {
    return b.dataset.rating - a.dataset.rating;
  });
  MAIN.innerHTML = '';
  cards.forEach( card => MAIN.append(card));
});

SORT_VIEWS_BTN.addEventListener('click', () => {
  let cards = Array.from(document.querySelectorAll('.movie'));
  cards.sort( (a, b) => {
    return b.dataset.views - a.dataset.views;
  });
  MAIN.innerHTML = '';
  cards.forEach( card => MAIN.append(card));
});

