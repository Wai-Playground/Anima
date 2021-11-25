/**
 * @author Shokkunn
 */

import { characterPayload, moodType } from "../statics/types";
import universeBase from "./universeBase";

export default class Character extends universeBase {
    personality: {
        greetings: Array<string> 
        farewells: Array<string>
    }
    constructor(_id: number | string, payload: characterPayload) {
        super(_id, 'characters', payload.name, payload.variant.isVariant, payload.link)
        this.personality = payload.personality;

        
    }
    /**
     * getVariant()
     * @param moodType | mood you want to query.
     * @returns character class that has the mood that you queried.
     */

    async getVariant(moodType: moodType): Promise<Character> {
        const moodVariant: characterPayload = await super.getVariant(moodType);
        return new Character(moodVariant._id, moodVariant);
    }

    get Personality() {
        return this.personality;
    }


}