import InputHelper from '../utils/input';
import Logger from '../utils/logger';
import { Direction } from '../utils/direction';

interface Tile {
    x: number;
    y: number;    
}
interface Connector {
    x: number;
    y: number;    
}
interface Pipe {
    symbol: string;
    connectors: Connector[];
}

const puzzle = 'Day 10B: Pipe Maze'
const input = new InputHelper();
const logger = new Logger(puzzle);

const rawInput = input.getRawInput();
const inputValues = rawInput.split('\n');

const pipeTypes: Pipe[] = [
    {symbol: 'S', connectors: []},
    {symbol: '.', connectors: []},
    {symbol: '|', connectors: [{x:  0, y:-1}, {x: 0, y: 1}]},
    {symbol: '-', connectors: [{x: -1, y: 0}, {x: 1, y: 0}]},
    {symbol: 'L', connectors: [{x:  0, y:-1}, {x: 1, y: 0}]},
    {symbol: 'J', connectors: [{x: -1, y: 0}, {x: 0, y:-1}]},
    {symbol: '7', connectors: [{x: -1, y: 0}, {x: 0, y: 1}]},
    {symbol: 'F', connectors: [{x:  1, y: 0}, {x: 0, y: 1}]},
]
const grid: Pipe[][] = inputValues.map(x=>x.split('').map(x=>pipeTypes.find(p=>p.symbol===x) || pipeTypes[0]));
const displaygrid: string[][] = inputValues.map(x=>x.split('').map(()=>'O'));

let start: Tile = {
    x: rawInput.indexOf('S') % (inputValues[0].length + 1),
    y: Math.floor(rawInput.indexOf('S') / (inputValues[0].length + 1))
}
const startPipe: Pipe = {
    symbol: 'S',
    connectors: []
} 
const directions = Direction.directionsWithoutDiagonals();
const connectors: Connector[] = [];

directions.forEach(direction=> {
    if (start.x + direction.x >=0 && start.y + direction.y >= 0) {
        const neighbourPipe = grid[start.y + direction.y][start.x + direction.x]
        if (neighbourPipe.connectors.some(pipe=> {
            return pipe.x===-direction.x && pipe.y===-direction.y
        })) connectors.push({x: direction.x, y: direction.y})
    }
})
pipeTypes[0].connectors = connectors;


let currentTile = {...start}
let currentUsed = 0
logger.start();

do {
    let { tile, used } = getNext(currentTile, currentUsed);
    currentTile = {...tile}
    currentUsed = used
} while (currentTile.x!=start.x||currentTile.y!=start.y)


let answer = 0;

displaygrid.forEach((row, y)=> {
    let inside = false;
    let direction = 0;
    row.forEach((col, x) => {
        if (col==='S') {
            const pipeS = pipeTypes[0]
            pipeTypes.forEach(p=>{
                if (p.symbol!=='.' &&
                     p.symbol!=='S' &&
                    p.connectors[0].x === pipeS.connectors[0].x &&
                    p.connectors[0].y === pipeS.connectors[0].y &&
                    p.connectors[1].x === pipeS.connectors[1].x &&
                    p.connectors[1].y === pipeS.connectors[1].y) {
                        col=p.symbol
                        }                     
            })
        }
        switch(col) {
            case 'F':
                direction=1;
                break;
            case '|':
                inside=!inside
                break;
            case '-':
                break;
            case 'L':
                direction=-1;
                break;                                   
            case 'J':
                if (direction===1) inside=!inside
                break;
            case '7':
                if (direction===-1) inside=!inside
                break;  
            case 'O':
                if (inside) {
                    displaygrid[y][x] = 'I'
                    answer++
                } 
                break;                                                 
          }        

    })
})

logger.end(answer);

function getNext(tile: Tile, used: number) {
    const currentPipe: Pipe = grid[tile.y][tile.x]
    displaygrid[tile.y][tile.x] = currentPipe.symbol

    const use = used ? 0 : 1;
    const nextTile = {x: tile.x + currentPipe.connectors[use].x, y: tile.y + currentPipe.connectors[use].y}
    const nextPipe = grid[nextTile.y][nextTile.x]

    used = nextPipe.connectors.findIndex((c, index)=> {
        return (c.x === - (currentPipe.connectors[use].x) && c.y === - (currentPipe.connectors[use].y))
    }) 
    return {tile: nextTile, used}
}
