/**
 * @author Shokkunn
 */

import { MessagePayload } from "discord.js";
import { CharacterPayload, CharacterPersonality, Char_Archetype, Ship_Tree, Temp_MoodTypeStrings, Tomo_Action } from "../statics/types";
import universeBase from "./universeBase";


export default class Character extends universeBase {

    personality: CharacterPersonality
    isNarrator: boolean
    constructor(_id: number | string, payload: CharacterPayload) {
        super(_id, 'characters', payload.name, payload.grade, payload.variant.isVariant, payload.link)
        this.personality = payload.personality;
        this.isNarrator = payload._id == 1 ? true : false;
    }
    /**
     * getVariant()
     * @param MoodType | mood you want to query.
     * @returns character class that has the mood that you queried.
     */

    async getVariant(MoodType: Temp_MoodTypeStrings): Promise<Character> {
        const moodVariant: CharacterPayload = await super.getVariant(MoodType);
        return new Character(moodVariant._id, moodVariant);
    }
    

    getRandInterStoryId(action_type: Tomo_Action) {
        const arr = this.getInteractionStoryIdArr(action_type);
        return (arr.length > 0 ? arr[this.randIntFromZero(arr.length)] : null) 
        
    }
    /**
     * 
     * @param action_type | action type you want to query.
     * @returns the array of the interaction.
     */
    getInteractionStoryIdArr(action_type: Tomo_Action) {
        return this.personality.interaction_story_ids.hasOwnProperty(action_type) ? this.personality.interaction_story_ids[action_type] : [];
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
    
    get narrator() {
        return this.isNarrator;
    }

    getRandGreetings() {
        return (this.greetings.length > 0 ? this.greetings.length[this.randIntFromZero(this.greetings.length)] : null) 
    }

    getRandFarewells() {
        return (this.farewells.length > 0 ? this.farewells.length[this.randIntFromZero(this.farewells.length)] : null) 

    }

    get farewells () {
        return this.personality.farewells;
    }

    get greetings () {
        return this.personality.greetings;
    }



}