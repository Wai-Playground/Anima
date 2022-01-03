/**
 * @author Jupiternerd
 */

import Queries from "../queries";
import { BaseUniversePayload, BasicUniverseType, BentoPayload, Boxes } from "../statics/types";
import Character from "./characters";
import Items from "./items";
import universeBase from "./universeBase";

 export default class LunchBox extends Items {
     drops: Array<Boxes>
     arr: Array<universeBase> = [];
     pity: number;
     constructor(_id: number | string, payload: BentoPayload) {
         super(_id, {emoji: (payload.emoji == null ? '🍱' : payload.emoji), ...payload})
         this.drops = payload.drops;
         this.pity = payload.pity;

         
     }

     async fillIntoArray() {
         let payload: universeBase;
         for (const loot of this.drops) {
          
            switch (loot.drop_type) {
                case "items":
                    payload = new Items(loot.drop_id, await Queries.item(loot.drop_id))
                    break;
                case "characters":
                    payload = new Character(loot.drop_id, await Queries.character(loot.drop_id))
                    break;
                case "backgrounds":
                    break;
                case "stories":
                    break;
            }
             for (let i = loot.drop_rate; i >= 0; i--) this.arr.push(payload)
             

         }

         //console.log(this.arr)
     }

     async roll(pity: boolean = false) {
         await this.fillIntoArray();
         if (pity) this.arr.filter(items => items.gradeInt >= this.gradeInt);
         const rolled = this.arr[this.randIntFromZero(this.arr.length)]
         return rolled
     }





 }
 