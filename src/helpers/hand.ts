import { Card } from './card';

export class Hand {
  cards: Card[];
  suitsCount = {
    spades: 0,
    hearts: 0,
    clubs: 0,
    diamonds: 0,
  };
  valueCount: { [key: number]: number } = {
    0: 0, // stone
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
    11: 0,
    12: 0,
    13: 0,
  };

  constructor(cards: Card[]) {
    this.cards = cards;
    this.init();
  }

  init() {
    this.cards.forEach((card) => {
      const suit = card.getSuit();
      if (suit !== 'stone') {
        this.suitsCount[suit]++;
      }
      this.valueCount[card.getValue()]++;
    });
  }

  getSuitsCount() {
    return this.suitsCount;
  }

  getValueCount() {
    return this.valueCount;
  }
}
