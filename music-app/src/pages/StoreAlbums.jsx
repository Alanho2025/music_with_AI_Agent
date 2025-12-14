// src/pages/StoreAlbums.jsx
import React, { useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import AlbumFilters from '../components/store/AlbumFilters';
import AlbumCard from '../components/store/AlbumCard';

function StoreAlbums() {
  const [albums, setAlbums] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [filters, setFilters] = useState({
    availability: null, // "in_stock" | "out_of_stock" | null
    minPrice: null,
    maxPrice: null,
    groups: [],
  });

  // ✅ 只在一開始載入資料，不要把 filters 放進來
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await api.get('/albums');
        if (cancelled) return;
        const raw = res.data || [];

        const normalized = raw.map((a) => ({
          ...a,
          price_nzd:
            a.price_nzd !== null && a.price_nzd !== undefined
              ? Number(a.price_nzd)
              : null,
          stock:
            a.stock !== null && a.stock !== undefined ? Number(a.stock) : null,
        }));

        setAlbums(normalized);
      } catch (err) {
        console.error('Failed to load albums', err);
      } finally {
        if (!cancelled) setInitialLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [api]);

  // ✅ 所有 filter 都在前端記憶體做，完全不重新去打 API
  const filteredAlbums = useMemo(() => {
    if (!albums.length) return [];

    const { availability, minPrice, maxPrice, groups } = filters;

    // 自動計算價格上下限（只在 albums 變化時生效）
    const numericPrices = albums
      .map((a) => a.price_nzd)
      .filter((p) => typeof p === 'number');
    const autoMin = numericPrices.length ? Math.min(...numericPrices) : 0;
    const autoMax = numericPrices.length ? Math.max(...numericPrices) : 0;

    let min = minPrice ?? autoMin;
    let max = maxPrice ?? autoMax;

    return albums.filter((a) => {
      // Availability
      if (availability === 'in_stock') {
        if (!(typeof a.stock === 'number' && a.stock > 0)) {
          return false;
        }
      } else if (availability === 'out_of_stock') {
        if (!(typeof a.stock === 'number' && a.stock <= 0)) {
          return false;
        }
      }

      // Group filter
      if (groups.length > 0) {
        if (!a.group_name || !groups.includes(a.group_name)) {
          return false;
        }
      }

      // Price range
      if (typeof a.price_nzd === 'number') {
        if (a.price_nzd < min || a.price_nzd > max) {
          return false;
        }
      }

      return true;
    });
  }, [albums, filters]);

  return (
    <div className="flex h-full">
      <AlbumFilters
        albums={albums}
        filters={filters}
        onFiltersChange={setFilters}
      />

      <main className="flex-1 px-4 md:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-slate-50 tracking-tight">
              In stock albums
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Browse K-pop albums, filter by group, price, and stock, then add
              them to your cart.
            </p>
          </div>

          <div className="hidden md:block">
            <label className="text-[11px] text-slate-400 mr-2">Sort</label>
            <select className="bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 px-2 py-1">
              <option>Featured</option>
              <option>Price: Low to high</option>
              <option>Price: High to low</option>
              <option>Newest</option>
            </select>
          </div>
        </div>

        {initialLoading ? (
          <p className="text-xs text-slate-400">Loading albums...</p>
        ) : filteredAlbums.length === 0 ? (
          <p className="text-xs text-slate-400">
            No albums match your filters.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredAlbums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default StoreAlbums;
