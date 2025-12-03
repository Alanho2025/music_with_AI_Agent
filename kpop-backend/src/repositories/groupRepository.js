// src/repositories/groupRepository.js
const pool = require("../../db");

async function createGroupFromWiki(data) {
    const {
        name,
        korean_name,
        gender,
        debut_date,
        company,
        members_count,
        original_members,
        fanclub_name,
        active,
    } = data;

    const result = await pool.query(
        `
    INSERT INTO groups
      (name, korean_name, gender, debut_date, company,
       members_count, original_members, fanclub_name, active)
    VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING *;
    `,
        [
            name,
            korean_name || null,
            gender || null,
            debut_date || null,
            company || null,
            members_count || null,
            original_members || null,
            fanclub_name || null,
            active ?? true,
        ]
    );

    return result.rows[0];
}

module.exports = {
    createGroupFromWiki,
};
