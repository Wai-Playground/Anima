/**
 * @author Shokkunn
 */

 import {ItemsPayload } from "../statics/types";
 import universeBase from "./universeBase";
 
 export default class Items extends universeBase {
     constructor(_id: number | string, payload: ItemsPayload) {
         super(_id, 'items', payload.name, payload.grade);
         
 
       }
 

 
 }