const express = require("express");
const app = express();
const blogRoute = require("./controller/blogRoute");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const protect = require("./middleware/authenticate")
require('dotenv').config();

mongoose.set("strictQuery", true);
mongoose.connect("mongodb+srv://testuser:12345@cluster0.v9mvjls.mongodb.net/BlogDB?retryWrites=true&w=majority");
var db = mongoose.connection;
db.on("open", () => {
    console.log("Connected to DB");
})
db.on("error", () => {
    console.log("Error occured");
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use("/blogRoute", blogRoute);
app.use("/auth/blogRoute", protect, blogRoute)


app.listen(4000, () => {
    console.log("Server connected to 4000")
})

