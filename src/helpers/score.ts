import { Hand, HandType } from './hand';
import { Joker } from './joker';

// chips and mults are represented as [chips, mult]
export const baseChipsAndMult = new Map<HandType, [number, number]>([
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

export const chipsAndMultArray = Array.from(baseChipsAndMult);

// returns [chips, mult]
export function getBaseChipsAndMultBasedOnLevel(handType: HandType, level: number): [number, number] {
  let [chips, mult] = baseChipsAndMult.get(handType) as [number, number];
  switch (handType) {
    case 'Flush Five':
      chips += (level - 1) * 40;
      mult += (level - 1) * 3;
      break;
    case 'Flush House':
      chips += (level - 1) * 40;
      mult += (level - 1) * 3;
      break;
    case 'Five of a Kind':
      chips += (level - 1) * 35;
      mult += (level - 1) * 3;
      break;
    case 'Royal Flush':
      chips += (level - 1) * 40;
      mult += (level - 1) * 3;
      break;
    case 'Straight Flush':
      chips += (level - 1) * 40;
      mult += (level - 1) * 3;
      break;
    case 'Four of a Kind':
      chips += (level - 1) * 30;
      mult += (level - 1) * 3;
      break;
    case 'Flush':
      chips += (level - 1) * 15;
      mult += (level - 1) * 2;
      break;
    case 'Full House':
      chips += (level - 1) * 25;
      mult += (level - 1) * 2;
      break;
    case 'Straight':
      chips += (level - 1) * 30;
      mult += (level - 1) * 2;
      break;
    case 'Three of a Kind':
      chips += (level - 1) * 20;
      mult += (level - 1) * 2;
      break;
    case 'Two Pair':
      chips += (level - 1) * 20;
      mult += level - 1;
      break;
    case 'Pair':
      chips += (level - 1) * 15;
      mult += level - 1;
      break;
    case 'High Card':
      chips += (level - 1) * 10;
      mult += level - 1;
      break;
    default:
      break;
  }

  return [chips, mult];
}

// returns [chips, mult, total]
export function getScore(
  hand: Hand,
  levels: number[],
  steelCardCount: number,
  steelRedSealCount: number,
  jokers: Joker[]
): [number, number, number] {
  const handType = hand.getHandType();
  let levelIndex = 0;
  chipsAndMultArray.forEach((v, i) => {
    if (v[0] === handType) {
      levelIndex = i;
    }
  });
  let [chips, mult] = getBaseChipsAndMultBasedOnLevel(hand.getHandType(), levels[levelIndex]);
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
          if (card.isLucky) {
            mult += 20;
          }
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

  if (steelCardCount > 0) {
    for (let i = 0; i < steelCardCount + steelRedSealCount; i++) {
      mult *= 1.5;
    }
  }

  // TODO: jokers
  jokers.forEach((joker) => {
    switch (joker.name) {
      case 'Joker':
        mult += 4;
        break;
      default:
        break;
    }
    switch (joker.edition) {
      case 'foil':
        chips += 50;
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
  });
  return [chips, mult, chips * mult];
}
