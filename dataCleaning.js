const fs = require('fs'); // Utiliser le système de fichiers de Node.js
const path = require('path'); // Gérer les chemins de fichiers

// 1. removeDuplicates: Supprime les entrées en double basées sur une clé spécifique
function removeDuplicates(data, key) {
  const seen = new Set();
  return data.filter(item => {
    const duplicate = seen.has(item[key]);
    seen.add(item[key]);
    return !duplicate;
  });
}

// 2. normalizeGenres: Normalise les genres avec une table de correspondance
const groupGenresByCategory = require('./Lorenzo_Visu/genreTraitement.js'); // Importer la fonction depuis genreNormalize.js
const data = require('./json/artist-without-members.json'); // Charger les données JSON

// Fonction normalizeGenres qui appelle la fonction groupGenresByCategory
function normalizeGenres(data) {
  // Appel à la fonction groupGenresByCategory qui fait tout le travail
  return groupGenresByCategory(data);
}
const updatedData = normalizeGenres(data);

const data2=  require('./json/artist-with-new-genres.json');
const extractEssentialInfo= require('./Lorenzo_Visu/gatherData.js');
function gatherData(data2) {
  // Appel à la fonction groupGenresByCategory qui fait tout le travail
  return extractEssentialInfo(data2);
}
const updatedData2 = gatherData(data2);

// Appel de la fonction normalizeGenres


// Sauvegarder les données JSON modifiées dans un nouveau fichier
//fs.writeFileSync('artist-with-normalized-genres.json', JSON.stringify(updatedData, null, 2));



// 3. filterIncompleteEntries: Filtre les entrées avec des champs manquants
function filterIncompleteEntries(data, requiredFields) {
  return data.filter(item =>
    requiredFields.every(field => item[field] !== undefined && item[field] !== null)
  );
}

// 4. convertDataTypes: Convertit certains champs vers le bon type (ex. Date, Nombre)
function convertDataTypes(data, typeMap) {
  return data.map(item => {
    const newItem = { ...item };
    for (const [key, type] of Object.entries(typeMap)) {
      if (type === "date") newItem[key] = new Date(item[key]);
      if (type === "number") newItem[key] = Number(item[key]);
    }
    return newItem;
  });
}

// Fonction utilitaire: Charger un fichier JSON
function loadJSON(filePath) {
  const rawData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(rawData);
}

// Fonction utilitaire: Enregistrer des données nettoyées dans le dossier cleandata/
function saveCleanedData(fileName, data) {
  const cleanDir = path.join(__dirname, 'cleandata'); // Dossier de sortie

  if (!fs.existsSync(cleanDir)) {
    fs.mkdirSync(cleanDir); // Crée le dossier s'il n'existe pas
  }

  const filePath = path.join(cleanDir, fileName);
  const jsonData = JSON.stringify(data, null, 2);
  
  fs.writeFileSync(filePath, jsonData, 'utf-8');
  console.log(`Données nettoyées sauvegardées dans : ${filePath}`);
}

// Nettoyage des données et sauvegarde
async function cleanAndSaveJSON(filePath, genreMap, requiredFields, typeMap) {
  try {
    const data = loadJSON(filePath); // Charger le fichier JSON

    // Appliquer les transformations de nettoyage
    let cleanedData = removeDuplicates(data, 'albumId');
    cleanedData = normalizeGenres(cleanedData, genreMap);
    cleanedData = filterIncompleteEntries(cleanedData, requiredFields);
    cleanedData = convertDataTypes(cleanedData, typeMap);

    // Sauvegarder dans le dossier cleandata/ avec le même nom de fichier
    const fileName = path.basename(filePath);
    saveCleanedData(fileName, cleanedData);
  } catch (error) {
    console.error(`Erreur lors du traitement du fichier ${filePath}: ${error}`);
  }
}

// Configuration des paramètres de nettoyage
const genreMap = {
  "alt rock": "alternative rock",
  "hiphop": "hip-hop"
};

const requiredFields = ['albumId', 'artist', 'releaseDate'];

const typeMap = {
  releaseDate: 'date',
  popularity: 'number'
};

// Nettoyage de tous les fichiers dans le dossier json/
const jsonDir = path.join(__dirname, 'json');
fs.readdir(jsonDir, (err, files) => {
  if (err) {
    console.error('Erreur lors de la lecture du dossier json/:', err);
    return;
  }

  files.forEach(file => {
    if (file.endsWith('.json')) {
      const filePath = path.join(jsonDir, file);
      cleanAndSaveJSON(filePath, genreMap, requiredFields, typeMap);
    }
  });
});
