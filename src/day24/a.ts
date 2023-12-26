import InputHelper from '../utils/input';
import Logger from '../utils/logger';
import Common from '../utils/common';

class Hailstone {
    x: number
    y: number
    z: number
    vx: number
    vy: number
    vz: number
    constructor(x:  number, y:  number, z:  number, vx:  number, vy:  number, vz:  number) {
        this.x = x
        this.y = y
        this.z = z
        this.vx = vx
        this.vy = vy
        this.vz= vz
    }
}
let MIN = 200000000000000
let MAX = 400000000000000
if (Common.testMode()) {
    MIN = 7
    MAX = 27
}


const puzzle = 'Day 24A: Never Tell Me The Odds'
const input = new InputHelper();
const logger = new Logger(puzzle);

const inputValues = input.getInput();
const hailstones: Hailstone[] = []
inputValues.forEach(line=> {
    const nbrs = line.match(/([-\d]+)/g)?.map(c=>parseInt(c)) || [0,0,0,0,0,0]
    hailstones.push(new Hailstone(nbrs[0], nbrs[1], nbrs[2], nbrs[3], nbrs[4], nbrs[5]))
})

logger.start();
let answer = 0;

for (let i1 = 0; i1 < hailstones.length-1; i1++) {
    for (let i2 = i1+1; i2 < hailstones.length; i2++) {
        const intersection = findIntersection(hailstones[i1], hailstones[i2])
        if (!intersection)      continue // Parallel

        if (intersection.x<MIN) continue // Outside test area
        if (intersection.x>MAX) continue // Outside test area
        if (intersection.y<MIN) continue // Outside test area
        if (intersection.y>MAX) continue // Outside test area

        if (hailstones[i1].vx>0&&intersection.x<hailstones[i1].x) continue // Intersection in the past
        if (hailstones[i1].vx<0&&intersection.x>hailstones[i1].x) continue // Intersection in the past
        if (hailstones[i1].vy>0&&intersection.y<hailstones[i1].y) continue // Intersection in the past
        if (hailstones[i1].vy<0&&intersection.y>hailstones[i1].y) continue // Intersection in the past

        if (hailstones[i2].vx>0&&intersection.x<hailstones[i2].x) continue // Intersection in the past
        if (hailstones[i2].vx<0&&intersection.x>hailstones[i2].x) continue // Intersection in the past
        if (hailstones[i2].vy>0&&intersection.y<hailstones[i2].y) continue // Intersection in the past
        if (hailstones[i2].vy<0&&intersection.y>hailstones[i2].y) continue // Intersection in the past
        answer++
    }    
}



logger.end(answer);

function findIntersection(hailstone1: Hailstone, hailstone2: Hailstone) {
    const crossProduct = hailstone1.vx * hailstone2.vy - hailstone1.vy * hailstone2.vx;
    if (crossProduct === 0) {
        return null; // Parallel
    }

    const determinant = (hailstone2.x - hailstone1.x) * hailstone2.vy - (hailstone2.y - hailstone1.y) * hailstone2.vx;
    const t1 = determinant / crossProduct;

    const intersectionX = hailstone1.x + hailstone1.vx * t1;
    const intersectionY = hailstone1.y + hailstone1.vy * t1;

    return { x: intersectionX, y: intersectionY };
}

