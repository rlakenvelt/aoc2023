import InputHelper from '../utils/input';
import Logger from '../utils/logger';

const puzzle = 'Day 07A: Camel Cards'
const input = new InputHelper();
const logger = new Logger(puzzle);
const CARDS = 'AKQJT98765432'
interface Hand {
    cards: string[];
    bid: number;
    strength: number;
}
const hands: Hand[] = input.getInput()
                           .map(line => {
                            const parts = line.split(' ');
                            return {
                                cards: parts[0].split(''),
                                bid:parseInt(parts[1]),
                                strength: 0
                            }
                           });

logger.start();

hands.forEach(hand => {
    const cardscount = CARDS.split('')
                            .map(c=>{ return {card: c, count: hand.cards.join('').match(new RegExp(c, 'g'))?.length || 0}})
                            .filter(c=>c.count>0)
                            .sort((a,b) => b.count-a.count)
    if (cardscount.length === 1) {
        hand.strength = 7; 
    } else
    if (cardscount.length === 2 && cardscount[0].count === 4) {
        hand.strength = 6; 
    } else
    if (cardscount.length === 2 ) {
        hand.strength = 5;
    } else
    if (cardscount.length === 3 && cardscount[0].count === 3) {
        hand.strength = 4; 
    } else
    if (cardscount.length === 3 ) {
        hand.strength = 3; 
    } else
    if (cardscount.length === 4 ) {
        hand.strength = 2; 
    } else {
        hand.strength = 1;
    }   
})
hands.sort((a, b) => {
    if (b.strength === a.strength) {
        for (let i = 0; i < 5; i++) {
            const p1 = CARDS.indexOf(a.cards[i])
            const p2 = CARDS.indexOf(b.cards[i])
            if (p1 !== p2) {
                return p2 - p1
            }
        }
    }
    return a.strength - b.strength
})

let answer = hands.reduce((total, hand, index) => {
    return total+=hand.bid*(index+1)
}, 0)

logger.end(answer);

