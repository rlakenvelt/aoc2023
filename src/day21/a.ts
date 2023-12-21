import InputHelper from '../utils/input';
import Logger from '../utils/logger';
import { Grid } from '../utils/grid'
import { Direction } from '../utils/direction';
import { Point } from '../utils/point'

const puzzle = 'Day 21A: Step Counter'
const input = new InputHelper();
const logger = new Logger(puzzle);

const inputValues = input.getInput().map(l=> l.split(''));
const garden: Grid<string> = new Grid(inputValues[0].length,inputValues.length)
garden.setGrid(inputValues)

logger.start();
let tiles: Point[] = [];
const start: Point = {x: garden.grid.flat().indexOf('S') % garden.grid.length, y: Math.floor(garden.grid.flat().indexOf('S') / garden.grid.length)}

tiles.push(start)
for (let steps = 1; steps <= 64; steps++) {
    let newTiles: Point[] = []
    tiles.forEach(tile=> {
        Direction.directionsWithoutDiagonals().forEach(direction=> {
            const x = tile.x+direction.x
            const y = tile.y+direction.y
            if (garden.isInsideGrid(x, y) && garden.grid[y][x]!=='#') {
                if (!newTiles.find(tile=>tile.x===x&&tile.y===y))
                  newTiles.push({x:tile.x+direction.x, y:tile.y+direction.y})
            }
        })
    }) 
    tiles=uniqueTiles(newTiles)
}

logger.end(tiles.length);

function uniqueTiles(tiles: Point[]) {
    return tiles.filter((value, index, self) => self.indexOf(value) === index)
}

