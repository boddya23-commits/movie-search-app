    
    //  api key
    const key = "917d1f481882207fe7c86b6886f6995d";

    let page = 1 ; 
    let dropdown = document.querySelector(".dropdown");
    let searchInput = document.querySelector("#input");


    let movieGrid = document.querySelector(".movies-grid");
    let addMoreButton = document.querySelector(".add-more");

    
    
    // when user enter text in serach box 
    searchInput.addEventListener("input" ,async ()=>{
        dropdown.innerHTML="";
        let movies= await searchMovies(searchInput.value);
        renderDropdown(movies);
    });

// to close dropdown when clicked any place out search or dropdown 
window.addEventListener("click" , (e)=>{
    if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.style.display = "none";
  }
  else { 
    dropdown.style.display = "block";
  }
});
    

test()

addMoreButton.addEventListener("click" , test );

let controller = null ; 

// get movies user search about form apis 
    async function searchMovies(query) { 
    if (!query.trim()) {
        return []
    }
    if (controller !== null) {
        controller.abort();
    }
    controller= new AbortController();
    try { 
        let link = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${query}`
        let response = await fetch(link , {signal : controller.signal});
        if(!response.ok) {
            throw new Error("mistakes");
        }
        else { 
        let allData = await response.json();
            return allData.results.slice(0,6);
        }
    }
    catch(error) {
        console.error("has mustakes");
        return [];
    }
    }

    // add result of search at dropdwon
    function renderDropdown (movies) {

        // if have no movies 
        if(!movies || movies.length === 0) {
            dropdown.innerHTML= "";
        }
        // if have movies 
        else { 
            let fragment = document.createDocumentFragment();
            movies.forEach((e)=>{ 
                // console.log(e);
                let poster = e.poster_path ? `https://image.tmdb.org/t/p/w92${e.poster_path}`:'https://via.placeholder.com/40x60?text=No+Image' ; 
                let name = e.title ;
                let id = e.id ; 
                let date = e.release_date   ;
                let years = date ? date.split("-")[0] : "n/a";

                let  div = document.createElement("div");
                div.classList.add("result")

                let posterImg = document.createElement("img");
                posterImg.src = poster ; 

                let movieName = document.createElement("p");
                movieName.innerText=name;
                movieName.classList.add("moive-name");
                
                let movieYear = document.createElement("div");
                movieYear.classList.add("years");
                movieYear.innerText = `(${years})`;
                
                div.append(posterImg, movieName, movieYear);
                fragment.appendChild(div);
            });
            dropdown.appendChild(fragment);
        }
    }

async function leadMoviesForGrid ()  {
    let link =`https://api.themoviedb.org/3/movie/popular?api_key=${key}&page=${page}`;
    try { 
        let response = await fetch (link);
        if (response.ok){
        let popularMovies = await response.json() ; 
        // console.log(popularMovies.results);
        return popularMovies.results ; 
        }
        else {
            throw new Error("can't response apis");
        }

    }
    catch(error) {
        console.error(`have mistakes ${error}`);
    }
}

function addMoviesTopage (movies) { 
    
    if (movies ||movies.length!== 0){
        let fragment = document.createDocumentFragment();
        movies.forEach((movie)=>{

            let name = movie.title;
            let poster = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`:'https://via.placeholder.com/40x60?text=No+Image' ; 
            let id = movie.id ;
            
            let div =document.createElement("div");
            div.classList.add("movie-item")

            let movieCard =document.createElement("div");
            movieCard.classList.add("movie-card")
            movieCard.id = id ; 

            let image =document.createElement("img");
            image.src = poster ; 
            movieCard.appendChild(image);
            
            let movieName =document.createElement("h3");
            movieName.innerText= name;
            movieName.classList.add("movie-name");
            div.append(movieCard, movieName);
            fragment.appendChild(div);
        });
        movieGrid.appendChild(fragment);
        page ++;
    }
}

async function test () { 
    let mpovies = await leadMoviesForGrid(page);
    addMoviesTopage(mpovies);
}


// https://api.themoviedb.org/3/movie/{movie_id}?api_key=YOUR_API_KEY