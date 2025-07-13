const API_URL = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "/2505-FTB-CT-WEB-PT-DanielB"
const API = API_URL + COHORT;
const $form = document.querySelector("form"); //will be used in function later
const $loading = document.querySelector("#loading-screen")//will be used in function later
const $app = document.querySelector("#app");//will be used in function later
let teams = [];

function showLoading () {
    $loading.setAttribute("style", "display:flex;");
}

function hideLoading () {
    $loading.setAttribute("style", "display:none;");
}

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

const createPlayer = async(name, breed, imageUrl) => {
    try {
        const response = await fetch(`${API}/players`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                breed,
                imageUrl
            })
        });

        const json = await response.json();
        return json.data.newPlayer;
    } catch (err) {
        console.error(err.message);
    }
}


const fetchPlayerById = async(id) => {
    try {
        const response = await fetch(`${API}/players/${id}`);
        const json = await response.json();
        return json.data.player;
    } catch (err) {
        console.error(err.message);
    }
}


const removePlayerById = async(id) => {
    try {
        await fetch(`${API}/players/${id}`, {
            method: "DELETE"
        });
    } catch (err) {
        console.error(err.message);
    }
}


async function fetchAllTeams () {
    try {
        // see "Get all teams"
    } catch (err) {
        console.error(err.message);
    }
}
//==details all players==
const renderAllPlayers = async() => {
    const playerList = await fetchAllPlayers();
    console.log(playerList);
    const $players = document.createElement("ul");
    $players.id = "player-list";
    playerList.forEach(player => {
        const $player = document.createElement("li");
        $player.className = "player-card";
        $player.innerHTML += `
        <h2>${player.name}</h2>
        <p>${player.breed}</p>
        <img src="${player.imageUrl}" alt="Picture of ${player.name}" />
        <section class="player-actions">
            <button class="details-btn">See Details</button>
            <button class="remove-btn">Remove Player</button>
        </section>
        `;
        $detailsBtn = $player.querySelector(".details-btn");
        $removeBtn = $player.querySelector(".remove-btn");

        $detailsBtn.addEventListener("click", async () => {
            showLoading();
            try {
                await renderSinglePlayer(player.id);
            } catch (err) {
                console.error(err.message);
            } finally {
                hideLoading();
            }
        });

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

        $players.appendChild($player);
    });
    const $main = document.querySelector("PlayerList");
    $main.innerHTML = "";
    $main.appendChild($players);
}

function PartyListItem(player) {
  const $li = document.createElement("li");

  if (player.id === selectedParty?.id) {
    $li.classList.add("selected");
  }

  $li.innerHTML = `
    <a href="#selected">${player.name}</a>
  `;
  $li.addEventListener("click", () => getParty(player.id));
  return $li;
}

function listAllPlayers() {
  const $ul = document.createElement("ul");
  $ul.classList.add("players");

  const $players = players.map(PartyListItem);
  $ul.replaceChildren(...$players);

  return $ul;
}

const renderSinglePlayer = async(id) => {
    const player = await fetchPlayerById(id);
    const $main = document.querySelector("PlayerList");
    $main.innerHTML = `
    <section id="single-player">
        <h2>${player.name}/${player.team?.name || "Unassigned"} - ${player.status}</h2>
        <p>${player.breed}</p>
        <img src="${player.imageUrl}" alt="Picture of ${player.name}" />
        <button id="back-btn">Back to List</button>
    </section>
    `;

    $main.querySelector("#back-btn").addEventListener("click", async () => {
        showLoading();
        try {
            await renderAllPlayers();
        } catch (err) {
            console.error(err.message);
        } finally {
            hideLoading();
        }
    });
}

const render = async() =>{
    const $app = document.querySelector("#app");
    $app.innerHTML=`
    <h1>Puppy Bowl</h1>
    <main>
    <section>
        <h2>Players</h2>
        <PlayerList></PlayerList>
    </section>
    <section id="selected">
        <h2>Player Details</h2>
        <SelectedPlayer></SelectedPlayer>
    </section> 
    </main>
    `;
    $app.querySelector("PlayerList").replaceWith(listAllPlayers())
    //$app.querySelector("SelectedPlayer").replaceWith(renderSinglePlayer())
   await renderAllPlayers();

};


// async function init () {
//     try {
//         await renderAllPlayers();
//         teams = await fetchAllTeams();
//     } catch (err) {
//         console.error(err);
//     } finally {
//         hideLoading();
//     }
// }

// $form.addEventListener("submit", async (e) => {
//     e.preventDefault();
//     const name = document.querySelector("#new-name").value;
//     const breed = document.querySelector("#new-breed").value;
//     const image = document.querySelector("#new-image").value;
    
//     showLoading();
//     try {
//         await createPlayer(name, breed, image);
//         renderAllPlayers();
//     } catch (err) {
//         console.error(err.message);
//     } finally {
//         document.querySelector("#new-name").value = "";
//         document.querySelector("#new-breed").value = "";
//         document.querySelector("#new-image").value = "";
//         hideLoading();
//     }
// })

// init();
// createPlayer("tobey","dachshund","https://www.vidavetcare.com/wp-content/uploads/sites/234/2022/04/dachshund-dog-breed-info.jpeg");

// fetchPlayerById(38967);
// removePlayerById(38967);
// fetchAllTeams();
render();
fetchAllPlayers();
renderSinglePlayer();