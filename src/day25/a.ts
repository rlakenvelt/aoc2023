import InputHelper from '../utils/input';
import Logger from '../utils/logger';
import { Graph} from '../utils/graph'

const puzzle = 'Day 25A: Snowverload'
const input = new InputHelper();
const logger = new Logger(puzzle);

const inputValues = input.getInput();

const graph = new Graph();

inputValues.forEach(line=> {
    const parts = line.match(/(\w+)/g) || ['']
    for (let p = 1; p<parts.length; p++) {
        graph.addEdge(parts[0], parts[p])
    }
})
logger.start();

graph.display()







