import { Hand, HandType } from './hand';

// chips and mults are represented as [chips, mult]
const baseChipsAndMult = new Map<HandType, [number, number]>([
  ['Flush Five', [200, 16]],
  ['Flush House', [140, 14]],
  ['Five of a Kind', [120, 12]],
  ['Royal Flush', [100, 8]],
  ['Straight Flush', [100, 8]],
  ['Four of a Kind', [60, 7]],
  ['Flush', [35, 4]],
  ['Full House', [35, 4]],
  ['Straight', [30, 4]],
  ['Three of a Kind', [30, 3]],
  ['Two Pair', [20, 2]],
  ['Pair', [10, 2]],
  ['High Card', [5, 1]],
]);

// returns [chips, mult, total]
export function getScore(hand: Hand): [number, number, number] {
  let [chips, mult] = baseChipsAndMult.get(hand.getHandType()) as [number, number];
  const scoringCards = hand.cards.filter((card) => card.isScoring);
  scoringCards.forEach((card) => {
    const numberOfRetriggers = card.seal === 'red' ? 2 : 1;
    for (let i = 0; i < numberOfRetriggers; i++) {
      let totalChips = card.getBaseChips();
      switch (card.enhancement) {
        case 'bonus':
          totalChips += 30;
          break;
        case 'mult':
          mult += 4;
          break;
        case 'glass':
          mult *= 2;
          break;
        case 'lucky':
          // TODO: lucky handling
          break;
        default:
          break;
      }
      switch (card.edition) {
        case 'foil':
          totalChips += 50;
          break;
        case 'holographic':
          mult += 10;
          break;
        case 'polychrome':
          mult *= 1.5;
          break;
        default:
          break;
      }
      chips += totalChips;
    }
  });
  return [chips, mult, chips * mult];
}
