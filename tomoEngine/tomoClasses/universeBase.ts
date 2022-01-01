/**
 * @author Shokkunn
 */

import { BackgroundPayload, BackgroundType, BasicUniverseType, CharacterPayload, ItemsPayload, Rarity_Grade, Rarity_Grade_Strings, RPG_Classes_Strings, StoryPayload, Temp_MoodTypeStrings } from "../statics/types";
import Queries from "../queries";
import { OriginalReqVarError } from "../statics/errors";

export default abstract class universeBase {
    _id: number | string;
    type: BasicUniverseType;
    name: string;
    variant?: boolean;
    link?: string;
    spoiler?: boolean;
    _class: RPG_Classes_Strings
    _grade?: Rarity_Grade_Strings
    emoji?: string
    description: string

    /**
     * Base class for all in-universe classes. 
     * @param _id 
     * @param basicImagetype |
     */
    constructor(_id: number | string, type: BasicUniverseType, name: string, description: string = "No Description Found.", _class: RPG_Classes_Strings = "any", emoji: string = "📦", spoiler: boolean = false, grade: Rarity_Grade_Strings = null, variant: boolean = null, link: string = null) {
        this._id = _id;
        this.name = name
        this.type = type;
        this.variant = variant;
        this._class = _class
        this.link = link;
        this.description = description.trim();
        this.spoiler = spoiler;
        this._grade = grade;
        this.emoji = emoji;

    }

    /**
     * 
     * @returns The ID of the class.
     */
    get getId(): number | string {
        return this._id;
    
    }
    /**
     * 
     * @returns name of the class
     */

    get getName(): string {
        return this.name;
    }


    get gradeInt(): number {
        return Rarity_Grade[this._grade];
    }

    get class() {
        return this._class;
    }

    /**
     * @returns if the base is spoiler or not.
     */
    get isSpoiler(): boolean {
        return this.spoiler;
    }
    
    /**
     * 
     * @returns type of the class
     */
    get getType(): BasicUniverseType {
        return this.type;
    }

    get markUpFormattedName() {
        return `*${this.getName}* [ Grade • **${this._grade}** ]`
    }

    get formattedName() {
        return this.markUpFormattedName.replace(/\*/g, "")
    }

    get markUpFormattedNamewEmoji() {
        return this.emoji + " " + this.markUpFormattedName
    }
    /**
     * 
     * @returns boolean | if the class is a variant or not.
     */

    get isVariant(): boolean {
        return this.variant;
    }

    /**
     * randIntFromZero
     * @param max 
     * @returns a random int from 0 to max (exclusive of max)
     */
    randIntFromZero(max: number) {
        return (Math.floor(Math.random() * max))
    }
    /**
     * Not supposed to be called since the return object is not in class form.
     * @param id id of the original variant. default: this._id (class)
     * @param string MoodType or BackgroundType.
     * @param type Optional.
     * @returns requested variant.
     */
    async getVariant(string: Temp_MoodTypeStrings | BackgroundType, id: number | string = this._id, type: BasicUniverseType = this.type) {
        let res: any;
        try {
            switch(type) {
                case "backgrounds":
                    res = await Queries.backgroundVariant(id, string) as BackgroundPayload;
                    break;
                case "characters":
                    res = await Queries.characterVariant(id, string) as CharacterPayload;
                    break;
                case "items":
                    res = await Queries.itemVariant(id, string) as ItemsPayload;
                    break;
                case "stories":
                    res = await Queries.storyVariant(id, string) as StoryPayload;
                    break;
                
            }

            if (!res.variant.isVariant) throw new OriginalReqVarError(res._id, type);

        } catch (e) {
            console.log(e)
        } finally {
            
            return res;
        }
        

    }
    
}