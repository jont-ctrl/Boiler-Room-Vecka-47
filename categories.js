const articleArea = document.querySelector('.articleArea');
const searchInput = document.querySelector('#searchArticlesInput');

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
      articleArea.innerHTML = '<h3>Inga artiklar hittades</h3>';
    }
  }
}

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
      newImg.src = element.urlToImage;

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
  newImg.src = article.urlToImage;

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

/// let url =
//   'https://newsapi.org/v2/top-headlines?' +
//   'country=us&' +
//   +'apiKey=7f05775074b64157aa2d6d6919e094af';

// business entertainment general health science sports technology

// Här hämtar vi kategori från URL:en, exempelvis "health" från health.html
const category = window.location.pathname.split('/').pop().split('.')[0]; // Hämta filnamnet utan ".html"

fetch(
  `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=7f05775074b64157aa2d6d6919e094af`
)
  .then((response) => response.json())
  .then((data) => {
    console.log('Fetched Data:', data);
    articles = data.articles;
    localStorage.setItem('artiklar', JSON.stringify(data.articles));
    renderHome();
  })
  .catch((error) => {
    console.error('Error:', error);

    const newError = document.createElement('h2');
    newError.textContent = `Error: ${error}`;
    articleArea.append(newError);
  });
