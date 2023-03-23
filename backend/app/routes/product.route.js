const express = require("express");
const products = require("../controllers/product.controller");
const auth = require("../middlewares/auth");
const uploadCloud = require("../middlewares/uploader.js");

const router = express.Router();

router.route("/")
    .get(products.findAll)
    .post(auth.verifyAdmin, uploadCloud.single('image'), products.create)
router.route("/:id")
    .get(products.findOne)
    .put(auth.verifyAdmin, uploadCloud.single('image'), products.update)
    .delete(auth.verifyAdmin, products.delete)

module.exports = router;