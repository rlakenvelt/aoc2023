export class Match {
    x: number = 0;
    y: number = 0;
}

export class StringMatch extends Match {
    match: string = '';
}
export class NumberMatch extends Match {
    match: number = 0;
}

export class MatchUtils {
    static getStringMatch(match: RegExp, text: string, y?: number): StringMatch[] {
        return Array.from(text.matchAll(match))
                    .map(m => {return {match: m[0].toString(), x: m.index || 0, y: y || 0} })
    }    
    static getNumberMatch(match: RegExp, text: string, y?: number): NumberMatch[] {
        return Array.from(text.matchAll(match))
                    .map(m => {return {match: parseInt(m[0]), x: m.index || 0, y: y || 0} })
    }  
}
