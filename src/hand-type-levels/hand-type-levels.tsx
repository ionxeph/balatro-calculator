import { ChangeEvent } from 'react';
import { chipsAndMultArray, getBaseChipsAndMultBasedOnLevel } from '../helpers/score';

function HandTypeLevels({ levels, setLevels }: { levels: number[]; setLevels: (levels: number[]) => void }) {
  return (
    <>
      {chipsAndMultArray.map((type, i) => {
        const [chips, mult] = getBaseChipsAndMultBasedOnLevel(type[0], levels[i]);
        return (
          <div key={i} className="grid grid-cols-3 auto-cols-min w-[400px]">
            <p>{type[0]}</p>
            <p>{`${chips} * ${mult}`}</p>
            <label className="sr-only" htmlFor={`level-${i}`}>
              type[0]
            </label>
            <input
              id={`level-${i}`}
              type="number"
              value={levels[i]}
              className={`bg-black border-white border-2 rounded-md${
                i !== chipsAndMultArray.length - 1 ? ' mb-2' : ''
              }`}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const newLevels = JSON.parse(JSON.stringify(levels));
                newLevels[i] = (e.target as HTMLInputElement).value;
                setLevels(newLevels);
              }}
            />
          </div>
        );
      })}
    </>
  );
}

export default HandTypeLevels;
