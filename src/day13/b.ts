import InputHelper from '../utils/input';
import Logger from '../utils/logger';

const puzzle = 'Day 13B: Point of Incidence'
const input = new InputHelper();
const logger = new Logger(puzzle);

const inputValues = input.getInput('\n\n');
const grids = inputValues.map(line=>line.split('\n').map(l=>l.split('')))

logger.start();

let answer = 0;


grids.forEach((grid, index)=> {
    let found=false
    let mirroredRows=0
    let originalRow = getMirroredRow(grid)
    let originalCol = getMirroredRow(rotatedGrid(grid))


    console.log('GRID', index, originalRow, originalCol)
    // displayGrid(grid)

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0].length; x++) {
            const workgrid = grid.map(row=>[...row])
            workgrid[y][x] = workgrid[y][x]==='.'?'#':'.';
            // displayGrid(workgrid)
            let row = getMirroredRow(workgrid, originalRow)
            let col = getMirroredRow(rotatedGrid(workgrid), originalCol)

            
            // console.log('A', index, y, x, mirroredRows)
            if (row+col>0) {
                // console.log(x,y)
                // displayGrid(workgrid)
                mirroredRows=row*100+col
                break;
            }        
        }
        if (mirroredRows>0) break
    }
    // console.log(index, mirroredRows)
    answer+=mirroredRows
})

logger.end(answer);

function getColumn(grid: string[][], column: number) {
    return grid.reduce((line, next) =>{
        line=next[column]+line
        return line;
    }, '')
}
function getRow(grid: string[][], row: number) {
    return grid[row].join('')
}

function rotatedGrid(grid: string[][]) {
    let newgrid: string[][] = [];
    for (let i = 0; i < grid.length; i++) {
        newgrid.push(getColumn(grid, i).split(''))
    }
    return newgrid;
}

function getMirroredRow(grid: string[][], except: number = 0) {
    for (let y = 0; y < grid.length - 1; y++ ) {
        if (y+1===except) continue
        if (getRow(grid, y) === getRow(grid, y + 1)) {
            const checklines = Math.min(y, grid.length - y - 2)
            let mirrorOK = true;
            for (let c = 1; c<=checklines; c++) {
                if (getRow(grid, y-c)  != getRow(grid, y+1+c) ) {
                    mirrorOK = false;
                    break;
                }
            }
            if (mirrorOK) {
                return y+1;
            }
        }
    }  
    return 0;
}

function displayGrid(grid: string[][]) {
    grid.forEach(line=> {
        console.log(line.join(''))
    })
}


