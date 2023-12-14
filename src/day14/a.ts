import InputHelper from '../utils/input';
import Logger from '../utils/logger';

const puzzle = 'Day 14A: Parabolic Reflector Dish'
const input = new InputHelper();
const logger = new Logger(puzzle);

const inputValues = input.getInput().map(line=>line.split(''));

logger.start();

let grid = rotatedGrid(inputValues)

let answer = countLoad(tilt(grid));

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

function tilt(grid: string[][]) {
    const workgrid=grid.map(l=>[...l])

    return workgrid.map(line=> {
        let workline = line.join('')     
        while (workline.indexOf('O.')>=0) {
            workline = workline.replace('O.', '.O');
        } 
        return workline.split('')
    })
}

function countLoad(grid: string[][]) {
    let result = 0
    for (let row=0; row<grid.length; row++) {
        for (let col = 0; col<grid[0].length; col++) {
            if (grid[row][col] === 'O') {
                result+=col+1;
            }
        }
    }
    return result
}