const fs = require('fs');

// Chemin du fichier de sortie
const outputPath = './json/artist-simplified.json';

// Charger le fichier JSON complet
const data = require('../json/artist-with-new-genres.json');

// Fonction pour extraire les informations essentielles
function extractEssentialInfo(data) {
  // Vérifier si le fichier simplifié existe déjà
  if (fs.existsSync(outputPath)) {
    console.log("Le fichier 'artist-simplified.json' existe déjà. Aucun traitement n'a été effectué.");
    return null; // Sortir de la fonction sans effectuer le traitement
  }

  // Si le fichier n'existe pas, extraire les informations essentielles
  const simplifiedData = data.map(item => ({
    name: item.name,                               // Nom de l'artiste
    country_of_birth: item.location.country,       // Pays de naissance
    music_style: item.dbp_genre,                   // Style de musique
    recordLabel: item.recordLabel || [],           // Liste des labels
    urlSpotify: !!item.urlSpotify,                 // true si urlSpotify existe, false sinon
    urlITunes: !!item.urlITunes,                   // true si urlITunes existe, false sinon
    urlAmazon: !!item.urlAmazon,                   // true si urlAmazon existe, false sinon
    urlDeezer: !!item.urlDeezer,                   // true si urlDeezer existe, false sinon
    urlDiscogs: !!item.urlDiscogs,                 // true si urlDiscogs existe, false sinon
    urlMusicBrainz: !!item.urlMusicBrainz          // true si urlMusicBrainz existe, false sinon
  }));

  // Sauvegarder les données simplifiées dans un nouveau fichier JSON
  fs.writeFileSync(outputPath, JSON.stringify(simplifiedData, null, 2), 'utf-8');
  console.log("Le fichier JSON simplifié a été créé avec succès.");
  
  return simplifiedData; // Retourne les données simplifiées
}

// Appel de la fonction
// extractEssentialInfo(data);

module.exports = extractEssentialInfo;
