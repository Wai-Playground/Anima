const { Schema, model} = require("mongoose");

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
    universe: {
      greetings: Array,
      farewells: Array,
      

    },
    link: String

  });

const char = model("characters", charSchema)
export = char;