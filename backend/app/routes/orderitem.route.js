const express = require("express");
const orderitems = require("../controllers/orderitem.controller");

const router = express.Router();

router.route("/")
    .get(orderitems.findAll)
    .post(orderitems.create)
    .delete(orderitems.deleteMany)
router.route("/:id")
    .get(orderitems.findOne)
    .put(orderitems.update)
    .delete( orderitems.delete)

module.exports = router;