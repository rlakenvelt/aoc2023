import InputHelper from '../utils/input';
import Logger from '../utils/logger';

const puzzle = 'Day 19A'
const input = new InputHelper();
const logger = new Logger(puzzle);

interface Rule {
    variable: string
    operator: string
    value: number
    next: string
}
class Part {
    x: number
    m: number
    a: number
    s: number
    next?: string
    accepted: boolean
    constructor(x: number, m: number, a: number, s: number) {
        this.x = x;
        this.m = m;
        this.a = a;
        this.s = s;
        this.next = 'in'
        this.accepted = false
    }
    rating(category: string): number {
        switch (category) {
            case 'x':
                return this.x
                break
            case 'm':
                return this.m   
                break
            case 'a':
                return this.a
                break
            case 's':
                return this.s   
                break
        }
        return 0
    }
    setNext(next: string) {
        switch (next) {
            case 'A':
                this.accepted = true
                this.next = ''
                break
            case 'R':
                this.accepted = false
                this.next = ''
                break
            default:
                this.next = next
                break        
        }
    }
}

class Workflow {
    name: string
    rules: Rule[];

    constructor(name: string) {
        this.name = name
        this.rules = []
    }

    private evaluate(param1: number, param2: number, operator: string) {
        return eval(param1 + operator + param2);
    }
    addRule(variable: string, operator: string, value: number, next: string) {
        if (next)
            this.rules.push({variable, operator, value, next})
        else
            this.rules.push({variable: '', operator: '', value: 0, next: variable})
    }
    executeForPart(part: Part) {
        this.rules.some(rule => {
            if (!rule.variable) {
                part.setNext(rule.next)
                return true
            }
            else 
            if (this.evaluate(part.rating(rule.variable), rule.value, rule.operator)) {
                part.setNext(rule.next)
                return true
            } 
        })
    }
}

logger.start();

const inputParts = input.getInput('\n\n');

const parts = inputParts[1].split('\n').map(p=> {
    let values: number[] = p.match(/(\d+)/g)?.map(c=>parseInt(c)) || []
    return new Part(values[0], values[1], values[2], values[3])
})

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

while (true) {
    const part = parts.find(p=> p.next!=='')
    if (!part) break
    const workflow = workflows.find(w=> w.name===part.next)
    workflow?.executeForPart(part);
}
let answer = parts.filter(p=>p.accepted)
     .reduce((total, part) => {


    return total+=part.x+part.m+part.a+part.s

}, 0)



logger.end(answer);

