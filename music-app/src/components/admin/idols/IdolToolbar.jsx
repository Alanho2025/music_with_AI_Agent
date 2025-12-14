// src/components/admin/IdolToolbar.jsx
import React from 'react';

function IdolToolbar({
  search,
  onSearchChange,
  filters,
  onFilterChange,
  groups,
}) {
  const updateFilters = (patch) => {
    onFilterChange({
      ...filters,
      ...patch,
    });
  };

  const handleReset = () => {
    onFilterChange({
      group: '',
      birthFrom: '',
      birthTo: '',
      imageStatus: 'all',
    });
  };

  return (
    <div className="mb-4 flex flex-wrap items-end gap-3 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
      {/* Search */}
      <div className="flex-1 min-w-[220px]">
        <label className="mb-1 block text-xs text-slate-400">Search</label>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
          placeholder="Search idols by name, group, or position..."
        />
      </div>

      {/* Group filter */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400">Group</label>
        <select
          value={filters.group || ''}
          onChange={(e) => updateFilters({ group: e.target.value })}
          className="min-w-[140px] rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
        >
          <option value="">All groups</option>
          {groups.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* Birthdate from */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400">Birthdate from</label>
        <input
          type="date"
          value={filters.birthFrom || ''}
          onChange={(e) => updateFilters({ birthFrom: e.target.value })}
          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
        />
      </div>

      {/* Birthdate to */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400">Birthdate to</label>
        <input
          type="date"
          value={filters.birthTo || ''}
          onChange={(e) => updateFilters({ birthTo: e.target.value })}
          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
        />
      </div>

      {/* Image status: image_url null or not */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400">Images</label>
        <select
          value={filters.imageStatus || 'all'}
          onChange={(e) => updateFilters({ imageStatus: e.target.value })}
          className="min-w-[150px] rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
        >
          <option value="all">All idols</option>
          <option value="with">With image</option>
          <option value="without">Without image</option>
        </select>
      </div>

      <button
        type="button"
        onClick={handleReset}
        className="ml-auto rounded-lg bg-slate-800 px-3 py-2 text-xs font-medium text-slate-100 hover:bg-slate-700"
      >
        Reset filters
      </button>
    </div>
  );
}

export default IdolToolbar;
