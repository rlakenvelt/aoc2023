export class Direction {
    x: number = 0;
    y: number = 0;
    symbol: string = '';

    static directionsWithDiagonals(): Direction[] {
        return [
            {x: 1, y: 0, symbol: 'E'},
            {x: 1, y: -1, symbol: 'NE'},
            {x: 0, y: -1, symbol: 'N'},
            {x: -1, y: -1, symbol: 'NW'},
            {x: -1, y: 0, symbol: 'W'},
            {x: -1, y: 1, symbol: 'SW'},
            {x: 0, y: 1, symbol: 'S'},
            {x: 1, y: 1, symbol: 'SE'}
        ]        
    }
    static directionsWithoutDiagonals(): Direction[] {
        return [
            {x: 1, y: 0, symbol: 'E'},
            {x: 0, y: -1, symbol: 'N'},
            {x: -1, y: 0, symbol: 'W'},
            {x: 0, y: 1, symbol: 'S'}
        ]        
    }
}