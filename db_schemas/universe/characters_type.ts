import mongoose, { Schema } from "mongoose";


const charSchema = new Schema({
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
    personality: {
      greetings: Array,
      farewells: Array,
      
    },
    link: String

  });
const char = mongoose.connection.useDb("universe").model("characters", charSchema)
export = char;