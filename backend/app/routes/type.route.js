const express = require("express");
const types = require("../controllers/type.controller");
const auth = require("../middlewares/auth");
const uploadCloud = require("../middlewares/uploader.js");

const router = express.Router();

router.route("/")
    .get(types.findAll)
    .post(auth.verifyToken, auth.verifyAdmin, uploadCloud.single('image'), types.create)
router.route("/:id")
    .get(types.findOne)
    .put(auth.verifyToken, auth.verifyAdmin, uploadCloud.single('image'), types.update)
    .delete(auth.verifyToken, auth.verifyAdmin, types.delete)

module.exports = router;