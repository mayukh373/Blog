const mongoose = require("mongoose");
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
const userSchema = new Schema({
    "username": {type: String},
    "email": {type: String},
    "password": {type: String}
}, {
    collection: "users"
});
module.exports = mongoose.model("user", userSchema);