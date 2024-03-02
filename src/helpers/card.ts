export type Suit = 'spades' | 'hearts' | 'clubs' | 'diamonds' | 'stone';
export class Card {
  // 0 to 52
  // 0 is stone card
  // 1 is ace of spades
  // 2 is two of spades
  // etc.
  // suits order is spades -> hearts -> clubs -> diamonds
  id: number;

  constructor(id: number) {
    this.id = id;
  }

  setId(id: number) {
    this.id = id;
  }

  getId(): number {
    return this.id;
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
}
