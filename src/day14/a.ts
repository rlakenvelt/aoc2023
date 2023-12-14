import InputHelper from '../utils/input';
import Logger from '../utils/logger';
import { Direction, Grid } from '../utils/grid';


const puzzle = 'Day 14A: Parabolic Reflector Dish'
const input = new InputHelper();
const logger = new Logger(puzzle);

const inputValues = input.getInput().map(line=>line.split(''));

let grid = rotatedGrid(inputValues)

// displayGrid(grid)

// const grid = new Grid<string>(inputValues[0].length, inputValues.length)


// grid.setGrid(inputValues)

// grid.display();

// console.log(grid.height)

logger.start();
let answer = 0;

for (let row=0; row<grid.length; row++) {
    let line = grid[row].join('')

    do {
        line = line.replace('O.', '.O');
    } while (line.indexOf('O.')>=0)

    for (let col = 0; col<line.length; col++) {
        if (line[col] === 'O') {
            answer+=col+1;
        }
    }
    // console.log(line)
    

}
// console.log('')
// displayGrid(grid)




logger.end(answer);

function rotatedGrid(grid: string[][]) {
    let newgrid: string[][] = [];
    for (let i = 0; i < grid.length; i++) {
        newgrid.push(getColumn(grid, i).split(''))
    }
    return newgrid;
}


function getColumn(grid: string[][], column: number) {
    return grid.reduce((line, next) =>{
        line=next[column]+line
        return line;
    }, '')
}

function displayGrid(grid: string[][]) {
    grid.forEach(line=> {
        console.log(line.join(''))
    })
}