import InputHelper from '../utils/input';
import Logger from '../utils/logger';

class Module {
    name: string
    connection: Module[] = []

    constructor(name: string) {
        this.name = name
    }
    addConnection(module: Module) {
        this.connection.push(module)
    }
    receivePulse(pulse: number, source?: Module) {
        console.log('RECEIVE', source?.name, pulse, this.name)
    }
    executePulse() {
        // console.log('EXECUTE', this.name)
    }
}
class FlipFlop extends Module{
    lastPulse: number = 0
    on: boolean = false;
    receivePulse(pulse: number, source?: Module) {
        super.receivePulse(pulse, source)
        this.lastPulse = pulse
    }
    executePulse() {
        super.executePulse()
        if (this.lastPulse===1) return
        this.on = !this.on
        this.connection.forEach(m=> {
            if (this.on)
                m.receivePulse(1, this)
            else
                m.receivePulse(0, this)
        })
        this.connection.forEach(m=> {
            m.executePulse()
        })
    }    
}
class Conjunction extends Module{
    memory: {module: string, pulse: number}[] = []
    receivePulse(pulse: number, source?: Module) {
        super.receivePulse(pulse, source)
        if (!source) return
        let memory=this.memory.find(m=>m.module = source.name)
        if (!memory) {
            memory = {module: source.name, pulse: pulse}
            this.memory.push(memory)
        }
    }
    executePulse() {
        super.executePulse()
        const newPulse = this.memory.some(m=>m.pulse===0) ? 1 : 0;
        this.connection.forEach(m=> {
            m.receivePulse(newPulse, this)
        })
        this.connection.forEach(m=> {
            m.executePulse()
        })
    }    
}
class Broadcaster extends Module{
    private pulse: number = 0;
    receivePulse(pulse: number, source?: Module) {
        super.receivePulse(pulse, source)
        this.pulse = pulse
        this.executePulse()
    }
    executePulse() {
        super.executePulse()
        this.connection.forEach(m=> {
            m.receivePulse(this.pulse, this)
        })
        this.connection.forEach(m=> {
            m.executePulse()
        })
    }
}

const puzzle = 'Day 20A: Pulse Propagation'
const input = new InputHelper();
const logger = new Logger(puzzle);

const inputValues = input.getInput();


const modules: Module[] = []
const connections: {from: string, to: string}[] = []
inputValues.forEach(line=> {
    const parts = line.split(' -> ')
    let name = ''
    switch (parts[0][0]) {
        case 'b':
            name = 'broadcaster'
            const b = new Broadcaster(name)
            modules.push(b)
            break
        case '%':
            name = parts[0].substring(1)
            const f = new FlipFlop(name)
            modules.push(f)
            break
        case "&":
            name = parts[0].substring(1)
            const c = new Conjunction(name)
            modules.push(c)
            break
    }
    parts[1].split(', ').forEach(m=> {
        connections.push({from: name, to:m})
    })
})
connections.forEach(c=> {
    const moduleFrom = modules.find(m=>m.name===c.from)
    const moduleTo = modules.find(m=>m.name===c.to)
    if (moduleFrom&&moduleTo) moduleFrom.addConnection(moduleTo)
})

logger.start();
const broadcaster = modules.find(m=> m.name==='broadcaster')
if (broadcaster)
    broadcaster.receivePulse(0)
let answer = 0;



logger.end(answer);

