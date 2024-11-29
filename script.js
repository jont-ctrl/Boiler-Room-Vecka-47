const articleArea = document.querySelector('.articleArea');
const searchInput = document.querySelector('#searchArticlesInput');
const catArea = document.querySelector('.catArea');

let articles = [];

// Search input field
searchInput.addEventListener('keyup', () => {
  console.log('Searching for:', searchInput.value);
  searchArticles(searchInput.value);
});

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

let apiKey =
  'live_MBYQSspEx30fGV0wezgfXkQJyISkrB8fzatBUBNsL1dSVwnkj0oWYmiOptDSP7Lv';

async function fetchCatImage() {
  console.log('hehejjej');

  try {
    console.log('hej');

    let response = await fetch(
      `https://api.thecatapi.com/v1/images/search?api_key=${apiKey}`
    );
    let data = await response.json();
    let catImageUrl = data[0]?.url;

    if (catImageUrl) {
      let title = document.createElement('h2');
      title.textContent = 'Cat of the day';

      let catImage = document.createElement('img');
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

fetchCatImage();

function renderArticles(articlesToRender) {
  console.log('Rendering articles:', articlesToRender);
  articleArea.innerHTML = '';

  articlesToRender.forEach((element) => {
    // If statement to remove news that are deleted
    if (element.author === null) {
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

  // const newImg = document.createElement('img');
  // newImg.src = article.urlToImage;

  const newArticle = document.createElement('p');
  newArticle.textContent = article.content;

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

const category = window.location.pathname.split('/').pop().split('.')[0];

if (category === 'index') {
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
  getTopNews();
} else {
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
    }
  }
  getNewsCategory();
}

// fetch(url)
//   .then((response) => response.json())
//   .then((data) => {
//     console.log('Fetched Data:', data);
//     articles = data.articles;
//     localStorage.setItem('artiklar', JSON.stringify(data.articles));
//     renderHome();
//   })
//   .catch((error) => {
//     console.error('Error:', error);

//     const newError = document.createElement('h2');
//     newError.textContent = `Sidan hittades inte, försök igen senare`;
//     articleArea.append(newError);

// fetch(
//   `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=7f05775074b64157aa2d6d6919e094af`
// )
//   .then((response) => response.json())
//   .then((data) => {
//     console.log('Fetched Data:', data);
//     articles = data.articles;
//     localStorage.setItem('artiklar', JSON.stringify(data.articles));
//     renderHome();
//   })
//   .catch((error) => {
//     console.error('Error:', error);

//     const newError = document.createElement('h2');
//     newError.textContent = `Sidan hittades inte, försök igen senare`;
//     articleArea.append(newError);
//   });

//

// // Promise 3 stadier alltid = pending, resolved, rejected
// async function getCat() {
//   try {
//     const response = await fetch('https://do3gapi.dog/api/v2/breeds');
//     const data = await response.json();
//     console.log(data.data[0].attributes.name);
//   } catch (error) {
//     console.error(error);
//   }
// }

// getCat();
