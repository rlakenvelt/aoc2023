import InputHelper from '../utils/input';
import Logger from '../utils/logger';

const puzzle = 'Day 13A: Point of Incidence'
const input = new InputHelper();
const logger = new Logger(puzzle);

const inputValues = input.getInput('\n\n');
const grids = inputValues.map(line=>line.split('\n').map(l=>l.split('')))

logger.start();

let answer = 0;


grids.forEach((grid, index)=> {
    for (let x = 0; x < grid[0].length - 1; x++ ) {
        if (getColumn(grid, x) === getColumn(grid, x + 1)) {
            const checkcols = Math.min(x, grid[0].length - x - 2)
            let mirrorOK = true;
            for (let c = 1; c<=checkcols; c++) {
                if (getColumn(grid, x - c)  != getColumn(grid, x+1+c) ) {
                    mirrorOK = false;
                    break;
                }
            }
            if (mirrorOK) {
                answer+=x+1
                break;
            }
        }
    }

    for (let y = 0; y < grid.length - 1; y++ ) {
        if (grid[y].join('') === grid[y+1].join('')) {
            const checklines = Math.min(y, grid.length - y - 2)
            let mirrorOK = true;
            for (let c = 1; c<=checklines; c++) {
                if (grid[y - c].join('') != grid[y+1+c].join('')) {
                    mirrorOK = false;
                    break;
                }
            }
            if (mirrorOK) {
                answer+=(y+1)*100
                break;
            }
        }
    }
    

})




logger.end(answer);

function getColumn(grid: string[][], column: number) {
    return grid.reduce((line, next) =>{
        line+=next[column]
        return line;
    }, '')
}

