import { useState } from 'react';
import './App.css';
import { Card } from './helpers/card';
import { Hand } from './helpers/hand';

function App() {
  const [hand, setHand] = useState<Hand>();

  return (
    <>
      <button
        onClick={() => {
          console.log('=== new hand ===');
          const nbrOfCards = Math.floor(Math.random() * 5) + 1;
          const cardsInHand = [];
          for (let i = 0; i < nbrOfCards; i++) {
            const card = new Card(Math.floor(Math.random() * 53));
            cardsInHand.push(card);
            console.log(
              `${card.getId()} = ${card.getSuit()} ${card.getRank()}`
            );
          }
          setHand(new Hand(cardsInHand));

          // setHand(
          //   new Hand([
          //     new Card(10),
          //     new Card(14),
          //     new Card(4),
          //     new Card(27),
          //     new Card(14),
          //   ])
          // );
        }}
      >
        New Random hand
      </button>
      {hand && (
        <div>
          <p>Suits</p>
          {['spades', 'hearts', 'clubs', 'diamonds'].map((suit, i) => {
            const suitsCount = hand.getSuitsCount() as any;
            return <p key={i}>{`${suit}: ${suitsCount[suit]}`}</p>;
          })}

          <p>Ranks</p>
          {Object.keys(hand.getRankCount()).map((rank, i) => {
            const count = hand.getRankCount()[+rank];
            if (count < 1) {
              return;
            }
            return <p key={i}>{`${rank}: ${hand.getRankCount()[+rank]}`}</p>;
          })}

          <p>Hand type</p>
          <p>{hand.getHandType()}</p>
        </div>
      )}
    </>
  );
}

export default App;
