import InputHelper from '../utils/input';
import Logger from '../utils/logger';
import Common from '../utils/common';

const puzzle = 'Day 09A: Mirage Maintenance'
const input = new InputHelper();
const logger = new Logger(puzzle);

const inputValues = input.getInput().map(line=>line.split(' ').map(x=>parseInt(x)));

logger.start();

let answer = inputValues.map(nextValue).reduce(Common.total);
logger.end(answer);


function nextValue(values: number[]) {
    let list = [...values]
    const differencesList: number[][] = [values];
    do {
        const newlist = differences(list)
        differencesList.unshift(newlist)
        if (newlist.every(x=>x===0)) break
        list=newlist
    } while (true)
    let nextValue = 0;
    for (let i = 1; i < differencesList.length; i++) {
        nextValue = differencesList[i][differencesList[i].length-1] + nextValue;
    }
    return nextValue;
}

function differences(values: number[]) {
    const list: number[] = [];
    for (let i = 1; i < values.length; i++) {
        list.push(values[i] - values[i - 1])
    }
    return list
}

