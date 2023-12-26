import InputHelper from '../utils/input';
import Logger from '../utils/logger';

class Cube {
    x: number
    y: number
    z: number
    constructor(x: number, y:number, z: number) {
        this.x=x
        this.y=y
        this.z=z
    }    
}

class Brick {
    minX: number
    maxX: number
    minY: number
    maxY: number
    minZ: number
    maxZ: number
    constructor(corner1: Cube, corner2: Cube) {
        this.minX = Math.min(corner1.x, corner2.x)
        this.maxX = Math.max(corner1.x, corner2.x)
        this.minY = Math.min(corner1.y, corner2.y)
        this.maxY = Math.max(corner1.y, corner2.y)
        this.minZ = Math.min(corner1.z, corner2.z)
        this.maxZ = Math.max(corner1.z, corner2.z)
    }
    get atFloor() {
        return this.minZ===1;
    }
    overlaps(brick: Brick): boolean {
        if (this.minX > brick.maxX|| this.maxX<brick.minX) return false
        if (this.minY > brick.maxY|| this.maxY<brick.minY) return false
        return true
    }
    supports(brick: Brick): boolean {
        if (this.maxZ !== brick.minZ-1) return false
        return this.overlaps(brick)
    }
    fall(distance: number) {
        this.minZ-=distance
        this.maxZ-=distance
    }
}

const puzzle = 'Day 22A: Sand Slabs'
const input = new InputHelper();
const logger = new Logger(puzzle);

const inputValues = input.getInput();

let bricks: Brick[] = []
let i = 0;
inputValues.forEach(line=> {
    const parts = line.split('~')
    const c1 = createCube(parts[0])
    const c2 = createCube(parts[1])
    i++
    if (c1&&c2) bricks.push(new Brick(c1, c2))
})
logger.start();

// Fall down
sortPile()
const pile = [...bricks]
while (pile.length) {
    const brick = pile.shift()
    if (!brick) break
    const lowerBricks = bricks.filter(b=>b.maxZ < brick.minZ&&b.overlaps(brick)).sort((a, b) => b.maxZ-a.maxZ)
    if (lowerBricks.length)
        brick.fall(brick.minZ-lowerBricks[0].maxZ-1)
    else
        brick.fall(brick.minZ-1)
}
sortPile()

const saveBricks: Brick[] = [];
bricks.forEach(brick=> {
    const similarBricks = bricks.filter(b=>b.maxZ===brick.maxZ&&b!==brick)
    const bricksToCheck = bricks.filter(b=>b.minZ===brick.maxZ+1)
    if (bricksToCheck.every(c=> {   
        return similarBricks.some(s=>s.supports(c))
    }))  saveBricks.push(brick)
})

logger.end(saveBricks.length);

function createCube(coordinate: string) {
    const values = coordinate.match(/(\d+)/g)?.map(c=>parseInt(c)) 
    if (values)
       return new Cube(values[0], values[1], values[2])
    return undefined
}

function sortPile() {
    bricks.sort((a, b) => a.minZ-b.minZ)
}



