export type Suit = 'spades' | 'hearts' | 'clubs' | 'diamonds' | 'none';
export type Enhancement = 'none' | 'bonus' | 'mult' | 'wild' | 'glass' | 'stone' | 'lucky'; // TODO: steel
export type Edition = 'base' | 'foil' | 'holographic' | 'polychrome';
export type Seal = 'none' | 'red' | 'gold'; // TODO: the other seals don't affect score, gold only has an effect with certain jokers

export class PokerCard {
  // 1 to 52
  // 1 is ace of spades
  // 2 is two of spades
  // etc.
  // suits order is spades -> hearts -> clubs -> diamonds
  id: number;
  enhancement: Enhancement = 'none';
  edition: Edition = 'base';
  seal: Seal = 'none';
  isScoring = false;
  isLucky = false; // when true and enhancement is lucky, always proc lucky card bonus

  constructor(id: number, enhancement: Enhancement, edition: Edition, seal: Seal) {
    this.id = id;
    this.enhancement = enhancement;
    this.edition = edition;
    this.seal = seal;
  }

  setId(id: number) {
    this.id = id;
  }

  // -1 represents stone
  getRank(): number {
    if (this.enhancement === 'stone') {
      return -1;
    }
    if (this.id % 13 === 0) {
      return 13;
    }
    return this.id % 13;
  }

  getSuit(): Suit {
    if (this.enhancement === 'stone') {
      return 'none';
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

  getBaseChips(): number {
    const rank = this.getRank();
    if (this.enhancement === 'stone') {
      return 50;
    } else if (rank === 1) {
      return 11;
    } else if (rank > 10) {
      return 10;
    } else {
      return rank;
    }
  }

  getImageName(): string {
    const suit = this.getSuit();
    const rank = this.getRank();
    switch (rank) {
      case -1:
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
