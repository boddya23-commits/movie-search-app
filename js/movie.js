const movieId = 497; 
const key = "917d1f481882207fe7c86b6886f6995d";
const link = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${key}&append_to_response=credits`;
console.log(link);
async function getInformation() {
    try{
        let  response=fetch(link);
        let allData= (await response).json
        return(allData)
    }
    catch(error) { 
        console.error(`has mistakes &{error}`)
        return null ;
    }
}
function addInfoToPage(info) {
    if(!info) return;

}