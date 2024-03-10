import { Hand, HandType } from './hand';
import { Joker, includesCertainJoker, uncommonJokerNames } from './joker';
import { Suit } from './poker-card';

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
  const jokers: Joker[] = JSON.parse(JSON.stringify(hand.jokers));
  // blueprint and brainstorm handling
  // TODO: rules of blueprint and brainstorm at the same time gets confusing, need clarification here
  jokers.forEach((joker, i) => {
    if (joker.name === 'Blueprint' && jokers[i + 1]) {
      const blueprintEdition = joker.edition;
      jokers[i] = JSON.parse(JSON.stringify(jokers[i + 1])) as Joker;
      jokers[i].edition = blueprintEdition;
    }

    if (joker.name === 'Brainstorm' && jokers[0].name !== 'Brainstorm') {
      const brainstormEdition = joker.edition;
      jokers[i] = JSON.parse(JSON.stringify(jokers[0])) as Joker;
      jokers[i].edition = brainstormEdition;
    }
  });

  let levelIndex = 0;
  chipsAndMultArray.forEach((v, i) => {
    if (v[0] === handType) {
      levelIndex = i;
    }
  });
  let [chips, mult] = getBaseChipsAndMultBasedOnLevel(hand.getHandType(), levels[levelIndex]);
  const scoringCards = (
    includesCertainJoker(jokers, 'Splash')
      ? hand.cards.map((card) => card)
      : hand.cards.filter((card) => card.isScoring)
  ).filter((card) => !card.isDebuffed);
  let photographTriggered = false;

  const hasSmearedJoker = includesCertainJoker(jokers, 'Smeared Joker');
  const scoringSuits: Suit[] = [];
  scoringCards.forEach((card) => {
    card.getSuit(hasSmearedJoker).forEach((suit) => scoringSuits.push(suit));
  });
  scoringCards.forEach((card, i) => {
    let numberOfRetriggers = card.seal === 'red' ? 2 : 1;
    if (hands === 1 && includesCertainJoker(jokers, 'Dusk')) {
      numberOfRetriggers++;
    }
    const hackRetriggers = [2, 3, 4, 5];
    if (includesCertainJoker(jokers, 'Hack') && hackRetriggers.includes(card.getRank())) {
      numberOfRetriggers++;
    }
    if (includesCertainJoker(jokers, 'Seltzer')) {
      numberOfRetriggers++;
    }
    if (includesCertainJoker(jokers, 'Sock and Buskin') && card.isFace(includesCertainJoker(jokers, 'Pareidolia'))) {
      numberOfRetriggers++;
    }
    if (includesCertainJoker(jokers, 'Hanging Chad') && i === 0) {
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
            if (card.getSuit(hasSmearedJoker).includes('diamonds')) {
              mult += 4;
            }
            break;
          case 'Lusty Joker':
            if (card.getSuit(hasSmearedJoker).includes('hearts')) {
              mult += 4;
            }
            break;
          case 'Wrathful Joker':
            if (card.getSuit(hasSmearedJoker).includes('spades')) {
              mult += 4;
            }
            break;
          case 'Gluttonous Joker':
            if (card.getSuit(hasSmearedJoker).includes('clubs')) {
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
          case 'Ancient Joker':
            if (card.getSuit(hasSmearedJoker).includes(joker.ancientJokerSuit!)) {
              mult *= 1.5;
            }
            break;
          case 'Walkie Talkie':
            if (card.getRank() === 10 || card.getRank() === 4) {
              chips += 10;
              mult += 4;
            }
            break;
          case 'Smiley Face':
            if (card.isFace(includesCertainJoker(jokers, 'Pareidolia'))) {
              mult += 4;
            }
            break;
          case 'Bloodstone':
            if (joker.specialConditionMet && card.getSuit(hasSmearedJoker).includes('hearts')) {
              mult *= 2;
            }
            break;
          case 'Arrowhead':
            if (card.getSuit(hasSmearedJoker).includes('spades')) {
              chips += 50;
            }
            break;
          case 'Onyx Agate':
            if (card.getSuit(hasSmearedJoker).includes('clubs')) {
              mult += 8;
            }
            break;
          case 'The Idol':
            if (card.enhancement !== 'stone' && card.id === joker.idolCardId) {
              mult *= 2;
            }
            break;
          case 'Triboulet':
            if (card.getRank() === 12 || card.getRank() === 13) {
              mult *= 2;
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
      case 'Raised Fist':
        mult += joker.specialNumber!;
        if (includesCertainJoker(jokers, 'Mime')) {
          mult += joker.specialNumber!;
        }
        break;
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
        break;
      case 'Ceremonial Dagger':
        mult += joker.specialNumber!;
        break;
      case 'Banner':
        chips += discards * 40;
        break;
      case 'Mystic Summit':
        if (discards === 0) {
          mult += 15;
        }
        break;
      case 'Loyalty Card':
        if (joker.specialConditionMet) {
          mult *= 4;
        }
        break;
      case 'Misprint':
        mult += joker.specialNumber!;
        break;
      case 'Steel Joker':
        mult *= joker.specialNumber!;
        break;
      case 'Abstract Joker':
        mult += 3 * jokers.length;
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
      case 'Blackboard':
        if (joker.specialConditionMet) {
          mult *= 3;
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
        break;
      case 'Hiker':
        chips += joker.specialNumber!;
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
        break;
      case 'Red Card':
        mult += joker.specialNumber!;
        break;
      case 'Madness':
        mult *= joker.specialNumber!;
        break;
      case 'Square Joker':
        chips += joker.specialNumber!;
        break;
      case 'Vampire':
        mult *= joker.specialNumber!;
        break;
      case 'Hologram':
        mult *= joker.specialNumber!;
        break;
      case 'Obelisk':
        mult *= joker.specialNumber!;
        break;
      case 'Erosion':
        mult += joker.specialNumber!;
        break;
      case 'Fortune Teller':
        mult += joker.specialNumber!;
        break;
      case 'Stone Joker':
        chips += 25 * joker.specialNumber!;
        break;
      case 'Lucky Cat':
        mult *= joker.specialNumber!;
        break;
      case 'Bull':
        chips += joker.specialNumber!;
        break;
      case 'Flash Card':
        mult += joker.specialNumber!;
        break;
      case 'Popcorn':
        mult += joker.specialNumber!;
        break;
      case 'Spare Trousers':
        mult += joker.specialNumber!;
        break;
      case 'Ramen':
        mult *= joker.specialNumber!;
        break;
      case 'Castle':
        chips += joker.specialNumber!;
        break;
      case 'Campfire':
        mult *= joker.specialNumber!;
        break;
      case 'Acrobat':
        if (hands === 1) {
          mult *= 3;
        }
        break;
      case 'Swashbuckler':
        mult += joker.specialNumber!;
        break;
      case 'Throwback':
        mult *= joker.specialNumber!;
        break;
      case 'Glass Joker':
        mult *= joker.specialNumber!;
        break;
      case 'Flower Pot':
        if (
          scoringSuits.includes('spades') &&
          scoringSuits.includes('hearts') &&
          scoringSuits.includes('clubs') &&
          scoringSuits.includes('diamonds')
        ) {
          mult *= 3;
        }
        break;
      case 'Wee Joker':
        chips += joker.specialNumber!;
        break;
      case 'Seeing Double':
        if (
          scoringSuits.includes('clubs') &&
          (scoringSuits.includes('spades') || scoringSuits.includes('hearts') || scoringSuits.includes('diamonds'))
        ) {
          mult *= 2;
        }
        break;
      case 'Hit the Road':
        mult *= joker.specialNumber!;
        break;
      case 'The Duo':
        if (hand.highestRankRepeat >= 2) {
          mult *= 2;
        }
        break;
      case 'The Trio':
        if (hand.highestRankRepeat >= 3) {
          mult *= 3;
        }
        break;
      case 'The Family':
        if (hand.highestRankRepeat >= 4) {
          mult *= 4;
        }
        break;
      case 'The Order':
        if (hand.isStraight()) {
          mult *= 3;
        }
        break;
      case 'The Tribe':
        if (hand.isFlush()) {
          mult *= 2;
        }
        break;
      case 'Stuntman':
        chips += 300;
        break;
      case "Driver's License":
        if (joker.specialConditionMet) {
          mult *= 3;
        }
        break;
      case 'Bootstraps':
        mult += joker.specialNumber!;
        break;
      case 'Canio':
        mult *= joker.specialNumber!;
        break;
      case 'Yorick':
        if (joker.specialConditionMet) {
          mult *= 5;
        }
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
    // Baseball Card handling
    if (includesCertainJoker(jokers, 'Baseball Card') && uncommonJokerNames.includes(joker.name)) {
      mult *= 1.5;
    }
  });
  return [chips, mult, chips * mult];
}
