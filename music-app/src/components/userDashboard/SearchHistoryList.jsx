import { useEffect, useState } from 'react';
import { useSecureApi } from '../../api/secureClient';

export default function SearchHistoryList() {
  const api = useSecureApi();
  const [items, setItems] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await api.get('/users/search-history');
    setItems(res.data);
  }

  async function clearAll() {
    await api.delete('/users/search-history');
    load();
  }

  return (
    <div>
      <button className="text-red-400 mb-3" onClick={clearAll}>
        Clear All
      </button>

      {items.map((i) => (
        <p key={i.id} className="text-sm text-slate-300 mb-1">
          {i.keyword}
          <span className="text-slate-500 text-xs ml-2">{i.searched_at}</span>
        </p>
      ))}
    </div>
  );
}
