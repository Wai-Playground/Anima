const { Schema, model} = require("mongoose");

const bgSchema = new Schema({
    _id: Number,
    variant: {
      isVariant: Boolean,
      variantIds: {
        type: Array,
        required: false
      },
      variantUse: {
        type: String,
        required: false
      },
      originalId: {
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