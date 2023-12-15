import InputHelper from '../utils/input';
import Logger from '../utils/logger';

const puzzle = 'Day 14B: Parabolic Reflector Dish'
const input = new InputHelper();
const logger = new Logger(puzzle);

let grid = input.getInput().map(line=>line.split(''));

logger.start();

let answer = 0; //countLoad(tilt(grid));

for (let c = 0; c < 2; c++) {
    // console.log('CYCLE', c)
    grid = cycle(grid)
    // displayGrid(grid)
    answer = countLoad(grid)
    console.log('LOAD', c, answer)
}


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
    console.log('')
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

function cycle(grid: string[][]) {
    let workgrid = rotatedGrid(grid)
    workgrid = tilt(workgrid)
    workgrid = rotatedGrid(workgrid)
    workgrid = tilt(workgrid)
    workgrid = rotatedGrid(workgrid)
    workgrid = tilt(workgrid)
    workgrid = rotatedGrid(workgrid)
    workgrid = tilt(workgrid)
    return workgrid;
}
function countLoad(grid: string[][]) {
    let result = 0
    for (let row=0; row<grid.length; row++) {
        let rowresult = 0;
        for (let col = 0; col<grid[0].length; col++) {
            if (grid[row][col] === 'O') {
                rowresult+=col+1;
            }
        }
        console.log(grid[row].join(''), rowresult)
        result+=rowresult
    }
    return result
}