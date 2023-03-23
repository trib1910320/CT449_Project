const express = require("express");
const orders = require("../controllers/order.controller");
const auth = require("../middlewares/auth");

const router = express.Router();

router.route("/")
    .get(orders.findAll)
    .post(orders.create)
router.route("/:id")
    .get(orders.findOne)
    .put(auth.verifyAdmin, orders.update)
    .delete(auth.verifyAdminOrder, orders.delete)

module.exports = router;