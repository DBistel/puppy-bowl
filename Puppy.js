const API_URL = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "/2505-FTB-CT-WEB-PT-DanielB"
const API = API_URL + COHORT;
const $form = document.querySelector("form"); //will be used in function later
const $loading = document.querySelector("#loading-screen")//will be used in function later
const $app = document.querySelector("#app");//will be used in function later
let teams = [];

const fetchAllPlayers =  async() => {
    try {
        const response = await fetch (`${API}/players`);
        const result = await response.json();
        return result.data.players; 
    } catch (err) {
        console.error(err.message);
        return [];
    }

}