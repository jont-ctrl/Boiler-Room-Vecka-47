const articleArea = document.querySelector('.articleArea');
const searchInput = document.querySelector('#searchArticlesInput');
const catArea = document.querySelector('.catArea');
const weatherArea = document.querySelector('.weatherArea');

// DOM Elements weather
const cityInput = document.getElementById('cityInput');
const getWeatherBtn = document.getElementById('getWeatherBtn');
const weatherResult = document.getElementById('weatherResult');

let articles = [];

// Search input field
searchInput.addEventListener('keyup', () => {
  console.log('Searching for:', searchInput.value);
  searchArticles(searchInput.value);
});

// Search articles
function searchArticles(query) {
  if (query.trim() === '') {
    renderHome();
  } else {
    const filteredArticles = articles.filter((article) => {
      const searchText = query.toLowerCase();
      const title = article.title ? article.title.toLowerCase() : '';
      const description = article.description
        ? article.description.toLowerCase()
        : '';

      return title.includes(searchText) || description.includes(searchText);
    });

    console.log('Filtered Articles:', filteredArticles);

    if (filteredArticles.length > 0) {
      renderArticles(filteredArticles);
    } else {
      articleArea.innerHTML = '<h3>No articles found.</h3>';
    }
  }
}

// Cat Area

let apiKey =
  'live_MBYQSspEx30fGV0wezgfXkQJyISkrB8fzatBUBNsL1dSVwnkj0oWYmiOptDSP7Lv';

async function fetchCatImage() {
  try {
    let response = await fetch(
      `https://api.thecatapi.com/v1/images/search?api_key=${apiKey}`
    );
    let data = await response.json();
    let catImageUrl = data[0]?.url;

    if (catImageUrl) {
      let title = document.createElement('h2');
      title.textContent = 'Cat of the day';

      let catImage = document.getElementById('catImage');
      catImage.src = catImageUrl;
      catImage.alt = 'A cute cat';
      // catImage.style.width = '300px';

      document.body.appendChild(title);
      document.body.appendChild(catImage);

      // const newCatDiv = document.createElement('div');
      // newCatDiv.id = 'cat';
      // main.append(newCatDiv);
      catArea.append(title);
      catArea.append(catImage);
    } else {
      console.error('Ingen bild hittades i API-svaret.');
    }
  } catch (error) {
    console.error('Something went wrong while fetching the cat image.', error);
  }
}

// Weather area
// API Key and Base URL
const API_KEY = '752a15f467b4f4a83ff17fe3bcd1816e';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Event Listener
getWeatherBtn.addEventListener('click', fetchWeatherWithAsyncAwait);

