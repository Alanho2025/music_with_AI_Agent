// src/utils/recommendUtils.js

/**
 * 根據 group 做多樣性限制:
 * - items: array of objects
 * - take: 最後要選出多少個 item
 * - groupKey: 代表 group 的欄位 (例如 "group_id")
 * - maxPerGroup: 每個 group 最多選幾個
 */
function pickWithGroupLimit(items, take, groupKey, maxPerGroup) {
    const counts = new Map();
    const result = [];

    for (const item of items) {
        const group = item[groupKey] ?? "unknown";
        const used = counts.get(group) || 0;

        if (used >= maxPerGroup) continue;

        counts.set(group, used + 1);
        result.push(item);

        if (result.length >= take) break;
    }

    return result;
}

module.exports = {
    pickWithGroupLimit,
};
  