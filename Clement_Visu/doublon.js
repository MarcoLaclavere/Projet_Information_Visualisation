const fs = require("fs");

// Charger le fichier JSON
let data = JSON.parse(fs.readFileSync("./json/album-simplified.json", "utf8"));

// Supprimer les doublons
const uniqueAlbums = [];
const albumSet = new Set();

data.forEach((item) => {
  // Créer une clé unique basée sur le nom et la date
  const uniqueKey = `${item.name}_${item.date}`;

  // Vérifier si cet album existe déjà dans le set
  if (!albumSet.has(uniqueKey)) {
    albumSet.add(uniqueKey); // Ajouter la clé unique dans le set
    uniqueAlbums.push(item); // Ajouter l'album à la liste sans doublons
  }
});

// Écrire la liste unique dans un nouveau fichier
fs.writeFileSync("./json/album-simplified-unique.json", JSON.stringify(uniqueAlbums, null, 2), "utf8");

console.log("Doublons supprimés et fichier mis à jour avec succès.");
