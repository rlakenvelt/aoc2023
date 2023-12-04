
export default class Common {

    static testMode() {
        return process.argv.some(a=>a==="-test");
    }
    static highlight(text: string):string {
        return `\x1b[1m\x1b[31m${text}\x1b[0m`;
    }
    static arrayMax(array: number[]) {
        return array.reduce((max, i) => {return Math.max(max,i)}, 0);
    }
    static arrayMin(array: number[]) {
        const maxValue = this.arrayMax(array);
        return array.reduce((min, i) => {return Math.min(min,i)}, maxValue);
    }
    static total(total: number, i: number) {
        return total+=i;
    }
    static multiply(total: number, i: number) {
        return total*=i;
    }
    static splitLine(line: string, separators: string[]): any {
        const lines = line.trim().split(separators[0]);
        if (separators.length === 1) 
           return lines;
        let newseparators = [...separators]
        newseparators.shift();
        return lines.map(l => Common.splitLine(l, newseparators))
    }

}