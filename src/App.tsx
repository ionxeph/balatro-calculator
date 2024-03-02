import { useState } from 'react';
import './App.css';
import { Card, Suit } from './helpers/card';
import { Hand } from './helpers/hand';

function App() {
  const [hand, setHand] = useState<Hand>();
  return (
    <>
      <button
        onClick={() => {
          const nbrOfCards = Math.floor(Math.random() * 5) + 1;
          const cardsInHand = [];
          for (let i = 0; i < nbrOfCards; i++) {
            const card = new Card(Math.floor(Math.random() * 53));
            cardsInHand.push(card);
            console.log(
              `${card.getId()} = ${card.getSuit()} ${card.getValue()}`
            );
          }
          setHand(new Hand(cardsInHand));
        }}
      >
        Random hand
      </button>
      {hand && (
        <div>
          <p>Suits</p>
          {['spades', 'hearts', 'clubs', 'diamonds'].map((suit, i) => {
            const suitsCount = hand.getSuitsCount() as any;
            return <p key={i}>{`${suit}: ${suitsCount[suit]}`}</p>;
          })}

          <p>Values</p>
          {Object.keys(hand.getValueCount()).map((value, i) => {
            const count = hand.getValueCount()[+value];
            if (count < 1) {
              return;
            }
            return <p key={i}>{`${value}: ${hand.getValueCount()[+value]}`}</p>;
          })}
        </div>
      )}
      {/* <p>{hand?.getValueCount()}</p> */}
      {/* <div style={{ marginTop: '100px' }}>
        {new Array(53).fill(0).map((_, i) => {
          let newCard = new Card(i);
          return (
            <p key={i}>{`${i} = ${newCard.getSuit()} ${newCard.getValue()}`}</p>
          );
        })}
      </div> */}
    </>
  );
}

export default App;
