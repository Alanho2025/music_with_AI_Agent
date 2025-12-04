import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function Sidebar() {
    const { isAuthenticated, profile, login, logout } = useAuth();

    const baseItemClasses =
        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition";
    const inactiveClasses =
        "text-slate-400 hover:text-slate-100 hover:bg-slate-800/70";
    const activeClasses = "bg-slate-800 text-slate-50";

    const makeClasses = (isActive) =>
        `${baseItemClasses} ${isActive ? activeClasses : inactiveClasses}`;

    return (
        <aside className="w-60 bg-slate-950 border-l border-slate-800 px-4 py-6 flex flex-col gap-6">
            <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    K-pop Hub
                </p>
                <p className="text-sm text-slate-400 mt-1">
                    Browse groups, idols, and your account.
                </p>
            </div>

            {/* main navigation */}
            <nav className="flex flex-col gap-1">
                <NavLink to="/" end className={({ isActive }) => makeClasses(isActive)}>
                    <span>🏠</span>
                    <span>Home</span>
                </NavLink>

                <NavLink
                    to="/groups"
                    className={({ isActive }) => makeClasses(isActive)}
                >
                    <span>👥</span>
                    <span>Groups</span>
                </NavLink>
                <NavLink
                    to="/idols"
                    className={({ isActive }) => makeClasses(isActive)}
                >
                    <span>🌟</span>
                    <span>Idols</span>
                </NavLink>
                <NavLink to="/music-player" className={({ isActive }) => makeClasses(isActive)}>
                    <span>🎧</span>
                    <span>Music Player</span>
                </NavLink>

                <NavLink to="/albums" className={({ isActive }) => makeClasses(isActive)}>
                    <span>💿</span>
                    <span>Albums</span>
                </NavLink>

                <NavLink to="/playlists" className={({ isActive }) => makeClasses(isActive)}>
                    <span>🎵</span>
                    <span>Custom Playlists</span>
                </NavLink>
                <NavLink
                    to="/me"
                    className={({ isActive }) => makeClasses(isActive)}
                >
                    <span>🧑</span>
                    <span>Personal Dashboard</span>
                </NavLink>
            </nav>

            {/* admin navigation - only when logged in */}
            {isAuthenticated && (
                <div className="flex flex-col gap-1 mt-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-1">
                        Admin
                    </p>

                    <NavLink
                        to="/admin/videos"
                        className={({ isActive }) => makeClasses(isActive)}
                    >
                        <span>🎵</span>
                        <span>Admin Videos</span>
                    </NavLink>

                    <NavLink
                        to="/admin/import"
                        className={({ isActive }) => makeClasses(isActive)}
                    >
                        <span>📚</span>
                        <span>Import data</span>
                    </NavLink>
                    <NavLink
                        to="/admin/idols"
                        className={({ isActive }) => makeClasses(isActive)}
                    >
                        <span>🌟</span>
                        <span>Edit idols data</span>
                    </NavLink>
                    <NavLink
                        to="/admin/albums"
                        className={({ isActive }) => makeClasses(isActive)}
                    >
                        <span>🌟</span>
                        <span>Edit album data</span>
                    </NavLink>
                </div>
            )}

            {/* auth area */}
            <div className="mt-auto border-t border-slate-800 pt-4 text-xs text-slate-300">
                {isAuthenticated ? (
                    <div className="space-y-2">
                        <p className="text-slate-200 text-sm">
                            Hi, {profile?.firstName || profile?.username || "Idol lover"}
                        </p>
                        <button
                            onClick={logout}
                            className="text-xs px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={login}
                        className="text-xs px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700"
                    >
                        Login with Keycloak
                    </button>
                )}
            </div>
        </aside>
    );
}

export default Sidebar;
