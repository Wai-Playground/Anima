import Amadeus_Base from "./Amadeus_Base";
import Redis from 'ioredis';

let memory: Redis.Redis;
/**
 * redis utility class
 */
export default class Red extends Amadeus_Base {
    constructor() {
        super()
    }

    static async connect() {
        memory = new Redis(6379);
        console.log(memory)
        console.log("Redis Loaded.")
    }

    static memory() {
        return memory;
    }

    static async flushAll() {
        let status = await memory.flushall();
        memory.flushdb();
        console.log(status)
    }



}