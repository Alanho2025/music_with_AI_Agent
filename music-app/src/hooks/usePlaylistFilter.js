// src/hooks/usePlaylistFilter.js
import { useCallback, useEffect, useState } from 'react';

export function usePlaylistFilter(secureApi) {
  const [playlists, setPlaylists] = useState([]);
  const [playlistFilter, setPlaylistFilter] = useState(null); // playlist id
  const [playlistItems, setPlaylistItems] = useState([]);

  // 抓全部 playlists
  useEffect(() => {
    async function loadPlaylists() {
      try {
        const res = await secureApi.get('/playlists');
        setPlaylists(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error('Failed to load playlists', e);
      }
    }

    loadPlaylists();
  }, []);

  // 點選 playlist tag
  const handlePlaylistSelect = useCallback(
    async (id) => {
      // 再點一次同一個就取消
      if (playlistFilter === id) {
        setPlaylistFilter(null);
        setPlaylistItems([]);
        return;
      }

      if (!id) {
        setPlaylistFilter(null);
        setPlaylistItems([]);
        return;
      }

      setPlaylistFilter(id);

      try {
        const res = await secureApi.get(`/playlists/${id}`);
        const items = res.data.items || [];

        const mapped = items.map((i) => ({
          video_id: i.video_id,
          video: {
            id: i.video_id,
            title: i.title,
            youtube_id: i.youtube_id,
            category: i.category,
            group_name: i.group_name,
            duration_seconds: i.duration_seconds,
          },
        }));

        setPlaylistItems(mapped);
      } catch (err) {
        console.error('Failed to load playlist', err);
      }
    },
    [playlistFilter, secureApi]
  );

  return {
    playlists,
    playlistFilter,
    playlistItems,
    handlePlaylistSelect,
  };
}
