const router = require("express").Router();
const User = require("./user-model");
const mw = require("./user-middleware");

router.get("/", async (req, res, next) => {
  const users = await User.getAllUsers();
  res.status(200).json(users);
});

router.delete("/:id", mw.checkUserId, async (req, res, next) => {
  try {
    await User.deleteUser(req.params.id);
    res
      .status(200)
      .json({ message: `id'si ${req.params.id} olan kullanıcı silindi` });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", mw.checkUserId, mw.checkName, async (req, res, next) => {
  try {
    const userUpdate = await User.updateUser(req.body, req.params.id);
    res.status(200).json(userUpdate);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
