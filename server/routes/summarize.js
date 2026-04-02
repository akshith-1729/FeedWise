const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  generateSummary,
  summarizeFile,
} = require("../controllers/summarizeController");

const upload = multer({ dest: "uploads/" });

router.post("/open", generateSummary);
router.post("/secure", generateSummary);

// 🔥 FILE ROUTE
router.post("/file", upload.single("file"), summarizeFile);

module.exports = router;