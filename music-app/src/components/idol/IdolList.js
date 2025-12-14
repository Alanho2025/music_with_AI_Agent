// src/components/IdolList.js
import React, { useEffect, useMemo, useState } from 'react';
import api from '../../api/client';
import { useSecureApi } from '../../api/secureClient';
import IdolCard from './IdolCard';
import IdolDetailPanel from './IdolDetailPanel';

export default function IdolList() {
  const [idols, setIdols] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  // ⭐ 單一 idol detail（要包含 gallery）
  const [idolDetail, setIdolDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // 訂閱相關
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loadingSub, setLoadingSub] = useState(false);

  const [search, setSearch] = useState('');

  const secureApi = useSecureApi();

  // 1) 先載入 idols 列表
  useEffect(() => {
    async function fetchIdols() {
      try {
        setLoading(true);
        const res = await api.get('/idols');
        const rows = Array.isArray(res.data) ? res.data : [];
        setIdols(rows);
        if (rows.length > 0) {
          setSelectedId(rows[0].id);
        }
      } catch (e) {
        console.error('Failed to load idols', e);
        setError(
          e.response?.data?.error || 'Failed to load idols. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchIdols();
  }, []);

  // 2) selectedId 改變時，再打 /idols/:id 拿 detail + images
  useEffect(() => {
    if (!selectedId) {
      setIdolDetail(null);
      return;
    }

    let cancelled = false;

    async function fetchDetail() {
      try {
        setDetailLoading(true);
        const res = await api.get(`/idols/${selectedId}`);

        const data = res.data || {};
        // 後端如果是 { idol, images } 就用 idol；如果直接回整個 idol 物件也可以
        const idolObj = data.idol || data;
        const images = data.images || data.gallery_images || [];

        if (cancelled) return;

        setIdolDetail({
          ...idolObj,
          // ⭐ 統一掛在 gallery_images 上，給 IdolDetailPanel 用
          gallery_images: images,
        });
      } catch (err) {
        console.error('Failed to load idol detail', err);
      } finally {
        if (!cancelled) setDetailLoading(false);
      }
    }

    fetchDetail();

    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  // 3) 查詢訂閱狀態
  useEffect(() => {
    async function fetchSub() {
      if (!selectedId) return;
      try {
        const res = await secureApi.get(`/idols/${selectedId}/subscription`);
        setIsSubscribed(Boolean(res.data?.subscribed));
      } catch (e) {
        // 沒登入 / API 沒做好就先略過，不要整頁炸掉
        console.warn('subscription check failed', e);
      }
    }
    fetchSub();
  }, [selectedId, secureApi]);

  // 4) 左邊搜尋 filter
  const filteredIdols = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return idols;

    return idols.filter((i) => {
      const haystack = [
        i.stage_name,
        i.birth_name,
        i.korean_name,
        i.group_name,
        i.position,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [idols, search]);

  // 5) 切換訂閱 / 取消訂閱
  const handleToggleSubscribe = async () => {
    if (!selectedId) return;
    try {
      setLoadingSub(true);
      if (!isSubscribed) {
        await secureApi.post(`/idols/${selectedId}/subscribe`);
        setIsSubscribed(true);
      } else {
        await secureApi.delete(`/idols/${selectedId}/subscribe`);
        setIsSubscribed(false);
      }
    } catch (e) {
      console.error('toggle subscribe failed', e);
    } finally {
      setLoadingSub(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.4fr,1.6fr] gap-4">
      {/* 左側列表 */}
      <div className="flex flex-col gap-3 border-r border-slate-800 pr-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, group, position..."
            className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/60 focus:border-pink-500"
          />
        </div>

        {loading && (
          <p className="text-xs text-slate-400 mt-2">Loading idols...</p>
        )}
        {error && <p className="text-xs text-red-400 mt-2">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mt-2">
          {filteredIdols.map((idol) => (
            <IdolCard
              key={idol.id}
              idol={idol}
              isActive={idol.id === selectedId}
              onClick={() => setSelectedId(idol.id)}
            />
          ))}
          {!loading && filteredIdols.length === 0 && (
            <p className="text-xs text-slate-500 col-span-full">
              No idols found.
            </p>
          )}
        </div>
      </div>

      {/* 右側 detail */}
      <div className="pl-2">
        <IdolDetailPanel
          idol={idolDetail} // ⭐ 用 detail，不是 selectedIdol
          isSubscribed={isSubscribed}
          loadingSub={loadingSub || detailLoading}
          onToggleSubscribe={handleToggleSubscribe}
        />
      </div>
    </div>
  );
}
