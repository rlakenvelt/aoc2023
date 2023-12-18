import InputHelper from '../utils/input';
import Logger from '../utils/logger';
import { Point } from '../utils/point'

const puzzle = 'Day 11A: Cosmic Expansion'
const input = new InputHelper();
const logger = new Logger(puzzle);

let inputValues = input.getInput();

logger.start();

let rows: number[] = []
inputValues.forEach((line, index) => {
    if (!line.match(/[^\.]/))
        rows.push(index)
})

let columns: number[] = []
for (let i = inputValues[0].length - 1; i >=0; i--) {
    if (inputValues.every(line=> line.substring(i,i+1)==='.'))
        columns.push(i)
}

const grid = inputValues.map(line=>line.split(''))

const galaxies = grid.reduce((list, row, y) => {
    row.forEach((col, x)=> {
        if (col==='#') list.push({x:x, y:y})

    })
    return list;
}, [] as Point[])

let answer = 0;

const GROW = 1;

for (let i = 0; i<galaxies.length-1; i++) {
    for (let j = i + 1; j<galaxies.length; j++) {
        let plusX = 0;
        let plusY = 0;
        columns.forEach(c=> {
            if (((galaxies[i].x <= c) && (c <= galaxies[j].x)) 
               || ((galaxies[j].x <= c) && (c <= galaxies[i].x)) )
            plusX+=GROW;
        })
        rows.forEach(r=> {
            if (((galaxies[i].y <= r) && (r <= galaxies[j].y))
               || ((galaxies[j].y <= r) && (r <= galaxies[i].y))) plusY+=GROW;
        })
        answer+= Math.abs(galaxies[i].x - galaxies[j].x) +  Math.abs(galaxies[i].y - galaxies[j].y) + plusX + plusY
    }    
}



logger.end(answer);

