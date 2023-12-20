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
        module.registerSource(this)
    }
    registerSource(module: Module) {
    }
    sendPulse(pulse: number, source?: Module) {
        // console.log(source?.name, pulse ? 'high' : 'low', '->', this.name)
    }

}
class FlipFlop extends Module{
    on: boolean = false;
    sendPulse(pulse: number, source?: Module) {
        super.sendPulse(pulse, source)

        if (pulse===1) return
        this.on = !this.on
        this.connection.forEach(m=> {
            pulseQueue.push({from: this, to: m, pulse: Number(this.on)})
        })
    }    
}
class Conjunction extends Module{
    memory: {module: string, pulse: number}[] = []
    registerSource(module: Module) {
        this.memory.push({module: module.name, pulse: 0})

    }
    sendPulse(pulse: number, source?: Module) {
        super.sendPulse(pulse, source)
        if (!source) return
        let memory=this.memory.find(m=>m.module===source.name)
        if (memory) memory.pulse=pulse
        const allOn = !this.memory.some(m=>m.pulse===0)
        this.connection.forEach(m=> {
            pulseQueue.push({from: this, to: m, pulse: allOn ? 0 : 1})
        })
    }    
}
class Broadcaster extends Module{
    sendPulse(pulse: number, source?: Module) {
        super.sendPulse(pulse, source)
        this.connection.forEach(m=> {
            pulseQueue.push({from: this, to: m, pulse: pulse})
        })
    }
}

interface Pulse {
    from: Module
    to: Module
    pulse: number
}

const puzzle = 'Day 20A: Pulse Propagation'
const input = new InputHelper();
const logger = new Logger(puzzle);
const pulseQueue: Pulse[] = [] 

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
    const moduleFrom = modules.find(m=>m.name===c.from) || new Module(c.from)
    const moduleTo = modules.find(m=>m.name===c.to) || new Module(c.to)
    moduleFrom.addConnection(moduleTo)
})

logger.start();
const broadcaster = modules.find(m=> m.name==='broadcaster')
if (broadcaster)
    pulseQueue.push({from: broadcaster, to: broadcaster, pulse: 0})


    let lowPulses = 0;
let highPulses = 0;
let button = 1;
while (true) {
    const pulse = pulseQueue.shift()
    if (!pulse) {
        button++
        if (button>1000) break
        if (broadcaster)
            pulseQueue.push({from: broadcaster, to: broadcaster, pulse: 0})
    }
    if (pulse) {
        if (pulse.pulse)
            highPulses++
        else 
            lowPulses++
        pulse.to.sendPulse(pulse.pulse, pulse.from)
    }
}
let answer = lowPulses * highPulses;

logger.end(answer);

