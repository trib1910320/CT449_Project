const express = require("express");
const products = require("../controllers/product.controller");
const auth = require("../middlewares/auth");
const uploadCloud = require("../middlewares/uploader.js");

const router = express.Router();

router.route("/")
    .get(products.findAll)
    .post(auth.verifyToken ,auth.verifyAdmin, uploadCloud.single('image'), products.create)
router.route("/new")
    .get(products.findNewLimit)
router.route("/:id")
    .get(products.findOne)
    .put(auth.verifyToken ,auth.verifyAdmin, uploadCloud.single('image'), products.update)
    .delete(auth.verifyToken ,auth.verifyAdmin, products.delete)

module.exports = router;