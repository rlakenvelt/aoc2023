import InputHelper from '../utils/input';
import Logger from '../utils/logger';
import { Direction } from '../utils/grid';
import Common from '../utils/common';

const puzzle = 'Day 03A: Gear Ratios'
const input = new InputHelper();
const logger = new Logger(puzzle);

const lines = input.getInput();
const directions = Direction.directionsWithDiagonals();

logger.start();

let symbols = lines.map((line, index) => Array.from(line.matchAll(/([^\w^.])/g)).map(match => {return {x: match.index, y: index}}))
                    .flat()

let numbers = lines.map((line, index) => Array.from(line.matchAll(/(\d{1,9})/g)).map(match => {return {number: parseInt(match[0]), x: match.index, y: index} }))
                    .flat()
                    .filter(filterNumbersWithAdjacentSymbol)
  
let answer = numbers.reduce((total, n) => {return total+=n.number}, 0)


logger.end(answer);


function filterNumbersWithAdjacentSymbol(number: any) {
    const length = number.number.toString().length;

    for (let i = 0; i < length; i++) {
        const found = directions.some((d: Direction)=> {
            return symbols.find(s=>s.x===number.x+i+d.x && s.y===number.y+d.y)
        })
        if (found) return true;
    }
    return false;

}

