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
    display: string;
    connectors: Connector[];
}

const puzzle = 'Day 10B: Pipe Maze'
const input = new InputHelper();
const logger = new Logger(puzzle);

const rawInput = input.getRawInput();
const inputValues = rawInput.split('\n');

const pipeTypes: Pipe[] = [
    {symbol: 'S', display: 'S', connectors: []},
    {symbol: '.', display: '.', connectors: []},
    {symbol: '|', display: '\u2503', connectors: [{x:  0, y:-1}, {x: 0, y: 1}]},
    {symbol: '-', display: '\u2501', connectors: [{x: -1, y: 0}, {x: 1, y: 0}]},
    {symbol: 'L', display: '\u2517', connectors: [{x:  0, y:-1}, {x: 1, y: 0}]},
    {symbol: 'J', display: '\u251B', connectors: [{x: -1, y: 0}, {x: 0, y:-1}]},
    {symbol: '7', display: '\u2513', connectors: [{x: -1, y: 0}, {x: 0, y: 1}]},
    {symbol: 'F', display: '\u250F', connectors: [{x:  1, y: 0}, {x: 0, y: 1}]},
]
const grid: Pipe[][] = inputValues.map(x=>x.split('').map(x=>pipeTypes.find(p=>p.symbol===x) || pipeTypes[0]));
const displaygrid: string[][] = inputValues.map(x=>x.split('').map(()=>'O'));

let start: Tile = {
    x: rawInput.indexOf('S') % (inputValues[0].length + 1),
    y: Math.floor(rawInput.indexOf('S') / (inputValues[0].length + 1))
}
console.log(start)
const startPipe: Pipe = {
    symbol: 'S',
    display: 'S',
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

display('O');


logger.end(answer / 2);

function getNext(tile: Tile, used: number) {
    const currentPipe: Pipe = grid[tile.y][tile.x]
    displaygrid[tile.y][tile.x] = currentPipe.display

    const use = used ? 0 : 1;
    const nextTile = {x: tile.x + currentPipe.connectors[use].x, y: tile.y + currentPipe.connectors[use].y}
    const nextPipe = grid[nextTile.y][nextTile.x]

    used = nextPipe.connectors.findIndex((c, index)=> {
        return (c.x === - (currentPipe.connectors[use].x) && c.y === - (currentPipe.connectors[use].y))
    }) 
    return {tile: nextTile, used}
}

function display(hightlight?: string) {
    displaygrid.forEach(row => {
        let temp = row.join('');
        if (hightlight) {
            const regex = new RegExp(hightlight, 'g');
            temp = temp.replace(regex, highlight(hightlight));
        }
        console.log(temp);
    })
} 

function highlight(t: string):string {
    return `\x1b[1m\x1b[31m${t}\x1b[0m`;
}  