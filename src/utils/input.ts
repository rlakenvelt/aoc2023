import * as fs from 'fs';
import Common from './common';

export default class InputHelper {

  testmode = false;

  constructor () {
    this.testmode = Common.testMode();
  }    

  getRawInput (name=(this.testmode ? "test" : "input")) {
    return fs.readFileSync(`./${name}.txt`, "utf-8");
  };
  getInput (separator = "\n", name=(this.testmode ? "test" : "input")): string[] {
    const file = fs.readFileSync(`./${name}.txt`, "utf-8");
    return file.split(separator).map(x =>x);
  };
  
  getNumericInput (separator = "\n") {
    return this.getInput(separator).map(x => parseInt(x));
  }; 
}