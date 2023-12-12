import InputHelper from '../utils/input';
import Logger from '../utils/logger';
import Common from '../utils/common';

const puzzle = 'Day 12A: Hot Springs'
const input = new InputHelper();
const logger = new Logger(puzzle);

const inputValues = input.getInput().map(l=>l.split(' '));
const springs = inputValues.map(l=>l[0])
const groups = inputValues.map(l=>l[1].split(',').map(c=>parseInt(c)))

logger.start();
let answer = 0;

springs.forEach((line, index)=> {
    const unknown = Array.from(line.matchAll(/[?]{1,}/g)).map(m=>convertMatch(m))
    const broken = Array.from(line.matchAll(/[#]{1,}/g)).map(m=>convertMatch(m))
    const totalBroken = groups[index].reduce(Common.total)
    const totalUnknown = unknown.reduce((total, part) => {
        total+=part.part.length
        return total;
    }, 0) 
    const totalKnown = broken.reduce((total, part) => {
        total+=part.part.length
        return total;
    }, 0) 
    const permutations = getAllPermutations(totalBroken - totalKnown, totalUnknown - (totalBroken - totalKnown))
    permutations.forEach(permutation=> {
        const p = [...permutation]
        const l = line.split('');
        for (let i=0; i < l.length; i++) {
            if (l[i]==='?') {
                l[i]=p.shift()||''
            }
        }
        const matches = l.join('').match(/[#]{1,}/g) || []
        if (matches.length===groups[index].length) {

            if (groups[index].every((grouplength, i) => {
                return (grouplength===matches[i].length)
            })) {
                answer++
            }
        }
    })
})


logger.end(answer);

function convertMatch(match: RegExpMatchArray): {part: string, index: number} {
    return {part: match[0], index: match.index||0}
}

function getAllPermutations(broken: number, other: number) {
    let result: string[] = [];

    function recursePermutation(current: string) {
        if (current.length === broken + other) {
            result.push(current);
            return;
        }
        if (broken > 0) {
            recursePermutation(current + '#');
        }
        if (other > 0) {
            recursePermutation(current + '.');
        }
    }
    recursePermutation('');
    return result;
}


