const fs = require('fs');

// Chemins des fichiers
const inputPath = '../json/album-simplified.json';
const outputPath = './json/stats-platform.json';

// Charger les données simplifiées
const data = require(inputPath);

// Fonction pour calculer les statistiques des plateformes par genre
function calculatePlatformStats(data) {
  const stats = {};

  // Initialiser le compteur pour le genre "any"
  stats["any"] = { urlSpotify: 0, urlITunes: 0, urlAmazon: 0, urlDeezer: 0, urlDiscogs: 0, urlMusicBrainz: 0 };

  // Parcourir chaque album pour compter les plateformes par genre
  data.forEach(item => {
    const genre = item.genre;

    // Initialiser le genre dans les statistiques s'il n'existe pas encore
    if (!stats[genre]) {
      stats[genre] = { urlSpotify: 0, urlITunes: 0, urlAmazon: 0, urlDeezer: 0, urlDiscogs: 0, urlMusicBrainz: 0 };
    }

    // Incrémenter les compteurs pour chaque plateforme si elle est présente (true)
    ["urlSpotify", "urlITunes", "urlAmazon", "urlDeezer", "urlDiscogs", "urlMusicBrainz"].forEach(platform => {
      if (item[platform]) {
        stats[genre][platform]++;
        stats["any"][platform]++;
      }
    });
  });

  return stats;
}

// Calculer les statistiques et les sauvegarder dans un fichier JSON
const stats = calculatePlatformStats(data);
fs.writeFileSync(outputPath, JSON.stringify(stats, null, 2), 'utf-8');
console.log("Le fichier 'stats-platform.json' a été créé avec succès.");
