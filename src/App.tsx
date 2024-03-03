import { useState } from 'react';
import { PokerCard } from './helpers/poker-card';
import { Hand } from './helpers/hand';
import { getScore } from './helpers/score';
import Card from './card/card';
import CardSelector from './card-selector/card-selector';

function App() {
  const [hand, setHand] = useState<Hand>();
  const [selectorOpen, setSelectorOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-5 h-40">
        {hand &&
          hand.cards.map((card, i) => {
            return (
              <button
                key={i}
                className="group rounded-md overflow-hidden relative text-center"
                onClick={() => {
                  const cards = hand.cards.filter((_, index) => index !== i);
                  setHand(new Hand(cards));
                }}
              >
                <Card card={card} />
                <div className="hidden absolute top-0 w-full h-full bg-red-400 opacity-70 group-hover:table">
                  <span className="table-cell align-middle">DELETE</span>
                </div>
              </button>
            );
          })}
        {(hand === undefined || hand.cards.length < 5) && (
          <button
            className="text-white border-solid border-2 rounded-md"
            onClick={() => {
              setSelectorOpen(true);
            }}
          >
            Add card
          </button>
        )}
      </div>

      <CardSelector
        open={selectorOpen}
        onSelect={(card: PokerCard) => {
          setSelectorOpen(false);
          const cards = hand ? hand.cards : [];
          cards.push(card);
          setHand(new Hand(cards));
        }}
      />

      {/* <button
        className="text-white border-white p-5 border-solid border-2 rounded-md"
        onClick={() => {
          const nbrOfCards = Math.floor(Math.random() * 5) + 1;
          // const nbrOfCards = 5;
          const cardsInHand = [];
          for (let i = 0; i < nbrOfCards; i++) {
            const card = new PokerCard(Math.floor(Math.random() * 53));
            cardsInHand.push(card);
          }
          setHand(new Hand(cardsInHand));

          setHand(
            new Hand([
              new PokerCard(6),
              new PokerCard(0),
              new PokerCard(18),
              new PokerCard(25),
              new PokerCard(30),
            ])
          );
        }}
      >
        New Random hand
      </button> */}
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
