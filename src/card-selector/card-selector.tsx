import { ChangeEvent, useState } from 'react';
import { Enhancement, PokerCard } from '../helpers/poker-card';

const spadesAce = 1;

const heartsAce = 14;

const clubsAce = 27;

const diamondsAce = 40;

const aceIds = [spadesAce, heartsAce, clubsAce, diamondsAce];

const getCardButton = (key: number, card: PokerCard, onClick: () => void) => (
  <button className="h-10 overflow-hidden" key={key} onClick={onClick}>
    <img src={`./card-images/${card.getImageName()}`} className="max-h-none" />
  </button>
);

const createNewCard = (id: number, enhancement: Enhancement): PokerCard => {
  const card = new PokerCard(id);
  card.enhancement = enhancement;
  return card;
};

function CardSelector({
  open,
  onSelect,
}: {
  open: boolean;
  onSelect: (card: PokerCard) => void;
}) {
  const [enhancement, setEnhancement] = useState<Enhancement>('none');

  const reset = () => {
    setEnhancement('none');
  };

  return (
    <dialog
      open={open}
      className="p-10 top-0 w-full h-lvh absolute bg-slate-900"
    >
      <div>
        <div className="mb-5 grid grid-cols-8">
          <label
            htmlFor="card-enhancement"
            className="text-white mr-5 col-span-2 text-right"
          >
            Enhancement:
          </label>
          <select
            id="card-enhancement"
            name="enhancement"
            className="w-full col-span-6 bg-black text-white"
            value={enhancement}
            onChange={(e: ChangeEvent) => {
              setEnhancement(
                (e.target as HTMLOptionElement).value as Enhancement
              );
            }}
          >
            <option value="none">none</option>
            <option value="bonus">bonus</option>
            <option value="mult">mult</option>
            <option value="wild">wild</option>
            <option value="glass">glass</option>
            <option value="lucky">lucky</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-1">
        {aceIds.map((aceId) => (
          <div key={aceId} className="grid grid-rows gap-1">
            {new Array(13).fill(0).map((_, i) => {
              const card = createNewCard(aceId + i, enhancement);
              return getCardButton(i, card, () => {
                onSelect(card);
                reset();
              });
            })}
          </div>
        ))}
      </div>
    </dialog>
  );
}

export default CardSelector;
