export type Suit = 'spades' | 'hearts' | 'clubs' | 'diamonds' | 'stone';
export type Enhancement =
  | 'none'
  | 'bonus'
  | 'mult'
  | 'wild'
  | 'glass'
  | 'lucky'; // TODO: steel
export type Edition = 'base' | 'foil' | 'holographic' | 'polychrome';
export type Seal = 'none' | 'red' | 'gold'; // the other seals don't affect score, gold only has an effect with certain jokers

export class PokerCard {
  // 0 to 52
  // 0 is stone card
  // 1 is ace of spades
  // 2 is two of spades
  // etc.
  // suits order is spades -> hearts -> clubs -> diamonds
  id: number;
  enhancement: Enhancement = 'none';
  edition: Edition = 'base';
  seal: Seal = 'none';
  isScoring = false;

  constructor(id: number) {
    this.id = id;
  }

  setId(id: number) {
    this.id = id;
  }

  getRank(): number {
    if (this.id !== 0 && this.id % 13 === 0) {
      return 13;
    }
    return this.id % 13;
  }

  getSuit(): Suit {
    if (this.id === 0) {
      return 'stone';
    }
    const suitNbr = this.id / 13;
    if (suitNbr <= 1) {
      return 'spades';
    }
    if (suitNbr <= 2) {
      return 'hearts';
    }
    if (suitNbr <= 3) {
      return 'clubs';
    }
    return 'diamonds';
  }

  getChips(): number {
    const rank = this.getRank();
    let totalChips: number;
    if (rank === 0) {
      totalChips = 50;
    } else if (rank === 1) {
      totalChips = 11;
    } else if (rank > 10) {
      totalChips = 10;
    } else {
      totalChips = rank;
    }
    if (this.enhancement === 'bonus') {
      totalChips += 30;
    }
    if (this.seal === 'red') {
      totalChips *= 2;
    }
    return totalChips;
  }

  getImageName(): string {
    const suit = this.getSuit();
    const rank = this.getRank();
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
}
