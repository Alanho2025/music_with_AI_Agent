// src/controllers/importController.js
const axios = require("axios");
const cheerio = require("cheerio");

async function importFromUrl(req, res) {
    const { url } = req.body;

    try {
        if (!url) {
            return res.status(400).json({ error: "Missing URL" });
        }

        const resp = await axios.get(url, {
            validateStatus: () => true,
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Safari/605.1.15",
                "Accept":
                    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9",
            },
        });

        console.log("[importFromUrl] status:", resp.status);

        const html = resp.data;
        const $ = cheerio.load(html);

        const title =
            $("h1").first().text() ||
            $("title").text() ||
            null;

        console.log("[importFromUrl] page title:", title);

        if (resp.status >= 400) {
            return res.status(400).json({
                error: `Request failed with status ${resp.status} (title: ${title})`,
            });
        }

        return res.json({
            success: true,
            parsed: {
                group: { name: title },
                idols: [],
                albums: [],
            },
        });
    } catch (err) {
        console.error("[importFromUrl] unexpected error:", err.message);
        return res.status(500).json({
            error: "Failed to scrape URL",
        });
    }
}

async function importFromHtml(req, res) {
    const { html } = req.body;

    try {
        const $ = cheerio.load(html);
        const title =
            $("h1").first().text() ||
            $("title").text() ||
            null;

        return res.json({
            success: true,
            parsed: {
                group: { name: title },
                idols: [],
                albums: [],
            },
        });
    } catch (err) {
        console.error("[importFromHtml] error:", err.message);
        return res.status(400).json({ error: "Invalid HTML." });
    }
}

async function saveImportedData(req, res) {
    try {
        // 之後你再接 groupRepo / idolRepo 存 DB
        console.log("[saveImportedData] body keys:", Object.keys(req.body));
        return res.json({ success: true });
    } catch (err) {
        console.error("[saveImportedData] error:", err.message);
        return res.status(500).json({ error: "Failed to save." });
    }
}

module.exports = {
    importFromUrl,
    importFromHtml,
    saveImportedData,
};