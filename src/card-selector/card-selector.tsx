import { ChangeEvent, useState, useRef, useEffect } from 'react';
import { Edition, Enhancement, PokerCard, Seal } from '../helpers/poker-card';

const spadesAce = 1;

const heartsAce = 14;

const clubsAce = 27;

const diamondsAce = 40;

const aceIds = [spadesAce, heartsAce, clubsAce, diamondsAce];

const getCardButton = (key: number, card: PokerCard, onClick: () => void) => (
  <button className="h-10 overflow-hidden justify-self-center" key={key} onClick={onClick}>
    <img src={`./card-images/${card.getImageName()}`} className="max-h-none" />
  </button>
);

const createNewCard = (id: number, enhancement: Enhancement, edition: Edition, seal: Seal): PokerCard => {
  const card = new PokerCard(id, enhancement, edition, seal);
  return card;
};

export const createDropdown = (
  id: string,
  label: string,
  value: Enhancement | Edition | Seal,
  options: Enhancement[] | Edition[] | Seal[],
  onSelect: (e: ChangeEvent) => void,
  showLabel = true
) =>
  showLabel ? (
    <div className="mb-5 grid grid-cols-9">
      <label htmlFor={id} className="text-white mr-5 col-span-2 text-right">
        {label}
      </label>
      <select
        id={id}
        name="enhancement"
        className="w-full col-span-6 bg-black text-white"
        value={value}
        onChange={onSelect}
      >
        {options.map((v) => (
          <option value={v} key={v}>
            {v}
          </option>
        ))}
      </select>
    </div>
  ) : (
    <>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select id={id} className="w-full col-span-6 bg-black text-white" value={value} onChange={onSelect}>
        {options.map((v) => (
          <option value={v} key={v}>
            {v}
          </option>
        ))}
      </select>
    </>
  );

function CardSelector({ open, onSelect }: { open: boolean; onSelect: (card: PokerCard) => void }) {
  const [enhancement, setEnhancement] = useState<Enhancement>('none');
  const [edition, setEdition] = useState<Edition>('base');
  const [seal, setSeal] = useState<Seal>('none');

  const reset = () => {
    setEnhancement('none');
    setEdition('base');
    setSeal('none');
  };

  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) {
      ref.current?.showModal();
      document.body.classList.add('overflow-hidden'); // prevent bg scroll
    } else {
      ref.current?.close();
      reset();
      document.body.classList.remove('overflow-hidden');
    }
  }, [open]);

  return (
    <dialog ref={ref} className="bg-slate-900 backdrop:bg-slate-900">
      <div className="m-10">
        <div>
          {createDropdown(
            'card-enhancement',
            'Enhancement:',
            enhancement,
            ['none', 'bonus', 'mult', 'wild', 'glass', 'stone', 'lucky'],
            (e: ChangeEvent) => {
              setEnhancement((e.target as HTMLOptionElement).value as Enhancement);
            }
          )}
          {createDropdown(
            'card-edition',
            'Edition:',
            edition,
            ['base', 'foil', 'holographic', 'polychrome'],
            (e: ChangeEvent) => {
              setEdition((e.target as HTMLOptionElement).value as Edition);
            }
          )}
          {createDropdown('card-seal', 'Seal:', seal, ['none', 'red'], (e: ChangeEvent) => {
            setSeal((e.target as HTMLOptionElement).value as Seal);
          })}
        </div>
        <div className="grid grid-cols-4 gap-1 pb-10">
          {aceIds.map((aceId) => (
            <div key={aceId} className="grid grid-rows gap-1">
              {new Array(13).fill(0).map((_, i) => {
                const card = createNewCard(aceId + i, enhancement, edition, seal);
                return getCardButton(i, card, () => {
                  onSelect(card);
                });
              })}
            </div>
          ))}
        </div>
      </div>
    </dialog>
  );
}

export default CardSelector;
