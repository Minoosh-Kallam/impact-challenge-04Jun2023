import logo from './logo.svg';
import './App.css';
import RecipeTable from './tables/RecipeTable';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <RecipeTable url='https://s3-ap-southeast-1.amazonaws.com/he-public-data/reciped9d7b8c.json' />
      </header>
    </div>
  );
}

export default App;
