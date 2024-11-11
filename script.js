// Finds search bar element and search button element.
const searchBarElement = document.querySelector('.js-meal-name-input');
const searchBtnElement = document.querySelector('.js-search-btn');

// importing order list and other neseccary functions from orderList.js.
import { orderList, addToOrderList } from './orderList.js';

// Loads default dishes for first time visiting the webpage.
fetchData("");

// Adding event listener to search button.
searchBtnElement.addEventListener('click',()=>
{
    const searchValue = searchBarElement.value.trim();
    
    if (searchValue === "") {
        fetchData(""); // Load default items when search is cleared
    } else {
        fetchData(searchValue); // Load search results
    }
})

// Fetches data from server.
function fetchData(searchValue) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchValue}`)
        .then(response => response.json())  // Parse the JSON from the response
        .then(data => {
            displayMeals(data);
        });
}

// Function to fetch meal data by meal ID
async function findMealObject(mealId) 
{
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    const data = await response.json();
    return data.meals ? data.meals[0] : null; // Return the meal object or null if not found
}

// Updates the cart quantity
function updateOrderListQuantity()
{
    let count = 0;
    orderList.forEach((order) =>
    {
        count += order.quantity;
    })

    document.querySelector('.order-count').innerText = count;
}

// Displays in order section.
function displayInOrderSection()
{
    let orderHTML = '';

    orderList.forEach((orderItem, index) =>
    {
        orderHTML += `
            <div class="ordered-meal-card">
				<h5>${index+1}. ${orderItem.mealName} X ${orderItem.quantity}</h5>
				<button class="order-recipe-btn js-recipe-btn" data-meal-id="${orderItem.mealId}">Recipe</button>
			</div>
        `;
    })

    document.querySelector('.total-orders').innerHTML = orderHTML;
    addEventsToRecipeButtons();
}

// Adding event listener to every order button.
function addEventsToOrderButtons()
{
    document.querySelectorAll('.js-order-btn')
    .forEach((orderButton)=>
    {
        orderButton.addEventListener('click',()=>
        {
            const mealName = orderButton.dataset.mealName;
            const mealId = orderButton.dataset.mealId;
            addToOrderList(mealName,mealId);
            updateOrderListQuantity();
            displayInOrderSection();
        })
    })
}

// Fetch meals, add event listeners, and handle modal display
function addEventsToRecipeButtons() {
    document.querySelectorAll('.js-recipe-btn')
        .forEach((recipeButton) => {
            recipeButton.addEventListener('click', async () => {
                // Disable button to prevent multiple clicks
                recipeButton.disabled = true;

                const mealObject = await findMealObject(recipeButton.dataset.mealId);

                // Re-enable the button after the request completes
                recipeButton.disabled = false;

                // Create and show modal
                if (mealObject) {
                    createAndShowModal(mealObject);
                }
            });
        });
}

// Creates and shows modals of clicked recipe.
function createAndShowModal(mealObject) {
    const modalHTML = `
        <div class="modal fade" id="mealModal" tabindex="-1" aria-labelledby="mealModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="mealModalLabel">${mealObject.strMeal}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>${mealObject.strInstructions}</p>
                        <img src="${mealObject.strMealThumb}" alt="${mealObject.strMeal}" class="img-fluid">
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('mealModal'));
    modal.show();

    document.getElementById('mealModal').addEventListener('hidden.bs.modal', function () {
        document.getElementById('mealModal').remove();
    });
}

// Generates the HTML for every meal product. 
function displayMeals(data) 
{
    
    // Stores the HTML. Using Accumulator pattern.
    let mealHTML = '';

    if (!data.meals) // No products found on search.
    { 
        mealHTML = `<p class="no-result-message">Sorry! No result found.</p>`;
    }
    else
    {
        data.meals.forEach((mealItem) => {
            mealHTML += `
                <div class="mealCard">
                    <img class="img-fluid rounded" src="${mealItem.strMealThumb}" alt="${mealItem.strMeal}">
                    <p class="item-name">${mealItem.strMeal}</p>

                    <div class="recipe-order-btn-section">
                        <button class="recipe-btn js-recipe-btn" data-meal-id="${mealItem.idMeal}">
                            Recipe
                        </button>
                        <button class="order-btn js-order-btn" data-meal-name="${mealItem.strMeal}" data-meal-id="${mealItem.idMeal}">
                            Order
                        </button>
                    </div>
                </div>
            `;
        });
    }

    document.querySelector('.js-meal-cards-section').innerHTML = mealHTML;
    addEventsToOrderButtons();
    addEventsToRecipeButtons();
}


