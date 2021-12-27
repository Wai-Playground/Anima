/**
 * @author Shokkunn
 */

 import {ItemsPayload, Item_Type } from "../statics/types";
 import universeBase from "./universeBase";
 
 export default class Items extends universeBase {
   _itemType: Item_Type
     constructor(_id: number | string, payload: ItemsPayload) {
         super(_id, 'items', payload.name, payload.description, payload.class || "any", payload.emoji, payload.spoiler, payload.grade);

         
       }

       /**
        * @returns string of itemtype
        */
       get itemType() {
         return this._itemType
       }


  
 

 
 }