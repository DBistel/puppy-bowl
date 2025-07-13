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

const fetchPlayerById =  async(id) => {
    try {
        const response = await fetch (`${API}/players/${id}`);
        const result = await response.json();
        return result.data.player; 
    } catch (err) {
        console.error(err.message);
        return [];
    }
}

const playerList = (player) =>{
    const $ul = document.createElement("ul");
    $ul.classList.add("player-list");

    const $items = players.map(playerListItems);
    $ul.replaceChildren(...$items);
}

const render = async () => {
    $app.innerHTML=`
    <h1>Puppy Bowl</h1>
    <main>
    <section>
        <h2>Players</h2>
        <PlayerList></PlayerList>
    </section>
   <section id="selected">
  <h2>Player Details</h2>
  <p id="player-message">Please select a player to see more details.</p>
</section>

    </main>
    `
}

const init = async () => {
    const players = await fetchAllPlayers();
    console.log(players)
    const testId = 39106
    const playerId = await fetchPlayerById(testId);
    console.log(playerId)
    render();
}
init();