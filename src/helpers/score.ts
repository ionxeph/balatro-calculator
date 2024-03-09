import { Hand, HandType } from './hand';
import { includesCertainJoker } from './joker';

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
  hands: number,
  discards: number
): [number, number, number] {
  const handType = hand.getHandType();
  const jokers = hand.jokers;
  let levelIndex = 0;
  chipsAndMultArray.forEach((v, i) => {
    if (v[0] === handType) {
      levelIndex = i;
    }
  });
  let [chips, mult] = getBaseChipsAndMultBasedOnLevel(hand.getHandType(), levels[levelIndex]);
  const scoringCards = includesCertainJoker(jokers, 'Splash')
    ? hand.cards.map((card) => card)
    : hand.cards.filter((card) => card.isScoring);
  let photographTriggered = false;
  scoringCards.forEach((card) => {
    let numberOfRetriggers = card.seal === 'red' ? 2 : 1;
    if (hands === 1 && includesCertainJoker(jokers, 'Dusk')) {
      numberOfRetriggers++;
    }
    const hackRetriggers = [2, 3, 4, 5];
    if (includesCertainJoker(jokers, 'Hack') && hackRetriggers.includes(card.getRank())) {
      numberOfRetriggers++;
    }

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

      jokers.forEach((joker) => {
        switch (joker.name) {
          case 'Greedy Joker':
            if (card.getSuit() === 'diamonds') {
              mult += 4;
            }
            break;
          case 'Lusty Joker':
            if (card.getSuit() === 'hearts') {
              mult += 4;
            }
            break;
          case 'Wrathful Joker':
            if (card.getSuit() === 'spades') {
              mult += 4;
            }
            break;
          case 'Gluttonous Joker':
            if (card.getSuit() === 'clubs') {
              mult += 4;
            }
            break;
          case 'Fibonacci':
            const fibonacciNumbers = [1, 2, 3, 5, 8];
            if (fibonacciNumbers.includes(card.getRank())) {
              mult += 8;
            }
            break;
          case 'Scary Face':
            if (card.isFace(includesCertainJoker(jokers, 'Pareidolia'))) {
              chips += 30;
            }
            break;
          case 'Even Steven':
            if (card.getRank() <= 10 && card.getRank() % 2 === 0) {
              mult += 4;
            }
            break;
          case 'Odd Todd':
            if (card.getRank() <= 9 && card.getRank() % 2 === 1) {
              chips += 30;
            }
            break;
          case 'Scholar':
            if (card.getRank() === 1) {
              chips += 20;
              mult += 4;
            }
            break;
          case 'Photograph':
            if (!photographTriggered && card.isFace(includesCertainJoker(jokers, 'Pareidolia'))) {
              mult *= 2;
              photographTriggered = true;
            }
            break;
          default:
            break;
        }
      });
    }
  });

  // TODO: steel kings and queens with held-in-hand jokers cannot be calculated perfectly like this
  if (steelCardCount > 0) {
    for (let i = 0; i < steelCardCount + steelRedSealCount; i++) {
      mult *= 1.5;
    }
  }

  jokers.forEach((joker) => {
    switch (joker.name) {
      case 'Shoot the Moon':
        for (let i = 0; i < joker.specialNumber!; i++) {
          mult + 13;
          if (includesCertainJoker(jokers, 'Mime')) {
            mult + 13;
          }
        }
        break;
      case 'Mime':
        for (let i = 0; i < steelCardCount; i++) {
          mult *= 1.5;
        }
        break;
      case 'Baron':
        for (let i = 0; i < joker.specialNumber!; i++) {
          mult *= 1.5;
          if (includesCertainJoker(jokers, 'Mime')) {
            mult *= 1.5;
          }
        }
        break;
      default:
        break;
    }
  });

  // TODO: jokers
  jokers.forEach((joker) => {
    switch (joker.name) {
      case 'Joker':
        mult += 4;
        break;
      case 'Jolly Joker':
        if (hand.highestRankRepeat >= 2) {
          mult += 8;
        }
        break;
      case 'Zany Joker':
        if (hand.highestRankRepeat >= 3) {
          mult += 12;
        }
        break;
      case 'Mad Joker':
        if (hand.highestRankRepeat >= 4) {
          mult += 20;
        }
        break;
      case 'Crazy Joker':
        if (hand.isStraight()) {
          mult += 12;
        }
        break;
      case 'Droll Joker':
        if (hand.isFlush()) {
          mult += 10;
        }
        break;
      case 'Sly Joker':
        if (hand.highestRankRepeat >= 2) {
          chips += 50;
        }
        break;
      case 'Wily Joker':
        if (hand.highestRankRepeat >= 3) {
          chips += 100;
        }
        break;
      case 'Clever Joker':
        if (hand.highestRankRepeat >= 4) {
          chips += 150;
        }
        break;
      case 'Devious Joker':
        if (hand.isStraight()) {
          chips += 100;
        }
        break;
      case 'Crafty Joker':
        if (hand.isFlush()) {
          chips += 80;
        }
        break;
      case 'Half Joker':
        if (hand.cards.length <= 3) {
          mult += 20;
        }
        break;
      case 'Joker Stencil':
        mult *= joker.specialNumber!;
        if (includesCertainJoker(jokers, 'Baseball Card')) {
          mult *= 1.5;
        }
        break;
      case 'Four Fingers':
        if (includesCertainJoker(jokers, 'Baseball Card')) {
          mult *= 1.5;
        }
        break;
      case 'Mime':
        if (includesCertainJoker(jokers, 'Baseball Card')) {
          mult *= 1.5;
        }
        break;
      case 'Ceremonial Dagger':
        mult += joker.specialNumber!;
        if (includesCertainJoker(jokers, 'Baseball Card')) {
          mult *= 1.5;
        }
        break;
      case 'Banner':
        chips += discards * 40;
        break;
      case 'Mystic Summit':
        if (discards === 0) {
          mult += 15;
        }
        break;
      case 'Marble Joker':
        if (includesCertainJoker(jokers, 'Baseball Card')) {
          mult *= 1.5;
        }
        break;
      case 'Loyalty Card':
        if (joker.specialConditionMet) {
          mult *= 4;
        }
        if (includesCertainJoker(jokers, 'Baseball Card')) {
          mult *= 1.5;
        }
        break;
      case 'Misprint':
        mult += joker.specialNumber!;
        break;
      case 'Dusk':
        if (includesCertainJoker(jokers, 'Baseball Card')) {
          mult *= 1.5;
        }
        break;
      case 'Raised Fist':
        mult += joker.specialNumber!;
        break;
      case 'Fibonacci':
        if (includesCertainJoker(jokers, 'Baseball Card')) {
          mult *= 1.5;
        }
        break;
      case 'Steel Joker':
        mult *= joker.specialNumber!;
        if (includesCertainJoker(jokers, 'Baseball Card')) {
          mult *= 1.5;
        }
        break;
      case 'Abstract Joker':
        mult *= 3 * jokers.length;
        break;
      case 'Hack':
        if (includesCertainJoker(jokers, 'Baseball Card')) {
          mult *= 1.5;
        }
        break;
      case 'Pareidolia':
        if (includesCertainJoker(jokers, 'Baseball Card')) {
          mult *= 1.5;
        }
        break;
      case 'Gros Michel':
        mult += 15;
        break;
      case 'Supernova':
        mult += joker.specialNumber!;
        break;
      case 'Ride the Bus':
        mult += joker.specialNumber!;
        break;
      case 'Space Joker':
        if (includesCertainJoker(jokers, 'Baseball Card')) {
          mult *= 1.5;
        }
        break;
      case 'Burglar':
        if (includesCertainJoker(jokers, 'Baseball Card')) {
          mult *= 1.5;
        }
        break;
      case 'Blackboard':
        if (joker.specialConditionMet) {
          mult *= 3;
        }
        if (includesCertainJoker(jokers, 'Baseball Card')) {
          mult *= 1.5;
        }
        break;
      case 'Runner':
        chips += joker.specialNumber!;
        break;
      case 'Ice Cream':
        chips += joker.specialNumber!;
        break;
      case 'Blue Joker':
        chips += joker.specialNumber!;
        break;
      case 'Constellation':
        mult *= joker.specialNumber!;
        if (includesCertainJoker(jokers, 'Baseball Card')) {
          mult *= 1.5;
        }
        break;
      case 'Hiker':
        chips += joker.specialNumber!;
        if (includesCertainJoker(jokers, 'Baseball Card')) {
          mult *= 1.5;
        }
        break;
      case 'Green Joker':
        mult += joker.specialNumber!;
        break;
      case 'Cavendish':
        mult *= 3;
        break;
      case 'Card Sharp':
        if (joker.specialConditionMet) {
          mult *= 3;
        }
        if (includesCertainJoker(jokers, 'Baseball Card')) {
          mult *= 1.5;
        }
        break;
      case 'Red Card':
        mult += joker.specialNumber!;
        break;
      case 'Madness':
        mult *= joker.specialNumber!;
        if (includesCertainJoker(jokers, 'Baseball Card')) {
          mult *= 1.5;
        }
        break;
      case 'Square Joker':
        chips += joker.specialNumber!;
        break;
      case 'Vampire':
        mult *= joker.specialNumber!;
        if (includesCertainJoker(jokers, 'Baseball Card')) {
          mult *= 1.5;
        }
        break;
      case 'Shortcut':
        if (includesCertainJoker(jokers, 'Baseball Card')) {
          mult *= 1.5;
        }
        break;
      case 'Hologram':
        mult *= joker.specialNumber!;
        if (includesCertainJoker(jokers, 'Baseball Card')) {
          mult *= 1.5;
        }
        break;
      case 'Vagabond':
        if (includesCertainJoker(jokers, 'Baseball Card')) {
          mult *= 1.5;
        }
        break;
      case 'Cloud 9':
        if (includesCertainJoker(jokers, 'Baseball Card')) {
          mult *= 1.5;
        }
        break;
      case 'Rocket':
        if (includesCertainJoker(jokers, 'Baseball Card')) {
          mult *= 1.5;
        }
        break;
      case 'Obelisk':
        mult *= joker.specialNumber!;
        break;
      case 'Midas Mask':
        if (includesCertainJoker(jokers, 'Baseball Card')) {
          mult *= 1.5;
        }
        break;
      case 'Luchador':
        if (includesCertainJoker(jokers, 'Baseball Card')) {
          mult *= 1.5;
        }
        break;
      case 'Gift Card':
        if (includesCertainJoker(jokers, 'Baseball Card')) {
          mult *= 1.5;
        }
        break;
      case 'Turtle Bean':
        if (includesCertainJoker(jokers, 'Baseball Card')) {
          mult *= 1.5;
        }
        break;
      case 'Erosion':
        mult += joker.specialNumber!;
        if (includesCertainJoker(jokers, 'Baseball Card')) {
          mult *= 1.5;
        }
        break;
      case 'Reserved Parking':
        if (includesCertainJoker(jokers, 'Baseball Card')) {
          mult *= 1.5;
        }
        break;
      case 'To the Moon':
        if (includesCertainJoker(jokers, 'Baseball Card')) {
          mult *= 1.5;
        }
        break;
      case 'Fortune Teller':
        mult += joker.specialNumber!;
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
