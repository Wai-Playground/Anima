const userSchema = new mongoose.Schema({
    _id: Number,
    name: String,

    activities: Array  
  });

const user = mongoose.model("user", userSchema)