// Fetch Weather Using Async/Await
async function fetchWeatherWithAsyncAwait() {
  const city = cityInput.value.trim();

  // Om inget stadnamn är angivet, använd Linköping som default
  const cityName = city === '' ? 'linköping' : city.toLowerCase();

  const url = `${BASE_URL}?q=${cityName}&appid=${API_KEY}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`City not found (${response.status})`);
    }
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    weatherResult.innerHTML = `<p class="error">${error.message}</p>`;
  }
}

// Ladda vädret för Linköping direkt när sidan laddas
document.addEventListener('DOMContentLoaded', () => {
  cityInput.value = '';
  fetchWeatherWithAsyncAwait(); // Anropa funktionen för att hämta väderdata
});

// Display Weather Function
function displayWeather(data) {
  const { name, main, weather } = data;
  weatherResult.innerHTML = `
    <h2>${name}</h2>
    <p><strong>Temperature:</strong> ${main.temp}°C</p>
    <p><strong>Feels Like:</strong> ${main.feels_like}°C</p>
    <p><strong>Humidity:</strong> ${main.humidity}%</p>
    <p><strong>Weather:</strong> ${weather[0].description}</p>
    <img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="${weather[0].description}" id='weather'/>
  `;
}

function renderArticles(articlesToRender) {
  console.log('Rendering articles:', articlesToRender);
  articleArea.innerHTML = '';

  articlesToRender.forEach((element) => {
    // If statement to remove news that are deleted
    if (element.author === null || element.content === null) {
      //console.log('Article deleted:', element.author);
    } else {
      // Create div and append all articles elements
      const newDiv = document.createElement('div');
      newDiv.classList.add('articleItem');

      const newTitle = document.createElement('h2');
      newTitle.textContent = element.title;

      const newImg = document.createElement('img');
      // newImg.src = element.urlToImage;

      if (element.urlToImage === null) {
        newImg.src = 'images/default.jpg';
      } else {
        newImg.src = element.urlToImage;
      }

      const newDesc = document.createElement('p');
      newDesc.textContent = element.description;

      const newBtn = document.createElement('button');
      newBtn.textContent = 'Read More';
      newBtn.classList.add('readMoreBtn');

      newBtn.addEventListener('click', () => {
        renderArticleDetail(element);
      });

      articleArea.append(newDiv);
      newDiv.append(newTitle, newImg, newDesc, newBtn);
    }
  });
}

function renderArticleDetail(article) {
  // Add 'fullView' class to the articleArea, for full width when viewing one article
  articleArea.classList.add('fullView');

  articleArea.innerHTML = '';

  // Create div and append all articles elements
  const newDivFull = document.createElement('div');
  newDivFull.classList.add('fullArticleItem');

  const newTitle = document.createElement('h2');
  newTitle.textContent = article.title;

  const newImg = document.createElement('img');

  if (article.urlToImage === null) {
    newImg.src = 'images/default.jpg';
  } else {
    newImg.src = article.urlToImage;
  }

  // Remove text 'chars' at the end of text.
  const newArticle = document.createElement('p');
  newArticle.textContent = article.content.replace(/\s\[\+(\d+)\schars\]$/, '');

  const newAuthor = document.createElement('p');
  newAuthor.id = 'authorArticle';
  newAuthor.textContent = 'By: ' + article.author;

  const articleUrl = document.createElement('p');
  articleUrl.innerHTML = `<a href="${article.url}" target="_blank">Read the original article here</a>`;

  const publishedDate = document.createElement('i');
  publishedDate.id = 'dateArticle';
  publishedDate.textContent = 'Published: ' + article.publishedAt;

  const backBtn = document.createElement('button');
  backBtn.textContent = 'Go Back';
  backBtn.classList.add('backButton');

  backBtn.addEventListener('click', () => {
    renderHome();
  });

  articleArea.append(newDivFull);

  newDivFull.append(
    newTitle,
    newImg,
    newAuthor,
    newArticle,
    publishedDate,
    articleUrl,
    backBtn
  );
}

function renderHome() {
  articleArea.classList.remove('fullView');
  renderArticles(articles);
}

// Hämta url keyword från url
const category = window.location.pathname.split('/').pop().split('.')[0];

let url =
  'https://newsapi.org/v2/top-headlines?' +
  'country=us&' +
  'apiKey=7f05775074b64157aa2d6d6919e094af';

async function getTopNews() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log('Fetched Data:', data);
    articles = data.articles;
    localStorage.setItem('artiklar', JSON.stringify(data.articles));
    renderHome();
  } catch (error) {
    console.error(error);
    const newError = document.createElement('h2');
    newError.textContent = `Sidan hittades inte, försök igen senare`;
    articleArea.append(newError);
  }
}

async function getNewsCategory() {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=7f05775074b64157aa2d6d6919e094af`
    );
    const data = await response.json();
    console.log('Fetched Data:', data);
    articles = data.articles;
    localStorage.setItem('artiklar', JSON.stringify(data.articles));
    renderHome();
  } catch (error) {
    console.error('Error:', error);

    const newError = document.createElement('h2');
    newError.textContent = `Sidan hittades inte, försök igen senare`;
    articleArea.append(newError);

    // Ladda artiklar från localstorage
  }
}

async function init() {
  const p1news = category === 'index' ? getTopNews() : getNewsCategory();
  const p2cat = fetchCatImage();
  const p3weather = fetchWeatherWithAsyncAwait();

  // Vänta på att alla promises ska bli klara
  const [result1, result2, result3] = await Promise.all([
    p1news,
    p2cat,
    p3weather,
  ]);
}

init();
