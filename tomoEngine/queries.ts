//import user_universe from "../db_schemas/universe/user_universe_type";
import { UniBaseNotFoundError } from "./statics/errors";
import { backgroundPayload, characterPayload } from "./statics/types";
import Monmonga from "../client/Amadeus_Mongo";
class Queries {
    public static async character(_id: string | number) {
        let payload: characterPayload;
        
        try {
          
            payload = await Monmonga.universeDB().collection<characterPayload>("characters").findOne({ _id: _id});
            if (!payload) throw new UniBaseNotFoundError(_id, "background");

        } catch(e) {
            console.log(e);
        } finally {
            return payload;
        }
        
        

    }

    public static async background(_id: string | number) {
        let payload: backgroundPayload;
        try {
            payload = await Monmonga.universeDB().collection<backgroundPayload>("backgrounds").findOne({ _id: _id});
            if (!payload) throw new UniBaseNotFoundError(_id, "background");

        } catch(e) {
            console.log(e);
        } finally {
            return payload;
        }
        

    }

    public static async characterVariant(originalID: number | string, mood: string | number) {
        let payload: characterPayload;

        try {

            payload = await Monmonga.universeDB().collection<characterPayload>("characters").findOne({'variant.originalID': originalID, 'variant.variantUse': mood});
            if (!payload) throw new UniBaseNotFoundError(originalID, "character");

        } catch(e) {
            console.log(e);
        } finally {
            return payload;
        }

    }

    public static async backgroundVariant(originalID: number | string, name: string | number) {
        let payload: backgroundPayload;
        try {
            payload = await Monmonga.universeDB().collection<backgroundPayload>("backgrounds").findOne({'variant.originalID': originalID, 'variant.variantUse': name});
            if (!payload) throw new UniBaseNotFoundError(originalID, "background");

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