import InputHelper from '../utils/input';
import Logger from '../utils/logger';
import Common from '../utils/common';

const puzzle = 'Day 06A: Wait For It'
const input = new InputHelper();
const logger = new Logger(puzzle);

const inputValues = input.getInput();
const times = inputValues[0].split(':')[1].split(' ').filter(c=>c!=='').map(i=>parseInt(i))
const records = inputValues[1].split(':')[1].split(' ').filter(c=>c!=='').map(i=>parseInt(i))
const ways = times.map(()=>0)

logger.start();

times.forEach((t, index)=> {
    for (let i = 1; i<t; i++) {
        if ((t - i) * i > records[index]) ways[index]++
    }
} )

logger.end(ways.reduce(Common.multiply));

