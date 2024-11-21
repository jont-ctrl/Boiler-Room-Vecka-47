fetch(url)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);

    data.articles.forEach((element) => {
      console.log(element.title);

      const newTitle = document.createElement('h2');
      newTitle.textContent = element.title;

      const newImg = document.createElement('img');
      newImg.src = element.urlToImage;

      const newDesc = document.createElement('h3');
      newDesc.textContent = element.description;

      document.body.append(newTitle, newImg, newDesc);
    });
  })
  .catch((error) => console.error(error));
