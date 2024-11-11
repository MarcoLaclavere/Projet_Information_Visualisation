// script pour generer les artistes les plus prolifiques par genre musical
// NB: should be used only one time to generate artist_genre_stats.json using : node Salma_Visu/generateGenreStats.js

import { createReadStream, writeFile } from 'fs';
import { join } from 'path';
import JSONStream from 'jsonstream';

// Configuration et exécution
const DATA_DIR = './json';
const OUTPUT_DIR = './Salma_Visu/preProcessedData';

// Fonction utilitaire pour obtenir l'ID MongoDB utilise dans le dataset. 
function getMongoId(idObject) {
    if (!idObject) return null;
    return idObject.$oid || idObject;
}

// Fonction pour charger un fichier JSON plus petit avec JSONStream
async function loadJSONWithStream(filePath) {
    return new Promise((resolve, reject) => {
        const data = [];
        const stream = createReadStream(filePath, { encoding: 'utf8' });
        const parser = JSONStream.parse('*');

        stream.pipe(parser)
            .on('data', (item) => data.push(item))
            .on('error', reject)
            .on('end', () => resolve(data));
    });
}

async function saveJSON(data, outputPath) {
    return new Promise((resolve, reject) => {
        writeFile(outputPath, JSON.stringify(data, null, 2), 'utf-8', (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

// Fonction pour nettoyer les genres
function cleanGenre(genre) {
    if (!genre) return 'Unknown';
    
    genre = genre.trim();
    genre = genre.charAt(0).toUpperCase() + genre.slice(1).toLowerCase();
    
    const genreMap = {
        'Hip Hop': ['Hip hop', 'Hip-hop', 'Rap'],
        'R&B': ['R&b', 'Rnb', 'R&B'],
        'Rock': ['Rock', 'Hard Rock', 'Soft Rock'],
        'Jazz': ['Jazz', 'Jazz Fusion', 'Modern Jazz'],
        'Classical': ['Classical', 'Classic', 'Orchestra'],
        'Electronic': ['Electronic', 'Electronica', 'EDM', 'Dance'],
        'Pop': ['Pop', 'Popular', 'Pop Rock'],
        'Blues': ['Blues', 'Blues Rock', 'Modern Blues'],
        'Country': ['Country', 'Country Rock', 'Modern Country'],
        'Folk': ['Folk', 'Folk Rock', 'Traditional'],
        'Reggae': ['Reggae', 'Reggae Rock', 'Ska']
    };

    for (const [mainGenre, variants] of Object.entries(genreMap)) {
        if (variants.includes(genre)) {
            return mainGenre;
        }
    }

    return genre;
}

async function processWasabiData(songsPath, albumsPath, artistsPath, outputPath) {
    console.time('Processing');
    try {
        console.log('Chargement des albums et artistes...');
        const [albums, artists] = await Promise.all([
            loadJSONWithStream(albumsPath),
            loadJSONWithStream(artistsPath)
        ]);

        console.log('Création des index...');
        const albumsMap = new Map(albums.map(album => [
            getMongoId(album._id), 
            { ...album, _id: getMongoId(album._id), id_artist: getMongoId(album.id_artist) }
        ]));

        const artistsMap = new Map(artists.map(artist => [
            getMongoId(artist._id),
            { ...artist, _id: getMongoId(artist._id) }
        ]));

        console.log('Traitement des chansons...');
        const genreStats = new Map();
        let processedSongs = 0;

        // Créer une promesse pour le traitement du stream song.json (car le fichier est tres large ...)
        // NB: poure le traitement de ces donnees il prend ~10 min. 
        await new Promise((resolve, reject) => {
            const songsStream = createReadStream(songsPath, { encoding: 'utf-8' });
            const parser = JSONStream.parse('*');

            songsStream
                .pipe(parser)
                .on('data', (song) => {
                    const songAlbumId = getMongoId(song.id_album);
                    const album = albumsMap.get(songAlbumId);
                    
                    if (!album || !album.genre) {
                        // /* console.log(" */genre not exist for album : "+songAlbumId);
                        return;
                    }

                    const genre = album.genre;
                    const artistId = album.id_artist;
                    const artist = artistsMap.get(artistId);
                    
                    if (!artist) {
                        // console.log("artist not exist for album : "+artistId);
                        return;
                    }

                    if (!genreStats.has(genre)) {
                        genreStats.set(genre, new Map());
                    }
                    
                    const artistsInGenre = genreStats.get(genre);
                    
                    if (!artistsInGenre.has(artistId)) {
                        artistsInGenre.set(artistId, {
                            artist: artist.name,
                            songCount: 0,
                            albumCount: new Set(),
                            details: {
                                id: artistId,
                                deezerFans: artist.deezerFans || 0,
                                urlDeezer: artist.urlDeezer || "",
                                picture: artist.picture || {},
                                urlWikipedia : artist.urlWikipedia,
                                urlOfficialWebsite : artist.urlOfficialWebsite,
                                urlFacebook: artist.urlFacebook,
                                urlMySpace: artist.urlMySpace,
                                urlTwitter: artist.urlTwitter
                            }
                        });
                    }

                    const artistStats = artistsInGenre.get(artistId);
                    artistStats.songCount++;
                    artistStats.albumCount.add(songAlbumId);

                    processedSongs++;
                    if (processedSongs % 10000 === 0) {
                        console.log(`Processed ${processedSongs.toLocaleString()} songs`);
                    }
                })
                .on('error', reject)
                .on('end', resolve);
        });

        console.log('Finalisation des statistiques...');
        const processedData = {};
        genreStats.forEach((artistsMap, genre) => {
            let mostProlifitArtist = null;
            let maxSongs = 0;

            artistsMap.forEach(stats => {
                if (stats.songCount > maxSongs) {
                    maxSongs = stats.songCount;
                    mostProlifitArtist = {
                        artist: stats.artist,
                        songCount: stats.songCount,
                        albumCount: stats.albumCount.size,
                        details: stats.details
                    };
                }
            });

            if (mostProlifitArtist) {
                processedData[cleanGenre(genre)] = mostProlifitArtist;
            }
        });

        console.log('Sauvegarde des résultats...');
        await saveJSON(processedData, outputPath);
        
        console.log(`Traitement terminé ! Résultats sauvegardés dans ${outputPath}`);
        console.log(`Total chansons traitées: ${processedSongs.toLocaleString()}`);
        console.log(`Nombre de genres: ${Object.keys(processedData).length}`);
        
        console.timeEnd('Processing time');
        console.log("End of processing")
        return processedData;

    } catch (error) {
        console.error('Erreur lors du traitement des données Wasabi:', error);
        throw error;
    }
}

const main = async () => {
    const paths = {
        songs: join(DATA_DIR, 'song.json'),
        albums: join(DATA_DIR, 'album.json'),
        artists: join(DATA_DIR, 'artist-without-members.json'),
        output: join(OUTPUT_DIR, 'artist_genre_stats.json')
    };

    try {
        await processWasabiData(
            paths.songs,
            paths.albums,
            paths.artists,
            paths.output
        );
    } catch (error) {
        console.error('Erreur:', error);
        process.exit(1);
    }
};

main();