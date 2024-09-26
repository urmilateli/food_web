
document.getElementById('closeOverlay').addEventListener('click', () => {
    document.getElementById('mealDetailOverlay').style.display = 'none';
});

function fetchMeals() {
    fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=')
        .then(response => response.json())
        .then(data => {
            displayMeals(data.meals);
        });
}

function displayMeals(meals) {
    const mealsContainer = document.getElementById('mealsContainer');
    mealsContainer.innerHTML = ''; 

    const limitedMeals = meals.slice(0, 14);

    limitedMeals.forEach(meal => {
        const mealCard = document.createElement('div');
        mealCard.className = 'meal-card';
        mealCard.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h4>${meal.strMeal}</h4>
            <p>Price: ₹${getRandomPrice()}</p>
            <button style="color: white; padding:9px; background-color:rgb(103, 81, 81) ; border-radius:3px; border:none; font-size:20px" onclick="showMealDetail(${meal.idMeal})">View Details</button>
        `;
        mealsContainer.appendChild(mealCard);
    });
}

function getRandomPrice() {
    return Math.floor(Math.random() * (500 - 100 + 1)) + 100; 
}

function showMealDetail(id) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then(response => response.json())
        .then(data => {
            const meal = data.meals[0];
            const mealDetail = document.getElementById('mealDetail');
            mealDetail.innerHTML = `
                <h2>${meal.strMeal}</h2>
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" style="width: 100%">
                <p>${meal.strInstructions}</p>
                <h3>Ingredients:</h3>
                <ul>${getIngredients(meal)}</ul>
            `;
            document.getElementById('mealDetailOverlay').style.display = 'flex';
        });
}

function getIngredients(meal) {
    let ingredientsList = '';
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient) {
            ingredientsList += `<li>${ingredient} - ${measure}</li>`;
        }
    }
    return ingredientsList || '<li>No ingredients available.</li>';
}

function searchMeal() {
    const query = document.getElementById('search').value;
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
        .then(response => response.json())
        .then(data => {
            displayMeals(data.meals);
        });
}

function filterByCost(costType) {
    fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=')
        .then(response => response.json())
        .then(data => {
            let meals = data.meals;

            if (costType === 'low') {
                meals = meals.filter(() => getRandomPrice() < 300);
            } else if (costType === 'high') {
                meals = meals.filter(() => getRandomPrice() >= 300);
            }

            displayMeals(meals);
        });
}

fetchMeals();
