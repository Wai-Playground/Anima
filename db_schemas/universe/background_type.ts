import mongoose, { Schema } from "mongoose";

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

  const bg = mongoose.connection.useDb("universe").model("characters", bgSchema)
  export = bg;