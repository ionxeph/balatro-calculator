import { ChangeEvent, useState } from 'react';
import { Edition, Enhancement, PokerCard, Seal } from './helpers/poker-card';
import { Hand } from './helpers/hand';
import { chipsAndMultArray, getScore } from './helpers/score';
import Card from './card/card';
import CardSelector, { createDropdown } from './card-selector/card-selector';
import HandTypeLevels from './hand-type-levels/hand-type-levels';
import Jokers from './jokers/jokers';
import { Joker } from './helpers/joker';

function App() {
  const [hand, setHand] = useState<Hand>();
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [levels, setLevels] = useState(new Array(chipsAndMultArray.length).fill(1));
  const [hands, setHands] = useState(1);
  const [discards, setDiscards] = useState(0);
  const [steelCardCount, setSteelCardCount] = useState(0);
  const [steelRedSealCount, setSteelRedSealCount] = useState(0);
  const [jokers, setJokers] = useState<Joker[]>([]);

  return (
    <>
      <div className="grid gap-6 grid-cols-8 text-white">
        <div className="col-span-5">
          <Jokers
            jokers={jokers}
            updateJokers={(jokers: Joker[]) => {
              setJokers(jokers);
            }}
          />
        </div>
        <div className="col-span-1 text-left">
          <label className="block" htmlFor="hands">
            Hands:
          </label>
          <input
            id="hands"
            type="number"
            className="bg-black border-white border-2 rounded-md w-full"
            value={hands}
            onChange={(e: ChangeEvent) => {
              setHands(+(e.target as HTMLInputElement).value);
            }}
          />
          <label className="block mt-3" htmlFor="discards">
            Discards:
          </label>
          <input
            id="discards"
            type="number"
            className="bg-black border-white border-2 rounded w-full"
            value={discards}
            onChange={(e: ChangeEvent) => {
              setDiscards(+(e.target as HTMLInputElement).value);
            }}
          />
        </div>
        <div className="col-span-1 text-left">
          <label className="block" htmlFor="steel-card-count" title="how many steel cards in hand?">
            Steel cards:
          </label>
          <input
            id="steel-card-count"
            type="number"
            className="bg-black border-white border-2 rounded-md w-full"
            title="how many steel cards in hand?"
            value={steelCardCount}
            onChange={(e: ChangeEvent) => {
              setSteelCardCount(+(e.target as HTMLInputElement).value);
            }}
          />
          <label className="block mt-3" htmlFor="steel-red-seal-count" title="how many steel cards have red seals?">
            Red seals:
          </label>
          <input
            id="steel-red-seal-count"
            type="number"
            title="how many steel cards have red seals?"
            className="bg-black border-white border-2 rounded w-full"
            value={steelRedSealCount}
            onChange={(e: ChangeEvent) => {
              setSteelRedSealCount(+(e.target as HTMLInputElement).value);
            }}
          />
        </div>
      </div>
      <div className="grid auto-cols-auto grid-flow-col gap-2 text-white">
        <div className="flex flex-col justify-between">
          <HandTypeLevels levels={levels} setLevels={(levels: number[]) => setLevels(levels)} />
        </div>
        <div className="grid grid-flow-row items-center">
          <div className="text-white h-40 text-center border-2 border-orange-700">
            {hand && hand.cards.length > 0 && (
              <>
                <p className="text-2xl mb-3">{hand.getHandType()}</p>
                <p className="text-4xl">
                  {(() => {
                    const [chips, mult, score] = getScore(
                      hand,
                      levels,
                      steelCardCount,
                      steelRedSealCount,
                      jokers,
                      hands,
                      discards
                    );
                    return `${Math.round(chips)} * ${Math.round(mult)} = ${Math.round(score)}`;
                  })()}
                </p>
              </>
            )}
          </div>
          <div className="grid grid-cols-5 auto-rows-min justify-self-center content-end gap-y-10 h-full w-[600px]">
            {hand && hand.cards.length > 0 ? (
              hand.cards.map((card, i) => (
                <div className="text-white h-24" key={i}>
                  <div className="mb-1">
                    {createDropdown(
                      `card-enhancement-${i}`,
                      `card ${i} enhancement`,
                      card.enhancement,
                      ['none', 'bonus', 'mult', 'wild', 'glass', 'stone', 'lucky'],
                      (e: ChangeEvent) => {
                        hand.cards[i].enhancement = (e.target as HTMLSelectElement).value as Enhancement;
                        setHand(new Hand(hand.cards));
                      },
                      false
                    )}
                  </div>
                  <div className="mb-1">
                    {createDropdown(
                      `card-edition-${i}`,
                      `card ${i} edition`,
                      card.edition,
                      ['base', 'foil', 'holographic', 'polychrome'],
                      (e: ChangeEvent) => {
                        hand.cards[i].edition = (e.target as HTMLSelectElement).value as Edition;
                        setHand(new Hand(hand.cards));
                      },
                      false
                    )}
                  </div>
                  <div className="mb-1">
                    {createDropdown(
                      `card-seal-${i}`,
                      `card ${i} seal`,
                      card.seal,
                      ['none', 'red'],
                      (e: ChangeEvent) => {
                        hand.cards[i].seal = (e.target as HTMLSelectElement).value as Seal;
                        setHand(new Hand(hand.cards));
                      },
                      false
                    )}
                  </div>
                  {card.enhancement === 'lucky' && (
                    <div className="flex justify-center mt-3">
                      <input
                        id={`is-lucky-${i}`}
                        type="checkbox"
                        checked={card.isLucky}
                        onChange={() => {
                          card.isLucky = !card.isLucky;
                          setHand(new Hand(hand.cards));
                        }}
                      />
                      <label className="ml-1" htmlFor={`is-lucky-${i}`}>
                        actually lucky
                      </label>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="h-24"></div>
            )}
            {hand &&
              hand.cards.map((card, i) => {
                return (
                  <div key={i} className="row-start-2 group rounded-md overflow-hidden relative text-center">
                    <Card card={card} />
                    <button
                      className={`hidden absolute top-0 left-0 w-1/2 h-2/3 bg-blue-400 opacity-70${
                        i !== 0 ? ' group-hover:block' : ''
                      }`}
                      onClick={() => {
                        const tempCard = hand.cards[i];
                        hand.cards[i] = hand.cards[i - 1];
                        hand.cards[i - 1] = tempCard;
                        setHand(new Hand(hand.cards));
                      }}
                    >
                      <span>&lt;--</span>
                    </button>
                    <button
                      className={`hidden absolute top-0 right-0 w-1/2 h-2/3 bg-green-400 opacity-70${
                        i !== hand.cards.length - 1 ? ' group-hover:block' : ''
                      }`}
                      onClick={() => {
                        const tempCard = hand.cards[i];
                        hand.cards[i] = hand.cards[i + 1];
                        hand.cards[i + 1] = tempCard;
                        setHand(new Hand(hand.cards));
                      }}
                    >
                      <span>--&gt;</span>
                    </button>
                    <button
                      className="hidden absolute bottom-0 w-full h-1/3 bg-red-400 opacity-70 group-hover:block"
                      onClick={() => {
                        const cards = hand.cards.filter((_, index) => index !== i);
                        setHand(new Hand(cards));
                      }}
                    >
                      <span>DELETE</span>
                    </button>
                  </div>
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
    </>
  );
}

export default App;
