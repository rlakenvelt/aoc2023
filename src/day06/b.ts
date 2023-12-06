import InputHelper from '../utils/input';
import Logger from '../utils/logger';

const puzzle = 'Day 06B: Wait For It'
const input = new InputHelper();
const logger = new Logger(puzzle);

const inputValues = input.getInput();
const time = parseInt(inputValues[0].replace(/[^\d]/g, ''))
const record = parseInt(inputValues[1].replace(/[^\d]/g, ''))

logger.start();

let ways=0;
for (let i = 1; i<time; i++) {
    if ((time - i) * i > record) ways++
}

logger.end(ways);

