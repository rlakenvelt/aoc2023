import InputHelper from '../utils/input';
import Logger from '../utils/logger';

const puzzle = 'Day 1B: Trebuchet?!'
const input = new InputHelper();
const logger = new Logger(puzzle);
const lines = input.getInput();

logger.start();

let answer = lines.map(wordsToDigits)
                  .reduce((total, line) => {
    const digits: number[] = line.split('')
                                 .filter(digit => parseInt(digit))
                                 .map(digit => parseInt(digit));   
    total += digits[0] * 10 + digits[digits.length - 1];
    return total;
}, 0)

logger.end(answer);

function wordsToDigits(line: string) {
    // quick&dirty...
    line = line.replace(/oneight/g, 'oneeight');
    line = line.replace(/twone/g, 'twoone');
    line = line.replace(/threeight/g, 'threeeight');
    line = line.replace(/fiveight/g, 'fiveeight');
    line = line.replace(/sevenine/g, 'sevennine');
    line = line.replace(/eightwo/g, 'eighttwo');
    line = line.replace(/eighthree/g, 'eightthree');
    line = line.replace(/nineight/g, 'nineeight');

    const words = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    line = words.reduce((result, word, index) => {
        return result.replace(new RegExp(`${word}`, 'g'), (index + 1).toString());
    }, line)

   return line;

}

