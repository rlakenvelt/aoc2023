import InputHelper from '../utils/input';
import Logger from '../utils/logger';

const puzzle = 'Day 15B: Lens Library'
const input = new InputHelper();
const logger = new Logger(puzzle);

interface Lens {
    label: string,
    focal: number
}
class Box {
    index: number
    lenses: Lens[]
    constructor(index: number) {
        this.index = index;
        this.lenses = [];
    }
    replaceLens(lens: Lens) {
        const index = this.lenses.findIndex(l=>l.label===lens.label)
        if (index < 0)
            this.lenses.push(lens)
        else
            this.lenses[index] = lens;
    }
    removeLens(label: string) {
        this.lenses=this.lenses.filter(l=>l.label!==label)
    }
    power():number {
        return this.lenses.reduce((total, lens, lensindex) => {
            return total+=(this.index + 1) * (lensindex + 1) * lens.focal;
        }, 0)
    }
}

logger.start();

const instructions = input.getInput(',');
const boxes: Box[] = [];
for (let i = 0; i<256; i++) {
    boxes.push(new Box(i))
}

instructions.forEach((instruction, index)=> {
    const lens = (instruction.match(/(\w{1,})/) || '')[0]
    const operation = (instruction.match(/([=-])/g) || '')[0]
    const box = hash(lens)
    if (operation==='=') {
        const focal = parseInt(instruction.split('=')[1])
        boxes[box].replaceLens({label: lens, focal: focal})
    } else {
        boxes[box].removeLens(lens)
    }
})
let answer = boxes.reduce((total, box) => {
    total+=box.power()
    return total
}, 0);

logger.end(answer);

function hash(input: string): number {
    let result = 0;
    for (let i = 0; i < input.length; i++) {
       result+=input.charCodeAt(i);
       result*=17
       result = result % 256
    }
    return result
}
