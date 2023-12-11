import InputHelper from '../utils/input';
import Logger from '../utils/logger';
import { Point } from '../utils/grid'

const puzzle = 'Day 11A: Cosmic Expansion'
const input = new InputHelper();
const logger = new Logger(puzzle);

const inputValues = input.getInput();

logger.start();

let tempgrid = inputValues.reduce((list, line) => {
    if (!line.match(/[^\.]/))
        list.push(line)
    list.push(line)
    return list
}, [] as string[])

let columns: number[] = []
for (let i = inputValues[0].length - 1; i >=0; i--) {
    if (tempgrid.every(line=> line.substring(i,i+1)==='.'))
        columns.push(i)
}
columns.forEach(col=> {
    tempgrid = tempgrid.map(line => {
        return line.substring(0, col) + '.' + line.substring(col)
    })
})
const grid = tempgrid.map(line=>line.split(''))
// console.log(grid)

const galaxies = grid.reduce((list, row, y) => {
    row.forEach((col, x)=> {
        if (col==='#') list.push({x:x, y:y})

    })
    return list;
}, [] as Point[])

// console.log(galaxies)

let answer = 0;

for (let i = 0; i<galaxies.length-1; i++) {
    for (let j = i + 1; j<galaxies.length; j++) {
        // console.log(i, j)
        answer+= Math.abs(galaxies[i].x -galaxies[j].x) +  Math.abs(galaxies[i].y -galaxies[j].y)
    
    }    
}



logger.end(answer);

