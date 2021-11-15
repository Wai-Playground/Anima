/**
 * @author Shokkunn
 */

import universeBase from "./universeBase";

export default class Background extends universeBase {
    constructor(_id: number, payload: {
        _id: number,
        variant: {
            isVariant: boolean,
            variantUse?: string,
            originalID?: number
        },
        name: string,
        description?: string,
        link: string
      }) {
          super(_id, 'backgrounds', payload.name);
      }

}