//import user_universe from "../db_schemas/universe/user_universe_type";
import { UniBaseNotFoundError } from "./statics/errors";
import { BackgroundPayload, BaseUniversePayload, BasicUniverseType, CharacterPayload, UserUniversePayload } from "./statics/types";
import Monmonga from "../client/Amadeus_Mongo";
import Red from "../client/Amadeus_Redis";
const EXPIRATION = parseInt(process.env.REDISEXPIRATION);
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
        let payload: BaseUniversePayload, cache: string, redis = Red.memory();
        try {
            cache = await redis.hGet(db, _id.toString());
            if (cache) {
                console.log("Cached! _id: "+ _id);
                payload = JSON.parse(cache) as BaseUniversePayload;

            }
            payload = await Monmonga.universeDB().collection<BaseUniversePayload>(db).findOne({ _id: _id});
            if (!payload) throw new UniBaseNotFoundError(_id, db);
            console.log( )
            redis.hSet(db, _id.toString(), JSON.stringify(payload));
            redis.expire(db, EXPIRATION);

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
        let payload: BaseUniversePayload, cache: string, hashKey: string = db + "_variants",  query: string= originalID + "_" + name, redis = Red.memory();
        try {
            cache = await redis.hGet(hashKey, query);
            if (cache) {
                console.log("Cached Variant! o_id: "+ originalID);
                payload = JSON.parse(cache) as BaseUniversePayload;

            }
            payload = await Monmonga.universeDB().collection<BaseUniversePayload>(db).findOne({'variant.originalID': originalID, 'variant.variantUse': name});
            if (!payload) throw new UniBaseNotFoundError(originalID, db);
            redis.hSet(hashKey, query, JSON.stringify(payload));
            redis.expire(hashKey, EXPIRATION);

        } catch(e) {
            console.log(e);
            
        } finally {
            
            return payload;
        }
    }
    /**
     * Returns the user universe object; Does not use redis for caching because this is very volatile.
     * @param _id 
     */

    public static async userUniverse(_id: string | number) {
        let payload: UserUniversePayload;
        try {            
            payload = await Monmonga.universeDB().collection<UserUniversePayload>("users").findOne({_id: _id});
            if (!payload) throw new UniBaseNotFoundError(_id, "users");
    
        } catch(e) {
            console.log(e);
        } finally {
            return payload;
        }
      
    }

    public static async insertUserUniverse(payload: UserUniversePayload) {
        try {            
            await Monmonga.universeDB().collection<UserUniversePayload>("users").insertOne(payload); 
    
        } catch(e) {
            console.log(e);
        } finally {
            return payload;
        }
      
    }




}

export = Queries;