import InputHelper from '../utils/input';
import Logger from '../utils/logger';
// 41222968
interface Range {
    sourceStart: number;
    destinationStart: number;
    range: number;
}
interface Map {
    index: number
    source: string;
    destination: string;
    ranges: Range[]
}

const puzzle = 'Day 05B: If You Give A Seed A Fertilizer'
const input = new InputHelper();
const logger = new Logger(puzzle);

logger.start();

const data = input.getInput('\n\n');
let seeds = data.shift()?.split(':')[1].trim().split(' ').map(c=>parseInt(c));
const maps = data.reduce((list: Map[], line, index) => {
    const t = line.split('\n');
    let s = t.shift()?.split(' ')[0].split('-');
    if (!s) s = []
    const map: Map = {
        index: index,
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
for (let i=0; i<seeds.length; i+=2) {
    for (let j=0; j<seeds[i+1]; j++) {
        let nr = seeds[i] + j;
        maps.forEach(map => {
            const range = map?.ranges.find(r=> {
                return r.sourceStart<=nr && r.sourceStart+r.range>=nr;
            })         
            nr = range ? range.destinationStart + nr - range.sourceStart: nr;    
        })
        answer = Math.min(answer, nr)        
    }
}


logger.end(answer);

