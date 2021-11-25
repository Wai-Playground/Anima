/**
 * @author Shokkunn
 */

import { backgroundPayload, backgroundType } from "../statics/types";
import universeBase from "./universeBase";

export default class Background extends universeBase {
    constructor(_id: number | string, payload: backgroundPayload) {
        super(_id, 'backgrounds', payload.name, payload.variant.isVariant, payload.link);
        

      }

    /**
     * getVariant()
     * @param bgType type of background.
     * @returns Class form version of the getVariant() from universeBase class.
     */

    async getVariant(bgType: backgroundType): Promise<Background> {
        const bgVariant: backgroundPayload = await super.getVariant(bgType);
        return new Background(bgVariant._id, bgVariant);
    }

}