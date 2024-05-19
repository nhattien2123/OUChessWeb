const router = require("express").Router();
require("dotenv").config();

router.use("/auth", require("./auth"));
router.use("/user", require("./User"));
router.use("/match", require("./Match"));
router.use("/admin", require("./Admin"))

module.exports = router;