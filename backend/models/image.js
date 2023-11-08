const mongoose = require("mongoose");
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
const imageSchema = new mongoose.Schema({
    "filename": String,
    "originalname": String,
    "path": String,
    "mimetype": String,
  },{
    collection: "images"
    });

module.exports = mongoose.model("image", imageSchema);  
