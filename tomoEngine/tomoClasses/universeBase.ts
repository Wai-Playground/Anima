/**
 * @author Shokkunn
 */

import { BackgroundPayload, BackgroundType, BasicUniverseType, CharacterPayload, MoodType, MoodTypeStrings, Rarity_Grade } from "../statics/types";
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
     * Not supposed to be called since the return object is not in class form.
     * @param id id of the original variant. default: this._id (class)
     * @param string MoodType or BackgroundType.
     * @param type Optional.
     * @returns requested variant.
     */
    async getVariant(string: MoodTypeStrings | BackgroundType, id: number | string = this._id, type: BasicUniverseType = this.type) {
        let res: any;
        try {
            if (type == "backgrounds") {

                res = await Queries.backgroundVariant(id, string) as BackgroundPayload;

            } else if (type == "characters") {

                res = await Queries.characterVariant(id, string) as CharacterPayload;

            }

            if (!res.variant.isVariant) throw new OriginalReqVarError(res._id, type);

        } catch (e) {
            console.log(e)
        } finally {
            
            return res;
        }
        

    }
    
}