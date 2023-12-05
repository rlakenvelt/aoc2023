import InputHelper from '../utils/input';
import Logger from '../utils/logger';

interface Range {
    sourceStart: number;
    destinationStart: number;
    range: number;
}
interface Map {
    source: string;
    destination: string;
    ranges: Range[]
}

const puzzle = 'Day 05A: If You Give A Seed A Fertilizer'
const input = new InputHelper();
const logger = new Logger(puzzle);

logger.start();

const data = input.getInput('\n\n');
let seeds = data.shift()?.split(':')[1].trim().split(' ').map(c=>parseInt(c));
const maps = data.reduce((list: Map[], line) => {
    const t = line.split('\n');
    let s = t.shift()?.split(' ')[0].split('-');
    if (!s) s = []
    const map: Map = {
        source: s[0],
        destination: s[2],
        ranges: []
    }
    map.ranges = t.reduce((list: Range[], line) => {
        const values = line.trim().split(' ').map(c=>parseInt(c))
        const range: Range = {
            sourceStart: values[1],
            destinationStart: values[0],
            range: values[2]
        }
        list.push(range)
        return list;
    }, [])
    list.push(map)
    return list;
}, [])

let answer = Number.MAX_VALUE;
if (!seeds) seeds=[]
console.log(seeds)
for (let i=0; i<seeds.length; i+=2) {
    console.log(seeds[i], seeds[i+1])

}

// seeds?.forEach(seed => {
//     let conversion = getConversion('seed', seed);
//     while (conversion.target !== 'location') {
//         conversion = getConversion(conversion.target, conversion.nr);
//     }
//     answer = Math.min(answer, conversion.nr)
// })


function getConversion(source: string | undefined, nr: number): {target: string | undefined, nr: number} {
    const map = maps.find(m=> m.source === source)
    const range = map?.ranges.find(r=> {
        return r.sourceStart<=nr && r.sourceStart+r.range>=nr;
    })
    return {target: map?.destination, nr: range ? range.destinationStart + nr - range.sourceStart: nr}
}

logger.end(answer);

