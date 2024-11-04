const fs = require('fs');

function aggregateGenresByCountry(inputPath = '../json/artist-simplified.json', outputPath = '../json/aggregatedData.json') {
  try {
    // Charger les données depuis le fichier JSON
    const rawData = fs.readFileSync(inputPath, 'utf-8');
    const artists = JSON.parse(rawData);

    // Transformation des données
    const countryGenreCounts = {};
    const usStates = [
      "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", 
      "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", 
      "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", 
      "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", 
      "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", 
      "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", 
      "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", 
      "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
    ];

    artists.forEach(artist => {
      // Si le pays est un état américain, on le remplace par "USA"
      let country = artist.country_of_birth || "Country Unknown";
      if (usStates.includes(country) || country === "United States") {
        country = "USA"; // Correspondance avec le nom utilisé dans le GeoJSON
      }

      if (!countryGenreCounts[country]) {
        countryGenreCounts[country] = {};
      }

      artist.music_style.forEach(genre => {
        countryGenreCounts[country][genre] = (countryGenreCounts[country][genre] || 0) + 1;
      });
    });

    // Créer un tableau avec la structure souhaitée, en excluant les pays ayant uniquement "Miscellaneous"
    const transformedData = Object.keys(countryGenreCounts)
      .filter(country => {
        // Exclure les pays ayant uniquement "Miscellaneous" comme genre
        const genres = Object.keys(countryGenreCounts[country]);
        return !(genres.length === 1 && genres[0] === "Miscellaneous");
      })
      .map(country => ({
        country,
        genres: countryGenreCounts[country]
      }));

    // Sauvegarder le résultat dans un fichier JSON
    fs.writeFileSync(outputPath, JSON.stringify(transformedData, null, 2), 'utf-8');
    console.log(`Les données agrégées ont été enregistrées dans '${outputPath}'`);

  } catch (error) {
    console.error("Erreur lors du traitement des données :", error);
  }
}

// Appeler la fonction pour exécuter le traitement
aggregateGenresByCountry();
