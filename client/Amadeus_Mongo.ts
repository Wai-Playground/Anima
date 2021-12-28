import Amadeus_Base from "./Amadeus_Base";
import {MongoClient} from "mongodb"
require("dotenv").config()

let momonga: MongoClient;
/**
 * Mongodb utility class.
 */
export default class Monmonga extends Amadeus_Base {
    constructor() {
        super()
    }
    
    static async connect() {
        let serverRetries = 0; //Variable to count the retries.
        console.log(process.env.URI)
    
        momonga = new MongoClient(process.env.URI)
    
    
        try {
          //Run function of connect.
          console.time("Database_Connection_Time"); //Starts Timer.
          await momonga.connect()
    
        } catch (e) {
          //If error, retry the function and add 1 to the retries.
          console.error("Mango login failed... retrying.");
          serverRetries++;
    
          await momonga.connect()
        } finally {
          //Finally log the results.
          console.info(
            `Mango connection successful after ${
              serverRetries > 0 ? serverRetries : "no"
            } ${serverRetries == 1 ? "retry" : "retries"}, time elapsed:`
          ); //Logs the retries and the time elasped.
          console.timeEnd("Database_Connection_Time"); //Stops timer.
        }
    }

    public static universeDB() {
        return momonga.db("universe")

    }
    public static discordDB() {
        return momonga.db("discord")

    }

    public static statsDB(){
      return momonga.db("statistics")
    }
}