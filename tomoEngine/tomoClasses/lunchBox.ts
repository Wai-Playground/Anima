/**
 * @author Jupiternerd
 */

import { BasicUniverseType, BentoPayload, Boxes } from "../statics/types";
import Items from "./items";

 export default class LunchBox extends Items {
     drops: Array<Boxes>
     arr: Array<{
         _id: number,
         type: BasicUniverseType
     }> = [];
     pity: number;
     constructor(_id: number | string, payload: BentoPayload) {
         super(_id, {emoji: (payload.emoji == null ? '🍱' : payload.emoji), ...payload})
         this.drops = payload.drops;
         this.pity = payload.pity;

         
     }

     async fillIntoArray() {
         for (const loot of this.drops) {
             for (let i = loot.drop_rate; i >= 0; i--) {
                this.arr.push({
                    _id: loot.drop_id,
                    type: loot.drop_type
                })
             }

         }

         //console.log(this.arr)
     }

     async roll() {
         await this.fillIntoArray();
         const rolled = this.arr[this.randIntFromZero(this.arr.length)]
         console.log(rolled)
         return rolled
     }





 }
 