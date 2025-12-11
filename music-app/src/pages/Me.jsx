import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";

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
            <Link
                to="/dashboard/hero-background"
                className="px-3 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-sm text-slate-100"
            >
                Customize Home Banner
            </Link>

            
        </div>
    );
}

export default Me;
