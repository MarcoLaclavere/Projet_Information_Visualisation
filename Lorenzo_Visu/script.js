// Fonction pour obtenir les genres sélectionnés
function getSelectedGenres() {
    const selectedGenres = [];
    document.querySelectorAll('#genre-filters input[name="genre"]:checked').forEach((checkbox) => {
        selectedGenres.push(checkbox.value);
    });
    return selectedGenres;
}

// Code pour gérer la boîte modale
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
});

const width = 960;
const height = 600;

Promise.all([
    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
    d3.json("../json/aggregatedData.json")
]).then(([geoData, genreData]) => {
    

    // Ajouter un événement de changement pour les filtres de genre
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

    const color = d3.scaleOrdinal(d3.schemeCategory10);
    
    // Augmentez ici le niveau de zoom initial et ajustez la translation
    let currentZoom = 5; // Niveau de zoom initial légèrement plus élevé
    let initialTranslateX = -1800; // Décalage initial vers la droite
    let initialTranslateY = -500;   // Décalage initial vers le bas (ajustez si nécessaire)

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
            g.attr("transform", event.transform);
            updateElements();
        });

    svg.call(zoomBehavior)
        .call(zoomBehavior.transform, d3.zoomIdentity
            .translate(initialTranslateX, initialTranslateY) // Appliquer la translation initiale
            .scale(currentZoom) // Appliquer le zoom initial
        );

    g.append("g")
        .selectAll("path")
        .data(geoData.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", "#f5f5dc")  // Blanc cassé
        .attr("stroke", "#000000")  // Noir
        .attr("stroke-width", "0.1");  // Épaisseur du contour

    const offsetMap = {
        "Norway": { x: -20, y: 70 },
        "France": { x: 8, y: -12 },
        "USA": { x: 40, y: 40 },
        "Canada": { x: -20, y: 40 },
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

        const countryGeo = geoData.features.find(d => d.properties.name === countryName);
        if (!countryGeo) return;
        const [x, y] = path.centroid(countryGeo);

        const offset = offsetMap[countryName] || { x: 0, y: 0 };
        const offsetX = offset.x;
        const offsetY = offset.y;

        const initialRadius = 3 + pieData.length * 2;
        const arc = d3.arc().innerRadius(0).outerRadius(initialRadius);
        const pie = d3.pie().value(d => d.count);

        const pieGroup = g.append("g")
            .datum({ radius: initialRadius })
            .attr("transform", `translate(${x + offsetX}, ${y + offsetY})`)
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

    // Appel initial de updateElements pour que les pie charts soient bien calibrés
    updateElements();
}


function showTooltip(countryName, pieData, color) {
    const tooltip = d3.select("#tooltip");
    tooltip.style("display", "block");

    const svg = d3.select("#tooltip-chart");
    svg.selectAll("*").remove();

    const radius = 120;
    const arc = d3.arc().innerRadius(0).outerRadius(radius);
    const pie = d3.pie().value(d => d.count);

    svg.attr("width", radius * 2).attr("height", radius * 2);

    const pieGroup = svg.append("g")
        .attr("transform", `translate(${radius}, ${radius})`);

    pieGroup.selectAll("path")
        .data(pie(pieData))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.genre))
        .append("title")
        .text(d => `${d.data.genre}: ${d.data.count}`);

    svg.append("text")
        .attr("x", radius)
        .attr("y", 10)
        .attr("text-anchor", "middle")
        .text(countryName)
        .style("font-weight", "bold");

    // Close tooltip event
    d3.select(".tooltip-close").on("click", () => tooltip.style("display", "none"));
}
