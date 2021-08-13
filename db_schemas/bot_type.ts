const { mongoose } = require("mongoose");

const botSchema = new mongoose.Schema({
    _id: Number,
    name: String,

    activities: Array,    
  });

const bot = mongoose.model("bot", botSchema)