/**
 * @author Shokkunn
 */

import { BackgroundPayload, BackgroundType, CharacterInUser, UserUniversePayload } from "../statics/types";
import universeBase from "./universeBase";
 
export default class DBUsers extends universeBase {
    tomodachis: Array<CharacterInUser>
    reservedTomo: Array<CharacterInUser>
    inventory: Array<{
        itemID: number,
        amount: number
      }>
    constructor(_id: number | string, payload: UserUniversePayload) {
        super(_id, 'users', payload.discord_username, false, null);
        this.tomodachis = payload.characters;
        this.reservedTomo = payload.reserved;
        this.inventory = payload.inventory;
         
 
    }

    
    
 

 
 }