
// ===================
// Sélecteurs DOM
// ===================
const searchInput = document.querySelector(".recherche-poke input");
const listePoke = document.querySelector('.liste-poke');
const formSearch = document.querySelector('form');
const chargement = document.querySelector('.loader');

// ===================
// Variables globales
// ===================
let allPokemon = [];
let tableauFin = [];
const limite = 75;
let PokeNombreDebut = 21;
let index = PokeNombreDebut;
let counter = 0;

// ===================
// Couleurs par type
// ===================
const types = {
    bug: '#a8b820',
    dark: '#705848',
    dragon: '#7038f8',
    electric: '#f8d030',
    fairy: '#ee99ac',
    fighting: '#c03028',
    fire: '#f08030',
    flying: '#a890f0',
    ghost: '#705898',
    grass: '#78c850',
    ground: '#e0c068',
    ice: '#98d8d8',
    normal: '#a8a878',
    poison: '#a040a0',
    psychic: '#f85888',
    rock: '#b8a038',
    steel: '#b8b8d0',
    water: '#6890f0'
};

// ===================
// Fetch principal
// ===================
function fetchPokemonBase() {

    chargement.style.display = 'flex';

    const promises = [];

    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limite}`)
        .then(res => res.json())
        .then(data => {
            data.results.forEach(pokemon => {
                promises.push(fetchPokemonComplet(pokemon));
            });
        })
        .then(() => Promise.all(promises))
        .then(() => {
            tableauFin = allPokemon
                .sort((a, b) => a.id - b.id)
                .slice(0, PokeNombreDebut);

            createCard(tableauFin);
            chargement.style.display = 'none';
        })
        .catch(err => console.error(err));
}

// ===================
// Fetch d’un Pokémon
// ===================
function fetchPokemonComplet(pokemon) {

    const objPokemonFull = {};
    const url = pokemon.url;
    const nameP = pokemon.name;

    return fetch(url)
        .then(res => res.json())
        .then(pokeData => {

            counter++;

            objPokemonFull.pic = pokeData.sprites.front_default;
            objPokemonFull.type = pokeData.types[0].type.name;
            objPokemonFull.id = pokeData.id;

            return fetch(`https://pokeapi.co/api/v2/pokemon-species/${nameP}`)
                .then(res => res.json())
                .then(speciesData => {
                    objPokemonFull.name = speciesData.names[4].name;
                    allPokemon.push(objPokemonFull);
                });
        });
}

// ===================
// Création des cartes
// ===================
function createCard(arr) {

    arr.forEach(poke => {

        const carte = document.createElement("li");
        carte.classList.add('hoverableCarte');

        carte.style.background = types[poke.type] || '#ccc';

        const imgCarte = document.createElement('img');
        imgCarte.src = poke.pic;

        const txtCarte = document.createElement('h5');
        txtCarte.innerText = poke.name;

        const idCarte = document.createElement('p');
        idCarte.innerText = `ID# ${poke.id}`;

        carte.append(imgCarte, txtCarte, idCarte);
        listePoke.appendChild(carte);
    });
}

// ===================
// Recherche
// ===================
formSearch.addEventListener('submit', e => {
    e.preventDefault();
    recherche();
});

function recherche() {

    if (index < counter) {
        addPoke(counter - index);
    }

    const filter = searchInput.value.toUpperCase();
    const allLi = document.querySelectorAll('.liste-poke li');
    const allTitles = document.querySelectorAll('.liste-poke li h5');

    for (let i = 0; i < allLi.length; i++) {
        const titleValue = allTitles[i].innerText.toUpperCase();
        allLi[i].style.display =
            titleValue.includes(filter) ? 'flex' : 'none';
    }
}

// ===================
// Scroll infini
// ===================
window.addEventListener('scroll', () => {

    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if (clientHeight + scrollTop >= scrollHeight - 20) {
        addPoke(6);
    }
});

function addPoke(nb) {

    if (index >= counter) return;

    const arrToAdd = allPokemon.slice(index, index + nb);
    createCard(arrToAdd);
    index += nb;
}

// ===================
// Label animé
// ===================
searchInput.addEventListener("input", e => {
    e.target.parentNode.classList.toggle(
        "active-input",
        e.target.value !== ""
    );
});

// ===================
// Lancement appli
// ===================
fetchPokemonBase();

