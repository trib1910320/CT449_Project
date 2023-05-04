const express = require("express");
const users = require("../controllers/user.controller");
const auth = require("../middlewares/auth");
const uploadCloud = require("../middlewares/uploader.js");

const router = express.Router();

router.route("/")
    .get(auth.verifyAdmin, users.findAll)
router.route("/logout")
    .get(users.logOut)
router.route("/:id")
    .get(users.findOne)
    .put(auth.verifyAdminUser, uploadCloud.single('avatar'), users.update)
    .delete(auth.verifyAdminUser, users.delete)

module.exports = router;