const articleArea = document.querySelector(".articleArea");

let url =
  "https://newsapi.org/v2/top-headlines?" +
  "country=us&" +
  "apiKey=7f05775074b64157aa2d6d6919e094af";

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);

    data.articles.forEach((element) => {
      console.log(element.title);

      const newTitle = document.createElement("h2");
      newTitle.textContent = element.title;

      const newImg = document.createElement("img");
      newImg.src = element.urlToImage;

      const newDesc = document.createElement("h3");
      newDesc.textContent = element.description;

      const newBtn = document.createElement("button");
      newBtn.textContent = "läs mer ";
      newBtn.classList.add("läsMerKnapp");

      newBtn.addEventListener("click", () => {
        articleArea.innerHTML = "";

        const newTitle = document.createElement("h2");
        newTitle.textContent = element.title;

        const newImg = document.createElement("img");
        newImg.src = element.urlToImage;

        const newArticle = document.createElement("p");
        newArticle.textContent = element.content;

        const backBtn = document.createElement("button");
        backBtn.textContent = "Gå tillbaka";
        backBtn.classList.add("backButton");

        backBtn.addEventListener("click", () => {
          console.log("tillbakaknapp");
        });

        articleArea.append(newTitle, newImg, newArticle, backBtn);
      });

      articleArea.append(newTitle, newImg, newDesc, newBtn);
    });
  })
  .catch((error) => console.error(error));
