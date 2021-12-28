//import user_universe from "../db_schemas/universe/user_universe_type";
import { UniBaseNotFoundError, UniVariantNotFoundError } from "./statics/errors";
import { BackgroundPayload, BaseUniversePayload, BasicUniverseType, CharacterInUser, CharacterPayload, Guild, ItemInUser, ItemsPayload, StoryPayload, UserUniversePayload } from "./statics/types";
import Monmonga from "../client/Amadeus_Mongo";
import Red from "../client/Amadeus_Redis";
const EXPIRATION = parseInt(process.env.REDISEXPIRATION);
class Queries {
    /**
     * Retrieves character payload.
     * @param _id | int or str
     * @returns character payload as json
     */
    public static async character(_id: string | number) {
        
        return await this.getBaseType(_id, "characters") as CharacterPayload;
    }

    /**
     * Retrieves background payload.
     * @param _id | int or str
     * @returns background payload as json
     */
    public static async background(_id: string | number) {
        
        return await this.getBaseType(_id, "backgrounds") as BackgroundPayload;
    }

    /**
     * Retrieves item payload.
     * @param _id | int or str
     * @returns item payload as json
     */
    public static async item(_id: string | number) {
        return await this.getBaseType(_id, "items") as ItemsPayload;
    }

    /**
     * retrieves story payload.
     * @param _id | int or str
     * @returns story paylaod as json
     */
    public static async story(_id: string | number) {
        return await this.getBaseType(_id, "stories") as StoryPayload;
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
            cache = await redis.hget(db, _id.toString());
            console.log(cache)
            if (cache) {

                payload = JSON.parse(cache) as BaseUniversePayload;
                if (!payload) throw new UniBaseNotFoundError(_id, db);
                return payload;

            }
            payload = await Monmonga.universeDB().collection<BaseUniversePayload>(db).findOne({ _id: _id});
            if (!payload) throw new UniBaseNotFoundError(_id, db);
            redis.hset(db, _id.toString(), JSON.stringify(payload));
            redis.expire(db, EXPIRATION);


        } catch(e) {
            console.log(e);
        } finally {
            return payload;
        }

    }

    /**
     * Retrieves variant of a item.
     * @param originalID | original id of the variant
     * @param name | name or use of variant
     * @returns item payload as json
     */
    public static async itemVariant(originalID: number | string, name: string | number) {
        return await this.getVariantType(originalID, name, "items") as ItemsPayload

    }
    /**
     * Retrieves variant of a story.
     * @param originalID | original id of the variant
     * @param name | name or use of variant
     * @returns story payload as json
     */
     public static async storyVariant(originalID: number | string, name: string | number) {
        return await this.getVariantType(originalID, name, "stories") as StoryPayload

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
            cache = await redis.hget(hashKey, query);
            if (cache) {

                payload = JSON.parse(cache) as BaseUniversePayload;
                return payload;
            }

            payload = await Monmonga.universeDB().collection<BaseUniversePayload>(db).findOne({'variant.originalID': originalID, 'variant.variantUse': name});
            if (!payload) throw new UniVariantNotFoundError(originalID, name, db);
            redis.hset(hashKey, query, JSON.stringify(payload));
            redis.expire(hashKey, EXPIRATION);

        } catch(e) {
            console.log(e);
            payload = await Queries.getBaseType(originalID, db);
            
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

    public static async updateUserUniverse(_id: string | number, payload: UserUniversePayload) {
        console.log(payload.characters[0])
        try {            
            await Monmonga.universeDB().collection<UserUniversePayload>("users").updateOne({_id: _id}, { $set: payload }); 
    
        } catch(e) {
            console.log(e);
        } finally {
            return payload;
        }
      
    }

    public static async updateUserInventory(_id: string | number, inventory: Array<ItemInUser>) {
        //console.log(inventory)

        try {            
            await Monmonga.universeDB().collection<UserUniversePayload>("users").updateOne({_id: _id}, { $set: {"inventory": inventory} }); 
    
        } catch(e) {
            console.log(e);
        } finally {
            return inventory;
        }
    }

    public static async updateUserTomo(_id: string | number, tomo: Array<CharacterInUser>) {
        console.log(tomo)

        try {            
            await Monmonga.universeDB().collection<UserUniversePayload>("users").updateOne({_id: _id}, { $set: {"characters": tomo } }); 
    
        } catch(e) {
            console.log(e);
        } finally {
            return tomo;
        }
    }

    /**@Statistics | DB Calls*/





}

export = Queries;