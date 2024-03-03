import { PokerCard } from '../helpers/poker-card';

function getImageName(card: PokerCard): string {
  const suit = card.getSuit();
  const rank = card.getRank();
  switch (rank) {
    case 0:
      return 'stone.webp';
    case 1:
      return `ace_of_${suit}.svg`;
    case 11:
      return `jack_of_${suit}.svg`;
    case 12:
      return `queen_of_${suit}.svg`;
    case 13:
      return `king_of_${suit}.svg`;
    default:
      return `${rank}_of_${suit}.svg`;
  }
}

function Card({ card }: { card: PokerCard }) {
  return (
    <>
      <img src={`./card-images/${getImageName(card)}`} />
    </>
  );
}

export default Card;
