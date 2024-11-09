const fs = require('fs');

// Chemin du fichier de sortie
const outputPath = './json/album-simplified.json';

// Charger le fichier JSON complet
const data = require('../json/album-with-new-genres.json');

// Fonction pour extraire les informations essentielles
function extractEssentialInfo(data) {
  // Vérifier si le fichier simplifié existe déjà
  if (fs.existsSync(outputPath)) {
    console.log("Le fichier 'album-simplified.json' existe déjà. Aucun traitement n'a été effectué.");
    return null; // Sortir de la fonction sans effectuer le traitement
  }

  // Si le fichier n'existe pas, extraire les informations essentielles
  const simplifiedData = data.map(item => ({
    name: item.name,                           // Nom de l'album
    date : item.dateRelease,                   // Date de publication
    genre: item.genre,                          // Style de musique
    urlSpotify: !!item.urlSpotify,          // Présence de l'URL Spotify
    urlITunes: !!item.urlITunes,            // Présence de l'URL iTunes
    urlAmazon: !!item.urlAmazon,            // Présence de l'URL Amazon
    urlDeezer: !!item.urlDeezer,            // Présence de l'URL Deezer
    urlDiscogs: !!item.urlDiscogs,          // Présence de l'URL Discogs
    urlMusicBrainz: !!item.urlMusicBrainz   // Présence de l'URL MusicBrainz
  }));

  // Sauvegarder les données simplifiées dans un nouveau fichier JSON
  fs.writeFileSync(outputPath, JSON.stringify(simplifiedData, null, 2), 'utf-8');
  console.log("Le fichier JSON simplifié a été créé avec succès.");
  
  return simplifiedData; // Retourne les données simplifiées
}

// Appel de la fonction
// extractEssentialInfo(data);

module.exports = extractEssentialInfo;
