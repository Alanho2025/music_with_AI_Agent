// src/pages/Me.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSecureApi } from "../api/secureClient";
import { useNavigate } from "react-router-dom";
import ProfileCard from "../components/userDashboard/ProfileCard";
import HistoryTabs from "../components/userDashboard/HistoryTabs";
import PreferencesPanel from "../components/userDashboard/PreferencesPanel";
import SubscriptionsPanel from "../components/userDashboard/SubscriptionsPanel";

function Me() {
    const secureApi = useSecureApi();
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState({});
    const [prefs, setPrefs] = useState(null);
    const [subs, setSubs] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 一次把三個區塊的資料抓回來
    useEffect(() => {
        let isMounted = true;

        async function loadAll() {
            try {
                setLoading(true);
                setError(null);

                const [profileRes, prefsRes, subsRes] = await Promise.all([
                    secureApi.get("/users/profile"),
                    secureApi.get("/users/preferences"),
                    secureApi.get("/users/subscriptions"),
                ]);

                if (!isMounted) return;

                setProfile(profileRes.data.profile);
                setStats(profileRes.data.stats || {});

                setPrefs(
                    prefsRes.data || {
                        home_banner_mode: "latest",
                        pref_girl_group: false,
                        pref_boy_group: false,
                        pref_solo: false,
                        pref_gen3: false,
                        pref_gen4: false,
                        notif_new_album: true,
                        notif_new_mv: true,
                        notif_playlist_update: true,
                    }
                );

                setSubs(
                    subsRes.data || {
                        idols: [],
                        groups: [],
                        albums: [],
                        playlists: [],
                    }
                );
            } catch (err) {
                console.error("Failed to load /me dashboard", err);
                if (err.response?.status === 401) {
                    setError("需要登入才能查看個人儀表板，請重新登入。");
                } else {
                    setError("載入個人儀表板失敗，稍後再試一次。");
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        loadAll();

        return () => {
            isMounted = false;
        };
    }, []);

    // 狀態渲染
    if (loading) {
        return (
            <div className="p-6 text-white">
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-white">
                <p className="text-red-400 mb-2">{error}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <header>
                <h1 className="text-2xl font-bold tracking-tight">My Page</h1>
                <p className="text-sm text-slate-400 mt-1">
                    Welcome back, {profile?.nickname || profile?.email}.
                </p>
            </header>

            <div className="p-6 text-white">
                <ProfileCard profile={profile} stats={stats}/>

                <div className="mt-6">
                    <HistoryTabs />
                </div>

                <div className="mt-6">
                    <PreferencesPanel
                        prefs={prefs}
                        refresh={async () => {
                            try {
                                const res = await secureApi.get("/users/preferences");
                                setPrefs(res.data);
                            } catch (err) {
                                console.error("Failed to reload preferences", err);
                            }
                        }}
                    />
                </div>

                <div className="mt-6">
                    <SubscriptionsPanel subs={subs} />
                </div>
            </div>
        </div>
    );
}

export default Me;
