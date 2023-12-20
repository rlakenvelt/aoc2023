import InputHelper from '../utils/input';
import Logger from '../utils/logger';

const puzzle = 'Day 19B: Aplenty'
const input = new InputHelper();
const logger = new Logger(puzzle);

interface Rule {
    variable: string
    operator: string
    value: number
    next: string
}

class Workflow {
    name: string
    rules: Rule[];

    constructor(name: string) {
        this.name = name
        this.rules = []
    }

    addRule(variable: string, operator: string, value: number, next: string) {
        if (next)
            this.rules.push({variable, operator, value, next})
        else
            this.rules.push({variable: '', operator: '', value: 0, next: variable})
    }
}

logger.start();

const inputParts = input.getInput('\n\n');

const workflows = inputParts[0].split('\n').map(l=> {
    let values = l.split('{')
    values[1] = values[1].slice(0, -1);
    const operation = values[1].split(',')

    const newWorkflow = new Workflow(values[0])
    operation.forEach(o=> {
        const parts = o.split(/[<>:]/)
        const operators = o.match(/[<>:]/g) || []
        newWorkflow.addRule(parts[0] || '', operators[0] || '', parseInt(parts[1]), parts[2])
    })
    return newWorkflow
})


workflows.filter(w=>w.rules.some(r=>r.next==='A')) 
         .forEach(w=>console.log(w))


// logger.end(answer);

