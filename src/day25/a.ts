import InputHelper from '../utils/input';
import Logger from '../utils/logger';

class Component {
    name : string
    connections: Set<string>
    constructor(name: string) {
        this.name = name
        this.connections = new Set<string>();
    }
    setConnection(name: string) {
        this.connections.add(name)
    }
}
const puzzle = 'Day 25A'
const input = new InputHelper();
const logger = new Logger(puzzle);

const inputValues = input.getInput();
const components: Map<string, Component> = new Map<string, Component>();

inputValues.forEach(line=> {
    const parts = line.match(/(\w+)/g) || ['']
    parts.forEach((part, index) =>{
        if (!components.has(part)) {
            components.set(part, new Component(part))
        }
    })
    const c1 = components.get(parts[0])
    for (let p = 1; p<parts.length; p++) {
        const c2 = components.get(parts[p])
        if (c1&&c2) {
            c1?.setConnection(c2.name)
            c2?.setConnection(c1.name)
        }
    }
})
// console.log(components)
logger.start();
let answer = 0;



logger.end(answer);


