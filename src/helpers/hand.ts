import { Joker, includesCertainJoker } from './joker';
import { PokerCard } from './poker-card';

export type HandType =
  | 'Flush Five'
  | 'Flush House'
  | 'Five of a Kind'
  | 'Royal Flush'
  | 'Straight Flush'
  | 'Four of a Kind'
  | 'Flush'
  | 'Full House'
  | 'Straight'
  | 'Three of a Kind'
  | 'Two Pair'
  | 'Pair'
  | 'High Card';

export class Hand {
  cards: PokerCard[];
  ranks: number[] = [];
  suitsCount: { [key: string]: number } = {
    spades: 0,
    hearts: 0,
    clubs: 0,
    diamonds: 0,
    none: 0,
  };
  rankCount: { [key: number | string]: number } = {
    '-1': 0, // stone
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
  highestRankRepeat = 0;
  handType: HandType = 'High Card';
  jokers: Joker[];

  constructor(cards: PokerCard[], jokers: Joker[]) {
    this.cards = cards;
    this.jokers = jokers;
    this.init();
  }

  setHand(cards: PokerCard[]) {
    this.cards = cards;
    this.init();
  }

  init() {
    this.cards.forEach((card) => {
      const suit = card.getSuit();
      this.suitsCount[suit]++;
      this.rankCount[card.getRank()]++;
    });
    this.ranks = this.cards.map((card) => card.getRank());
    this.highestRankRepeat = this.getHighestRankRepeat();
    if (this.cards.length > 0) {
      this.handType = this.calculateHandType();
      this.setScoringCards();
    }
  }

  setScoringCards() {
    this.cards.forEach((card) => {
      card.isScoring = false;
      if (card.enhancement === 'stone') {
        card.isScoring = true;
      }
    });
    const getScoringRankByRepeatedRank = (numberOfRepeats: number, multiple = false): number | number[] => {
      let scoringRank: number[] = [];
      Object.keys(this.rankCount).forEach((rank) => {
        if (this.rankCount[+rank] === numberOfRepeats) {
          scoringRank.push(+rank);
        }
      });
      return multiple ? scoringRank : scoringRank[0];
    };
    switch (this.handType) {
      case 'Flush Five':
      case 'Flush House':
      case 'Five of a Kind':
      case 'Full House':
        this.cards.forEach((card) => (card.isScoring = true));
        break;
      case 'Straight':
      case 'Royal Flush':
      case 'Straight Flush':
      case 'Flush':
        if (includesCertainJoker(this.jokers, 'Four Fingers')) {
          // TODO
        } else {
          this.cards.forEach((card) => (card.isScoring = true));
        }
        break;
      case 'Four of a Kind':
        this.cards.forEach((card) => {
          if (card.getRank() === getScoringRankByRepeatedRank(4)) {
            card.isScoring = true;
          }
        });
        break;
      case 'Three of a Kind':
        this.cards.forEach((card) => {
          if (card.getRank() === getScoringRankByRepeatedRank(3)) {
            card.isScoring = true;
          }
        });
        break;
      case 'Two Pair':
        this.cards.forEach((card) => {
          if ((getScoringRankByRepeatedRank(2, true) as number[]).includes(card.getRank())) {
            card.isScoring = true;
          }
        });
        break;
      case 'Pair':
        this.cards.forEach((card) => {
          if (card.getRank() === getScoringRankByRepeatedRank(2)) {
            card.isScoring = true;
          }
        });
        break;
      case 'High Card':
        let currentHighCard = 0;
        let highCardIndex = 0;
        this.cards.forEach((card, i) => {
          const cardRank = card.getRank() === 1 ? 14 : card.getRank();
          if (cardRank > currentHighCard) {
            currentHighCard = cardRank;
            highCardIndex = i;
          }
        });
        this.cards[highCardIndex].isScoring = true;
        break;
    }
  }

  calculateHandType(): HandType {
    const isFlush = this.isFlush();

    if (this.highestRankRepeat === 5) {
      if (isFlush) {
        return 'Flush Five';
      }
      return 'Five of a Kind';
    }

    const isFullHouse = this.isFullHouse();
    if (isFullHouse && isFlush) {
      return 'Flush House';
    }

    const isStraight = this.isStraight();
    if (isStraight && isFlush) {
      if (
        this.ranks.includes(1) &&
        this.ranks.includes(10) &&
        this.ranks.includes(11) &&
        this.ranks.includes(12) &&
        this.ranks.includes(13)
      ) {
        return 'Royal Flush';
      }

      return 'Straight Flush';
    }

    if (this.highestRankRepeat === 4) {
      return 'Four of a Kind';
    }

    if (isFlush) {
      return 'Flush';
    }

    if (isFullHouse) {
      return 'Full House';
    }

    if (isStraight) {
      return 'Straight';
    }

    if (this.highestRankRepeat === 3) {
      return 'Three of a Kind';
    }

    if (this.highestRankRepeat === 2) {
      let numberOfPairs = 0;
      Object.keys(this.rankCount).forEach((rank) => {
        if (this.rankCount[+rank] === 2) {
          numberOfPairs++;
        }
      });
      if (numberOfPairs === 2) {
        return 'Two Pair';
      }
      return 'Pair';
    }

    return 'High Card';
  }

  getHandType(): HandType {
    return this.handType;
  }

  getHighestRankRepeat(): number {
    let highest = 0;
    Object.keys(this.rankCount).forEach((rank) => {
      if (+rank === -1) {
        return;
      }
      if (this.rankCount[+rank] > highest) {
        highest = this.rankCount[+rank];
      }
    });
    return highest;
  }

  isStraight(): boolean {
    const hasFourFingers = includesCertainJoker(this.jokers, 'Four Fingers');
    const hasShortcut = includesCertainJoker(this.jokers, 'Shortcut');
    if (this.cards.filter((card) => card.getBaseChips() !== 50).length < (hasFourFingers ? 4 : 5)) {
      return false;
    }

    // count down from a given rank, and check longest consecutive
    let longest = 0;
    const checkConsecutive = (rank: number, count: number, ranks: number[]): number => {
      if (count === 4) {
        return count;
      }
      if (ranks.includes(rank)) {
        return checkConsecutive(rank - 1, count + 1, ranks);
      } else if (hasShortcut && ranks.includes(rank - 1)) {
        return checkConsecutive(rank - 2, count + 1, ranks);
      } else {
        return count;
      }
    };

    this.ranks.forEach((rank) => {
      let consecutive = 0;
      if (rank === 1) {
        // treat ace as "14"
        consecutive = checkConsecutive(13, 0, this.ranks);
      } else {
        consecutive = checkConsecutive(rank - 1, 0, this.ranks);
      }
      if (consecutive > longest) {
        longest = consecutive;
      }
    });
    console.log(longest);
    return longest >= (hasFourFingers ? 3 : 4);
  }

  isFullHouse(): boolean {
    if (this.highestRankRepeat !== 3) {
      return false;
    }

    let hasPair = false;
    Object.keys(this.rankCount).forEach((rank) => {
      if (this.rankCount[+rank] === 2) {
        hasPair = true;
      }
    });

    if (hasPair) {
      return true;
    }

    return false;
  }

  isFlush(): boolean {
    const hasFourFingers = includesCertainJoker(this.jokers, 'Four Fingers');
    if (this.cards.filter((card) => card.getBaseChips() !== 50).length < (hasFourFingers ? 4 : 5)) {
      return false;
    }
    let highestSuitCount = 0;
    Object.keys(this.suitsCount).forEach((suit) => {
      if (this.suitsCount[suit] > highestSuitCount) {
        highestSuitCount = this.suitsCount[suit];
      }
    });
    if (highestSuitCount >= (hasFourFingers ? 4 : 5)) {
      return true;
    }
    return false;
  }

  getSuitsCount() {
    return this.suitsCount;
  }

  getRankCount() {
    return this.rankCount;
  }
}
