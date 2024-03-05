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
    <div>
      <div className="text-white h-40 mb-10 text-center">
        {hand && (
          <>
            <p className="text-5xl mb-3">{hand.getHandType()}</p>
            <p className="text-6xl">{`${getScore(hand)[0]} = ${
              getScore(hand)[1]
            }`}</p>
          </>
        )}
      </div>
      <div className="grid grid-cols-5 grid-rows-2 gap-y-10 h-96">
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
        {hand &&
          hand.cards.map((card, i) => (
            <div className="row-start-2 text-white">
              <p key={i} className="text-center">
                {`${card.enhancement.toUpperCase()}${
                  card.enhancement !== 'none' ? ' CARD' : ''
                }`}
              </p>
              <p key={i} className="text-center">
                {card.edition.toUpperCase()}
              </p>
              <p key={i} className="text-center">
                {`${card.seal.toUpperCase()}${
                  card.seal !== 'none' ? ' SEAL' : ''
                }`}
              </p>
            </div>
          ))}
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
    </div>
  );
}

export default App;
