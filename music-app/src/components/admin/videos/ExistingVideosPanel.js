// src/components/admin/videos/ExistingVideosPanel.jsx
import React from 'react';

function ExistingVideosPanel({
  videos,
  filteredVideos,
  listLoading,
  selectedVideoId,
  searchTerm,
  setSearchTerm,
  letterFilter,
  setLetterFilter,
  groupFilter,
  setGroupFilter,
  sortOrder,
  setSortOrder,
  groupNameOptions,
  onEdit,
  onDelete,
}) {
  const letterOptions = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Existing songs</h2>
        {listLoading && (
          <span className="text-xs text-slate-400">Loading...</span>
        )}
      </div>

      {/* Filters row */}
      <div className="flex flex-col gap-2">
        {/* search + sort */}
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 rounded-md bg-slate-950 border border-slate-700 text-xs"
            placeholder="Search by title, group, or YouTube ID..."
          />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-2 py-2 rounded-md bg-slate-950 border border-slate-700 text-xs"
          >
            <option value="asc">Sort A-Z</option>
            <option value="desc">Sort Z-A</option>
          </select>
        </div>

        {/* letter filter */}
        <div className="flex flex-wrap gap-1 text-[10px]">
          <button
            type="button"
            onClick={() => setLetterFilter('')}
            className={`px-2 py-1 rounded-md border ${
              letterFilter === ''
                ? 'bg-slate-700 border-slate-500 text-slate-50'
                : 'bg-slate-950 border-slate-700 text-slate-400'
            }`}
          >
            All letters
          </button>
          {letterOptions.map((ch) => (
            <button
              key={ch}
              type="button"
              onClick={() => setLetterFilter(letterFilter === ch ? '' : ch)}
              className={`px-2 py-1 rounded-md border ${
                letterFilter === ch
                  ? 'bg-slate-700 border-slate-500 text-slate-50'
                  : 'bg-slate-950 border-slate-700 text-slate-400'
              }`}
            >
              {ch}
            </button>
          ))}
        </div>

        {/* group tag filter */}
        {groupNameOptions.length > 0 && (
          <div className="flex flex-wrap gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => setGroupFilter('')}
              className={`px-2 py-1 rounded-full border ${
                groupFilter === ''
                  ? 'bg-slate-700 border-slate-500 text-slate-50'
                  : 'bg-slate-950 border-slate-700 text-slate-400'
              }`}
            >
              All groups
            </button>
            {groupNameOptions.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setGroupFilter(groupFilter === name ? '' : name)}
                className={`px-2 py-1 rounded-full border ${
                  groupFilter === name
                    ? 'bg-emerald-500/80 border-emerald-400 text-slate-950'
                    : 'bg-slate-950 border-slate-700 text-slate-300'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* list */}
      {filteredVideos.length === 0 && !listLoading && (
        <p className="text-xs text-slate-400">
          No videos found with current filters.
        </p>
      )}

      <div className="flex flex-col gap-2 max-h-[520px] overflow-y-auto pr-1">
        {filteredVideos.map((v) => (
          <div
            key={v.id}
            className={`flex items-center justify-between px-3 py-2 rounded-md text-xs ${
              selectedVideoId === v.id ? 'bg-slate-700' : 'bg-slate-800'
            }`}
          >
            <div className="flex flex-col">
              <span className="font-medium">{v.title}</span>
              <span className="text-slate-400">
                {v.group_name ? `${v.group_name} · ` : ''}
                {v.category || 'video'} ·{' '}
                <span className="font-mono">{v.youtube_id}</span>
              </span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onEdit(v)}
                className="px-3 py-1 rounded-md bg-slate-700 text-[11px]"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(v.id)}
                className="px-3 py-1 rounded-md bg-red-500/80 text-[11px]"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExistingVideosPanel;
