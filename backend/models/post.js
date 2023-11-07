const mongoose = require("mongoose");
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
const postSchema = new Schema({
    "title": {type: String}, 
    "desc": {type: String},
    "content": {type: String},
    "username": {type: String},
    "userId": {type: ObjectId},
    "image": {type: String},
    "categories": {type: Array},
    "updatedAt": {type: Date}
}, {
    collection: "posts"
});

module.exports = mongoose.model("post", postSchema);