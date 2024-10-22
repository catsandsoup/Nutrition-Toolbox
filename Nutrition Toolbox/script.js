const API_KEY = 'GEtVAxRgJGgTBHCfg44DMTfo6ragjEN310Dmay4S';
const API_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    document.getElementById('food-search-form').addEventListener('submit', handleSubmit);
});

async function handleSubmit(e) {
    e.preventDefault();
    console.log('Form submitted');
    const query = document.getElementById('food-search').value;
    console.log('Search query:', query);
    const results = await searchFood(query);
    displayResults(results);
}

async function searchFood(query) {
    console.log('Searching for:', query);
    try {
        const response = await fetch(`${API_BASE_URL}/foods/search?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
        const data = await response.json();
        console.log('Search results:', data);
        return data.foods;
    } catch (error) {
        console.error('Error searching for food:', error);
        return [];
    }
}

function displayResults(foods) {
    console.log('Displaying results');
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (foods.length === 0) {
        resultsDiv.innerHTML = '<p>No results found.</p>';
        return;
    }

    const ul = document.createElement('ul');
    foods.forEach(food => {
        const li = document.createElement('li');
        li.innerHTML = `
            <h3>${food.description}</h3>
            <p>Brand: ${food.brandOwner || 'N/A'}</p>
            <p>Calories: ${food.foodNutrients.find(n => n.nutrientName === 'Energy')?.value || 'N/A'} kcal</p>
            <button onclick="showNutrients('${food.fdcId}')">View Nutrients</button>
        `;
        ul.appendChild(li);
    });
    resultsDiv.appendChild(ul);
}

async function showNutrients(fdcId) {
    console.log('showNutrients called with fdcId:', fdcId);
    try {
        const response = await fetch(`${API_BASE_URL}/food/${fdcId}?api_key=${API_KEY}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const food = await response.json();
        console.log('Fetched food data:', food);
        
        const nutrientsList = food.foodNutrients.map(nutrient => 
            `<li>${nutrient.nutrient.name}: ${nutrient.amount} ${nutrient.nutrient.unitName}</li>`
        ).join('');

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>${food.description}</h2>
                <h3>Nutrients:</h3>
                <ul>${nutrientsList}</ul>
                <button onclick="this.closest('.modal').remove()">Close</button>
            </div>
        `;
        document.body.appendChild(modal);
    } catch (error) {
        console.error('Error fetching nutrient data:', error);
        alert('Failed to fetch nutrient data. Please try again.');
    }
}