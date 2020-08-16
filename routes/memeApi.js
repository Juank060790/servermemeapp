var express = require("express");
var router = express.Router();
const fileUpload = require("../helpers/upload.helper")("public/images/");
const uploader = fileUpload.uploader;
const photoHelper = require("../helpers/photo.helper");
const memeController = require("../controllers/memeController");

/**
 * @route GET api/memes/images
 * @description Get all memes
 * @access Public
 */
router.get("/images", memeController.getOriginalImages);

/**
 * @route GET api/memes
 * @description Get all memes
 * @access Public
 */
router.get("/", memeController.getMemes);

/**
 * @route POST api/memes
 * @description Create a new meme
 * @access Public
 */
router.post(
  "/",
  uploader.single("image"),
  photoHelper.resize,
  memeController.createMeme
);

router.put("/:id", memeController.updateMeme);

module.exports = router;
