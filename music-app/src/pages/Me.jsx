import { useAuth } from "../auth/AuthContext";

function Me() {
    const { isAuthenticated, profile } = useAuth();

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col gap-4">
                <h1 className="text-2xl font-bold tracking-tight">Personal Dashboard</h1>
                <p className="text-sm text-slate-400">
                    You need to log in to see your personalized page.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <header>
                <h1 className="text-2xl font-bold tracking-tight">
                    My Page
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                    Welcome back, {profile?.firstName || profile?.username}.
                </p>
            </header>

            <div className="bg-slate-900 rounded-2xl p-4 text-sm text-slate-300">
                <p>Here we will show:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Your group subscriptions</li>
                    <li>Your playlists</li>
                    <li>Recommended videos and events</li>
                </ul>
            </div>
        </div>
    );
}

export default Me;
