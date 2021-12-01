/**
 * @author Shokkunn
 */

import { CharacterPayload, CharacterPersonality, Char_Archetype, MoodType, MoodTypeStrings, Ship_Tree } from "../statics/types";
import universeBase from "./universeBase";


export default class Character extends universeBase {

    personality: CharacterPersonality
    constructor(_id: number | string, payload: CharacterPayload) {
        super(_id, 'characters', payload.name, payload.grade, payload.variant.isVariant, payload.link)
        this.personality = payload.personality;

    }
    /**
     * getVariant()
     * @param MoodType | mood you want to query.
     * @returns character class that has the mood that you queried.
     */

    async getVariant(MoodType: MoodTypeStrings): Promise<Character> {
        const moodVariant: CharacterPayload = await super.getVariant(MoodType);
        return new Character(moodVariant._id, moodVariant);
    }

    get likes() {
        return this.personality.likes;
    }

    get dislikes() {
        return this.personality.dislikes;
    }

    get archetype() {
        return this.personality._archetype;

    }

    getRandGreetings() {
        return this.personality.greetings[(Math.floor(Math.random() * this.personality?.greetings.length))]


    }

    getRandFarewells() {
        return this.personality.farewells[(Math.floor(Math.random() * this.personality?.greetings.length))]

    }

    get farewells () {
        return this.personality.farewells;
    }

    get greetings () {
        return this.personality.greetings;
    }



}