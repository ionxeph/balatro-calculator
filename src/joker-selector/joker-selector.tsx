import { useRef, useEffect, ChangeEvent, FormEvent, useState } from 'react';
import { createDropdown } from '../card-selector/card-selector';
import { Edition } from '../helpers/poker-card';
import { Joker, allJokerNames } from '../helpers/joker';

function JokerSelector({ open, onSelect }: { open: boolean; onSelect: (joker: Joker) => void }) {
  const [edition, setEdition] = useState<Edition>('base');
  const [searchString, setSearchString] = useState('');

  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) {
      ref.current?.showModal();
      document.body.classList.add('overflow-hidden'); // prevent bg scroll
    } else {
      ref.current?.close();
      setEdition('base');
      document.body.classList.remove('overflow-hidden');
    }
  }, [open]);

  return (
    <dialog ref={ref} className="bg-slate-900 backdrop:bg-slate-900 text-white">
      <div className="m-10">
        <div className="mb-5 grid grid-cols-9">
          <label htmlFor="joker-search" className="text-white mr-5 col-span-2 text-right">
            Search for a joker:
          </label>
          <input
            id="joker-search"
            name="enhancement"
            className="w-full col-span-6 bg-black text-white"
            value={searchString}
            onInput={(e: FormEvent<HTMLInputElement>) => {
              setSearchString((e.target as HTMLInputElement).value);
            }}
          />
        </div>
        {createDropdown(
          'joker-edition',
          'Edition:',
          edition,
          ['base', 'foil', 'holographic', 'polychrome'],
          (e: ChangeEvent) => {
            setEdition((e.target as HTMLOptionElement).value as Edition);
          }
        )}
        <p className="mb-4">
          Not all jokers are included. Most jokers that don't affect scoring are not. Use the placeholder joker if you
          need to add an unincluded joker that has an Edition which can affect score.
        </p>
        <div className="grid grid-cols-5 gap-1 pb-10">
          {allJokerNames
            .filter((name) => name.toLowerCase().includes(searchString.toLowerCase()))
            .map((name, i) => (
              <button key={i} className="justify-self-center" title={name} onClick={() => onSelect({ name, edition })}>
                <img src={`./jokers/${name}.webp`} alt={name} />
              </button>
            ))}
        </div>
      </div>
    </dialog>
  );
}

export default JokerSelector;
