const articleArea = document.querySelector(".articleArea");
let articles = []; // Global variabel för att lagra hämtade artiklar

function renderHome() {
  articleArea.innerHTML = "";

  articles.forEach((element) => {
    const newTitle = document.createElement("h2");
    newTitle.textContent = element.title;

    const newImg = document.createElement("img");
    newImg.src = element.urlToImage;

    const newDesc = document.createElement("h3");
    newDesc.textContent = element.description;

    const newBtn = document.createElement("button");
    newBtn.textContent = "Läs mer";
    newBtn.classList.add("läsMerKnapp");

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

  const publishedDate = document.createElement("p");
  publishedDate.textContent = article.publishedAt;

  const articleUrl = document.createElement("p");
  articleUrl.innerHTML = `<a href="${article.url}" target="_blank">Läs orginalartikeln</a>`;

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
    publishedDate,
    newArticle,
    articleUrl,
    backBtn
  );
}

let url =
  "https://newsapi.org/v2/top-headlines?" +
  "country=us&" +
  "apiKey=7f05775074b64157aa2d6d6919e094af";

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);

    // Spara artiklarna i den globala variabeln
    articles = data.articles;

    localStorage.setItem("artiklar", JSON.stringify(data.articles));

    // Rendera startsidan med artiklar
    renderHome();
  })
  .catch((error) => {
    console.error(error);

    const newError = document.createElement("h2");
    newError.textContent = `Error: ${error}`;
    articleArea.append(newError);
  });
