import { ChangeEvent, useState } from 'react';
import { Joker } from '../helpers/joker';
import JokerSelector from '../joker-selector/joker-selector';
import { PokerCard, Suit } from '../helpers/poker-card';
import Card from '../card/card';
import CardSelector from '../card-selector/card-selector';

function Jokers({ jokers, updateJokers }: { jokers: Joker[]; updateJokers: (jokers: Joker[]) => void }) {
  const [open, setOpen] = useState(false);
  const [cardSelectorOpen, setCardSelectorOpen] = useState(false);

  return (
    <>
      <div className="overflow-x-auto">
        <div className="flex h-40 items-center [&>*]:mx-1">
          <button
            className="text-white border-solid border-2 rounded-md w-28 min-w-28 h-36"
            onClick={() => {
              setOpen(true);
            }}
          >
            Add a joker
          </button>
          {jokers.map((joker, i) => {
            const isSpecial =
              joker.specialConditionMet !== undefined ||
              joker.specialNumber !== undefined ||
              joker.name === 'Ancient Joker' ||
              joker.name === 'The Idol';
            return (
              <div
                key={i}
                className="group w-28 min-w-28 h-36 self-center flex relative"
                title={`${joker.edition.toUpperCase()} ${joker.name}`}
              >
                <img
                  className="m-auto"
                  src={`./jokers/${joker.name === 'placeholder' ? 'Joker' : joker.name}.webp`}
                  alt={joker.name}
                />
                {joker.name === 'placeholder' && (
                  <div className="absolute top-1/2 w-full text-white bg-orange-800 rounded-lg text-center">
                    placeholder
                  </div>
                )}
                {joker.specialConditionMet !== undefined && (
                  <div className="absolute top-0 left-0 w-full text-white bg-red-900 rounded-lg text-center">
                    <input
                      type="checkbox"
                      id={`'joker-active-'${i}`}
                      checked={joker.specialConditionMet}
                      onChange={() => {
                        const newJokers = JSON.parse(JSON.stringify(jokers)) as Joker[];
                        newJokers[i].specialConditionMet = !newJokers[i].specialConditionMet;
                        updateJokers(newJokers);
                      }}
                    />
                    <label htmlFor={`'joker-active-'${i}`}>active?</label>
                  </div>
                )}
                {joker.specialNumber !== undefined && (
                  <div className="absolute top-0 left-0 w-full text-white bg-red-900 rounded-lg text-center">
                    <input
                      className="w-full bg-red-900 rounded-lg text-center"
                      type="number"
                      id={`'joker-number-'${i}`}
                      value={joker.specialNumber}
                      onChange={(e: ChangeEvent) => {
                        const newJokers = JSON.parse(JSON.stringify(jokers)) as Joker[];
                        newJokers[i].specialNumber = +(e.target as HTMLInputElement).value;
                        updateJokers(newJokers);
                      }}
                    />
                    <label className="sr-only" htmlFor={`'joker-number-'${i}`}>
                      current number
                    </label>
                  </div>
                )}
                {joker.name === 'Ancient Joker' && (
                  <div className="absolute top-0 left-0 w-full text-white bg-red-900 rounded-lg text-center">
                    <select
                      className="w-full bg-red-900 rounded-lg text-center"
                      id={`'joker-suit-'${i}`}
                      value={joker.ancientJokerSuit}
                      onChange={(e: ChangeEvent) => {
                        const newJokers = JSON.parse(JSON.stringify(jokers)) as Joker[];
                        newJokers[i].ancientJokerSuit = (e.target as HTMLInputElement).value as Suit;
                        updateJokers(newJokers);
                      }}
                    >
                      <option value="spades">Spades</option>
                      <option value="hearts">Hearts</option>
                      <option value="clubs">Clubs</option>
                      <option value="diamonds">Diamonds</option>
                    </select>
                    <label className="sr-only" htmlFor={`'joker-suit-'${i}`}>
                      current suit
                    </label>
                  </div>
                )}
                {joker.name === 'The Idol' && joker.idolCardId && (
                  <div className="absolute top-0 left-0 w-full text-white bg-red-900 rounded-lg text-center overflow-hidden h-1/3  border-blue-500 border-2">
                    <button
                      className="w-full bg-red-900 rounded-lg text-center"
                      title="change card"
                      onClick={() => setCardSelectorOpen(true)}
                    >
                      <Card card={new PokerCard(joker.idolCardId, 'none', 'base', 'none')} />
                      <span className="sr-only">change card</span>
                    </button>
                    <CardSelector
                      idol={true}
                      open={cardSelectorOpen}
                      onSelect={(card: PokerCard) => {
                        const newJokers = JSON.parse(JSON.stringify(jokers)) as Joker[];
                        newJokers[i].idolCardId = card.id;
                        updateJokers(newJokers);
                        setCardSelectorOpen(false);
                      }}
                    />
                  </div>
                )}
                <button
                  className={`hidden absolute left-0 w-1/2 bg-blue-400 opacity-70${
                    i !== 0 ? ' group-hover:block' : ''
                  }${isSpecial ? ' h-1/3 top-1/3' : ' h-2/3 top-0'}`}
                  onClick={() => {
                    const newJokers = JSON.parse(JSON.stringify(jokers)) as Joker[];
                    const tempJoker = newJokers[i];
                    newJokers[i] = newJokers[i - 1];
                    newJokers[i - 1] = tempJoker;
                    updateJokers(newJokers);
                  }}
                >
                  <span>&lt;--</span>
                </button>
                <button
                  className={`hidden absolute right-0 w-1/2 bg-green-400 opacity-70${
                    i !== jokers.length - 1 ? ' group-hover:block' : ''
                  }${isSpecial ? ' h-1/3 top-1/3' : ' h-2/3 top-0'}`}
                  onClick={() => {
                    const newJokers = JSON.parse(JSON.stringify(jokers)) as Joker[];
                    const tempJoker = newJokers[i];
                    newJokers[i] = newJokers[i + 1];
                    newJokers[i + 1] = tempJoker;
                    updateJokers(newJokers);
                  }}
                >
                  <span>--&gt;</span>
                </button>
                <button
                  className="hidden absolute bottom-0 w-full h-1/3 bg-red-400 opacity-70 group-hover:block"
                  onClick={() => {
                    const newJokers = jokers.filter((_, index) => index !== i);
                    updateJokers(newJokers);
                  }}
                >
                  <span>DELETE</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <JokerSelector
        open={open}
        onSelect={(joker: Joker) => {
          setOpen(false);
          jokers.push(joker);
          updateJokers(JSON.parse(JSON.stringify(jokers)));
        }}
      />
    </>
  );
}

export default Jokers;
