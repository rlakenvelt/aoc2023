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
            (energized.grid[this.posistion.y][this.posistion.x] !== '#' || contraption.grid[this.posistion.y][this.posistion.x] !== '.')) {
            this.path.push(this.posistion)
            energized.grid[this.posistion.y][this.posistion.x] = '#'
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
    display() {
        console.log('D:', this.direction, 'P:', this.posistion, this.path.length, this.done)
        // this.path.forEach(p=> {
        //     console.log('   ', p)
        // })
    }
}


const puzzle = 'Day 16A: The Floor Will Be Lava'
const input = new InputHelper();
const logger = new Logger(puzzle);

const beams: Beam[] = [new Beam(-1,0)]

const inputValues = input.getInput().map(l=>l.split(''));
const contraption: Grid<string> = new Grid(inputValues[0].length, inputValues.length)
const energized: Grid<string> = new Grid(inputValues[0].length, inputValues.length, '.')


contraption.setGrid(inputValues)

contraption.display()
logger.start();


do {
    const beam = beams.filter(beam=> beam.done===false)[0]
    if (!beam) break;
    beam.move()
} while (true)

beams.forEach(b=>{
    b.display()
})
energized.display()

let answer = energized.grid.flat().join('').match(/#/g)?.length;



logger.end(answer);

function activeBeams(): number {
    return beams.filter(beam=> beam.done===false).length
}

