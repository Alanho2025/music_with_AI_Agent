// src/components/home/SkeletonCardRow.jsx
import React from 'react';

export default function SkeletonCardRow() {
  return (
    <div className="flex flex-col gap-3">
      <div className="h-5 w-32 rounded-md bg-slate-800 animate-pulse" />
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="w-40 shrink-0 rounded-xl bg-slate-900/80 p-3 flex flex-col gap-3 animate-pulse"
          >
            <div className="aspect-square w-full rounded-lg bg-slate-800" />
            <div className="h-4 w-24 rounded bg-slate-800" />
            <div className="h-3 w-16 rounded bg-slate-800" />
          </div>
        ))}
      </div>
    </div>
  );
}
