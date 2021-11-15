/**
 * @author Shokkunn
 */

import universeBase from "./universeBase";

export default class Character extends universeBase {
    constructor(_id: number, payload: {
        _id: number,
        variant: {
            isVariant: boolean,
            variantUse?: string,
            originalID?: number
        },
        name: string,
        age?: number,
        bloodtype?: string,
        description?: string,
        link: string
      }) {
        super(_id, 'character', payload.name)

        
    }

}