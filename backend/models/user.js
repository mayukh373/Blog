const mongoose = require("mongoose");
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
const userSchema = new Schema({
    "username": {type: String},
    "email": {type: String},
    "password": {type: String},
    "createdOn": {type: Date},
    "imagePath": {type: String},
    "links": {type: Array},
    "bio": {type: String},
    "bookmarks": {type: Array}
}, {
    collection: "users"
});
module.exports = mongoose.model("user", userSchema);