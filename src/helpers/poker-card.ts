export type Suit = 'spades' | 'hearts' | 'clubs' | 'diamonds' | 'none';
export type Enhancement = 'none' | 'bonus' | 'mult' | 'wild' | 'glass' | 'stone' | 'lucky';
export type Edition = 'base' | 'foil' | 'holographic' | 'polychrome';
export type Seal = 'none' | 'red';

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
  isDebuffed = false;

  constructor(id: number, enhancement: Enhancement, edition: Edition, seal: Seal) {
    this.id = id;
    this.enhancement = enhancement;
    this.edition = edition;
    this.seal = seal;
  }

  setId(id: number) {
    this.id = id;
  }

  isFace(hasPareidolia: boolean): boolean {
    const faceRanks = [11, 12, 13];
    return hasPareidolia || faceRanks.includes(this.getRank());
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

  getSuit(hasSmearedJoker: boolean): Suit[] {
    if (this.enhancement === 'stone') {
      return ['none'];
    }
    const suitNbr = this.id / 13;
    if (suitNbr <= 1) {
      if (this.enhancement === 'wild') {
        return ['spades', 'hearts', 'clubs', 'diamonds'];
      }
      return hasSmearedJoker ? ['spades', 'clubs'] : ['spades'];
    }
    if (suitNbr <= 2) {
      if (this.enhancement === 'wild') {
        return ['hearts', 'clubs', 'diamonds', 'spades'];
      }
      return hasSmearedJoker ? ['hearts', 'diamonds'] : ['hearts'];
    }
    if (suitNbr <= 3) {
      if (this.enhancement === 'wild') {
        return ['clubs', 'hearts', 'diamonds', 'spades'];
      }
      return hasSmearedJoker ? ['clubs', 'spades'] : ['clubs'];
    }
    if (this.enhancement === 'wild') {
      return ['diamonds', 'clubs', 'hearts', 'spades'];
    }
    return hasSmearedJoker ? ['diamonds', 'hearts'] : ['diamonds'];
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
    const suit = this.getSuit(false)[0];
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
