import { Direction } from '../utils/direction';
import { Grid } from '../utils/grid';
import InputHelper from '../utils/input';
import Logger from '../utils/logger';

interface DigCommand {
    direction: string
    meters: number
}

const puzzle = 'Day 18B: Lavaduct Lagoon'
const input = new InputHelper();
const logger = new Logger(puzzle);

const inputValues = input.getInput();
logger.start();

const digCommands: DigCommand[] = inputValues.map(command=> {
    const parts = command.split(' ')
    const newCommand: DigCommand = {direction: parts[2].substring(7,8), meters: parseInt(parts[2].substring(2,7), 16)}
    switch (newCommand.direction) {
        case '0':
            newCommand.direction = 'E'
            break;
        case '2':
            newCommand.direction = 'W'
            break;
        case '3':
            newCommand.direction = 'N'
            break;
        case '1':
            newCommand.direction = 'S'
            break;            
    }
    return newCommand
})


// let minX = 0
// let maxX = 0
// let minY = 0
// let maxY = 0
// let position = {x:0, y:0}
// digCommands.forEach(c=> {
//     const direction = Direction.directionsWithoutDiagonals().find(d=>d.symbol===c.direction)
//     if (direction) {
//         position.x+=direction.x*c.meters
//         position.y+=direction.y*c.meters
//         minX = Math.min(minX, position.x)
//         maxX = Math.max(maxX, position.x)
//         minY = Math.min(minY, position.y)
//         maxY = Math.max(maxY, position.y)
//     }

// })
// const shiftX = Math.abs(minX)
// const shiftY = Math.abs(minY)
// const map = new Grid(maxX+1+shiftX, maxY+1+shiftY, '.')

// position = {x:shiftX, y:shiftY}
// map.grid[position.y][position.x]='#'
// digCommands.forEach(c=> {
//     const direction = Direction.directionsWithoutDiagonals().find(d=>d.symbol===c.direction)
//     if (direction) {
//         for (let i = 1; i<=c.meters; i++) {
//             position.x+=direction.x
//             position.y+=direction.y
//             map.grid[position.y][position.x]='#'
//         }
//     }
// })
// map.floodFill(shiftX+1,shiftY+1,'#')
// let answer = map.grid.reduce((count, line) => {
//      const c = line.join('').match(/#/g)?.length || 0
//     count+=c
//     return count
// }, 0);

// logger.end(answer);

