import { DEBUG } from "./constants";
function log(...input : any){
    if(DEBUG){
        console.log(...input)
    }
}


export default log;