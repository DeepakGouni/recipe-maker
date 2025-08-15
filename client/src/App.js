import { useState } from 'react';
import './App.css';

function App() {
  const [dietaryNeeds, setDietaryNeeds] = useState('');
  const [preferences, setPreferences] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [recipe, setRecipe] = useState('');
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
    } catch (error) {
      console.error('Error:', error);
      setRecipe('Failed to generate recipe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>AI Recipe Generator</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Dietary Needs:</label>
          <input
            type="text"
            value={dietaryNeeds}
            onChange={(e) => setDietaryNeeds(e.target.value)}
            placeholder="e.g., vegetarian, gluten-free"
          />
        </div>
        <div>
          <label>Preferences:</label>
          <input
            type="text"
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            placeholder="e.g., quick meals, spicy"
          />
        </div>
        <div>
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

      {recipe && (
        <div className="recipe-result">
          <h2>Your Custom Recipe</h2>
          <pre>{recipe}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
