import InputHelper from '../utils/input';
import Logger from '../utils/logger';

const puzzle = 'Day 04B: Scratchcards'
const input = new InputHelper();
const logger = new Logger(puzzle);

const lines = input.getInput();

logger.start();

let cards = lines.reduce((list: any[], line, index) => {
    const card ={id: index + 1, winning: [] as number[], my: [] as number[], copies: 1, matches: 0};
    const lists = line.split(':')
                      .filter((part, index) => index > 0)
                      .map(l => l.split('|'))
                
    card.winning = lists[0][0].trim().split(' ').filter(v=>v!==' ').map(v=>parseInt(v)).filter(v=>!Number.isNaN(v))
    card.my = lists[0][1].trim().split(' ').map(v=>parseInt(v)).filter(v=>!Number.isNaN(v))   
    card.my.forEach((n: number) => {
        if (card.winning.includes(n)) card.matches++
    });               
    list.push(card)
    return list;
}, [])

const MAX = cards.length - 1;
cards.forEach((card, index) => {
    for (let i = 1; i <= Math.min(MAX, card.matches); i++) {
        cards[index+i].copies+=card.copies;
    }
})
let answer=cards.reduce((total, card) => {
    total += card.copies
    return total
}, 0)

logger.end(answer);

