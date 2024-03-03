import { PokerCard } from '../helpers/poker-card';

const spadesAce = 1;

const heartsAce = 14;

const clubsAce = 27;

const diamondsAce = 40;

const getCardButton = (key: number, card: PokerCard, onClick: () => void) => (
  <button className="h-10 overflow-hidden" key={key} onClick={onClick}>
    <img src={`./card-images/${card.getImageName()}`} className="max-h-none" />
  </button>
);

function CardSelector({
  open,
  onSelect,
}: {
  open: boolean;
  onSelect: (card: PokerCard) => void;
}) {
  return (
    <dialog
      open={open}
      className="p-10 top-0 w-full h-lvh absolute bg-slate-900"
    >
      <div className="grid grid-cols-4 gap-1">
        <div className="grid grid-rows gap-1">
          {new Array(13).fill(0).map((_, i) => {
            const card = new PokerCard(spadesAce + i);
            return getCardButton(i, card, () => {
              onSelect(card);
            });
          })}
        </div>
        <div className="grid grid-rows gap-1">
          {new Array(13).fill(0).map((_, i) => {
            const card = new PokerCard(heartsAce + i);
            return getCardButton(i, card, () => {
              onSelect(card);
            });
          })}
        </div>
        <div className="grid grid-rows gap-1">
          {new Array(13).fill(0).map((_, i) => {
            const card = new PokerCard(clubsAce + i);
            return getCardButton(i, card, () => {
              onSelect(card);
            });
          })}
        </div>
        <div className="grid grid-rows gap-1">
          {new Array(13).fill(0).map((_, i) => {
            const card = new PokerCard(diamondsAce + i);
            return getCardButton(i, card, () => {
              onSelect(card);
            });
          })}
        </div>
        {/* {new Array(53).fill(0).map((_, i) => {
          const card = new PokerCard(i);
          return <img key={i} src={`./card-images/${card.getImageName()}`} />;
        })} */}
      </div>
    </dialog>
  );
}

export default CardSelector;
