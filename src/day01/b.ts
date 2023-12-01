import InputHelper from '../utils/input';
import Logger from '../utils/logger';

const puzzle = 'Day 1B: Trebuchet?!'
const input = new InputHelper();
const logger = new Logger(puzzle);
const lines = input.getInput();

logger.start();

let answer = lines.map(wordsToDigits)
                  .reduce(accumulateNumbers, 0)

logger.end(answer);

function accumulateNumbers(total: number, line: string) {
    const digits: number[] = line.split('')
                                 .filter(digit => parseInt(digit))
                                 .map(digit => parseInt(digit));   
    total += digits[0] * 10 + digits[digits.length - 1];
    return total;    
}

function wordsToDigits(line: string) {
    const words = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    line = words.reduce((result, word, index) => {
        return result.replace(new RegExp(`${word}`, 'g'), word + (index + 1).toString() + word);
    }, line)
   return line;
}



