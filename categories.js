const articleArea = document.querySelector(".articleArea");
const searchInput = document.querySelector("#searchArticlesInput");
let articles = [];

searchInput.addEventListener("keyup", () => {
  console.log("Searching for:", searchInput.value);
  searchArticles(searchInput.value);
});

function searchArticles(query) {
  if (query.trim() === "") {
    renderHome();
  } else {
    const filteredArticles = articles.filter((article) => {
      const searchText = query.toLowerCase();
      const title = article.title ? article.title.toLowerCase() : "";
      const description = article.description
        ? article.description.toLowerCase()
        : "";

      return title.includes(searchText) || description.includes(searchText);
    });

    console.log("Filtered Articles:", filteredArticles);

    if (filteredArticles.length > 0) {
      renderArticles(filteredArticles);
    } else {
      articleArea.innerHTML = "<h3>Inga artiklar hittades</h3>";
    }
  }
}

function renderArticles(articlesToRender) {
  console.log("Rendering articles:", articlesToRender);
  articleArea.innerHTML = "";

  articlesToRender.forEach((element) => {
    const newTitle = document.createElement("h2");
    newTitle.textContent = element.title;

    const newImg = document.createElement("img");
    newImg.src = element.urlToImage;

    const newDesc = document.createElement("h3");
    newDesc.textContent = element.description;

    const newBtn = document.createElement("button");
    newBtn.textContent = "Läs mer";
    newBtn.classList.add("readMoreBtn");

    newBtn.addEventListener("click", () => {
      renderArticleDetail(element);
    });

    articleArea.append(newTitle, newImg, newDesc, newBtn);
  });
}

function renderArticleDetail(article) {
  articleArea.innerHTML = "";

  const newTitle = document.createElement("h2");
  newTitle.textContent = article.title;

  const newImg = document.createElement("img");
  newImg.src = article.urlToImage;

  const newArticle = document.createElement("p");
  newArticle.textContent = article.content;

  const newAuthor = document.createElement("p");
  newAuthor.textContent = article.author;

  const articleUrl = document.createElement("p");
  articleUrl.innerHTML = `<a href="${article.url}" target="_blank">Läs orginalartikeln</a>`;

  const publishedDate = document.createElement("i");
  publishedDate.textContent = article.publishedAt;

  const backBtn = document.createElement("button");
  backBtn.textContent = "Gå tillbaka";
  backBtn.classList.add("backButton");

  backBtn.addEventListener("click", () => {
    renderHome();
  });

  articleArea.append(
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
  renderArticles(articles);
}

// let url =
//   'https://newsapi.org/v2/top-headlines?' +
//   'country=us&' +
//   +'apiKey=7f05775074b64157aa2d6d6919e094af';

// business entertainment general health science sports technology

// Här hämtar vi kategori från URL:en, exempelvis "health" från health.html
const category = window.location.pathname.split("/").pop().split(".")[0]; // Hämta filnamnet utan ".html"

fetch(
  `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=7f05775074b64157aa2d6d6919e094af`
)
  .then((response) => response.json())
  .then((data) => {
    console.log("Fetched Data:", data);
    articles = data.articles;
    localStorage.setItem("artiklar", JSON.stringify(data.articles));
    renderHome();
  })
  .catch((error) => {
    console.error("Error:", error);

    const newError = document.createElement("h2");
    newError.textContent = `Error: ${error}`;
    articleArea.append(newError);
  });
