const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const db = require("../models");

router.post("/signup", (req, res, next) => {
  const email = req.body.email;
  const username = req.body.username;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const password = req.body.password;

  if (!email || !username || !firstname || !lastname || !password) res.status(400).json({ error: { message: 'email, username, firstname, lastname or password is missing' } });

  db.user.findOne({ email }).exec().then(existingUser => {
    if (!!existingUser) {
      res.status(409).json({ error: { message: 'email already exist' } });
    } else {
      db.user.findOne({ username }).exec().then(existingUser => {
        if (!!existingUser) {
          res.status(409).json({ error: { message: 'username already exist' } });
        } else {
          const user = new db.user({
            _id: new mongoose.Types.ObjectId(),
            firstname,
            lastname,
            email,
            username,
            password
          });

          user.save().then(newUser => {
            res.status(201).json({ "message": "User is created" });
          }).catch(error => {
            console.error(error);
            res.status(500).json({ error });
          });
        }
      }).catch(error => {
        console.error(error);
        res.status(500).json({ error });
      });
    }
  })
  .catch(error => {
    console.error(error);
    res.status(500).json({ error });
  });
});

module.exports = router;
