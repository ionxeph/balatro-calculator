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
  let [chips, mult] = baseChipsAndMult.get(hand.getHandType()) as [
    number,
    number
  ];
  const scoringCards = hand.cards.filter((card) => card.isScoring);
  scoringCards.forEach((card) => {
    let totalChips = card.getBaseChips();

    if (card.enhancement === 'bonus') {
      totalChips += 30;
    }
    if (card.edition === 'foil') {
      totalChips += 50;
    }
    if (card.seal === 'red') {
      totalChips *= 2;
    }
    chips += totalChips;
  });
  return [chips, mult, chips * mult];
}
