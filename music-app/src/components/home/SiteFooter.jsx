// src/components/home/SiteFooter.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function SiteFooter() {
  return (
    <footer className="mt-4 border-t border-slate-900 pt-4 text-[11px] text-slate-500 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        <span>K-pop Music Hub · personal project</span>
        <Link
          to="https://github.com/Alanho2025"
          target="_blank"
          rel="noreferrer"
          className="hover:text-slate-300"
        >
          GitHub
        </Link>
        <span>Data stored in your PostgreSQL database.</span>
      </div>
      <div className="flex gap-3">
        <span>© {new Date().getFullYear()} Alan</span>
      </div>
    </footer>
  );
}
