// src/api/wikiClient.js
// 專門包一下 Wikipedia import 的後端 API

import { useSecureApi } from "./secureClient";

// Group import
export function useWikiGroupApi() {
    const secureApi = useSecureApi();

    async function importGroup(payload) {
        const res = await secureApi.post("/wiki/groups/import", payload);
        return res.data;
    }

    return { importGroup };
}

// Idol import
export function useWikiIdolApi() {
    const secureApi = useSecureApi();

    async function importIdol(payload) {
        const res = await secureApi.post("/api/wiki/idols/import", payload);
        return res.data;
    }

    return { importIdol };
}

// Album import
export function useWikiAlbumApi() {
    const secureApi = useSecureApi();

    async function importAlbum(payload) {
        const res = await secureApi.post("/api/wiki/albums/import", payload);
        return res.data;
    }

    return { importAlbum };
}
