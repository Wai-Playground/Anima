const { Schema, model} = require("mongoose");

const userUniSchema = new Schema({
    _id: Number,
    name: String,
    
  });

const user_universe = model("User", userUniSchema)
export = user_universe;