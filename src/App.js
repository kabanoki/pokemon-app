import { useEffect, useState } from 'react';
import './App.css';
import Card from './components/Card/Card';
import Navbar from './components/Navbar/Navbar';
import { getAllPokemon, getPokemon } from './utils/pokemon';

function App() {
  const initialURL = 'https://pokeapi.co/api/v2/pokemon';
  const [loading, setLoading] = useState(true);
  const [pokemonDate, setPokemonDate] = useState([]);
  const [nextURL, setNextURL] = useState('');
  const [prevURL, setPrevURL] = useState('');

  useEffect(()=>{
    const fetchPokemonData = async () => {
      let res = await getAllPokemon(initialURL);
      loadPokemon(res.results);
      setNextURL(res.next);
      setPrevURL(res.previous);
      setLoading(false);
    }
    fetchPokemonData();
  }, []);

  const loadPokemon = async (data) => {
    let _pokemonDate = await Promise.all(
      data.map((pokemon) => {
        let pokemonRecord = getPokemon(pokemon.url);
        return pokemonRecord;
      })
    );
    setPokemonDate(_pokemonDate);
  };

  const handleNextPage = async () => {
    if(!nextURL) return ;

    setLoading(true);
    let res = await getAllPokemon(nextURL);
    loadPokemon(res.results);
    setNextURL(res.next);
    setPrevURL(res.previous);
    setLoading(false);
  }
  const handlePrevPage = async () => {
    if(!prevURL) return ;

    setLoading(true);
    let res = await getAllPokemon(prevURL);
    loadPokemon(res.results);
    setNextURL(res.next);
    setPrevURL(res.previous);
    setLoading(false);
  }

  return (
    <>
      <Navbar />
      <div className="App">
        {loading ? (
          <h1>ロード中・・</h1>
        ) : (
        <>
          <div className='pokemonCardContainer'>
            {pokemonDate.map((pokemon, i)=> {
              return <Card key={i} pokemon={pokemon} />;
            })}
          </div>
          <div className='btn'>
            <button onClick={handlePrevPage}>前へ</button>
            <button onClick={handleNextPage}>次へ</button>
          </div>
        </>
        )}
      </div>
    </>
  );
}

export default App;
