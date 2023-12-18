import InputHelper from '../utils/input';
import Logger from '../utils/logger';
import { Grid, Direction } from '../utils/grid'

class EnergyLoss {
    path: string
    value: number
    constructor(value: number, path?: string) {
        this.value = value
        this.path = path ? path : ''
    }
    validDirection(direction?: string) {
        if (!direction) return true
        if (this.path.length<3) return true
        return this.path.split('').every(c => c === this.path[0]) ? this.path[0]!==direction : true
    }
}
class CityBlock {
    x: number;
    y: number;
    energyLoss: number;
    totalEnergyLoss: number;
    path: string[]
    constructor(x: number, y: number, energyLoss: number) {
        this.x = x;
        this.y = y;
        this.energyLoss = energyLoss;
        this.totalEnergyLoss = Number.MAX_SAFE_INTEGER;
        this.path = [];
    }
}

const puzzle = 'Day 17A: Clumsy Crucible'
const input = new InputHelper();
const logger = new Logger(puzzle);
const inputValues = input.getInput().map(l=>l.split('').map(c=>parseInt(c)));

logger.start();

const cityMap: Grid<CityBlock> = new Grid(inputValues[0].length, inputValues.length);
const grid: CityBlock[][] = new Array(inputValues.length).fill([]).map(() => new Array(inputValues[0].length));
for (let y = 0; y<inputValues.length; y++) {
    for (let x = 0; x<inputValues[0].length; x++) {
        const newBlock = new CityBlock(x, y, inputValues[y][x]);
        grid[y][x]=newBlock;  
    }
}
cityMap.setGrid(grid)

logger.start();
const answer = dijkstra(cityMap.grid[0][0], cityMap.grid[cityMap.height-1][cityMap.width-1]);
logger.end(answer);


function dijkstra(start: CityBlock, finish: CityBlock) {
    const queue: CityBlock[] = []; 
    const directions = Direction.directionsWithoutDiagonals();

    start.energyLoss=0;
    start.totalEnergyLoss=0;
    queue.push(start);
    let loop = 0;
    while (queue.length > 0) {
        loop++
        // if (loop>2) break
        const cityBlock = queue.shift();
        if (!cityBlock) continue;
        if (cityBlock===finish) {
            console.log(cityBlock)
            return cityBlock.totalEnergyLoss; 
        }
        console.log(cityBlock)
        directions.filter(d=>directionAllowed(d.symbol, cityBlock.path))
                  .forEach((direction: Direction) => {

            if (cityMap.isOutsideGrid(cityBlock.x+direction.x, cityBlock.y+direction.y)) return;
            const nextCityBlock = cityMap.grid[cityBlock.y+direction.y][cityBlock.x+direction.x];
            const newEnergyLoss = cityBlock.totalEnergyLoss+nextCityBlock.energyLoss;

            if (nextCityBlock.totalEnergyLoss > newEnergyLoss) {
                nextCityBlock.totalEnergyLoss=newEnergyLoss;
                nextCityBlock.path = [...cityBlock.path]
                nextCityBlock.path.push(direction.symbol)
                const cityBlockOnQueue=queue.find(foundCave=>foundCave===nextCityBlock);
                if (!cityBlockOnQueue) {
                    queue.push(nextCityBlock);
                }
                queue.sort((a, b) => a.totalEnergyLoss-b.totalEnergyLoss);
            }
        });
    } 
    return -1;
} 

function directionAllowed(direction:string, path: string[]) {
    if (path.length<3) return true
    const lastPath = path.slice(-3).reverse()
    return lastPath.some(p=>p!==direction)
}
