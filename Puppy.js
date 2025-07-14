const API_URL = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "/2505-FTB-CT-WEB-PT-DanielB"
const API = API_URL + COHORT;
const $form = document.querySelector("form"); 
const $app = document.querySelector("#app");
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
        <p>${player.status}</p>
        <img src="${player.imageUrl}" alt="Picture of ${player.name}" />
        <section class="player-actions">
            <button class="remove-btn">Remove Player</button>
        </section>
        `;
        $removeBtn.addEventListener("click", async () => {
            try {
                const confirmRemove = confirm(`Are you sure you want to remove ${player.name} from the roster?`);
                if (!confirmRemove) return;
                showLoading();
                await removePlayerById(player.id);
                await renderAllPlayers();
            } catch (err) {
                console.error(err.message);
            } finally {
                hideLoading();
            }
        })
}


const addNewPlayer = () => {
    const $form = document.createElement("form");
    $form.innerHTML=`
  <div class="form-group">
    <label for = "playerName">Player Name</label>
    <input class="form-control" id="newPlayerName" placeholder="Buddy, Max, Oliver">
 <div>
   <div class="form-group">
    <label for="Breed">Breed</label>
    <input class="form-control" id="newEventDescription" placeholder="basset hound, golden retriever, Heinz 57">
  </div>
   <div class="form-group">
   <label for="status">Status:</label>
    <select id="status" name="status">
        <option value="null">-Select one-</option>
        <option value="field">Field</option>
        <option value="bench">Benched</option>
    </select>
  </div>
   <div class="form-group">
    <label for="imgUrl">Picture</label>
    <input class="form-control" id="newEventLocation" placeholder="https://image.com">
  </div>
  <button type="submit" class="btn btn-primary">Invite Puppy</button>
    `;
    // $form.addEventListener("click", (e) => {
    // e.preventDefault();
    // })
    return $form;
}

const newPlayer = async (e) => {
  e.preventDefault();

  const name = e.target[0].value;     
  const breed = e.target[1].value;    
  const status = e.target[2].value;   
  const imageUrl = e.target[3].value; 
  const obj = { name, breed, status, imageUrl };

  try {
    const response = await fetch(`${API}/players`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });

    const data = await response.json();
    console.log("New player created:", data);
  } catch (error) {
    console.error("Error creating player:", error);
  }

  await init();
};


const render = async () => {
    $app.innerHTML=`
    <h1>Puppy Bowl</h1>
    <main>
    <section id="player-selection">
        <h2>Players</h2>
        <p id="player-message">Please select a player to see more details.</p>
        <div id="player-list"></div>
    </section>
   <section id="selected">
  <h2>Player Details</h2>
</section>
<section id="newPlayer">
    <h2>Add a new player:</h2>
    <form id="newPlayerForm"></form>
</section>

    </main>
    `;

    const players = await fetchAllPlayers();
    const $list = playerList(players);
    $app.querySelector("#player-list").replaceWith($list);

    const $form = addNewPlayer(newPlayer);
    $form.addEventListener("submit",newPlayer);
    document.querySelector("#newPlayerForm").replaceWith($form)
};

const init = async () => {
    await render();
}
init();