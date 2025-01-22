const express = require("express");
const controller = require('../controllers/admindashboard.controller')

const router = express.Router();

router.post("/login",controller.loginUser);
router.get("/login",controller.loginUser);
router.delete("/login",controller.loginUser);


router.post("/sign",controller.loginUser);


module.exports = router;