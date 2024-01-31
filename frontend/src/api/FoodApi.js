export async function fetchFoodByString(params) {
    try {
        const fetchedFood = await fetch(`http://localhost:5000/search/query?str=${params}`)
        const fetchedFoodjson=await fetchedFood.json();
        return fetchedFoodjson;
    } catch (error) {
        return [];
    }
}
export async function fetchFoodAutocompleteByString(params) {
    try {
        const fetchedFood = await fetch(`http://localhost:5000/autocomplete/query?str=${params}`)
        const fetchedFoodjson=await fetchedFood.json();
        return fetchedFoodjson;
    } catch (error) {
        return [];
    }
}