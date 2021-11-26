//import user_universe from "../db_schemas/universe/user_universe_type";
import { UniBaseNotFoundError } from "./statics/errors";
import { BackgroundPayload, BaseUniversePayload, BasicUniverseType, CharacterPayload } from "./statics/types";
import Monmonga from "../client/Amadeus_Mongo";
class Queries {
    /**
     * Retrieves character payload.
     * @param _id | int
     * @returns character payload as json
     */
    public static async character(_id: string | number) {
        return await this.getBaseType(_id, "characters") as CharacterPayload;
    }

    /**
     * Retrieves background payload.
     * @param _id | int
     * @returns background payload as json
     */
    public static async background(_id: string | number) {
        return await this.getBaseType(_id, "backgrounds") as BackgroundPayload;
    }

    /**
     * Should not be used outside of this class.
     * @param _id priv
     * @param db priv
     * @returns priv
     */
    private static async getBaseType(_id: number | string, db: BasicUniverseType) {
        let payload: BaseUniversePayload;
        try {
            payload = await Monmonga.universeDB().collection<BaseUniversePayload>(db).findOne({ _id: _id});
            if (!payload) throw new UniBaseNotFoundError(_id, db);

        } catch(e) {
            console.log(e);
        } finally {
            return payload;
        }

    }

    /**
     * Retrieves variant of a character.
     * @param originalID | original id of the variant
     * @param name | name or use of variant
     * @returns character payload as json
     */
    public static async characterVariant(originalID: number | string, name: string | number) {
        return await this.getVariantType(originalID, name, "characters") as CharacterPayload

    }

    /**
     * Retrieves variant of a background.
     * @param originalID | original id of the variant
     * @param name | name or use of the variant
     * @returns background payload as json
     */
    public static async backgroundVariant(originalID: number | string, name: string | number) {
        return await this.getVariantType(originalID, name, "backgrounds") as BackgroundPayload

    }
    /**
     * Should not be used outside of this class.
     * @param _id priv
     * @param db priv
     * @returns priv
     */
    private static async getVariantType(originalID: number | string, name: string | number, db: BasicUniverseType) {
        let payload: BaseUniversePayload;
        try {
            payload = await Monmonga.universeDB().collection<BaseUniversePayload>(db).findOne({'variant.originalID': originalID, 'variant.variantUse': name});
            if (!payload) throw new UniBaseNotFoundError(originalID, db);

        } catch(e) {
            console.log(e);
            
        } finally {
            return payload;
        }
    }
/*
    public static async userUniverse(_id: String | number) {
        
        return await user_universe.findOne({ _id: _id});
        

    }*/




}

export = Queries;