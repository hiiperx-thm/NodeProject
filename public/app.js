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
// 1. Definim l'estat i el contenidor FORA per mantenir la memòria
let isShiny = false;
let pokemonCache = null; // Guardem les dades per no fer fetch cada vegada que canviem de color

btnPokemon.addEventListener("click", async () => {
  const inputEl = document.getElementById("input");
  const outputEl = document.getElementById("output");
  const name = inputEl.value.trim().toLowerCase();

  if (!name) {
    outputEl.value = "Si us plau, introdueix un nom de Pokémon.";
    return;
  }

  try {
    if (!pokemonCache || pokemonCache.name !== name) {
      const res = await fetch("/convertPokemon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name }),
      });

      const json = await res.json();

      if (res.status !== 200) {
        outputEl.value = "Pokémon no trobat.";
        return;
      }

      pokemonCache =
        typeof json.result === "string" ? JSON.parse(json.result) : json.result;
    }

    let img = document.getElementById("pokemon-img");
    if (!img) {
      img = document.createElement("img");
      img.id = "pokemon-img";
      document.querySelector(".container").appendChild(img);
    }

    img.src = isShiny
      ? pokemonCache.sprites.front_shiny
      : pokemonCache.sprites.front_default;

    outputEl.value = `Mostrant ${pokemonCache.name.toUpperCase()} (${isShiny ? "Shiny" : "Normal"})`;

    isShiny = !isShiny;
  } catch (error) {
    console.error("Error:", error);
    outputEl.value = "Error en la comunicació amb el servidor.";
  }
});
