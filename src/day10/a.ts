import InputHelper from '../utils/input';
import Logger from '../utils/logger';
import { Direction } from '../utils/grid';

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
    connectors: Connector[]
}

const puzzle = 'Day 10A: Pipe Maze'
const input = new InputHelper();
const logger = new Logger(puzzle);

const rawInput = input.getRawInput();
const inputValues = rawInput.split('\n');

const pipeTypes: Pipe[] = [
    {symbol: 'S', connectors: []},
    {symbol: '|', connectors: [{x:  0, y:-1}, {x: 0, y: 1}]},
    {symbol: '-', connectors: [{x: -1, y: 0}, {x: 1, y: 0}]},
    {symbol: 'L', connectors: [{x:  0, y:-1}, {x: 1, y: 0}]},
    {symbol: 'J', connectors: [{x: -1, y: 0}, {x: 0, y:-1}]},
    {symbol: '7', connectors: [{x: -1, y: 0}, {x: 0, y: 1}]},
    {symbol: 'F', connectors: [{x:  1, y: 0}, {x: 0, y: 1}]},
]
const grid: Pipe[][] = inputValues.map(x=>x.split('').map(x=>pipeTypes.find(p=>p.symbol===x) || pipeTypes[0]));

let start: Tile = {
    x: rawInput.indexOf('S') % (inputValues[0].length + 1),
    y: Math.floor(rawInput.indexOf('S') / (inputValues[0].length + 1))
}
console.log(start)
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
let answer = 0;

do {
    answer++;
    let { tile, used } = getNext(currentTile, currentUsed);
    currentTile = {...tile}
    currentUsed = used
} while (currentTile.x!=start.x||currentTile.y!=start.y)



logger.end(answer / 2);

function getNext(tile: Tile, used: number) {
    const currentPipe: Pipe = grid[tile.y][tile.x]
    const use = used ? 0 : 1;
    const nextTile = {x: tile.x + currentPipe.connectors[use].x, y: tile.y + currentPipe.connectors[use].y}
    const nextPipe = grid[nextTile.y][nextTile.x]

    used = nextPipe.connectors.findIndex((c, index)=> {
        return (c.x === - (currentPipe.connectors[use].x) && c.y === - (currentPipe.connectors[use].y))
    }) 
    return {tile: nextTile, used}
}