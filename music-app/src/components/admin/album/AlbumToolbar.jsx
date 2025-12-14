// src/components/admin/AlbumToolbar.jsx
import React from 'react';

function AlbumToolbar({
  search,
  onSearchChange,
  onCreate,
  filters,
  onFilterChange,
  groups,
  countries,
}) {
  const handleFilterPatch = (patch) => {
    onFilterChange({
      ...filters,
      ...patch,
    });
  };

  return (
    <div className="mb-4 flex flex-wrap items-end gap-3 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
      {/* New album */}
      <button
        type="button"
        onClick={onCreate}
        className="rounded-lg bg-pink-500 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-600"
      >
        + New album
      </button>

      {/* Search */}
      <div className="flex-1 min-w-[220px]">
        <label className="mb-1 block text-xs text-slate-400">Search</label>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
          placeholder="Search albums by title or group..."
        />
      </div>

      {/* Group */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400">Group</label>
        <select
          value={filters.groupId || ''}
          onChange={(e) => handleFilterPatch({ groupId: e.target.value })}
          className="min-w-[140px] rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
        >
          <option value="">All groups</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      {/* Country */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400">Country</label>
        <select
          value={filters.country || ''}
          onChange={(e) => handleFilterPatch({ country: e.target.value })}
          className="min-w-[140px] rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
        >
          <option value="">All countries</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Release from */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400">Release from</label>
        <input
          type="date"
          value={filters.releaseFrom || ''}
          onChange={(e) => handleFilterPatch({ releaseFrom: e.target.value })}
          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
        />
      </div>

      {/* Release to */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400">Release to</label>
        <input
          type="date"
          value={filters.releaseTo || ''}
          onChange={(e) => handleFilterPatch({ releaseTo: e.target.value })}
          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
        />
      </div>

      {/* Reset */}
      <button
        type="button"
        onClick={() =>
          onFilterChange({
            groupId: '',
            country: '',
            releaseFrom: '',
            releaseTo: '',
          })
        }
        className="ml-auto rounded-lg bg-slate-800 px-3 py-2 text-xs font-medium text-slate-100 hover:bg-slate-700"
      >
        Reset filters
      </button>
    </div>
  );
}

export default AlbumToolbar;
