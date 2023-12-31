import InputHelper from '../utils/input';
import Logger from '../utils/logger';
import { Direction } from '../utils/direction'

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
        this.totalEnergyLoss = Infinity;
        this.path = '';
        this.constraint = ''
    }
}

const puzzle = 'Day 17A: Clumsy Crucible'
const input = new InputHelper();
const logger = new Logger(puzzle);
const inputValues = input.getInput().map(l=>l.split('').map(c=>parseInt(c)));

logger.start();

const nodes: CityBlock[] = []
const height = inputValues.length;
const width = inputValues[0].length;
for (let y = 0; y<inputValues.length; y++) {
    for (let x = 0; x<inputValues[0].length; x++) {
        const newBlock = new CityBlock(x, y, inputValues[y][x]);
        nodes.push(newBlock)
    }
}
logger.start();
const answer = dijkstra(nodes[0], nodes[nodes.length-1]);
logger.end(answer);

function dijkstra(start: CityBlock, finish: CityBlock) {
    const queue: CityBlock[] = []; 
    const directions = Direction.directionsWithoutDiagonals();

    start.energyLoss=0;
    start.totalEnergyLoss=0;
    queue.push(start);
    while (queue.length > 0) {
        const cityBlock = queue.shift();
        if (!cityBlock) continue;
        if (cityBlock.x===finish.x&&cityBlock.y===finish.y) {
            return cityBlock.totalEnergyLoss; 
        }
        directions.filter(d=>directionAllowed(d.symbol, cityBlock.path))
                  .forEach((direction: Direction) => {

            if (isOutsideGrid(cityBlock.x+direction.x, cityBlock.y+direction.y)) return;
            const x = cityBlock.x+direction.x
            const y = cityBlock.y+direction.y
            const c = constraint(cityBlock.path + direction.symbol)
            let nextCityBlock = nodes.find(n=>n.x===x&&n.y===y&&n.constraint===c)
            if (!nextCityBlock) {
                nextCityBlock = new CityBlock(x, y, inputValues[y][x])
                nextCityBlock.constraint = c;
                nodes.push(nextCityBlock)
            }
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
    const m = path.match(/(.)\1*$/)
    return m ? m[0] : ''
}