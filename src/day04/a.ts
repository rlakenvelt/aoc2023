import InputHelper from '../utils/input';
import Logger from '../utils/logger';

const puzzle = 'Day 04A: Scratchcards'
const input = new InputHelper();
const logger = new Logger(puzzle);

const lines = input.getInput();

logger.start();

let cards = lines.reduce((list: any[], line, index) => {
    const card ={id: index + 1, winning: [] as number[], my: [] as number[]};
    const lists = line.split(':')
                      .filter((part, index) => index > 0)
                      .map(l => l.split('|'))
                
    card.winning = lists[0][0].trim().split(' ').filter(v=>v!==' ').map(v=>parseInt(v)).filter(v=>!Number.isNaN(v))
    card.my = lists[0][1].trim().split(' ').map(v=>parseInt(v)).filter(v=>!Number.isNaN(v))                  
    list.push(card)
    return list;
}, [])

let answer = cards.reduce((total, card) => {
    let score = 0;
    card.my.forEach((n: number) => {
        if (card.winning.includes(n)) {
            if (score===0)
                score = 1;
            else
                score *=2;
        }
        
    });
    total+=score
    return total;
}, 0)



logger.end(answer);

