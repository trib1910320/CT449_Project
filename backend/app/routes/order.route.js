const express = require("express");
const orders = require("../controllers/order.controller");
const auth = require("../middlewares/auth");

const router = express.Router();

router.route("/")
    .get(orders.findAll)
    .post(orders.create)
router.route("/user")
    .get(orders.findByUser)
router.route("/:id")
    .get(orders.findOne)
    .put(auth.verifyToken, auth.verifyAdmin, orders.update)
    .delete(auth.verifyAdminOrder, orders.delete)

module.exports = router;