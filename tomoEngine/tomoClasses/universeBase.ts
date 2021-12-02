/**
 * @author Shokkunn
 */

import { BackgroundPayload, BackgroundType, BasicUniverseType, CharacterPayload, ItemsPayload, Rarity_Grade, StoryPayload, Temp_MoodTypeStrings } from "../statics/types";
import Queries from "../queries";
import { OriginalReqVarError } from "../statics/errors";

export default class universeBase {
    _id: number | string;
    type: BasicUniverseType;
    name: string;
    variant?: boolean;
    link?: string;
    grade?: Rarity_Grade

    /**
     * Base class for all in-universe classes. 
     * @param _id |
     * @param basicImagetype |
     */
    constructor(_id: number | string, type: BasicUniverseType, name: string, grade: Rarity_Grade = null, variant: boolean = null, link: string = null) {
        this._id = _id;
        this.name = name
        this.type = type;
        this.variant = variant;
        this.link = link;
        this.grade = grade;

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
    
    /**
     * 
     * @returns type of the class
     */
    get getType(): BasicUniverseType {
        return this.type;
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