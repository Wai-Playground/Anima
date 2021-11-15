/**
 * @author Shokkunn
 */

import { basicUniverseType } from "../statics/types";


export default class universeBase {
    _id: number;
    type: basicUniverseType;
    name: string;

    /**
     * Base class for all in-universe classes. 
     * @param _id |
     * @param basicImagetype |
     */
    constructor(_id: number, type: basicUniverseType, name: string) {
        this._id = _id;
        this.name = name
        this.type = type;

    }
}