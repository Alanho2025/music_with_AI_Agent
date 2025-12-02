import { NavLink } from "react-router-dom";

function Sidebar() {
    const baseItemClasses =
        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition";
    const inactiveClasses =
        "text-slate-400 hover:text-slate-100 hover:bg-slate-800/70";
    const activeClasses = "bg-slate-800 text-slate-50";

    return (
        <aside className="w-60 bg-slate-950 border-l border-slate-800 px-4 py-6 flex flex-col gap-6">
            {/* Logo / Title */}
            <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    K-pop Hub
                </p>
                <p className="text-sm text-slate-400 mt-1">
                    Browse groups, idols, and your account.
                </p>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-1">
                <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                        `${baseItemClasses} ${isActive ? activeClasses : inactiveClasses
                        }`
                    }
                >
                    <span>🏠</span>
                    <span>Home</span>
                </NavLink>

                <NavLink
                    to="/groups"
                    className={({ isActive }) =>
                        `${baseItemClasses} ${isActive ? activeClasses : inactiveClasses
                        }`
                    }
                >
                    <span>👥</span>
                    <span>Groups</span>
                </NavLink>

                <NavLink
                    to="/idols"
                    className={({ isActive }) =>
                        `${baseItemClasses} ${isActive ? activeClasses : inactiveClasses
                        }`
                    }
                >
                    <span>🌟</span>
                    <span>Idols</span>
                </NavLink>

                <NavLink
                    to="/me"
                    className={({ isActive }) =>
                        `${baseItemClasses} ${isActive ? activeClasses : inactiveClasses
                        }`
                    }
                >
                    <span>🧑</span>
                    <span>My Page</span>
                </NavLink>
            </nav>

            {/* 下面這區之後可以放 Keycloak 登入 / 登出 或其他資訊 */}
            <div className="mt-auto text-xs text-slate-500 space-y-1">
                <p>Auth: not connected yet</p>
                <p>Next step: plug in Keycloak here.</p>
            </div>
        </aside>
    );
}

export default Sidebar;