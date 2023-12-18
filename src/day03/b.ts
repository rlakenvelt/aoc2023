import InputHelper from '../utils/input';
import Logger from '../utils/logger';
import { Direction } from '../utils/direction';
import Common from '../utils/common';
import { MatchUtils, NumberMatch } from '../utils/match';

const puzzle = 'Day 03B: Gear Ratios'
const input = new InputHelper();
const logger = new Logger(puzzle);

const lines = input.getInput();
const directions = Direction.directionsWithDiagonals();

logger.start();

let symbols = lines.map((line, index) => MatchUtils.getStringMatch(/([^\w^.])/g, line, index))
                   .flat()
                   .map(symbol => { return {...symbol, parts: [] as number[]}} )

let numbers = lines.map((line, index) => MatchUtils.getNumberMatch(/(\d{1,9})/g, line, index))
                   .flat()
                   .filter(filterNumbersWithAdjacentSymbol)

let answer = symbols.filter(symbol => symbol.match==='*' && symbol.parts.length===2)
                    .map(symbol=> symbol.parts.reduce(Common.multiply, 1))
                    .reduce(Common.total, 0)
                                 
logger.end(answer);

function filterNumbersWithAdjacentSymbol(number: NumberMatch) {
    const length = number.match.toString().length;

    for (let i = 0; i < length; i++) {
        const found = directions.some((d: Direction)=> {
            const symbol = symbols.find(s=>s.x===number.x+i+d.x && s.y===number.y+d.y)
            if (symbol) {
                symbol.parts.push(number.match)
                return true;
            }
            return false;
        })
        if (found) return true;
    }
    return false;

}

