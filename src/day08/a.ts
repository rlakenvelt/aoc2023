import InputHelper from '../utils/input';
import Logger from '../utils/logger';

interface Navigation {
    key: string;
    next: string[];
}

const puzzle = 'Day 08A: Haunted Wasteland'
const input = new InputHelper();
const logger = new Logger(puzzle);

const inputValues = input.getInput('\n\n');
const instructions = inputValues[0].split('').map(i=>i==='L'?0:1);
const navigations = inputValues[1].split('\n')
                                  .map(line => {
                                    const parts = line.replace(/[\w ]/g, ' ')
                                    const n: Navigation = {
                                        key: line.substring(0, 3),
                                        next: [line.substring(7, 10), line.substring(12, 15)]
                                    }
                                    return n
                                  });

logger.start();


let answer = 0;

const MAX=instructions.length - 1;

let navigation: Navigation | undefined = navigations.find(n=>n.key==='AAA')

let instruction = 0;
do {
    answer++;
    navigation = navigations.find(n=>n.key===navigation?.next[instructions[instruction]])
    if (navigation?.key==='ZZZ') break;
    instruction++;
    if(instruction>MAX) instruction=0;
} while (true);




logger.end(answer);

