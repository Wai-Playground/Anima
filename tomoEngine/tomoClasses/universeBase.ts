/**
 * @author Shokkunn
 */

import { backgroundPayload, backgroundType, basicUniverseType, characterPayload, moodType } from "../statics/types";
import Queries from "../queries";
import { OriginalReqVarError } from "../statics/errors";

export default class universeBase {
    _id: number;
    type: basicUniverseType;
    name: string;
    variant: boolean;

    /**
     * Base class for all in-universe classes. 
     * @param _id |
     * @param basicImagetype |
     */
    constructor(_id: number, type: basicUniverseType, name: string, variant: boolean) {
        this._id = _id;
        this.name = name
        this.type = type;
        this.variant = variant;

    }

    /**
     * 
     * @returns The ID of the class.
     */
    getId() {
        return this._id;
    
    }
    /**
     * 
     * @returns name of the class
     */

    getName() {
        return this.name;
    }
    
    /**
     * 
     * @returns type of the class
     */
    getType() {
        return this.type;
    }
    /**
     * 
     * @returns boolean | if the class is a variant or not.
     */

    isVariant() {
        return this.variant;
    }
    /**
     * Not supposed to be called since the return object is not in class form.
     * @param id id of the original variant.
     * @param string moodType or backgroundType.
     * @param type Optional.
     * @returns requested variant.
     */
    async getVariant(string: moodType | backgroundType, id: number = this._id, type: basicUniverseType = this.type) {
        let res: any;
        try {
            if (type == "background") {

                res = await Queries.backgroundVariant(id, string) as backgroundPayload;

            } else if (type == "character") {

                res = await Queries.characterVariant(id, string) as characterPayload;

            }

            if (!res.variant.isVariant) throw new OriginalReqVarError(res._id, type);

        } catch (e) {
            return console.log(e)
        } finally {
            
            return res;
        }
        

    }
    
}