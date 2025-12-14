import { useNavigate } from 'react-router-dom';
export default function ProfileCard({ profile, stats }) {
  const navigate = useNavigate();
  return (
    <div className="bg-slate-800 p-6 rounded-xl text-white mb-6">
      <div className="flex items-center gap-4">
        <img
          src={profile.avatar_url}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <p className="text-xl font-semibold">{profile.username}</p>
          <p className="text-slate-400">{profile.email}</p>
        </div>
        <button
          onClick={() => navigate('/settings')}
          className="p-2 rounded-lg hover:bg-slate-800 transition text-slate-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="w-6 h-6"
          >
            <path d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.4 15a1.6 1.6 0 00.3 1.8l.1.2a2 2 0 01-2.8 2.8l-.2-.1a1.6 1.6 0 00-1.8-.3 1.6 1.6 0 00-1 1.5V21a2 2 0 01-4 0v-.3a1.6 1.6 0 00-1-1.5 1.6 1.6 0 00-1.8.3l-.2.1a2 2 0 01-2.8-2.8l.1-.2a1.6 1.6 0 00.3-1.8 1.6 1.6 0 00-1.5-1H3a2 2 0 010-4h.3a1.6 1.6 0 001.5-1 1.6 1.6 0 00-.3-1.8l-.1-.2a2 2 0 012.8-2.8l.2.1a1.6 1.6 0 001.8.3h.1a1.6 1.6 0 001-1.5V3a2 2 0 014 0v.3a1.6 1.6 0 001 1.5 1.6 1.6 0 001.8-.3l.2-.1a2 2 0 012.8 2.8l-.1.2a1.6 1.6 0 00-.3 1.8v.1c.2.7.8 1.2 1.5 1.2H21a2 2 0 010 4h-.3c-.7 0-1.3.5-1.5 1.2z"
            />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-4 text-center mt-6">
        <StatItem value={stats.watch_count} label="Videos Watched" />
        <StatItem value={stats.idol_follow_count} label="Idols Followed" />
        <StatItem value={stats.group_follow_count} label="Groups Followed" />
        <StatItem value={stats.playlist_count} label="Playlists" />
      </div>
    </div>
  );
}

function StatItem({ value, label }) {
  return (
    <div>
      <p className="text-2xl">{value}</p>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  );
}
