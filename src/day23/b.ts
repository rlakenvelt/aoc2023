import InputHelper from '../utils/input';
import Logger from '../utils/logger';
import { Direction } from '../utils/direction'
import { Point } from '../utils/point'
import { Grid } from '../utils/grid'

interface Road {
    from: Point,
    to: Point,
    direction: string
    length: number
}
const puzzle = 'Day 23B: A Long Walk'
const input = new InputHelper();
const logger = new Logger(puzzle);

const inputValues = input.getInput().map(l=>l.split(''));
const map: Grid<string> = new Grid(inputValues[0].length, inputValues.length)
const crossroads: Set<number> = new Set()
const roads: Road[] = []

class Hike {
    path = new Set<number>()
    x: number
    y: number
    length: number = 0
    sizes:  number[] = []
    constructor(path?: Set<number>) {
      if (path)
         this.path = new Set(path)
      else
         this.path = new Set()  
      this.x = 0
      this.y = 0
    }
    addToPath(road: Road) {
      this.path.add(key(road.to.x, road.to.y))
      this.x = road.to.x
      this.y = road.to.y
      this.length+=road.length
      this.sizes.push(road.length)
    //   console.log(road.length, this.length)
    }
    visited(x: number, y:number) {
        // console.log(x, y, this.path.has(key(x, y)))
        return this.path.has(key(x, y))
    }
    clone() {
      const newHike = new Hike(this.path)
      newHike.x = this.x
      newHike.y = this.y
      newHike.length = this.length
      return newHike
    }
}
map.setGrid(inputValues)
const start: Point = {x: 1, y: 0}
const finish: Point = {x: map.width-2, y: map.height-1}

logger.start();

getCrossRoads()
// console.log(crossroads)
getRoads()
// console.log(roads)

// console.log(crossroads)

const result = bfs(roads, start, finish)
// console.log(result)
let answer = result.reduce((max, hike) => {
  return Math.max(max, hike.length)
}, 0);
logger.end(answer);

function bfs(roads: Road[], start: Point, finish: Point) {
    const firstHike = new Hike()
    firstHike.addToPath(roads[0])

    const hikes: Hike[] = [firstHike];
    const queue: Hike[] = [hikes[0]];
    let loop=0
    while (queue.length) {
        loop++
        // if (loop>2) break
      const hike = queue.shift();
      if (!hike) break
      const current = hike.clone()
    //   console.log(current)
      if (current.x !== finish.x || current.y !== finish.y) {
        // console.log('')
        // console.log(loop, hike)
        roads.filter(road=>road.from.x===hike.x && road.from.y===hike.y && !hike.visited(road.to.x, road.to.y))
             .forEach((road, index)=> {
                let tempHike = hike
                if (index>0) {
                  tempHike = current.clone()  
                  hikes.push(tempHike)
                }
                tempHike.addToPath(road)   
                queue.push(tempHike);

             })
      }

    }
    // console.log('HIKES', loop, hikes, finish.x, finish.y)
    return hikes.filter(h=> h.x===finish.x&&h.y===finish.y);
}


function key (x:number, y: number) {
    return y*1000+x
}
function point (key:number) {
    const x = key % 1000
    const y = (key - x) / 1000
    return {x, y}
}
function getCrossRoads() {
    crossroads.add(key(1,0))
    crossroads.add(key(map.width-2,map.height-1))
    for (let y = 0; y<map.height; y++) {
        for (let x = 0; x<map.width; x++) {
            if (map.node(x, y)==='#') continue
            const directions = Direction.directionsWithoutDiagonals()
                                        .filter(direction => {
                                            return map.isInsideGrid(x + direction.x, y + direction.y) && map.node(x + direction.x, y + direction.y)!=='#'
                                        })  
                                        .length  
            if (directions>2) {
                crossroads.add(key(x,y))
            }
        }    
    }    
}

function getRoads() {
    crossroads.forEach(c=> {
        const { x, y } = point(c)
        // const x = c % 1000
        // const y = (c - x) / 1000
        // console.log(c, x, y)
        directionsForNode(x, y)
            .forEach(d=> {
                const road: Road = {from: point(c), to: {x: 0, y: 0}, direction: d.symbol, length: 1}
                let tx = x + d.x
                let ty = y + d.y  
                let last = key(x, y)      
                while (!crossroads.has(key(tx, ty))) {
                    road.length++
                    const direction = directionsForNode(tx, ty).filter(td=> {
                        return key(tx + td.x, ty + td.y)!==last
                    })[0]
                    last = key(tx, ty)      
                    tx+=direction.x
                    ty+=direction.y
                } 
                road.to = { x: tx, y: ty}
                roads.push(road)
                // console.log('ROAD', road)    
        })
    })
}

function directionsForNode(x: number, y: number) {
    return Direction.directionsWithoutDiagonals()
                    .filter(direction => {
                        return map.isInsideGrid(x + direction.x, y + direction.y) && map.node(x + direction.x, y + direction.y)!=='#'
                    })      
}


