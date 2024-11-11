const fs = require("fs");

// Charger le fichier JSON
let data = JSON.parse(fs.readFileSync("./json/album-simplified.json", "utf8"));

// Structure de données pour stocker les comptages par année et par genre
const yearGenreCounts = {};

// Parcourir chaque album pour compter le nombre de musiques par genre et par année
data.forEach((album) => {
  const year = album.date.split("-")[0]; // Extraire l'année de la date
  const genre = album.genre;

  // Si l'année est "0000" ou invalide, on l'ignore
  if (year === "0000" || isNaN(parseInt(year))) return;

  // Initialiser l'année et le genre si nécessaire
  if (!yearGenreCounts[year]) yearGenreCounts[year] = {};
  if (!yearGenreCounts[year][genre]) yearGenreCounts[year][genre] = 0;

  // Incrémenter le nombre d'albums pour ce genre et cette année
  yearGenreCounts[year][genre]++;
});

// Sauvegarder les résultats dans un fichier pour la visualisation
fs.writeFileSync("./json/year-genre-counts.json", JSON.stringify(yearGenreCounts, null, 2), "utf8");

console.log("Traitement terminé et résultats sauvegardés dans 'year-genre-counts.json'");
