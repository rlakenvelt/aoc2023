import InputHelper from '../utils/input';
import Logger from '../utils/logger';

const puzzle = 'Day 1A: Trebuchet?!'
const input = new InputHelper();
const logger = new Logger(puzzle);
const lines = input.getInput();

logger.start();

let answer = lines.reduce((total, line) => {

    const digits: number[] = line.split('')
                                 .filter(digit => parseInt(digit))
                                 .map(digit => parseInt(digit));   
    total += digits[0] * 10 + digits[digits.length - 1];
    return total;
}, 0)

logger.end(answer);

