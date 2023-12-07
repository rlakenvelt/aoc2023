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
    rank: number,
    type: string
}
const hands: Hand[] = input.getInput()
                           .map(line => {
                            const parts = line.split(' ');
                            return {
                                cards: parts[0].split(''),
                                bid:parseInt(parts[1]),
                                strength: 0,
                                rank: 0,
                                type: ''
                            }
                           });

logger.start();

hands.forEach(hand => {
    const cardscount = CARDS.split('')
                            .map(c=>{
                                    let cnt = hand.cards.reduce((total, current) => {
                                        if (current===c) total++;
                                        return total;
                                    }, 0)
                                    return {card: c, count: cnt}
                                })
                            .filter(c=>c.count>0)
                            .sort((a,b) => { return b.count-a.count})
    if (cardscount.length === 1) {
        hand.strength = 7; hand.type = 'Five of a kind';
    } else
    if (cardscount.length === 2 && cardscount[0].count === 4) {
        hand.strength = 6; hand.type = 'Four of a kind'
    } else
    if (cardscount.length === 2 ) {
        hand.strength = 5; hand.type = 'Full house'
    } else
    if (cardscount.length === 3 && cardscount[0].count === 3) {
        hand.strength = 4; hand.type = 'Three of a kind'
    } else
    if (cardscount.length === 3 ) {
        hand.strength = 3; hand.type = 'Two pair'
    } else
    if (cardscount.length === 4 ) {
        hand.strength = 2; hand.type = 'One pair'
    } else {
        hand.strength = 1; hand.type = 'High card'
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
    total+=hand.bid*(index+1)
    return total
}, 0)

logger.end(answer);

