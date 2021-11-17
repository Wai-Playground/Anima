/**
 * @author Shokkunn
 */

import { characterPayload, moodType } from "../statics/types";
import universeBase from "./universeBase";

export default class Character extends universeBase {
    constructor(_id: number, payload: characterPayload) {
        super(_id, 'character', payload.name, payload.variant.isVariant)

        
    }
    /**
     * getVariant()
     * @param moodType | mood you want to query.
     * @returns character class that has the mood that you queried.
     */

    async getVariant(moodType: moodType) {
        const moodVariant: characterPayload = await super.getVariant(moodType);
        console.log(moodVariant)
        return new Character(moodVariant._id, moodVariant);
    }


}