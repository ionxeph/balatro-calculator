import { PokerCard } from '../helpers/poker-card';

function Card({ card }: { card: PokerCard }) {
  return (
    <>
      <img className="m-auto" src={`./card-images/${card.getImageName()}`} />
    </>
  );
}

export default Card;
