

let apiKey = 'live_MBYQSspEx30fGV0wezgfXkQJyISkrB8fzatBUBNsL1dSVwnkj0oWYmiOptDSP7Lv';

async function fetchCatImage() {
    try {
        let response = await fetch(`https://api.thecatapi.com/v1/images/search?api_key=${apiKey}`);
        let data = await response.json();
        let catImageUrl = data[0]?.url;

        if (catImageUrl) {
            let title = document.createElement('h2');
            title.textContent = 'Cats of the day';

            let catImage = document.createElement('img');
            catImage.src = catImageUrl;
            catImage.alt = 'A cute cat';
            catImage.style.width = '300px'; 

            document.body.appendChild(title);
            document.body.appendChild(catImage);
        } else {
            console.error('Ingen bild hittades i API-svaret.');
        }
    } catch (error) {
        console.error('Something went wrong while fetching the cat image.', error);
    }
}

fetchCatImage();
