// src/components/idol/IdolList.js
import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { useSecureApi } from '../../api/secureClient';
import IdolCard from './IdolCard';
import IdolDetailPanel from './IdolDetailPanel';

export default function IdolList({ idols = [], loading = false, error = '' }) {
  const [selectedId, setSelectedId] = useState(null);

  // 單一 idol detail（含多圖片）
  const [idolDetail, setIdolDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // 訂閱狀態
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loadingSub, setLoadingSub] = useState(false);

  const secureApi = useSecureApi();

  // 當 idols 列表改變時，決定選哪一個 idol
  useEffect(() => {
    if (!idols || idols.length === 0) {
      setSelectedId(null);
      setIdolDetail(null);
      setIsSubscribed(false);
      return;
    }

    setSelectedId((prev) => {
      // 如果之前選的還在新的列表裡，就保留
      if (prev && idols.some((i) => i.id === prev)) return prev;
      // 否則預設選第一個
      return idols[0].id;
    });
  }, [idols]);

  // 根據 selectedId 載入 idol 詳細資料（對應你後端的 { idol, images }）
  useEffect(() => {
    if (!selectedId) {
      setIdolDetail(null);
      return;
    }

    let cancelled = false;

    async function loadDetail() {
      try {
        setDetailLoading(true);
        const res = await api.get(`/idols/${selectedId}`);
        if (cancelled) return;

        const data = res.data || {};
        const rawIdol = data.idol; // 後端 SELECT i.*, g.name AS group_name
        const images = data.images || [];

        if (!rawIdol) {
          setIdolDetail(null);
          return;
        }

        // 先用後端傳回來的 idol
        let merged = {
          ...rawIdol,
          images,
        };

        // 再把列表那邊的基本欄位（例如 group_name、image_url）合併進來
        const fromList = idols.find((i) => i.id === rawIdol.id);
        if (fromList) {
          merged = {
            ...fromList,
            ...merged,
          };
        }

        setIdolDetail(merged);
      } catch (e) {
        console.error('Failed to load idol detail', e);
        if (!cancelled) {
          setIdolDetail(null);
        }
      } finally {
        if (!cancelled) {
          setDetailLoading(false);
        }
      }
    }

    loadDetail();

    return () => {
      cancelled = true;
    };
  }, [selectedId, idols]);

  // 根據 selectedId 載入訂閱狀態
  useEffect(() => {
    if (!selectedId) {
      setIsSubscribed(false);
      return;
    }

    let cancelled = false;

    async function loadSub() {
      try {
        const res = await secureApi.get(`/idols/${selectedId}/subscription`);
        if (cancelled) return;
        // 後端建議回 { subscribed: true/false }
        setIsSubscribed(!!res.data?.subscribed);
      } catch (e) {
        console.error('Failed to load idol subscription', e);
        if (!cancelled) {
          setIsSubscribed(false);
        }
      }
    }

    loadSub();

    return () => {
      cancelled = true;
    };
  }, [selectedId, secureApi]);

  // 切換訂閱 / 取消訂閱
  const handleToggleSubscribe = async () => {
    if (!selectedId) return;

    try {
      setLoadingSub(true);
      if (isSubscribed) {
        await secureApi.delete(`/idols/${selectedId}/subscription`);
        setIsSubscribed(false);
      } else {
        await secureApi.post(`/idols/${selectedId}/subscription`);
        setIsSubscribed(true);
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
        {loading && (
          <p className="text-xs text-slate-400 mt-2">Loading idols...</p>
        )}

        {error && <p className="text-xs text-red-400 mt-2">{error}</p>}

        {!loading && !error && (!idols || idols.length === 0) && (
          <p className="text-xs text-slate-400 mt-2">
            No idols found with current filters.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mt-2">
          {idols.map((idol) => (
            <IdolCard
              key={idol.id}
              idol={idol}
              isActive={idol.id === selectedId}
              onClick={() => setSelectedId(idol.id)}
            />
          ))}
        </div>
      </div>

      {/* 右側 detail */}
      <div className="pl-2">
        <IdolDetailPanel
          idol={idolDetail}
          isSubscribed={isSubscribed}
          loadingSub={loadingSub || detailLoading}
          onToggleSubscribe={handleToggleSubscribe}
        />
      </div>
    </div>
  );
}
