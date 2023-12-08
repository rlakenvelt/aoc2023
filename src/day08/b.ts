import InputHelper from '../utils/input';
import Logger from '../utils/logger';
import MathUtils from '../utils/math';

interface Navigation {
    key: string;
    next: string[];
}

const puzzle = 'Day 08B: Haunted Wasteland'
const input = new InputHelper();
const logger = new Logger(puzzle);

const inputValues = input.getInput('\n\n');
const instructions = inputValues[0].split('').map(i=>i==='L'?0:1);
const navigations = inputValues[1].split('\n')
                                  .map(line => {
                                    const parts = line.match(/(\w+)/g) || []
                                    const n: Navigation = {
                                        key: parts[0] || '',
                                        next: [parts[1], parts[2]]
                                    }
                                    return n
                                  });
const MAX=instructions.length - 1;

logger.start();

let trips: Navigation[] = navigations.filter(n=>n.key.match(/..A/))
let counts = trips.map(()=>0)

// Calculate trip length for each sepearate trip
let instruction = 0;
do {
    trips = trips.map((trip, index)=> {
        if (trip.key.match(/..Z/)) return trip;
        counts[index]++;
        const newtrip = navigations.find(n=>n.key===trip.next[instructions[instruction]]) || {key: '', next: []}
        return newtrip;
    })
    if (trips.every(t=>t.key.match(/..Z/))) break;
    instruction++;
    if(instruction>MAX) instruction=0;
} while (true);

// Answer is LCM of all separate trips
logger.end(counts.reduce(MathUtils.lcm));
