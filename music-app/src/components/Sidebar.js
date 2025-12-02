function Sidebar() {
    return (
        <aside className="hidden md:block w-72 border-l border-slate-800 p-4">
            <div className="flex flex-col gap-4">
                <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">
                        User
                    </p>
                    <p className="text-sm mt-1">
                        Guest mode
                    </p>
                    <p className="text-xs text-slate-500">
                        Later this will show Keycloak login status and profile.
                    </p>
                </div>

                <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">
                        Roadmap
                    </p>
                    <ul className="mt-1 text-xs text-slate-400 list-disc list-inside space-y-1">
                        <li>Connect real idol data from PostgreSQL</li>
                        <li>Embed YouTube player component</li>
                        <li>Add Keycloak authentication</li>
                        <li>Integrate Langflow AI agents</li>
                    </ul>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;