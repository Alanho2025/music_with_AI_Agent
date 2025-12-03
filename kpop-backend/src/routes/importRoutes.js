// routes/importRoutes.js
const express = require("express");
const router = express.Router();
const { importFromUrl, importFromHtml, saveImportedData } = require("../controllers/importController");

// 用 POST /api/import/url
router.post("/url", importFromUrl);

// 如果之後要貼 HTML 用這個
router.post("/html", importFromHtml);

// 存到 DB
router.post("/save", saveImportedData);

module.exports = router;