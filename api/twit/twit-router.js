const router = require("express").Router();
const twitModel = require("./twit-model");
const mw = require("./twit-middleware");

router.get("/", async (req, res, next) => {
  const posts = await twitModel.postlarıGetir();
  res.status(200).json(posts); //post atılan tarihe göre sıralandı
});

router.get("/:id", mw.checkUserId, (req, res, next) => {
  res.status(200).json(req.yorum);
});

router.post("/", mw.checkPayloadAndUserIdExist, async (req, res, next) => {
  try {
    let insertedData = await twitModel.insertPost(req.body);
    res.json(insertedData);
  } catch (error) {
    next(error);
  }
});

router.put(
  "/:post_id",
  mw.checkPostId,
  mw.checkPostContent,
  async (req, res, next) => {
    try {
      const postUpdate = await twitModel.updatePost(
        req.body,
        req.params.post_id
      );
      res.status(200).json(postUpdate);
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/:post_id", mw.checkPostId, async (req, res, next) => {
  try {
    await twitModel.deletePost(req.params.post_id);
    res
      .status(200)
      .json({ message: `id'si ${req.params.post_id} olan post silindi` });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
