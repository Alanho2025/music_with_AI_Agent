// src/repositories/idolRepository.js
const pool = require("../../db");

async function createIdolFromWiki(data) {
    const {
        group_id,
        stage_name,
        birth_name,
        korean_name,
        position,
        birthdate,
        nationality,
        image_url,
    } = data;

    const result = await pool.query(
        `
    INSERT INTO idols
      (group_id, stage_name, birth_name, korean_name,
       position, birthdate, nationality, image_url)
    VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *;
    `,
        [
            group_id,
            stage_name,
            birth_name || null,
            korean_name || null,
            position || null,
            birthdate || null,
            nationality || null,
            image_url || null,
        ]
    );

    return result.rows[0];
}

module.exports = {
    createIdolFromWiki,
};
