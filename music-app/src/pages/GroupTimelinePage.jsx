// src/pages/GroupTimelinePage.jsx
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import AlbumTimelineHorizontal from '../components/album/AlbumTimelineHorizontal';
import AlbumDetailPanel from '../components/album/AlbumDetailPanel';
import GroupSelector from '../components/group/GroupSelector';
import api from '../api/client';

export default function GroupTimelinePage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [groups, setGroups] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  // 解析 query string
  const query = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const albumIdFromUrl = query.get('album');

  useEffect(() => {
    api.get('/groups').then((res) => setGroups(res.data || []));
  }, []);

  useEffect(() => {
    if (!id) return;
    api
      .get(`/groups/${id}/albums`)
      .then((res) => {
        setAlbums(res.data || []);
        setSelectedAlbum(null); // 換 group 先清空，後面再用 query 帶入
      })
      .catch((err) => {
        console.error('Failed to load albums timeline', err);
      });
  }, [id]);

  // 當 albums 載入完，又有 ?album=xx 時，自動選中對應專輯
  useEffect(() => {
    if (!albumIdFromUrl || albums.length === 0) return;

    const targetId = Number(albumIdFromUrl);
    const found = albums.find((a) => a.id === targetId);
    if (found) {
      setSelectedAlbum(found);
    }
  }, [albumIdFromUrl, albums]);

  const currentGroup = useMemo(() => {
    const numericId = Number(id);
    return groups.find((g) => g.id === numericId);
  }, [groups, id]);

  // 點時間軸的 album 時，同步更新網址
  const handleSelectAlbum = (album) => {
    setSelectedAlbum(album);
    navigate(`/groups/${id}?album=${album.id}`);
  };

  return (
    <div className="flex-1 min-h-screen bg-slate-950 px-4 py-6 md:px-6 lg:px-8">
      {/* 這層不要再 mx-auto / max-w，寬度就是 main 的 flex 區域 */}
      <div className="flex gap-6 items-start">
        {/* 左側 group selector：固定寬度 */}
        <div className="shrink-0">
          <GroupSelector groups={groups} />
        </div>

        {/* 右側：timeline + detail */}
        <div className="flex flex-col gap-6 bg-slate-950">
          {/* Heading */}
          <header className="flex flex-col gap-1">
            <h1 className="text-lg font-semibold text-slate-100">
              {currentGroup
                ? `${currentGroup.name} album timeline`
                : 'Album timeline'}
            </h1>
            <p className="text-xs text-slate-400 max-w-xl">
              Drag left or right to explore the release history, then click an
              album to see its details below.
            </p>
          </header>

          {/* Timeline 卡片：寬度 = 右側欄寬，不會跑到 sidebar 底下 */}
          <section className="max-w-7xl rounded-2xl border border-slate-600 bg-slate-800">
            {/* 真正負責水平捲動 */}
            <div className="w-full overflow-x-auto overflow-y-hidden">
              {/* 內容自然撐寬，只在捲動區內變長 */}
              <div className="inline-flex min-w-max px-6 py-6">
                <AlbumTimelineHorizontal
                  albums={albums}
                  onSelectAlbum={handleSelectAlbum}
                  selectedAlbumId={selectedAlbum?.id}
                />
              </div>
            </div>
          </section>

          {/* 下方 detail panel */}
          <section className="w-full">
            <AlbumDetailPanel album={selectedAlbum} />
          </section>
        </div>
      </div>
    </div>
  );
}
