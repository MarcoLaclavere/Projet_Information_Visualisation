// Variables globales pour les données et les filtres
let fullData = {};
let filteredData = {};
const DATA_URL = './preProcessedData/artist_genre_stats.json';
const DEFAULT_GENRES = 5;
const DEFAULT_CATEGORIES = [
    'Rock',
    'Pop',
    'Hip Hop',
    'Jazz',
    'Electronic',
    'Classical',
    'Blues',
    'Country',
    'Folk'
];
document.addEventListener('DOMContentLoaded', function () {
    const trigger = document.getElementById('genreDropdownTrigger');
    const menu = document.getElementById('genreFilter');

    // Toggle dropdown
    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        trigger.classList.toggle('active');
        menu.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !trigger.contains(e.target)) {
            trigger.classList.remove('active');
            menu.classList.remove('show');
        }
    });
});

async function loadProcessedData() {
    try {
        const response = await fetch(DATA_URL);
        if (!response.ok) throw new Error('Erreur de chargement');
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        document.getElementById('loading').textContent =
            'Erreur lors du chargement des données';
        throw error;
    }
}

function initializeFilters(data) {
    const dropdownItems = document.querySelector('.dropdown-items');
    const genres = new Set([...DEFAULT_CATEGORIES, ...Object.keys(data)]);

    genres.forEach(genre => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'dropdown-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `genre-${genre}`;
        checkbox.className = 'category-checkbox';
        checkbox.value = genre;
        checkbox.checked = DEFAULT_CATEGORIES.includes(genre);

        const label = document.createElement('label');
        label.htmlFor = `genre-${genre}`;

        const checkboxCustom = document.createElement('span');
        checkboxCustom.className = 'checkbox-custom';

        const text = document.createElement('span');
        text.textContent = genre;

        label.appendChild(checkboxCustom);
        label.appendChild(text);

        itemDiv.appendChild(checkbox);
        itemDiv.appendChild(label);
        dropdownItems.appendChild(itemDiv);
    });

    // Update the selected count in the trigger
    function updateTriggerCount() {
        const selectedCount = document.querySelectorAll('.category-checkbox:checked').length;
        const countSpan = document.querySelector('.selected-count');
        countSpan.textContent = selectedCount;
    }

    // Add event listeners
    // pour le checkbox 
    dropdownItems.addEventListener('change', event => {
        if (event.target.type === 'checkbox') {
            updateFilteredData();
            updateTriggerCount();
        }
    });
    document.getElementById('selectAll').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleAll();
        updateTriggerCount();
    });


    // Pour la recherche d'artiste
    document.getElementById('artistFilter').addEventListener('input', () => {
        updateFilteredData();
    });
    // Pour le bouton réinitialiser
    document.getElementById('resetFilters').addEventListener('click', () => {
        resetFilters();
        updateTriggerCount();
    });

    // Initial count update
    updateTriggerCount();
    updateFilteredData();
}
function toggleAll() {
    const checkboxes = document.querySelectorAll('.category-checkbox');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    checkboxes.forEach(cb => cb.checked = !allChecked);
    updateFilteredData();
}

function updateFilteredData() {
    const selectedGenres = Array.from(document.querySelectorAll('.category-checkbox:checked'))
        .map(cb => cb.value);
    const artistSearch = document.getElementById('artistFilter').value.toLowerCase();

    filteredData = {};
    Object.entries(fullData).forEach(([genre, data]) => {
        if (selectedGenres.includes(genre) &&
            (!artistSearch || data.artist.toLowerCase().includes(artistSearch))) {
            filteredData[genre] = data;
        }
    });

    // Update counts
    // document.getElementById('selectedCount').textContent = selectedGenres.length;
    document.getElementById('genreCount').textContent = Object.keys(filteredData).length;

    // Update visualization
    updateMetrics(filteredData);
    createBubbleChart(filteredData);
}
function resetFilters() {
    const checkboxes = document.querySelectorAll('.category-checkbox');
    checkboxes.forEach(cb => {
        cb.checked = DEFAULT_CATEGORIES.includes(cb.value);
    });
    document.getElementById('artistFilter').value = '';
    updateFilteredData();
}

function updateMetrics(data) {
    const totalSongs = Object.values(data).reduce((sum, d) => sum + d.songCount, 0);
    const totalArtists = Object.keys(data).length;

    document.getElementById('genreCount').textContent = Object.keys(data).length;
    document.getElementById('artistCount').textContent = totalArtists;
    document.getElementById('songCount').textContent = totalSongs.toLocaleString();
}

function createBubbleChart(data) {
    // Dimensions et marges
    const width = 1000;
    const height = 500;
    const margin = { top: 40, right: 100, bottom: 60, left: 80 };

    // Nettoyer le contenu précédent
    d3.select("#chart").selectAll("*").remove();

    // Créer le SVG
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Créer les échelles
    const xScale = d3.scaleBand()
        .domain(Object.keys(data))
        .range([0, width])
        .padding(0.4);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(Object.values(data), d => d.songCount) * 1.1])
        .range([height, 0]);

    const radiusScale = d3.scaleSqrt()
        .domain([0, d3.max(Object.values(data), d => d.albumCount)])
        .range([10, 50]);

    // Palette de couleurs personnalisée
    const colorScale = d3.scaleOrdinal()
        .domain(Object.keys(data))
        .range([
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
            '#D4A5A5', '#9B59B6', '#3498DB', '#E67E22', '#2ECC71',
            '#F1C40F'
        ]);

    // Axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // Ajouter l'axe X
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em");

    // Ajouter l'axe Y
    svg.append("g")
        .call(yAxis);

    // Labels des axes
    svg.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", -60)
        .attr("x", -height / 2)
        .attr("text-anchor", "middle")
        .text("Nombre de Chansons");

    svg.append("text")
        .attr("class", "axis-label")
        .attr("transform", `translate(${width / 2}, ${height + 50})`)
        .attr("text-anchor", "middle")
        .text("Genres Musicaux");

    // Tooltip
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Ajouter les bulles
    svg.selectAll("circle")
        .data(Object.entries(data))
        .join("circle")
        .attr("class", "bubble")
        .attr("cx", d => xScale(d[0]) + xScale.bandwidth() / 2)
        .attr("cy", d => yScale(d[1].songCount))
        .attr("r", d => radiusScale(d[1].albumCount))
        .attr("fill", d => colorScale(d[0]))
        .attr("opacity", 0.7)
        .attr("stroke", "white")
        .attr("stroke-width", 1)
        .on("mouseover", function (event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("opacity", 0.9);

            tooltip.transition()
                .duration(200)
                .style("opacity", .9);

            tooltip.html(`
                <strong>${d[1].artist}</strong><br/>
                Genre: ${d[0]}<br/>
                Nombre de chansons: ${d[1].songCount}<br/>
                Nombre d'albums: ${d[1].albumCount}<br/>
                ${d[1].details.deezerFans ?
                    `Fans Deezer: ${d[1].details.deezerFans.toLocaleString()}` : ''}
            `)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 10) + "px");
        })
        .on("mouseout", function () {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("opacity", 0.7);

            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

}

async function init() {
    try {
        fullData = await loadProcessedData();
        document.getElementById('loading').style.display = 'none';
        initializeFilters(fullData);
    } catch (error) {
        console.error('Erreur d\'initialisation:', error);
    }
}

init();