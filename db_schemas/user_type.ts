const { Schema, model} = require("mongoose");

const userSchema = new Schema({
    _id: Number,
    name: String,

    lvl: Number,
    xp: Number  
  });

const user = model("user", userSchema)
export = user;