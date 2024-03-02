import './App.css';
import { Card } from './helpers/card';

function App() {
  return (
    <>
      {new Array(53).fill(0).map((_, i) => {
        let newCard = new Card(i);
        return <p>{`${i} = ${newCard.getSuit()} ${newCard.getValue()}`}</p>;
      })}
    </>
  );
}

export default App;
