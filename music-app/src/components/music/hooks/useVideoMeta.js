// src/components/music/hooks/useVideoMeta.js
import { useEffect, useState } from 'react';
import api from '../../../api/client';
import { useSecureApi } from '../../../api/secureClient';

export function useVideoMeta(currentVideo) {
  const secureApi = useSecureApi();
  const [meta, setMeta] = useState(null);
  const [metaLoading, setMetaLoading] = useState(false);
  const [liked, setLiked] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!currentVideo?.id) return;

    async function fetchMeta() {
      try {
        setMetaLoading(true);
        const res = await api.get(`/videos/${currentVideo.id}/meta`);
        setMeta(res.data);
      } catch (err) {
        console.error('Failed to load video meta', err);
        setMeta(null);
      } finally {
        setMetaLoading(false);
      }
    }

    async function fetchLiked() {
      try {
        const res = await secureApi.get(`/videos/${currentVideo.id}/liked`);
        setLiked(res.data.liked);
      } catch (err) {
        // 未登入或錯誤時，當作沒按讚
        setLiked(false);
      }
    }

    fetchMeta();
    fetchLiked();
  }, [currentVideo?.id]);

  async function handleToggleLike() {
    if (!currentVideo?.id) return;

    try {
      const res = await secureApi.post(`/videos/${currentVideo.id}/like`);
      const nowLiked = res.data.liked;
      setLiked(nowLiked);

      setMeta((prev) => {
        if (!prev) return prev;
        const currentLikes = Number(prev.likes) || 0;
        return {
          ...prev,
          likes: nowLiked ? currentLikes + 1 : currentLikes - 1,
        };
      });
    } catch (err) {
      console.error('Failed to toggle like', err);
    }
  }

  const displayCompany =
    meta?.company || currentVideo?.company || currentVideo?.group_company;
  const displayViews = Number(meta?.views ?? currentVideo?.views ?? 0) || 0;
  const displayLikes = Number(meta?.likes ?? currentVideo?.likes ?? 0) || 0;
  const displayGroup =
    meta?.groupName || currentVideo?.group_name || 'Unknown group';

  return {
    meta,
    metaLoading,
    liked,
    displayCompany,
    displayViews,
    displayLikes,
    displayGroup,
    handleToggleLike,
  };
}
