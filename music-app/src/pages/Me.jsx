function Me() {
    return (
        <div className="flex flex-col gap-4">
            <header>
                <h1 className="text-2xl font-bold tracking-tight">
                    My Page
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                    This page will show your subscriptions, playlists, and personalized stats after auth is ready.
                </p>
            </header>

            <div className="bg-slate-900 rounded-2xl p-4 text-sm text-slate-300">
                <p>
                    For now this is a placeholder. Next step is to protect this route with Keycloak and link it to the users table.
                </p>
            </div>
        </div>
    );
}

export default Me;