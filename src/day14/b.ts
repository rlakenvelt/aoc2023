import InputHelper from '../utils/input';
import Logger from '../utils/logger';

const puzzle = 'Day 14B: Parabolic Reflector Dish'
const input = new InputHelper();
const logger = new Logger(puzzle);
let loads: number[] = [];
let grid = input.getInput().map(line=>line.split(''));

logger.start();

grid = rotatedGrid(grid)

do {
    grid = cycle(grid)
    loads.push(countLoad(grid))
} while (repeatingPattern(loads) === -1)

const pattern = repeatingPattern(loads);
const cycles = (1000000000 - loads.length) ; 
let answer = loads[loads.length + (cycles % pattern) - 1 - pattern]

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
    let workgrid = tilt(grid)
    workgrid = rotatedGrid(workgrid)
    workgrid = tilt(workgrid)
    workgrid = rotatedGrid(workgrid)
    workgrid = tilt(workgrid)
    workgrid = rotatedGrid(workgrid)
    workgrid = tilt(workgrid)
    workgrid = rotatedGrid(workgrid)
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
        result+=rowresult
    }
    return result
}

function repeatingPattern(list: number[]) {
    const r = list.map(l=>l).reverse();
    const last = r.shift() || 0;
    const nextIndex = r.indexOf(last);
    if (nextIndex<=0) return -1;
    for (let i = 0; i < nextIndex; i++) {
        if (r[i] != r[nextIndex+i+1]) return -1
    }
    return nextIndex + 1;
}
