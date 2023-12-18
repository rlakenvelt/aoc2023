import InputHelper from '../utils/input';
import Logger from '../utils/logger';
import { Direction } from '../utils/direction';
import { Grid } from '../utils/grid';
import { Point } from '../utils/point';

class Beam {
    posistion: Point
    direction: string
    path: Point[]
    done: boolean
    constructor(x: number, y:number, direction?: string) {
        if (!direction) direction='E'
        this.direction = direction
        this.posistion = new Point(x,y)
        this.path = []
        this.done=false;
    }
    move() {
        const currentDirection = Direction.directionsWithoutDiagonals().filter(d=>d.symbol===this.direction)[0]
        this.posistion = new Point(this.posistion.x + currentDirection.x, this.posistion.y + currentDirection.y)

        if (contraption.isInsideGrid(this.posistion.x, this.posistion.y) &&
            energized.filter(e=>e.from=== this.direction&&e.tile.x===this.posistion.x&&e.tile.y===this.posistion.y).length===0) {
            this.path.push(this.posistion)
            energized.push({from: this.direction, tile: this.posistion})
        } else {
            this.done = true;
            return
        }
        switch (contraption.grid[this.posistion.y][this.posistion.x]) {
            case '/':
                const n1 = Direction.directionsWithoutDiagonals().filter(d=>d.x===-currentDirection.y&&d.y===-currentDirection.x)[0]
                this.direction = n1.symbol || this.direction
                break;
            case '\\':
                const n2 = Direction.directionsWithoutDiagonals().filter(d=>d.x===currentDirection.y&&d.y===currentDirection.x)[0]
                this.direction = n2.symbol || this.direction                
                break;
            case '|':
                if (this.direction==='S'||this.direction==='N') break
                this.direction = 'S'
                beams.push(new Beam(this.posistion.x, this.posistion.y, "N"))
                break;
            case '-':
                if (this.direction==='W'||this.direction==='E') break
                this.direction = 'E'
                beams.push(new Beam(this.posistion.x, this.posistion.y, 'W'))
                break;
            }
    }
}


const puzzle = 'Day 16A: The Floor Will Be Lava'
const input = new InputHelper();
const logger = new Logger(puzzle);

const beams: Beam[] = [new Beam(-1,0)]

const inputValues = input.getInput().map(l=>l.split(''));
const contraption: Grid<string> = new Grid(inputValues[0].length, inputValues.length)
const energized: {from: string, tile: Point}[] = [];

contraption.setGrid(inputValues)

logger.start();

do {
    const beam = beams.filter(beam=> beam.done===false)[0]
    if (!beam) break;
    beam.move()
} while (true)

energized.forEach(e=> {
    contraption.grid[e.tile.y][e.tile.x] = '#'
})
let answer = contraption.grid.flat().join('').match(/#/g)?.length;

logger.end(answer);

