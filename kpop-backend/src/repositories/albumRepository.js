// src/repositories/albumRepository.js
const pool = require("../../db");

async function createAlbumFromWiki(data) {
    const { group_id, title, release_date, country, sales, peak_chart } = data;

    const result = await pool.query(
        `
    INSERT INTO albums
      (group_id, title, release_date, country, sales, peak_chart)
    VALUES
      ($1,$2,$3,$4,$5,$6)
    RETURNING *;
    `,
        [group_id, title, release_date || null, country || null, sales || null, peak_chart || null]
    );

    return result.rows[0];
}

module.exports = {
    createAlbumFromWiki,
};
