import InputHelper from '../utils/input';
import Logger from '../utils/logger';
import { Direction } from '../utils/direction'

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
    constraint: string;
    path: string
    constructor(x: number, y: number, energyLoss: number) {
        this.x = x;
        this.y = y;
        this.energyLoss = energyLoss;
        this.totalEnergyLoss = Number.MAX_SAFE_INTEGER;
        this.path = '';
        this.constraint = ''
    }
}

const puzzle = 'Day 17A: Clumsy Crucible'
const input = new InputHelper();
const logger = new Logger(puzzle);
const inputValues = input.getInput().map(l=>l.split('').map(c=>parseInt(c)));

logger.start();

// const cityMap: Grid<CityBlock> = new Grid(inputValues[0].length, inputValues.length);
// const grid: CityBlock[][] = new Array(inputValues.length).fill([]).map(() => new Array(inputValues[0].length));
const nodes: CityBlock[] = []
const height = inputValues.length;
const width = inputValues[0].length;
for (let y = 0; y<inputValues.length; y++) {
    for (let x = 0; x<inputValues[0].length; x++) {
        const newBlock = new CityBlock(x, y, inputValues[y][x]);
        nodes.push(newBlock)
        // grid[y][x]=newBlock;  
    }
}
// cityMap.setGrid(grid)

logger.start();
const answer = dijkstra(nodes[0], nodes[nodes.length-1]);
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
        // if (loop>5) {
        //     break
        // }
        const cityBlock = queue.shift();
        if (!cityBlock) continue;
        if (cityBlock.x===finish.x&&cityBlock.y===finish.y) {
            console.log(cityBlock)
            return cityBlock.totalEnergyLoss; 
        }
        // console.log(cityBlock)
        directions.filter(d=>directionAllowed(d.symbol, cityBlock.path))
                  .forEach((direction: Direction) => {

            if (isOutsideGrid(cityBlock.x+direction.x, cityBlock.y+direction.y)) return;
            const x = cityBlock.x+direction.x
            const y = cityBlock.y+direction.y
            const c = constraint(cityBlock.path)
            let nextCityBlock = nodes.find(n=>n.x===x&&n.y===y&&n.constraint===c)
            if (!nextCityBlock) {
                nextCityBlock = new CityBlock(x, y, inputValues[y][x])
                nextCityBlock.constraint = c;
                nodes.push(nextCityBlock)
            }
            //cityMap.grid[cityBlock.y+direction.y][cityBlock.x+direction.x];
            const newEnergyLoss = cityBlock.totalEnergyLoss+nextCityBlock.energyLoss;

            if (nextCityBlock.totalEnergyLoss > newEnergyLoss) {
                nextCityBlock.totalEnergyLoss=newEnergyLoss;
                nextCityBlock.path = cityBlock.path+direction.symbol
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

function directionAllowed(direction:string, path: string) {
    const last = path.slice(-1)
    if (last==='E'&&direction==='W') return false
    if (last==='W'&&direction==='E') return false
    if (last==='N'&&direction==='S') return false
    if (last==='S'&&direction==='N') return false
    if (path.length<3) return true
    const lastPath = path.slice(-3).split('').reverse()
    return lastPath.some(p=>p!==direction)
}

function isOutsideGrid(x: number, y: number) {
    if (x<0) return true;
    if (x>width-1) return true;
    if (y<0) return true;
    if (y>height-1) return true;
    return false;
}   

function constraint(path: string) {
    const c = path.slice(-3).split('')
    const last = c[c.length-1]
    for (let i = c.length-1; i>=0; i--) {
        if (c[i]!==last) {
            return c.slice(i+1).join('')
        }
    }
    return c.join('')
}