// src/hooks/useMusicSelection.js
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

function getGroupName(video) {
  if (!video) return '';
  return (
    video.group_name ||
    video.group ||
    video.groupName ||
    video.artist ||
    ''
  ).trim();
}

export function useMusicSelection(
  videos,
  playlistFilter,
  playlistItems,
  paramYoutubeId,
  paramTitle
) {
  // filters
  const [searchTerm, setSearchTerm] = useState('');
  const [groupFilter, setGroupFilter] = useState('All groups');
  const [sortBy, setSortBy] = useState('title'); // "title" | "group"
  const [sortDirection, setSortDirection] = useState('asc'); // "asc" | "desc"

  // 播放狀態
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const [deepLinkVideo, setDeepLinkVideo] = useState(null);
  const autoNextTimeoutRef = useRef(null);

  // group options for filter
  const groupOptions = useMemo(() => {
    const names = new Set();
    videos.forEach((v) => {
      const name = getGroupName(v);
      if (name) names.add(name);
    });
    return Array.from(names).sort();
  }, [videos]);

  // 初始選第一首（沒有 deep-link 的情況下）
  useEffect(() => {
    if (!videos.length) return;
    if (currentVideoId != null) return;
    if (deepLinkVideo) return;

    setCurrentVideoId(videos[0].id);
  }, [videos, currentVideoId, deepLinkVideo]);

  // 處理 URL deep-link: ?youtube=...
  useEffect(() => {
    if (!paramYoutubeId) {
      setDeepLinkVideo(null);
      return;
    }

    const match = videos.find((v) => v.youtube_id === paramYoutubeId);

    if (match) {
      setCurrentVideoId(match.id);
      setDeepLinkVideo(null);
    } else {
      setDeepLinkVideo({
        id: -1,
        title: paramTitle || 'Track',
        youtube_id: paramYoutubeId,
        duration_seconds: null,
        group_name: '',
      });
      setCurrentVideoId(null);
    }
  }, [paramYoutubeId, paramTitle, videos]);

  // 搜尋 + group filter + 排序 + playlist 模式
  const filteredVideos = useMemo(() => {
    if (playlistFilter && playlistItems.length > 0) {
      // 只看 playlist 的清單
      return playlistItems.map((i) => i.video);
    }

    const term = searchTerm.trim().toLowerCase();

    const filtered = videos.filter((v) => {
      const groupName = getGroupName(v);
      const matchGroup =
        groupFilter === 'All groups' || groupName === groupFilter;

      if (!term) return matchGroup;

      const haystack = [v.title, groupName, v.category, v.tags, v.description]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchSearch = haystack.includes(term);
      return matchGroup && matchSearch;
    });

    const sorted = [...filtered].sort((a, b) => {
      let aField;
      let bField;

      if (sortBy === 'group') {
        aField = getGroupName(a).toLowerCase();
        bField = getGroupName(b).toLowerCase();
      } else {
        aField = (a.title || '').toLowerCase();
        bField = (b.title || '').toLowerCase();
      }

      if (aField < bField) return sortDirection === 'asc' ? -1 : 1;
      if (aField > bField) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [
    videos,
    searchTerm,
    groupFilter,
    sortBy,
    sortDirection,
    playlistFilter,
    playlistItems,
  ]);

  // 決定目前播放哪支
  const currentVideo = useMemo(() => {
    if (deepLinkVideo) return deepLinkVideo;
    if (!filteredVideos.length) return null;
    if (currentVideoId == null) return filteredVideos[0];

    const found = filteredVideos.find((v) => v.id === currentVideoId);
    return found || filteredVideos[0];
  }, [filteredVideos, currentVideoId, deepLinkVideo]);

  const currentIndex = useMemo(() => {
    if (!currentVideo || deepLinkVideo) return -1;
    return filteredVideos.findIndex((v) => v.id === currentVideo.id);
  }, [filteredVideos, currentVideo, deepLinkVideo]);

  const upNext = useMemo(() => {
    if (currentIndex === -1) return [];
    return filteredVideos.slice(currentIndex + 1, currentIndex + 3);
  }, [filteredVideos, currentIndex]);

  const handleSelectVideo = useCallback((id) => {
    setCurrentVideoId(id);
    setDeepLinkVideo(null);
  }, []);

  const handlePrev = useCallback(() => {
    if (!filteredVideos.length || currentIndex <= 0) return;
    setCurrentVideoId(filteredVideos[currentIndex - 1].id);
    setDeepLinkVideo(null);
  }, [filteredVideos, currentIndex]);

  const handleNext = useCallback(() => {
    if (!filteredVideos.length) return;

    if (currentIndex === -1) {
      setCurrentVideoId(filteredVideos[0].id);
      setDeepLinkVideo(null);
      return;
    }

    const next = filteredVideos[currentIndex + 1];
    if (next) {
      setCurrentVideoId(next.id);
      setDeepLinkVideo(null);
    }
  }, [filteredVideos, currentIndex]);

  // 自動跳下一首
  useEffect(() => {
    if (!currentVideo || deepLinkVideo) return;

    if (autoNextTimeoutRef.current) {
      clearTimeout(autoNextTimeoutRef.current);
    }

    const durationSeconds = Number(currentVideo.duration_seconds || 0);
    if (!durationSeconds || durationSeconds <= 0) return;

    const delay = durationSeconds * 1000 + 5000;

    autoNextTimeoutRef.current = setTimeout(() => {
      handleNext();
    }, delay);

    return () => {
      if (autoNextTimeoutRef.current) {
        clearTimeout(autoNextTimeoutRef.current);
      }
    };
  }, [currentVideo, deepLinkVideo, handleNext]);

  return {
    searchTerm,
    setSearchTerm,
    groupFilter,
    setGroupFilter,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    groupOptions,
    filteredVideos,
    currentVideo,
    currentIndex,
    upNext,
    handleSelectVideo,
    handlePrev,
    handleNext,
  };
}
