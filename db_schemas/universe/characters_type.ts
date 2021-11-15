const { Schema, model} = require("mongoose");

const charSchema = new Schema({
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
    age: {
      type: Number,
      required: false
    },
    bloodtype: {
      type: String,
      required: false
    },
    description: {
      type: String,
      required: false
    },
    link: String

  });

const char = model("characters", charSchema)
export = char;