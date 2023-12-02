import InputHelper from '../utils/input';
import Logger from '../utils/logger';

const puzzle = 'Day 02B: Cube Conundrum'
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
    const minimum = {red: 0, green: 0, blue: 0};
    game.set.forEach((s: any) => {
        if (s.red)
           minimum.red = Math.max(minimum.red, s.red);
        if (s.green)
           minimum.green = Math.max(minimum.green, s.green);
        if (s.blue)
           minimum.blue = Math.max(minimum.blue, s.blue);
    })
    answer += minimum.red * minimum.green * minimum.blue;
}) 

logger.end(answer);

