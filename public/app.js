const toJson = document.getElementById("btnToJSON");
const toXML = document.getElementById("btnToXML");
const btn = document.getElementById("btn");
const btnPokemon = document.getElementById("btnPokemon");

btn.addEventListener("click", async () => {
  const text = document.getElementById("input").value;

  // Fem una petició HTTP al servidor (Express)
  // fetch() envia una request al backend
  const res = await fetch("/convert", {
    // Tipus de petició
    // POST = enviem dades al servidor
    method: "POST",
    // Capçaleres HTTP
    // Indiquem que estem enviant dades en format JSON
    headers: {
      "Content-Type": "application/json",
    },

    // Cos de la petició (les dades que enviem)
    // Convertim l’objecte JS a text JSON
    body: JSON.stringify({ data: text }),
  });

  // El servidor respon amb JSON
  // Convertim la resposta a objecte JavaScript
  const json = await res.json();

  // Mostrem el resultat a la textarea de sortida
  document.getElementById("output").value = json.result;
});

toXML.addEventListener("click", async () => {
  const text = document.getElementById("input").value;

  const res = await fetch("/convertToXML", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: text }),
  });

  const json = await res.json();
  document.getElementById("output").value = json.result;
});

toJson.addEventListener("click", async () => {
  const text = document.getElementById("input").value;

  const res = await fetch("/convertToJson", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: text }),
  });

  const json = await res.json();
  document.getElementById("output").value = JSON.stringify(
    json.result,
    null,
    2,
  );
});

btnPokemon.addEventListener("click", async () => {
  const inputEl = document.getElementById("input");
  const outputEl = document.getElementById("output");
  const imgContainer = document.getElementById("img-container");
  const name = inputEl.value.trim().toLowerCase();

  if (!name) return;

  try {
    const res = await fetch("/convertPokemon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name }),
    });

    const json = await res.json();
    const pokemon = json.result;

    imgContainer.innerHTML = `<img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">`;

    const abilities = pokemon.abilities.map(a => a.ability.name).join(", ");
    outputEl.value = `NOM: ${pokemon.name.toUpperCase()}\nHABILITATS: ${abilities}`;

  } catch (error) {
    outputEl.value = "Error cercant el Pokémon.";
  }
});