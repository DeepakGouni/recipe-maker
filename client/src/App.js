import { useState } from 'react';
import './App.css';

function App() {
  const [dietaryNeeds, setDietaryNeeds] = useState('');
  const [preferences, setPreferences] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [recipe, setRecipe] = useState('');
  const [recipeImage, setRecipeImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5001/api/suggest-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dietaryNeeds, preferences, ingredients }),
        credentials: 'include'
      });

      const data = await response.json();
      setRecipe(data.recipe);
      
      // Get food image from MealDB
      const recipeTitle = data.recipe.split('\n')[0].toLowerCase();
      const foodName = recipeTitle.split(' ')[0]; // Get first word of recipe title
      setRecipeImage(`https://www.themealdb.com/images/ingredients/${foodName}.png`);
      
      // Fallback to generic food image if needed
      const img = new Image();
      img.onerror = () => setRecipeImage('https://www.themealdb.com/images/ingredients/Chicken.png');
      img.src = `https://www.themealdb.com/images/ingredients/${foodName}.png`;
    } catch (error) {
      console.error('Error:', error);
      setRecipe('Failed to generate recipe. Please try again.');
      setRecipeImage('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>AI Recipe Generator</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Dietary Needs:</label>
          <input
            type="text"
            value={dietaryNeeds}
            onChange={(e) => setDietaryNeeds(e.target.value)}
            placeholder="e.g., vegetarian, gluten-free"
          />
        </div>
        <div className="form-group">
          <label>Preferences:</label>
          <input
            type="text"
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            placeholder="e.g., quick meals, spicy"
          />
        </div>
        <div className="form-group">
          <label>Available Ingredients:</label>
          <input
            type="text"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="e.g., chicken, rice, tomatoes"
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Get Recipe'}
        </button>
      </form>

      {isLoading && <div className="loading">Creating your perfect recipe...</div>}

      {recipe && (
        <div className="recipe-container">
          <div className="recipe-card">
            {recipeImage && (
              <img 
                src={recipeImage} 
                alt="Recipe" 
                className="recipe-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://source.unsplash.com/600x400/?food';
                }}
              />
            )}
            <div className="recipe-content">
              <h2 className="recipe-title">Your Custom Recipe</h2>
              <div className="recipe-text">{recipe}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
