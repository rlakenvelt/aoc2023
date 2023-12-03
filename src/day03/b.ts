import InputHelper from '../utils/input';
import Logger from '../utils/logger';
import { Direction } from '../utils/grid';
import Common from '../utils/common';

const puzzle = 'Day 03B: Gear Ratios'
const input = new InputHelper();
const logger = new Logger(puzzle);

const lines = input.getInput();
const directions = Direction.directionsWithDiagonals();

logger.start();

let symbols = lines.map((line, index) => {
                        const matches = Array.from(line.matchAll(/([^\w])/g))
                        return matches.filter((match)=>match[0].toString()!=='.')
                                    .map(match => {
                                            return {symbol: match[0].toString(), x: match.index}
                                    })
                                    .map(n=> {return {...n, y: index, parts: [] as number[]}})
                    })
                    .flat()

let numbers = lines.map((line, index) => {
                            const matches = Array.from(line.matchAll(/(\d{1,9})/g))
                            return matches.map(match => {
                                                return {number: parseInt(match[0]), x: match.index}
                                           })
                                           .map(n=> {return {...n, y: index}})
                        })
                    .flat()
                    .filter(filterNumbersWithAdjacentSymbol)
  
let answer = symbols.filter(symbol => symbol.symbol==='*' && symbol.parts.length===2)
                    .map(symbol=> symbol.parts.reduce(Common.multiply, 1))
                    .reduce(Common.total, 0)
                                 
logger.end(answer);


function filterNumbersWithAdjacentSymbol(number: any) {
    const length = number.number.toString().length;

    for (let i = 0; i < length; i++) {
        const found = directions.some((d: Direction)=> {
            const symbol = symbols.find(s=>s.x===number.x+i+d.x && s.y===number.y+d.y)
            if (symbol) {
                symbol.parts.push(number.number)
                return true;
            }
            return false;
        })
        if (found) return true;
    }
    return false;

}

