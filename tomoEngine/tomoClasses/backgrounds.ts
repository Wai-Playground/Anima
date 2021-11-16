/**
 * @author Shokkunn
 */

import { backgroundPayload, backgroundType } from "../statics/types";
import universeBase from "./universeBase";

export default class Background extends universeBase {
    constructor(_id: number, payload: backgroundPayload) {
        super(_id, 'background', payload.name, payload.variant.isVariant);
        

      }

    /**
     * getVariant()
     * @param bgType type of background.
     * @returns Class form version of the getVariant() from universeBase class.
     */

    async getVariant(bgType: backgroundType) {
        const bgVariant: backgroundPayload = await super.getVariant(bgType);
        return new Background(bgVariant.variant.originalId, bgVariant);
    }

}