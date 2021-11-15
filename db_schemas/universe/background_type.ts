const { Schema, model} = require("mongoose");

const bgSchema = new Schema({
    _id: Number,
    variant: {
      isVariant: Boolean,
      variant_use: {
        type: String,
        required: false
      },
      originalID: {
        type: Number,
        required: false
      }
    },
    name: String,
    description: String,
    link: String
  });

const bg = model("background", bgSchema)
export = bg;