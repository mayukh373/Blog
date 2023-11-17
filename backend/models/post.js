const mongoose = require("mongoose");
const user = require('./user')

var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
const postSchema = new Schema({
    "title": {type: String}, 
    "desc": {type: String},
    "content": {type: String},
    "username": {type: String},
    "userId": {type: ObjectId},
    "userImagePath": {type: String},
    "imagePath": {type: String},
    "categories": {type: Array},
    "updatedAt": {type: Date},
    "viewedBy": {type: Array}
}, {
    collection: "posts"
});

module.exports = mongoose.model("post", postSchema);