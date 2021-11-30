import Amadeus_Base from "./Amadeus_Base";
import {createClient} from "redis"

let memory;

export default class Red extends Amadeus_Base {
    constructor() {
        super()
    }


    static async connect() {

          memory = createClient();
          await memory.connect();
          memory.on('error', (err) => console.log('Redis Client Error', err));
          await memory.set("key", "value")
          console.log(await memory.get("key"))
          console.log("Redis done.")
        
            
    }

    static memory() {
        return memory;
    }

    static async checkMemory(key) {
        await memory.get(key)
    }



}