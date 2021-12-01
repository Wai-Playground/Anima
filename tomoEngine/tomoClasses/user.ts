/**
 * @author Shokkunn
 */

 import { BackgroundPayload, BackgroundType, UserUniversePayload } from "../statics/types";
 import universeBase from "./universeBase";
 
 export default class Users extends universeBase {
     constructor(_id: number | string, payload: UserUniversePayload) {
         super(_id, 'users', payload.discord_username, false, null);



         
 
       }
 

 
 }