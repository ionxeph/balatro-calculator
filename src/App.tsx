import { useState } from 'react';
import { PokerCard } from './helpers/poker-card';
import { Hand } from './helpers/hand';
import { chipsAndMultArray, getScore } from './helpers/score';
import Card from './card/card';
import CardSelector from './card-selector/card-selector';
import HandTypeLevels from './hand-type-levels/hand-type-levels';

function App() {
  const [hand, setHand] = useState<Hand>();
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [levels, setLevels] = useState(new Array(chipsAndMultArray.length).fill(1));

  return (
    <div className="grid auto-cols-auto grid-flow-col gap-2 text-white">
      <div className="flex flex-col justify-between">
        <HandTypeLevels levels={levels} setLevels={(levels: number[]) => setLevels(levels)} />
      </div>
      <div className="grid grid-flow-row items-center">
        <div className="text-white h-40 text-center">
          {hand && hand.cards.length > 0 && (
            <>
              <p className="text-5xl mb-3">{hand.getHandType()}</p>
              <p className="text-6xl">
                {(() => {
                  const [chips, mult, score] = getScore(hand, levels);
                  return `${chips} * ${mult} = ${score}`;
                })()}
              </p>
            </>
          )}
        </div>
        <div className="grid grid-cols-5 auto-rows-min justify-self-center content-end gap-y-10 h-full w-[600px]">
          {hand && hand.cards.length > 0 ? (
            hand.cards.map((card, i) => (
              <div className="text-white h-24" key={i}>
                <p className="text-center">
                  {`${card.enhancement.toUpperCase()}${card.enhancement !== 'none' ? ' CARD' : ''}`}
                </p>
                <p className="text-center">{card.edition.toUpperCase()}</p>
                <p className="text-center">{`${card.seal.toUpperCase()}${card.seal !== 'none' ? ' SEAL' : ''}`}</p>
              </div>
            ))
          ) : (
            <div className="h-24"></div>
          )}
          {hand &&
            hand.cards.map((card, i) => {
              return (
                <button
                  key={i}
                  className="row-start-2 group rounded-md overflow-hidden relative text-center"
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
              className="row-start-2 text-white border-solid border-2 rounded-md min-h-[174.275px]"
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
      </div>
    </div>
  );
}

export default App;
