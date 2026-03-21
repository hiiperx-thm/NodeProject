import express from "express";
import { xml2json } from "xml-js";
import { toXML } from "./utils.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

app.post("/convertToXML", (req, res) => {
  try {
    const { data } = req.body;
    const result = toXML(data);
    res.json({ result });
  } catch (e) {
    res.status(400).json({ result: "Error convirtiendo a XML" });
  }
});

app.post("/convert", (req, res) => {
  try {
    const { data } = req.body;
    const result = toXML(data);
    res.json({ result });
  } catch (e) {
    res.status(400).json({ result: "Error convirtiendo a XML" });
  }
});

app.post("/convertToJson", (req, res) => {
  try {
    const { data } = req.body;

    const jsonString = xml2json(data, { compact: true, spaces: 4 });

    const resultObj = JSON.parse(jsonString);

    res.json({ result: resultObj });
  } catch (e) {
    console.error(e);
    res.status(400).json({ result: "Error: El XML no es válido" });
  }
});

app.post("/convertPokemon", async (req, res) => {
  try {
    const { name } = req.body;
    const cleanName = name ? name.trim().toLowerCase() : "";

    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${cleanName}`,
    );

    if (!response.ok) {
      throw new Error("Pokemon no trobat");
    }

    const pokemonData = await response.json();

    res.json({ result: pokemonData });
  } catch (e) {
    // És millor enviar un objecte amb estructura similar per no petar el front
    res.status(404).json({ result: null, error: "No s'ha trobat el Pokémon" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor a http://localhost:${PORT}`);
});
