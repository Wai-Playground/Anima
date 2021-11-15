import bg from "../db_schemas/universe/background_type";
import char from "../db_schemas/universe/characters_type";
import user_universe from "../db_schemas/universe/user_universe_type";
import { backgroundPayload, characterPayload } from "./statics/types";

const mongoose = require("mongoose");

class Queries {
    
    public static async character(_id: String | number) {
        return await char.findOne({ _id: _id}) as characterPayload;
        

    }

    public static async userUniverse(_id: String | number) {
        return await user_universe.findOne({ _id: _id});
        

    }

    public static async backgroundUniverse(_id: String | number) {
        return await bg.findOne({ _id: _id}) as backgroundPayload;
        

    }


}

export = Queries;