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

// returns [formula, total]
export function getScore(hand: Hand): [string, number] {
  let [chips, mult] = baseChipsAndMult.get(hand.getHandType()) as [
    number,
    number
  ];
  const scoringCards = hand.cards.filter((card) => card.isScoring);
  const chipParticles = [chips];
  const multParticles = [mult];
  // parens are represented by [left-paren-particle, right-paren-particle]
  // let multParens = [];
  let formula = '(';
  scoringCards.forEach((card) => {
    chips += card.getChips();
    chipParticles.push(card.getChips());
  });
  chipParticles.forEach((particle, i) => {
    // if last particle
    if (i === chipParticles.length - 1) {
      formula += `${particle}) * `;
    } else {
      formula += `${particle} + `;
    }
  });
  // TODO: mult particles and parens
  formula += `${multParticles[0]}`;
  return [formula, chips * mult];
}
