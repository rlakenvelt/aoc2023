import InputHelper from '../utils/input';
import Logger from '../utils/logger';
import { Direction } from '../utils/direction';
import { MatchUtils } from '../utils/match';

const puzzle = 'Day 03A: Gear Ratios'
const input = new InputHelper();
const logger = new Logger(puzzle);

const lines = input.getInput();
const directions = Direction.directionsWithDiagonals();

logger.start();

let symbols = lines.map((line, index) => MatchUtils.getStringMatch(/([^\w^.])/g, line, index))
                   .flat()

let numbers = lines.map((line, index) => MatchUtils.getNumberMatch(/(\d{1,9})/g, line, index))
                   .flat()
                   .filter(filterNumbersWithAdjacentSymbol)

let answer = numbers.reduce((total, n) => {return total+=n.match}, 0)

logger.end(answer);

function filterNumbersWithAdjacentSymbol(number: any) {
    const length = number.match.toString().length;

    for (let i = 0; i < length; i++) {
        const found = directions.some((d: Direction)=> {
            return symbols.find(s=>s.x===number.x+i+d.x && s.y===number.y+d.y)
        })
        if (found) return true;
    }
    return false;

}

