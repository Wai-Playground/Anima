/**
 * @author Shokkunn
 */

import { BackgroundPayload, BackgroundType } from "../statics/types";
import universeBase from "./universeBase";

export default class Background extends universeBase {
    //renderedImage: Image;
    constructor(_id: number | string, payload: BackgroundPayload) {
        super(_id, 'backgrounds', payload.name, payload.description, "any", payload.emoji || "🗻", payload.spoiler, payload.grade, payload.variant.isVariant, payload.link);
        //this.renderedImage = null;

      }

    /**
     * getVariant()
     * @param bgType type of background.
     * @returns Class form version of the getVariant() from universeBase class.
     */

    async getVariant(bgType: BackgroundType): Promise<Background> {
        const bgVariant: BackgroundPayload = await super.getVariant(bgType);
        return new Background(bgVariant._id, bgVariant);
    }

}