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

memeController.updateMeme = async (req, res, next) => {
  try {
    const memeId = req.params.id;
    // Read data from the json file
    let rawData = fs.readFileSync("memes.json");
    let memes = JSON.parse(rawData).memes;
    const index = memes.findIndex((meme) => meme.id === memeId);
    if (index === -1) {
      return utilsHelper.sendResponse(
        res,
        400,
        false,
        null,
        new Error("Meme not found"),
        null
      );
    }
    const meme = memes[index];
    meme.texts = req.body.texts || [];
    meme.updatedAt = Date.now();

    // Put text on image
    await photoHelper.putTextOnImage(
      meme.originalImagePath,
      meme.outputMemePath,
      meme.texts
    );
    fs.writeFileSync("memes.json", JSON.stringify({ memes }));
    return utilsHelper.sendResponse(
      res,
      200,
      true,
      meme,
      null,
      "Meme has been updated!"
    );
  } catch (err) {
    next(err);
  }
};

module.exports = router;
