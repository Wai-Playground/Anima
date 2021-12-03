import Amadeus_Base from "./Amadeus_Base";
import Redis from 'ioredis';

let memory: Redis.Redis;

export default class Red extends Amadeus_Base {
    constructor() {
        super()
    }

    static async connect() {
        memory = new Redis();
        console.log("Redis Loaded.")
        
        
    }

    static memory() {
        return memory;
    }

    static async flushAll() {
        await memory.flushall();
    }



}