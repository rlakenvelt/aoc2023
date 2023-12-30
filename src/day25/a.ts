import InputHelper from '../utils/input';
import Logger from '../utils/logger';
import { Graph} from '../utils/graph'

const puzzle = 'Day 25A: Snowverload'
const input = new InputHelper();
const logger = new Logger(puzzle);

const inputValues = input.getInput();

const graph = new Graph();


logger.start();

inputValues.forEach(line=> {
    const parts = line.match(/(\w+)/g) || ['']
    for (let p = 1; p<parts.length; p++) {
        graph.addEdge(parts[0], parts[p])
    }
})
let result = graph.kargerMinCut()
while (result.edges.length !== 3) {
    result = graph.kargerMinCut()
}

logger.end(result.vertices[0].joins.length*result.vertices[1].joins.length);








