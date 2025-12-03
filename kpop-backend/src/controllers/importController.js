// src/controllers/importController.js
const axios = require("axios");
const cheerio = require("cheerio");

const { createGroupFromWiki } = require("../repositories/groupRepository");
const { createIdolFromWiki } = require("../repositories/idolRepository");
const { createAlbumFromWiki } = require("../repositories/albumRepository");

// 先用簡單 parser：抓 <h1> 或 <title> 填 group.name
// 之後你要加 AI parser 再往這裡接就好
async function importFromUrl(req, res) {
    let url;

    if (typeof req.body === "string") {
        url = req.body.trim();
    } else if (req.body && typeof req.body.url === "string") {
        url = req.body.url.trim();
    }

    if (!url) {
        return res.status(400).json({ error: "Missing URL" });
    }

    try {
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

        if (!resp.data || typeof resp.data !== "string") {
            return res
                .status(400)
                .json({ error: `Request failed with status ${resp.status}` });
        }

        const html = resp.data;
        const $ = cheerio.load(html);

        const title =
            $("h1").first().text() ||
            $("title").text() ||
            null;

        // 這裡先只回 group.name，其餘從前端表單補
        return res.json({
            success: true,
            parsed: {
                group: {
                    name: title,
                },
                idols: [],
                albums: [],
            },
        });
    } catch (err) {
        console.error("[importFromUrl] unexpected error:", err.message);
        return res.status(500).json({
            error: "Failed to scrape or parse URL",
        });
    }
}

// 如果你之後要「手動貼 HTML」可以用這支
async function importFromHtml(req, res) {
    const { html } = req.body;
    if (!html) {
        return res.status(400).json({ error: "Missing HTML" });
    }

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
        return res.status(500).json({ error: "Failed to parse HTML." });
    }
}

// ⭐ 重點：把前端的 group / idols / albums 存進三張 table
async function saveImportedData(req, res) {
    try {
        const { parsed } = req.body || {};
        if (!parsed) {
            return res.status(400).json({ error: "Missing parsed data." });
        }

        const groupData = parsed.group || {};
        const idolsData = Array.isArray(parsed.idols) ? parsed.idols : [];
        const albumsData = Array.isArray(parsed.albums) ? parsed.albums : [];

        // 1) 先存 group
        let savedGroup = null;
        let groupId = null;

        if (groupData && groupData.name) {
            const payload = {
                name: groupData.name,
                korean_name: groupData.korean_name || null,
                gender: groupData.gender || null,
                debut_date: groupData.debut_date || null,
                company: groupData.company || null,
                members_count:
                    groupData.members_count ??
                    (idolsData.length ? idolsData.length : null),
                original_members: groupData.original_members || null,
                fanclub_name: groupData.fanclub_name || null,
                active:
                    typeof groupData.active === "boolean"
                        ? groupData.active
                        : true,
            };

            savedGroup = await createGroupFromWiki(payload);
            groupId = savedGroup.id;
        }

        // 沒有 group 也不崩，直接回錯
        if (!groupId) {
            return res.status(400).json({
                error:
                    "Group is missing or could not be created. Please check group name.",
            });
        }

        // 2) 存 idols（包含 image_url）
        const savedIdols = [];
        for (const idol of idolsData) {
            // 至少要有 stage_name 或 birth_name 才存
            if (!idol || (!idol.stage_name && !idol.birth_name)) continue;

            const payload = {
                group_id: groupId,
                stage_name: idol.stage_name || null,
                birth_name: idol.birth_name || null,
                korean_name: idol.korean_name || null,
                position: idol.position || null,
                birthdate: idol.birthdate || null,
                nationality: idol.nationality || null,
                image_url: idol.image_url || null, // ⭐ 圖片 URL 直接入 DB
            };

            const saved = await createIdolFromWiki(payload);
            savedIdols.push(saved);
        }

        // 3) 存 albums
        const savedAlbums = [];
        for (const album of albumsData) {
            if (!album || !album.title) continue;

            const payload = {
                group_id: groupId,
                title: album.title,
                release_date: album.release_date || null,
                country: album.country || null,
                sales: album.sales || null,
                peak_chart: album.peak_chart || null,
            };

            const saved = await createAlbumFromWiki(payload);
            savedAlbums.push(saved);
        }

        return res.json({
            success: true,
            group: savedGroup,
            idols: savedIdols,
            albums: savedAlbums,
        });
    } catch (err) {
        console.error("[saveImportedData] error:", err);
        return res.status(500).json({ error: "Failed to save imported data." });
    }
}

module.exports = {
    importFromUrl,
    importFromHtml,
    saveImportedData,
};
