const router = require("express").Router();

const auth = require("../../middleware/auth");
const notificationController = require("./notification.controller");

router.post("/", auth, notificationController.create);
router.delete("/:id", auth, notificationController.remove);
router.get("/", auth, notificationController.list);
router.patch("/:id/read", auth, notificationController.markAsRead);
router.delete("/", auth, notificationController.deleteAll);

module.exports = router;
