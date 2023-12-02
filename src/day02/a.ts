import InputHelper from '../utils/input';
import Logger from '../utils/logger';

const puzzle = 'Day 02A: Cube Conundrum'
const input = new InputHelper();
const logger = new Logger(puzzle);

const lines = input.getInput();

logger.start();

const games = lines.reduce((list: any[], line) => {
    let game: any = {};
    const t1 = line.split(':');
    const t2 = t1[1].split(';')
                    .map(set => {
                        const s = set.split(',');
                        const draw: any = {};
                        s.forEach(dice => {
                            dice=dice.trim()
                            const d = dice.split(' ')
                            draw[d[1]] = parseInt(d[0])
                        })
                        return draw;
                    });
    game.id = parseInt(t1[0].split(' ')[1]);
    game.set = t2;
    list.push(game);
    return list;
}, [])

let answer = 0;

games.forEach(game => {
    let ok = true;
    game.set.forEach((s: any) => {
        if (s.red > 12 || s.green > 13 || s.blue > 14) {
            ok = false;
        }
    })
    if (ok) answer += game.id;


}) 



logger.end(answer);

