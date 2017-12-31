const express = require("express");
const router = express.Router();

router.get("/signup", (req, res, next) => {
  res.send('Signup');
});

module.exports = router;
