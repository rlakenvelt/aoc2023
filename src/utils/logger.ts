import Common from './common';
import { hrtime } from 'process';

export default class Logger {

    starttime: bigint;
    puzzletitle: string;
    testmode = false;
    
    constructor (title: string) {
        this.puzzletitle = title;
        this.starttime = hrtime.bigint();
        this.testmode = Common.testMode();
    }  

    start() {
        this.starttime = hrtime.bigint();
    };

    end (answer: any) {
        const endtime = hrtime.bigint();
        const used = Math.round(Number(endtime - this.starttime) / 1000);
        console.log("---------------------");
        console.log("Puzzle   :", this.puzzletitle);
        if (this.testmode)
            console.log("Answer   :", answer, Common.highlight('TESTMODE'));
        else    
            console.log("Answer   :", answer);
        if (used < 2000)    
            console.log("Duration :", used, "µs");
        else    
            console.log("Duration :", Math.round(used / 1000), "ms");
        console.log("---------------------");
    };

}