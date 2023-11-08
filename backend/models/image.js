const mongoose = require("mongoose");
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
const imageSchema = new mongoose.Schema({
    "filename": {type: String},
    "originalname": {type: String},
    "path": {type: String},
    "mimetype": {type: String},
  },{
    collection: "images"
    });

module.exports = mongoose.model("image", imageSchema);  
