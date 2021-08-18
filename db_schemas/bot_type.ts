const { Schema, model } = require("mongoose");

const botSchema = new Schema({
    _id: Number,
    name: String,

    activities: Array  
  });

const bot_model = model("bot", botSchema)
export = bot_model;

