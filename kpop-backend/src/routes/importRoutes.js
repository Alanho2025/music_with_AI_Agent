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
// src/routes/importLLM.js
const axios = require("axios");

/**
 * 把 HTML 轉成純文字
 */
function cleanHTML(html) {
    return html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

/**
 * 從 kprofiles 頁面中，抽出「真正的 group profile 段落」
 * 例如： "ILLIT Members Profile" 開頭到後面幾千字
 */
function extractKprofilesSlice(cleanedText) {
    // 找 "XXX Members Profile" 這種標題
    const headerRegex = /([A-Za-z0-9.+\- ]+)\s+Members Profile/i;
    const match = cleanedText.match(headerRegex);

    let startIndex = 0;
    if (match) {
        startIndex = cleanedText.indexOf(match[0]);
    }

    // 往後抓一段內容，包含 group 簡介 + 成員 profile
    const SLICE_LENGTH = 1200;
    const slice = cleanedText.slice(startIndex, startIndex + SLICE_LENGTH);

    console.log("[DEBUG] slice start index:", startIndex);
    console.log("[DEBUG] slice head preview:", slice.slice(0, 200));

    return slice;
}

/**
 * 安全 JSON 解析：從第一個 { 到最後一個 } 截出來再 parse
 */
function safeJsonParse(str) {
    try {
        const start = str.indexOf("{");
        const end = str.lastIndexOf("}");
        if (start === -1 || end === -1 || end <= start) return null;
        const jsonStr = str.substring(start, end + 1);
        return JSON.parse(jsonStr);
    } catch (err) {
        console.error("JSON parse error:", err);
        return null;
    }
}

/**
 * DeepSeek 專用 prompt：讓它只輸出我們要的 JSON
 */
function buildPrompt(text) {
    return `
  You are a JSON generator that extracts K-pop group data from the text.
  
  Your job:
  1. Read the text carefully.
  2. Find the K-pop group profile, member profiles, and basic album information.
  3. Fill the JSON schema below from the text only.
  4. If something is missing, use "" for strings or 0 for numbers.
  5. Do NOT invent members, albums, or data that are not supported by the text.
  
  Output rules:
  - Output STRICT JSON ONLY.
  - No markdown.
  - No backticks.
  - No comments.
  - No explanation.
  - No text before or after the JSON.
  - Keys and structure must match the schema exactly.
  - Dates must use format YYYY-MM-DD.
  - "sales" is a number (no commas, no units).
  - "members_count" is a number.
  
  Schema:
  {
    "group": {
      "name": "",
      "korean_name": "",
      "gender": "",
      "debut_date": "",
      "company": "",
      "fanclub_name": "",
      "members_count": 0,
      "original_members": []
    },
    "idols": [
      {
        "stage_name": "",
        "birth_name": "",
        "korean_name": "",
        "position": "",
        "birthdate": "",
        "nationality": "",
        "image_url": ""
      }
    ],
    "albums": [
      {
        "title": "",
        "release_date": "",
        "country": "",
        "sales": 0,
        "peak_chart": ""
      }
    ]
  }
  
  Now read the following page content and return ONE JSON object that follows the schema:
  
  TEXT START
  ${text}
  TEXT END
  `;
}

/**
 * POST /api/import/group-llm
 * Body: { "sourceUrl": "https://kprofiles.com/illit-members-profile/" }
 */
router.post("/group-llm", async (req, res) => {
    console.log("hit /api/import/group-llm");

    try {
        const { sourceUrl } = req.body;
        if (!sourceUrl) {
            return res.status(400).json({ error: "Missing sourceUrl" });
        }

        console.log("[LLM] 1. Fetching HTML from:", sourceUrl);

        // 抓原始 HTML
        const htmlResp = await axios.get(sourceUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept": "text/html",
            },
        });

        console.log("[LLM] 2. Cleaning HTML...");
        const cleanedText = cleanHTML(htmlResp.data);

        // 🚩 只截取從 "ILLIT Members Profile" 之後的內容
        const relevantText = extractKprofilesSlice(cleanedText);
        const prompt = buildPrompt(relevantText);

        console.log("[LLM] 3. Calling Ollama /api/generate (deepseek-coder:6.7b)...");

        // 直接打 Ollama HTTP API，避免 JS client timeout 問題
        const ollamaResp = await axios.post(
            "http://127.0.0.1:11434/api/generate",
            {
                model: "deepseek-coder:1.3b",
                prompt,
                stream: false,
            },
            {
                timeout: 0, // 不限時間，先確保能拿到第一筆結果
            }
        );

        const content = ollamaResp.data?.response || "";
        console.log("[LLM] 4. Raw content preview:", content.slice(0, 200));

        const json = safeJsonParse(content);

        if (!json) {
            console.error("[LLM] JSON parse failed");
            return res.status(500).json({
                error: "LLM returned invalid JSON",
                rawPreview: content.slice(0, 400),
            });
        }

        console.log("[LLM] 5. Parsed JSON keys:", Object.keys(json));
        console.log("[LLM] FINAL JSON:", JSON.stringify(json, null, 2));
        return res.json(json);
    } catch (err) {
        console.error("LLM Import Error (outer catch):", err);
        return res.status(500).json({
            error: "LLM import failed",
            detail: err.message || String(err),
        });
    }
});
  
  


module.exports = router;