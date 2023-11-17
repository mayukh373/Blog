const mongoose = require("mongoose");
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
const commentSchema = new Schema({
    "comment": {type: String}, 
    "author": {type: String},
    "postId": {type: ObjectId},
    "userId": {type: ObjectId},
    "userImagePath": {type: String},
    "postedAt": {type: Date},
}, {
    collection: "comments"
})

module.exports = mongoose.model("comments", commentSchema);