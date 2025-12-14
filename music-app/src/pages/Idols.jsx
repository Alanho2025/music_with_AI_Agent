// src/pages/Idols.jsx
import { useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import IdolToolbar from '../components/admin/idols/IdolToolbar';
import IdolList from '../components/idol/IdolList';

function Idols() {
  const [idols, setIdols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 給 IdolToolbar 用的狀態（和 admin 那邊一樣 key）
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    group: '',
    birthFrom: '',
    birthTo: '',
    imageStatus: 'all', // all | with | without
  });

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get('/idols');
        if (!isMounted) return;
        setIdols(res.data);
      } catch (err) {
        console.error('Failed to load idols', err);
        if (isMounted) setError('Failed to load idols.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  // 從 idols 中抽出 group 名稱列表，傳給 IdolToolbar 的 groups prop
  const groupNames = useMemo(() => {
    const set = new Set();
    idols.forEach((idol) => {
      if (idol.group_name) {
        set.add(idol.group_name);
      }
    });
    return Array.from(set).sort();
  }, [idols]);

  // 套用 search + filters 做前端篩選，丟給 IdolList 用
  const filteredIdols = useMemo(() => {
    return idols.filter((idol) => {
      const { group, birthFrom, birthTo, imageStatus } = filters;

      // 1) 搜尋：名字 / group
      if (search) {
        const keyword = search.toLowerCase();
        const name = (idol.stage_name || idol.name || '').toLowerCase();
        const groupName = (idol.group_name || '').toLowerCase();

        if (!name.includes(keyword) && !groupName.includes(keyword)) {
          return false;
        }
      }

      // 2) group 篩選
      if (group && idol.group_name !== group) {
        return false;
      }

      // 3) 生日區間篩選
      if ((birthFrom || birthTo) && idol.birthdate) {
        const idolDate = new Date(idol.birthdate);
        if (birthFrom && idolDate < new Date(birthFrom)) {
          return false;
        }
        if (birthTo && idolDate > new Date(birthTo)) {
          return false;
        }
      } else if ((birthFrom || birthTo) && !idol.birthdate) {
        // 有設定篩選，但這個 idol 沒生日 -> 直接排掉
        return false;
      }

      // 4) 有沒有 image_url
      if (imageStatus === 'with' && !idol.image_url) {
        return false;
      }
      if (imageStatus === 'without' && idol.image_url) {
        return false;
      }

      return true;
    });
  }, [idols, search, filters]);

  if (loading) {
    return <div className="p-6 text-slate-200">Loading idols...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-400">{error}</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Idols</h1>
        <p className="text-sm text-slate-400 mt-1">
          All idols from your database, joined with their groups.
        </p>
      </header>
      <div className="bg-slate-900 rounded-2xl p-4">
        <IdolToolbar
          search={search}
          onSearchChange={setSearch}
          filters={filters}
          onFilterChange={setFilters}
          groups={groupNames}
        />
        <IdolList idols={filteredIdols} loading={loading} error={error} />
      </div>
    </div>
  );
}

export default Idols;
