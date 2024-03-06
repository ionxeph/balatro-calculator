import { Edition } from './poker-card';

export type JokerName =
  | 'placeholder' // for unincluded jokers that have edition
  | 'Joker'
  | 'Greedy Joker'
  | 'Lusty Joker'
  | 'Wrathful Joker'
  | 'Gluttonous Joker'
  | 'Jolly Joker'
  | 'Zany Joker'
  | 'Mad Joker'
  | 'Crazy Joker'
  | 'Droll Joker'
  | 'Sly Joker'
  | 'Wily Joker'
  | 'Clever Joker'
  | 'Devious Joker'
  | 'Crafty Joker'
  | 'Half Joker'
  | 'Joker Stencil'
  | 'Four Fingers'
  | 'Mime'
  | 'Ceremonial Dagger'
  | 'Banner'
  | 'Mystic Summit'
  | 'Marble Joker'
  | 'Loyalty Card'
  | 'Misprint'
  | 'Dusk'
  | 'Raised Fist'
  | 'Fibonacci'
  | 'Steel Joker'
  | 'Scary Face'
  | 'Abstract Joker'
  | 'Hack'
  | 'Pareidolia'
  | 'Gros Michel'
  | 'Even Steven'
  | 'Odd Todd'
  | 'Scholar'
  | 'Supernova'
  | 'Ride the Bus'
  | 'Space Joker'
  | 'Burglar'
  | 'Blackboard'
  | 'Runner'
  | 'Ice Cream'
  | 'Splash'
  | 'Blue Joker'
  | 'Constellation'
  | 'Hiker'
  | 'Green Joker'
  | 'Cavendish'
  | 'Card Sharp'
  | 'Red Card'
  | 'Madness'
  | 'Square Joker'
  | 'Vampire'
  | 'Shortcut'
  | 'Hologram'
  | 'Vagabond'
  | 'Baron'
  | 'Cloud 9'
  | 'Rocket'
  | 'Obelisk'
  | 'Midas Mask'
  | 'Luchador'
  | 'Photograph'
  | 'Gift Card'
  | 'Turtle Bean'
  | 'Erosion'
  | 'Reserved Parking'
  | 'To the Moon'
  | 'Fortune Teller'
  | 'Stone Joker'
  | 'Lucky Cat'
  | 'Baseball Card'
  | 'Bull'
  | 'Diet Cola'
  | 'Trading Card'
  | 'Flash Card'
  | 'Popcorn'
  | 'Spare Trousers'
  | 'Ancient Joker'
  | 'Ramen'
  | 'Walkie Talkie'
  | 'Seltzer'
  | 'Castle'
  | 'Smiley Face'
  | 'Campfire'
  | 'Mr. Bones'
  | 'Acrobat'
  | 'Sock and Buskin'
  | 'Swashbuckler'
  | 'Troubadour'
  | 'Certificate'
  | 'Smeared Joker'
  | 'Throwback'
  | 'Hanging Chad'
  | 'Rough Gem'
  | 'Bloodstone'
  | 'Arrowhead'
  | 'Onyx Agate'
  | 'Glass Joker'
  | 'Showman'
  | 'Flower Pot'
  | 'Blueprint'
  | 'Wee Joker'
  | 'Merry Andy'
  | 'Oops! All 6s'
  | 'The Idol'
  | 'Seeing Double'
  | 'Matador'
  | 'Hit the Road'
  | 'The Duo'
  | 'The Trio'
  | 'The Family'
  | 'The Order'
  | 'The Tribe'
  | 'Stuntman'
  | 'Brainstorm'
  | 'Satellite'
  | 'Shoot the Moon'
  | "Driver's License"
  | 'Cartomancer'
  | 'Astronomer'
  | 'Burnt Joker'
  | 'Bootstraps'
  | 'Canio'
  | 'Triboulet'
  | 'Yorick';

export type Joker = { name: JokerName; edition: Edition };

export const allJokerNames: JokerName[] = ['placeholder', 'Joker', 'Greedy Joker'];

export const cardPlayedJokerNames: JokerName[] = [
  'Greedy Joker',
  'Lusty Joker',
  'Wrathful Joker',
  'Gluttonous Joker',
  'Jolly Joker',
  'Zany Joker',
  'Mad Joker',
  'Crazy Joker',
  'Droll Joker',
  'Sly Joker',
  'Wily Joker',
  'Clever Joker',
  'Devious Joker',
  'Crafty Joker',
  'Half Joker',
  'Fibonacci',
  'Scary Face',
  'Hack',
  'Pareidolia',
  'Even Steven',
  'Odd Todd',
  'Scholar',
  'Photograph',
  'Walkie Talkie',
  'Seltzer',
  'Smiley Face',
  'Sock and Buskin',
  'Hanging Chad',
  'Bloodstone',
  'Arrowhead',
  'Onyx Agate',
  'Flower Pot',
  'Wee Joker',
  'The Idol',
  'Triboulet',
];

export const cardHeldJokerNames: JokerName[] = ['Mime', 'Baron', 'Sock and Buskin', 'Shoot the Moon'];

export const ruleBendingJokerNames: JokerName[] = ['Four Fingers', 'Splash', 'Shortcut', 'Smeared Joker', 'Blueprint'];

export const uncommonJokerNames: JokerName[] = [
  'Joker Stencil',
  'Four Fingers',
  'Mime',
  'Ceremonial Dagger',
  'Marble Joker',
  'Loyalty Card',
  'Dusk',
  'Fibonacci',
  'Steel Joker',
  'Hack',
  'Pareidolia',
  'Space Joker',
  'Burglar',
  'Blackboard',
  'Constellation',
  'Hiker',
  'Card Sharp',
  'Madness',
  'Vampire',
  'Shortcut',
  'Vagabond',
  'Cloud 9',
  'Rocket',
  'Midas Mask',
  'Luchador',
  'Gift Card',
  'Turtle Bean',
  'Erosion',
  'Reserved Parking',
  'To the Moon',
  'Stone Joker',
  'Lucky Cat',
  'Bull',
  'Diet Cola',
  'Trading Card',
  'Flash Card',
  'Spare Trousers',
  'Ramen',
  'Seltzer',
  'Castle',
  'Mr. Bones',
  'Acrobat',
  'Sock and Buskin',
  'Troubadour',
  'Certificate',
  'Smeared Joker',
  'Throwback',
  'Rough Gem',
  'Bloodstone',
  'Arrowhead',
  'Onyx Agate',
  'Glass Joker',
  'Showman',
  'Flower Pot',
  'Merry Andy',
  'Oops! All 6s',
  'The Idol',
  'Seeing Double',
  'Matador',
  'Stuntman',
  'Satellite',
  'Cartomancer',
  'Astronomer',
  'Burnt Joker',
];
