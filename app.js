//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");

const app = express();

app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(express.static("public"));
mongoose.set("strictQuery", true);

// Connecting DataBase
mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

// userSchema
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

// const secret = "Thisisourlittlesecret";
/* Encrypting the password field in the database. */
// userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

// user model and collection
const User = new mongoose.model("User", userSchema);

// Home Route
app.get("/", function(req, res) {
  res.render("home");
});
// Login Route
app.get("/login", function(req, res) {
  res.render("login");
});
// Register Route
app.get("/register", function(req, res) {
  res.render("register");
});

// Register Post Request
app.post("/register", function(req, res) {
  const newUser = new User({
    email: req.body.useremail,
    password: req.body.password
  });
  newUser.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});
// Login Post Request
app.post("/login", function(req, res) {
  const useremail = req.body.useremail;
  const password = req.body.password;

  User.findOne({ email: useremail }, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets");
        }
      }
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
