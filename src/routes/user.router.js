const router = require("express").Router();

const auth = require("../middleware/auth");
const userController = require("../controllers/user.controller");

router.get("/search", auth, userController.search);
router.get("/suggest", auth, userController.suggest);
router.get("/saved-posts", auth, userController.getSavedPosts);
router.get("/discover-posts", auth, userController.getDiscoverPosts);
router.get("/:id", auth, userController.get);
router.patch("/", auth, userController.update);
router.patch("/:id/follow", auth, userController.follow);
router.patch("/:id/unfollow", auth, userController.unfollow);
router.get("/:id/posts", auth, userController.getUserPosts);

module.exports = router;
