import InputHelper from '../utils/input';
import Logger from '../utils/logger';

const puzzle = 'Day 15A: Lens Library'
const input = new InputHelper();
const logger = new Logger(puzzle);

const inputValues = input.getInput(',');

logger.start();

// hash('HASH')

let answer = inputValues.reduce((total, value) => {
    total+=hash(value)
    return total
}, 0);



logger.end(answer);

function hash(input: string): number {

    let result = 0;
    for (let i = 0; i < input.length; i++) {
       result+=input.charCodeAt(i);
       result*=17
       result = result % 256
    }
    console.log(input, result)
    return result
}

