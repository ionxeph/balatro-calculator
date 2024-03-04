export type Suit = 'spades' | 'hearts' | 'clubs' | 'diamonds' | 'stone';
export class PokerCard {
  // 0 to 52
  // 0 is stone card
  // 1 is ace of spades
  // 2 is two of spades
  // etc.
  // suits order is spades -> hearts -> clubs -> diamonds
  id: number;
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
    if (rank === 0) {
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
