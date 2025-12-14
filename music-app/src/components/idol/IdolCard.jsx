// src/components/IdolCard.jsx
import React from 'react';

export default function IdolCard({ idol, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl border px-4 py-3 transition
                ${
                  isActive
                    ? 'border-pink-500 bg-slate-800/80'
                    : 'border-slate-800 bg-slate-900 hover:border-pink-400 hover:bg-slate-800/70'
                }`}
    >
      <p className="text-sm font-semibold text-slate-50">{idol.stage_name}</p>
      <p className="text-xs text-slate-400 mt-1">
        Group: <span className="text-slate-200">{idol.group_name}</span>
      </p>
      <p className="text-xs text-slate-500">Position: {idol.position}</p>
    </button>
  );
}
