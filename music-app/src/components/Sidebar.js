import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function Sidebar() {
    const { isAuthenticated, isAdmin, profile, login, logout, register, initialized } =
        useAuth();

    const baseItemClasses =
        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition";
    const inactiveClasses =
        "text-slate-400 hover:text-slate-100 hover:bg-slate-800/70";
    const activeClasses = "bg-slate-800 text-slate-50";

    const makeClasses = (isActive) =>
        `${baseItemClasses} ${isActive ? activeClasses : inactiveClasses}`;

    return (
        <aside className="w-60 bg-slate-950 border-l border-slate-800 px-4 py-6 flex flex-col">
            {/* branding */}
            <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    K-pop Hub
                </p>
                <p className="text-sm text-slate-400 mt-1">
                    Browse groups, idols, and your account.
                </p>
            </div>

            {/* auth section 在上面，縮小 padding */}
            <div className="mt-4 border-t border-slate-800 pt-4 pb-3 flex flex-col gap-3">
                {!initialized ? (
                    <p className="text-xs text-slate-500">Checking login...</p>
                ) : isAuthenticated ? (
                    <>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs text-slate-100">
                                {profile?.firstName?.[0] ||
                                    profile?.username?.[0] ||
                                    "U"}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm text-slate-100">
                                    {profile?.firstName ||
                                        profile?.username ||
                                        "User"}
                                </span>
                                <span className="text-xs text-slate-500">
                                    Logged in
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={logout}
                            className="text-xs px-3 py-2 rounded-lg bg-slate-800 text-slate-100 hover:bg-slate-700"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={register}
                            className="text-xs px-3 py-2 rounded-lg border border-slate-700 text-slate-100 hover:bg-slate-800 text-center"
                        >
                            Register
                        </button>

                        <button
                            onClick={login}
                            className="text-xs px-3 py-2 rounded-lg bg-sky-500 text-slate-950 font-medium hover:bg-sky-400"
                        >
                            Login
                        </button>
                    </>
                )}
            </div>

            {/* main navigation - 佔掉剩下空間 */}
            <nav className="mt-4 flex-1 flex flex-col gap-1">
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

                <NavLink
                    to="/music-player"
                    className={({ isActive }) => makeClasses(isActive)}
                >
                    <span>🎧</span>
                    <span>Music Player</span>
                </NavLink>

                <NavLink
                    to="/albums"
                    className={({ isActive }) => makeClasses(isActive)}
                >
                    <span>💿</span>
                    <span>Albums</span>
                </NavLink>

                <NavLink
                    to="/cart"
                    className={({ isActive }) => makeClasses(isActive)}
                >
                    <span>🛒</span>
                    <span>Cart</span>
                </NavLink>

                <NavLink
                    to="/playlists"
                    className={({ isActive }) => makeClasses(isActive)}
                >
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
            {isAuthenticated && isAdmin && (
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
        </aside>
    );
}

export default Sidebar;
