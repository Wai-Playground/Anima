import Amadeus_Base from "./Amadeus_Base";
import {createClient} from "redis"
export default class Red extends Amadeus_Base {
    constructor() {
        super()
    }


    static async connect() {

          const client = createClient();
        
          client.on('error', (err) => console.log('Redis Client Error', err));
        
          //await client.connect();
        
          await client.set('key', 'value');
          const value = await client.get('key');   
          console.log(value)    
    }

}