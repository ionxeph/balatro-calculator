import { Card as CardClass } from '../helpers/card';

function getImageName(card: CardClass): string {
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

function Card({ card }: { card: CardClass }) {
  return (
    <>
      <img height="128" src={`./card-images/${getImageName(card)}`} />
    </>
  );
}

export default Card;
