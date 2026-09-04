const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const movieId = urlParams.get("id")??497;




const key = "917d1f481882207fe7c86b6886f6995d";
const link = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${key}&append_to_response=credits,videos`;

let poster = document.querySelector(".poster-and-trial img");
let movieTitle = document.querySelector(".movie-name");
let meta = document.querySelector(".meta");
let rate = document.querySelector(".the-rate");
let starsRateContiner = document.querySelector(".stars-rating");
let peopleRating = document.querySelector(".people-rating");
let genresContinar = document.querySelector(".genres");
let overview = document.querySelector(".overview");
let castCards = document.querySelector(".cards");
    let trailerBtn = document.querySelector("#watch-trial"); 



async function getInformation() {
    try {
        let response = await fetch(link);
        let allData = await response.json();
        return allData;
    } catch(error) { 
        console.error(`has mistakes ${error}`);
        return null;
    }
}

function addInfoToPage(info) {
    if(!info) return;

    const posterFilm = info.poster_path 
        ? `https://image.tmdb.org/t/p/original${info.poster_path}`
        : "https://via.placeholder.com/500x750?text=No+Image";
        
    const name = info.title;
    let date = info.release_date;
    let year = date ? date.split("-")[0] : "N/A";
    const hours = Math.floor(info.runtime / 60);
    const minutes = info.runtime % 60;
    const runtimeText = info.runtime ? `${hours}h ${minutes}m` : "N/A";
    const voteAvarage = info.vote_average ? info.vote_average.toFixed(1) : "N/A";
    const voteCount = info.vote_count ? info.vote_count.toLocaleString() : "0";
    const genres = info.genres || [];
    const overviewAPI = info.overview || "No description available.";
    let casts = info.credits ? info.credits.cast : []; 

const videos = info.videos ? info.videos.results : [];
const trailer = videos.find(video => video.type === "Trailer" && video.site === "YouTube") || videos[0];

if (trailerBtn) {
    if (trailer) {
        trailerBtn.style.opacity = "1";
        trailerBtn.style.cursor = "pointer";
        trailerBtn.onclick = () => {
            window.open(`https://www.youtube.com/watch?v=${trailer.key}`, "_blank");
            console.log(trailer);
        };
    } else {
        trailerBtn.style.opacity = "0.5";
        trailerBtn.style.cursor = "not-allowed";
        trailerBtn.onclick = null;
    }
}
    
    poster.src = posterFilm;
    movieTitle.textContent = name;
    meta.textContent = `${year} • ${runtimeText}`;
    rate.textContent = voteAvarage;

    let voteTemp = voteAvarage / 2; 

for (let i = 1; i <= 5; i++) {
    let star = document.createElement("i");

    if (voteTemp >= i) {
        star.classList.add("fa-solid", "fa-star");
    } else if (voteTemp >= i - 0.5) {
        star.classList.add("fa-solid", "fa-star-half-stroke");
    } else {
        star.classList.add("fa-regular", "fa-star");
    }

    starsRateContiner.appendChild(star);
}
    
    peopleRating.textContent = `(${voteCount} ratings)`;

    genres.forEach(genre => {
        let span = document.createElement("span");
        span.innerText = genre.name;
        genresContinar.appendChild(span);
    });

    overview.textContent = overviewAPI; 

    let fragment = document.createDocumentFragment();

    casts.slice(0,20).forEach((cast) => {
        let div = document.createElement("div");
        div.classList.add("card-cast");

        let image = document.createElement("img");
        image.src = cast.profile_path 
            ? `https://image.tmdb.org/t/p/w185${cast.profile_path}`
            : "https://via.placeholder.com/185x278?text=No+Photo";

        let castName = document.createElement("p");
        castName.innerText = cast.name;
        castName.classList.add("cast-name");

        let spanCast = document.createElement("span");
        spanCast.classList.add("character");
        spanCast.innerText = cast.character;

        div.append(image, castName, spanCast);
        fragment.appendChild(div);
    });

    castCards.appendChild(fragment);


}

getInformation().then(data => {
    addInfoToPage(data);
});