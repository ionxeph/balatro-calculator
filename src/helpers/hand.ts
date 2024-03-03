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
    stone: 0,
  };
  rankCount: { [key: number]: number } = {
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
  highestRankRepeat = 0;
  handType: HandType = 'High Card';

  constructor(cards: PokerCard[]) {
    this.cards = cards;
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
    this.handType = this.calculateHandType();
  }

  getScoringCards(): PokerCard[] {
    let scoringCards: PokerCard[] = [];
    const getScoringRankByRepeatedRank = (
      numberOfRepeats: number,
      multiple = false
    ): number | number[] => {
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
      case 'Royal Flush':
      case 'Straight Flush':
      case 'Flush':
      case 'Full House':
      case 'Straight':
        return this.cards;
      case 'Four of a Kind':
        scoringCards = this.cards.filter(
          (card) => card.getRank() === getScoringRankByRepeatedRank(4)
        );
        break;
      case 'Three of a Kind':
        scoringCards = this.cards.filter(
          (card) => card.getRank() === getScoringRankByRepeatedRank(3)
        );
        break;
      case 'Two Pair':
        scoringCards = this.cards.filter((card) =>
          (getScoringRankByRepeatedRank(2, true) as number[]).includes(
            card.getRank()
          )
        );
        break;
      case 'Pair':
        scoringCards = this.cards.filter(
          (card) => card.getRank() === getScoringRankByRepeatedRank(2)
        );
        break;
      case 'High Card':
        const filteredHighCard = this.cards
          .filter((card) => card.id !== 0)
          .sort((a, b) => b.getChips() - a.getChips())[0];
        if (filteredHighCard) {
          scoringCards.push(filteredHighCard);
        }
        break;
    }
    this.cards.forEach((card) => {
      if (card.getChips() === 50) {
        scoringCards.push(card);
      }
    });
    return scoringCards;
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
      if (this.ranks.includes(1) && this.ranks.includes(10)) {
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
      if (+rank === 0) {
        return;
      }
      if (this.rankCount[+rank] > highest) {
        highest = this.rankCount[+rank];
      }
    });
    return highest;
  }

  isStraight(): boolean {
    if (
      this.cards.length < 5 ||
      this.highestRankRepeat > 1 ||
      this.suitsCount.stone > 0
    ) {
      return false;
    }

    // count down from a given rank, and check longest consecutive
    let longest = 0;
    const checkConsecutive = (
      rank: number,
      count: number,
      ranks: number[]
    ): number => {
      if (count === 5) {
        return count;
      }
      if (ranks.includes(rank)) {
        return checkConsecutive(rank - 1, count + 1, ranks);
      } else {
        return count;
      }
    };

    this.ranks.forEach((rank) => {
      let consecutive = 0;
      if (rank === 1) {
        // treat ace as "14"
        consecutive = checkConsecutive(14, 0, this.ranks);
      } else if (rank < 5) {
        consecutive = 0;
      } else {
        consecutive = checkConsecutive(rank, 0, this.ranks);
      }
      if (consecutive > longest) {
        longest = consecutive;
      }
    });
    return longest === 5;
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
    if (this.cards.length < 5 || this.suitsCount.stone > 0) {
      return false;
    }
    let numberOfUniqueSuits = 0;
    Object.keys(this.suitsCount).forEach((suit) => {
      if (this.suitsCount[suit] > 0) {
        numberOfUniqueSuits++;
      }
    });
    if (numberOfUniqueSuits < 2) {
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
