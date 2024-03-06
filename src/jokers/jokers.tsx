import { Joker } from '../helpers/joker';

function Jokers({ jokers }: { jokers: Joker[] }) {
  return (
    <div className="h-40">
      <div className="flex">
        {jokers.map((joker, i) => (
          <div key={i} className="w-28 self-center">
            <img className="m-auto" src={`./jokers/${joker.name}.webp`} />
          </div>
        ))}
        JOKERS COMING SOON
      </div>
    </div>
  );
}

export default Jokers;
