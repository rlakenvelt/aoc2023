import InputHelper from '../utils/input';
import Logger from '../utils/logger';
import { Direction } from '../utils/direction'
import { Point } from '../utils/point'
import { Grid } from '../utils/grid'

const puzzle = 'Day 23A: A Long Walk'
const input = new InputHelper();
const logger = new Logger(puzzle);

const inputValues = input.getInput().map(l=>l.split(''));
const map: Grid<string> = new Grid(inputValues[0].length, inputValues.length)

class Hike {
    path: Point[]
    x: number
    y: number
    constructor(path: Point[]) {
      this.path = [...path]
      this.x = path[path.length-1].x
      this.y = path[path.length-1].y
    }
    addToPath(x: number, y:number) {
      this.path.push({x, y})
      this.x = x
      this.y = y
    }
    visited(x: number, y:number) {
      const found = this.path.find(n=> n.x === x && n.y === y)
      return (found !== undefined);
    }
    clone() {
      return new Hike(this.path)
    }
}
map.setGrid(inputValues)

logger.start();

const result = bfs(map, {x: 1, y:0}, {x: inputValues[0].length-2, y:inputValues.length-1})
let answer = result.reduce((max, hike) => {
  return Math.max(max, hike.path.length-1)
}, 0);
logger.end(answer);

function bfs(grid: Grid<string>, start: Point, finish: Point) {
    const hikes: Hike[] = [new Hike([start])];
    const queue: Hike[] = [hikes[0]];
    while (queue.length) {
      const hike = queue.shift();
      if (!hike) break
      const current = hike.clone()
      if (current.x !== finish.x || current.y !== finish.y) {
        Direction.directionsWithoutDiagonals()
                .filter(direction => {
                    const x = current.x + direction.x
                    const y = current.y + direction.y
                    switch (grid.node(current.x, current.y)) {
                      case '>':
                        if (direction.symbol!='E') return false
                        break
                      case '<':
                        if (direction.symbol!='W') return false
                        break
                      case '^':
                        if (direction.symbol!='N') return false
                        break
                      case 'v':
                        if (direction.symbol!='S') return false
                        break
                    }
                    return !current.visited(x, y) && grid.isInsideGrid(x, y) && grid.node(x,y)!=='#'
                  })
                  .forEach((direction, index) => {   
                    let tempHike = hike
                    if (index>0) {
                      tempHike = current.clone()  
                      hikes.push(tempHike)
                    }
                    tempHike.addToPath(current.x + direction.x, current.y + direction.y)          
                    queue.push(tempHike);
                })
      }

    }
    return hikes.filter(h=> h.x===finish.x&&h.y===finish.y);
  }

