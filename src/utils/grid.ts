export class Point {
    x: number = 0;
    y: number = 0;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}
export class Line {
    from: Point;
    to: Point;

    constructor(from: Point, to: Point) {
        this.from = from;
        this.to = to;
    }
}
export class Direction {
    x: number = 0;
    y: number = 0;

    static directionsWithDiagonals(): Direction[] {
        return [
            {x: 1, y: 0},
            {x: 1, y: -1},
            {x: 0, y: -1},
            {x: -1, y: -1},
            {x: -1, y: 0},
            {x: -1, y: 1},
            {x: 0, y: 1},
            {x: 1, y: 1}
        ]        
    }
    static directionsWithoutDiagonals(): Direction[] {
        return [
            {x: 1, y: 0},
            {x: 0, y: -1},
            {x: -1, y: 0},
            {x: 0, y: 1}
        ]        
    }
}

export class Grid<T> {
    grid: T[][] = [][0];
    width: number = 0;
    height: number = 0;

    constructor(width: number = 0, height: number = 0, initial?: T) {
        if (width > 0 && height > 0 && initial!==undefined) {
            this.initGrid(width, height, initial);
        }
    }
    
    initGrid (width: number, height: number, initial: T) {
        this.setGrid(new Array(height).fill([]).map(row => new Array(width).fill(initial)));
    }
    
    setGrid(grid: T[][]) {
        this.grid = grid;
        this.height = grid.length;
        this.width  = grid[0].length;
    }
    expand(margin: number, initial: T) {
        for (let i=0; i<margin; i++) {
            this.grid.unshift(new Array(this.width).fill(initial));
            this.grid.push(new Array(this.width).fill(initial));
        }
        this.grid.forEach(l=> {
            for (let i=0; i<margin; i++) {
                l.unshift(initial);
                l.push(initial);
            }
        })
        this.height = this.grid.length;
        this.width  = this.grid[0].length;
    }
    crop(margin: number) {
        for (let i=0; i<margin; i++) {
            this.grid.shift();
            this.grid.pop();
        }
        this.grid.forEach(l=> {
            for (let i=0; i<margin; i++) {
                l.shift();
                l.pop();
            }
        })   
        this.height = this.grid.length;
        this.width  = this.grid[0].length;             
    }
    private highlight(t: string):string {
        return `\x1b[1m\x1b[31m${t}\x1b[0m`;
    }  
    display(hightlight?: string) {
        this.grid.forEach(row => {
            let temp = row.join('');
            if (hightlight) {
                const regex = new RegExp(hightlight, 'g');
                temp = temp.replace(regex, this.highlight(hightlight));
            }
            console.log(temp);
        })
    } 
    isOutsideGrid(x: number, y: number) {
        if (x<0) return true;
        if (x>this.width-1) return true;
        if (y<0) return true;
        if (y>this.height-1) return true;
        return false;
    }    
    isInsideGrid(x: number, y: number) {
        if (x<0) return false;
        if (x>this.width-1) return false;
        if (y<0) return false;
        if (y>this.height-1) return false;
        return true;
    }  
}