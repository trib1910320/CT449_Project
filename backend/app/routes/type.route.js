const express = require("express");
const types = require("../controllers/type.controller");
const auth = require("../middlewares/auth");

const router = express.Router();

router.route("/")
    .get(types.findAll)
    .post(auth.verifyAdmin, types.create)
router.route("/:id")
    .get(types.findOne)
    .put(auth.verifyAdmin, types.update)
    .delete(auth.verifyAdmin, types.delete)

module.exports = router;