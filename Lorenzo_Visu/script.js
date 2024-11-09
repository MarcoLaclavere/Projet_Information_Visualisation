let savedTransform = d3.zoomIdentity;

// Fonction pour obtenir les genres sélectionnés
function getSelectedGenres() {
    const selectedGenres = [];
    document.querySelectorAll('#genre-filters input[name="genre"]:checked').forEach((checkbox) => {
        selectedGenres.push(checkbox.value);
    });
    return selectedGenres;
}



document.addEventListener("DOMContentLoaded", function() {
    const modal = document.getElementById("welcome-modal");
    const closeButton = document.querySelector(".modal-close");

    modal.style.display = "block";

    closeButton.onclick = function() {
      modal.style.display = "none";
    };

    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };

    document.querySelectorAll('#genre-filters label').forEach(label => {
        const genre = label.getAttribute('for');
        if (genreColors[genre]) {
            label.style.backgroundColor = genreColors[genre];
            label.style.color = "white";
        }
    });
});

const width = 960;
const height = 600;

const genreColors = {
    "rock": "#FF0000",
    "pop": "#00FF00",
    "electronic": "#0000FF",
    "metal": "#FFFF00",
    "blues": "#FF00FF",
    "jazz": "#00FFFF",
    "r&b & soul": "#FFA500",
    "folk": "#8A2BE2",
    "hip hop": "#C52A2A",
    "easy listening": "#5F9EA0",
    "avant-garde & experimental": "#D2691E",
    "country": "#FF7F50",
    "latin & south american": "#6495ED",
    "punk": "#DC143C",
    "religious": "#00CED1",
    "regional": "#1E90FF",
    "traditional_folk": "#8B0000",
    "Miscellaneous": "#696969",
    "other": "#808080"
};

const color = genre => genreColors[genre] || "#d3d3d3";

Promise.all([
    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
    d3.json("../json/aggregatedData.json")
]).then(([geoData, genreData]) => {
    document.querySelectorAll('#genre-filters input[name="genre"]').forEach((checkbox) => {
        checkbox.addEventListener('change', () => updateMap(geoData, genreData));
    });
    updateMap(geoData, genreData);
}).catch(error => console.error('Erreur lors du chargement des données :', error));

function updateMap(geoData, genreData) {
    d3.select("#map-container").selectAll("svg").remove();

    const projection = d3.geoMercator().scale(130).translate([width / 2, height / 2]);
    const path = d3.geoPath().projection(projection);

    const svg = d3.select("#map-container").append("svg").attr("width", width).attr("height", height);
    const g = svg.append("g");

    let currentZoom = 5;
    let initialTranslateX = -1800;
    let initialTranslateY = -500;

    function updateElements() {
        g.selectAll(".country-chart").each(function(d, i, nodes) {
            const pieGroup = d3.select(nodes[i]);
            const radius = pieGroup.datum().radius / currentZoom;
            const arc = d3.arc().innerRadius(0).outerRadius(radius);

            pieGroup.selectAll("path").attr("d", arc);

            pieGroup.select("text.country-label")
                .attr("dy", radius + 2)
                .style("font-size", `${15 / currentZoom}px`);
        });
    }

    const zoomBehavior = d3.zoom()
        .scaleExtent([1, 8])
        .on("zoom", (event) => {
            currentZoom = event.transform.k;
            savedTransform = event.transform;
            g.attr("transform", event.transform);
            updateElements();
        });

    svg.call(zoomBehavior)
        .call(zoomBehavior.transform, savedTransform);

    g.append("g")
        .selectAll("path")
        .data(geoData.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", "#f5f5dc")
        .attr("stroke", "#000000")
        .attr("stroke-width", "0.1");

    const offsetMap = {
        "Norway": { x: -20, y: 70 },
        "France": { x: 8, y: -12 },
        "USA": { x: 40, y: 40 },
        "Canada": { x: -20, y: 40 },
        "Country Unknown": { x: 1000, y: 180 } // Position dans l'océan Pacifique
    };

    const selectedGenres = getSelectedGenres();

    genreData.forEach(countryData => {
        const countryName = countryData.country;
        const genres = countryData.genres;

        const filteredGenres = Object.entries(genres).filter(([genre]) =>
            selectedGenres.includes(genre)
        );

        const pieData = filteredGenres.map(([genre, count]) => ({
            genre,
            count
        }));

        // Gérer les pays avec des coordonnées géographiques spéciales
        let x, y;
        if (countryName === "Country Unknown") {
            const offset = offsetMap[countryName];
            x = offset.x;
            y = offset.y;
        } else {
            const countryGeo = geoData.features.find(d => d.properties.name === countryName);
            if (!countryGeo) return;
            [x, y] = path.centroid(countryGeo);

            const offset = offsetMap[countryName] || { x: 0, y: 0 };
            x += offset.x;
            y += offset.y;
        }

        const initialRadius = 3 + pieData.length * 2;
        const arc = d3.arc().innerRadius(0).outerRadius(initialRadius);
        const pie = d3.pie().value(d => d.count);

        const pieGroup = g.append("g")
            .datum({ radius: initialRadius })
            .attr("transform", `translate(${x}, ${y})`)
            .attr("class", "country-chart")
            .on("click", () => showTooltip(countryName, pieData, color));

        pieGroup.selectAll("path")
            .data(pie(pieData))
            .enter()
            .append("path")
            .attr("d", arc)
            .attr("fill", d => color(d.data.genre))
            .append("title")
            .text(d => `${d.data.genre}: ${d.data.count}`);

        pieGroup.append("text")
            .attr("dy", initialRadius + 2)
            .attr("text-anchor", "middle")
            .attr("class", "country-label")
            .text(countryName)
            .style("font-size", `${15}px`);
    });

    updateElements();
}


function showTooltip(countryName, pieData, color) {
    const tooltip = d3.select("#tooltip");
    tooltip.style("display", "block");

    // Ajouter le nom du pays dans le conteneur dédié
    d3.select("#tooltip-country-name").text(countryName);

    const svg = d3.select("#tooltip-chart");
    svg.selectAll("*").remove();

    const radius = 70; // Ajustez le rayon pour qu'il corresponde au conteneur
    svg.attr("width", radius * 2).attr("height", radius * 2);

    const arc = d3.arc().innerRadius(0).outerRadius(radius);
    const pie = d3.pie().value(d => d.count);

    const pieGroup = svg.append("g")
        .attr("transform", `translate(${radius}, ${radius})`);

    pieGroup.selectAll("path")
        .data(pie(pieData))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.genre))
        .on("click", function(event, d) {
            event.stopPropagation();
            d3.select("#tooltip-buttons").style("display", "block");

            // Mettre à jour le texte du genre sélectionné
            d3.select("#tooltip-selected-genre").text(`Genre sélectionné : ${d.data.genre}`);
            console.log(`Genre sélectionné : ${d.data.genre}`);
        })
        .append("title")
        .text(d => `${d.data.genre}: ${d.data.count}`);

    const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on("zoom", (event) => {
            pieGroup.attr("transform", event.transform);
        });

    svg.call(zoom);

    d3.select(".tooltip-close").on("click", () => {
        tooltip.style("display", "none");
        d3.select("#tooltip-buttons").style("display", "none");
        d3.select("#tooltip-selected-genre").text("Genre sélectionné : Aucun"); // Réinitialiser le texte du genre sélectionné
    });
}




