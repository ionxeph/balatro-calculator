import { useState } from 'react';
import './App.css';
import { Card as CardClass } from './helpers/card';
import { Hand } from './helpers/hand';
import { getScore } from './helpers/score';
import Card from './card/card';

function App() {
  const [hand, setHand] = useState<Hand>();

  return (
    <>
      <button
        onClick={() => {
          console.log('=== new hand ===');
          const nbrOfCards = Math.floor(Math.random() * 5) + 1;
          // const nbrOfCards = 5;
          const cardsInHand = [];
          for (let i = 0; i < nbrOfCards; i++) {
            const card = new CardClass(Math.floor(Math.random() * 53));
            cardsInHand.push(card);
          }
          setHand(new Hand(cardsInHand));

          // setHand(
          //   new Hand([
          //     new Card(6),
          //     new Card(37),
          //     new Card(18),
          //     new Card(25),
          //     new Card(30),
          //   ])
          // );
        }}
      >
        New Random hand
      </button>
      {hand && (
        <div>
          <p>Cards</p>
          {hand.cards.map((card, i) => {
            return <Card key={i} card={card} />;
          })}

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

          <p>Hand score</p>
          <p>{`${getScore(hand)[0]} * ${getScore(hand)[1]} = ${
            getScore(hand)[2]
          }`}</p>
        </div>
      )}
    </>
  );
}

export default App;
