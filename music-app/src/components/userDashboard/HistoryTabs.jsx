import { useState } from 'react';
import WatchHistoryList from './WatchHistoryList';
import SearchHistoryList from './SearchHistoryList';

export default function HistoryTabs() {
  const [tab, setTab] = useState('watch');

  return (
    <div className="bg-slate-900 p-6 rounded-xl text-white">
      <div className="flex gap-6 border-b border-slate-700 pb-2 mb-4">
        <button
          className={tab === 'watch' ? 'text-white' : 'text-slate-400'}
          onClick={() => setTab('watch')}
        >
          Watch History
        </button>

        <button
          className={tab === 'search' ? 'text-white' : 'text-slate-400'}
          onClick={() => setTab('search')}
        >
          Search History
        </button>
      </div>

      {tab === 'watch' && <WatchHistoryList />}
      {tab === 'search' && <SearchHistoryList />}
    </div>
  );
}
