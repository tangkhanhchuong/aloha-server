const router = require("express").Router();

const auth = require("../middleware/auth");
const notifyController = require("../controllers/notify.controller");

router.post("/", auth, notifyController.create);
router.delete("/:id", auth, notifyController.remove);
router.get("/", auth, notifyController.list);
router.patch("/:id/read", auth, notifyController.markAsRead);
router.delete("/", auth, notifyController.deleteAll);

module.exports = router;
