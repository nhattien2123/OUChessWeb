const router = require("express").Router();
require("dotenv").config();

router.use("/auth", require("./auth"));
router.use("/user", require("./user"));

module.exports = router;