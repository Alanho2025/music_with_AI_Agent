// src/components/home/ContinueListeningCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function getContinueListening() {
  try {
    const raw = localStorage.getItem('kpophub:lastPlayed');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read lastPlayed from localStorage', err);
    return null;
  }
}

export default function ContinueListeningCard() {
  const track = getContinueListening();

  if (!track) return null;

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-slate-800">
          {track.coverUrl ? (
            <img
              src={track.coverUrl}
              alt={track.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-lg">
              🎵
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Continue listening
          </p>
          <p className="text-sm font-semibold text-slate-50 truncate max-w-xs">
            {track.title}
          </p>
          <p className="text-xs text-slate-400 truncate max-w-xs">
            {track.artist || track.groupName}
          </p>
        </div>
      </div>
      <Link
        to="/music"
        className="inline-flex items-center rounded-full bg-fuchsia-500 px-4 py-1.5 text-xs font-medium text-white hover:bg-fuchsia-400 transition whitespace-nowrap"
      >
        Resume in player
      </Link>
    </section>
  );
}
