const express = require("express");
const toppings = require("../controllers/topping.controller");
const auth = require("../middlewares/auth");

const router = express.Router();

router.route("/")
    .get(toppings.findAll)
    .post(auth.verifyToken ,auth.verifyAdmin, toppings.create)
router.route("/:id")
    .get(toppings.findOne)
    .put(auth.verifyToken ,auth.verifyAdmin, toppings.update)
    .delete(auth.verifyToken ,auth.verifyAdmin, toppings.delete)

module.exports = router;