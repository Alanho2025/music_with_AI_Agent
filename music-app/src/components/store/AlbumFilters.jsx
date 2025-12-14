// src/components/store/AlbumFilters.jsx
import React, { useMemo } from 'react';

function AlbumFilters({ albums, filters, onFiltersChange }) {
  const { availability, minPrice, maxPrice, groups } = filters;

  // 從 albums 算出 group list + 價格區間
  const { groupOptions, priceRange, counts } = useMemo(() => {
    const groupSet = new Set();
    let min = Number.POSITIVE_INFINITY;
    let max = 0;
    let inStock = 0;
    let outOfStock = 0;

    albums.forEach((a) => {
      if (a.group_name) groupSet.add(a.group_name);
      if (typeof a.price_nzd === 'number') {
        if (a.price_nzd < min) min = a.price_nzd;
        if (a.price_nzd > max) max = a.price_nzd;
      }
      if (typeof a.stock === 'number') {
        if (a.stock > 0) inStock += 1;
        else outOfStock += 1;
      }
    });

    if (min === Number.POSITIVE_INFINITY) min = 0;

    return {
      groupOptions: Array.from(groupSet).sort(),
      priceRange: { min, max },
      counts: { inStock, outOfStock },
    };
  }, [albums]);

  const toggleGroup = (name) => {
    const set = new Set(groups);
    if (set.has(name)) set.delete(name);
    else set.add(name);
    onFiltersChange({ ...filters, groups: Array.from(set) });
  };

  return (
    <aside className="w-72 border-r border-slate-800 pr-4 hidden lg:block">
      <h2 className="text-sm font-semibold text-slate-100 mb-4">
        Filter products
      </h2>

      {/* Availability */}
      <div className="mb-6">
        <button
          type="button"
          className="w-full flex items-center justify-between py-2"
        >
          <span className="text-xs font-semibold text-slate-300">
            Availability
          </span>
        </button>
        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={() =>
              onFiltersChange({
                ...filters,
                availability: availability === 'in_stock' ? null : 'in_stock',
              })
            }
            className={`flex-1 rounded-full border px-3 py-1 text-[11px] ${
              availability === 'in_stock'
                ? 'bg-slate-100 text-slate-900 border-slate-100'
                : 'border-slate-600 text-slate-200'
            }`}
          >
            In stock ({counts.inStock})
          </button>
          <button
            type="button"
            onClick={() =>
              onFiltersChange({
                ...filters,
                availability:
                  availability === 'out_of_stock' ? null : 'out_of_stock',
              })
            }
            className={`flex-1 rounded-full border px-3 py-1 text-[11px] ${
              availability === 'out_of_stock'
                ? 'bg-slate-100 text-slate-900 border-slate-100'
                : 'border-slate-600 text-slate-200'
            }`}
          >
            Out of stock ({counts.outOfStock})
          </button>
        </div>
      </div>

      {/* Group filter */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-slate-300 mb-2">Group</p>
        <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
          {groupOptions.map((name) => {
            const active = groups.includes(name);
            return (
              <button
                key={name}
                type="button"
                onClick={() => toggleGroup(name)}
                className={`w-full flex items-center justify-between rounded-md px-2 py-1 text-[11px] ${
                  active
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="truncate">{name}</span>
                {active && <span className="text-[10px]">×</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price range */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-slate-300 mb-2">Price (NZD)</p>
        <div className="flex gap-2 mb-2">
          <div className="flex-1">
            <label className="text-[10px] text-slate-500 block mb-1">
              From
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-2 rounded-l-lg border border-slate-700 bg-slate-900 text-[11px] text-slate-300">
                $
              </span>
              <input
                type="number"
                step="0.5"
                min={priceRange.min}
                max={priceRange.max}
                className="flex-1 rounded-r-lg bg-slate-950 border border-l-0 border-slate-700 px-2 py-1 text-[11px] text-slate-100"
                value={minPrice ?? priceRange.min}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    minPrice: Number(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>
          <div className="flex-1">
            <label className="text-[10px] text-slate-500 block mb-1">To</label>
            <div className="flex">
              <span className="inline-flex items-center px-2 rounded-l-lg border border-slate-700 bg-slate-900 text-[11px] text-slate-300">
                $
              </span>
              <input
                type="number"
                step="0.5"
                min={priceRange.min}
                max={priceRange.max}
                className="flex-1 rounded-r-lg bg-slate-950 border border-l-0 border-slate-700 px-2 py-1 text-[11px] text-slate-100"
                value={maxPrice ?? priceRange.max}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    maxPrice: Number(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default AlbumFilters;
