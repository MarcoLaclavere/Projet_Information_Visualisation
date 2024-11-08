// Initialiser un objet pour compter les occurrences de chaque genre
const genreCounts = {};
const simplifiedData = require('../json/album-simplified.json');

// Parcourir le fichier JSON simplifié pour compter les genres
simplifiedData.forEach(item => {
  const genre = item.genre; // Assurez-vous que c'est le bon nom de clé

  // Initialiser le compteur pour ce genre s'il n'existe pas encore
  if (!genreCounts[genre]) {
    genreCounts[genre] = 0;
  }

  // Incrémenter le compteur pour ce genre
  genreCounts[genre]++;
});

// Transformer les comptes en une chaîne de texte formatée
const genreCountString = Object.entries(genreCounts)
  .map(([genre, count]) => `${genre} : ${count}`)
  .join(', ');

// Afficher le résultat dans le format souhaité
console.log(genreCountString);