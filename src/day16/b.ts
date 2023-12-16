import InputHelper from '../utils/input';
import Logger from '../utils/logger';
import { Grid, Direction, Point } from '../utils/grid';

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

interface Touched {
    from: string,
    tile: Point
}


const puzzle = 'Day 16B: The Floor Will Be Lava'
const input = new InputHelper();
const logger = new Logger(puzzle);

let beams: Beam[] = []

const inputValues = input.getInput().map(l=>l.split(''));
const contraption: Grid<string> = new Grid(inputValues[0].length, inputValues.length)
let energized: Touched[] = [];

contraption.setGrid(inputValues)

logger.start();
let answer=0;

for (let x = 0; x<contraption.width; x++) {
    answer = Math.max(answer, processbeams(x, -1, 'S'))
    answer = Math.max(answer, processbeams(x, contraption.height+1, 'N'))
}
for (let y = 0; y<contraption.height; y++) {
    answer = Math.max(answer, processbeams(-1, y, 'E'))
    answer = Math.max(answer, processbeams(contraption.width+1, y, 'W'))
}


logger.end(answer);

function uniqueTiles(tiles: Touched[]) {
      return tiles.map(t => t.tile.x*1000+t.tile.y)
                  .filter((value, index, self) => self.indexOf(value) === index).length
}

function processbeams(x: number, y: number, direction:string) {
    beams = [new Beam(x,y,direction)]
    energized = [];
    do {
        const beam = beams.filter(beam=> beam.done===false)[0]
        if (!beam) break;
        beam.move()
    } while (true)
    const result = uniqueTiles(energized)
    return result
}


