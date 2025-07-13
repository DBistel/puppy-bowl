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

const playerListItems = (player) => {
    const $li = document.createElement("li");

    $li.innerHTML=`
    <a href="#selected">
        <h3>${player.name}</h3>
        <img src="${player.imageUrl}" alt="Picture of  ${player.name}" style="width: 100px; height: auto;" />
    </a>
    `;
    $li.addEventListener("click", async () => {
        const fullPlayer = await fetchPlayerById(player.id)
        renderSinglePlayer(fullPlayer)
        
    });
    return $li;
}

const playerList = (players) =>{
    const $ul = document.createElement("ul");
    $ul.classList.add("player-list");

    const $items = players.map(playerListItems);
    $ul.replaceChildren(...$items);

    return $ul;
}

const renderSinglePlayer = (player) =>{
    const $selection = document.querySelector("#selected");
    $selection.innerHTML=`
    <h2>${player.name}</h2>
        <p>${player.breed}</p>
        <img src="${player.imageUrl}" alt="Picture of ${player.name}" />
        <section class="player-actions">
            <button class="details-btn">See Details</button>
            <button class="remove-btn">Remove Player</button>
        </section>
        `;
}

const render = async () => {
    $app.innerHTML=`
    <h1>Puppy Bowl</h1>
    <main>
    <section>
        <h2>Players</h2>
        <div id="player-list"></div>
    </section>
   <section id="selected">
  <h2>Player Details</h2>
  <p id="player-message">Please select a player to see more details.</p>
</section>

    </main>
    `;
    const players = await fetchAllPlayers();
    const $list = playerList(players);

    $app.querySelector("#player-list").replaceWith($list);
};

const init = async () => {
    await render();
}
init();