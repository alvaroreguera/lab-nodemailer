const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const User = require("../models/User");
const sendAewsomeMail = require("../mail/sendMail")

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const rol = req.body.role;
  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const hashConf = bcrypt.hashSync(username, salt);
    const hashConfReal = hashConf.replace(/[\/. ,:-]+/g, "");

    console.log(hashConfReal)

    const newUser = new User({
      username,
      password: hashPass,
      confirmationCode: hashConfReal
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        sendAewsomeMail(email, hashConfReal);
        res.redirect("/auth/login")
      }
    });
  });
});

authRoutes.get("/confirm/:confirmCode", (req, res, next) => {
  let confirmationCode = req.params.confirmCode;
  User.findOneAndUpdate({ confirmationCode }, {status: "Active"},)
.then ((user)=>{
  res.render("auth/confirmation", user);
console.log(user)})
.catch((err) => {
  console.log(err);
  res.render("auth/login");

}
)
});


authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = authRoutes;
