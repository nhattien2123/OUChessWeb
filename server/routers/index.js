const router = require("express").Router();
require("dotenv").config();

router.use("/auth", require("./auth"));
router.use("/user", require("./user"));
router.use("/match", require("./match"));

module.exports = router;