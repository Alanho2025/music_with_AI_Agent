import { useState } from "react";
import SettingsTabs from "./SettingsTabs";
import { useNavigate } from "react-router-dom";
import UserInfoSettings from "./sections/UserInfoSettings";
import UserPreferencesSettings from "./sections/UserPreferencesSettings";
import HeroBackgroundEditor from "./sections/HeroBackgroundEditor";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("banner");
    const navigate = useNavigate();
    return (
        <div className="flex-1 p-8 text-slate-100">

            {/* Header + Back button */}
            <header className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 text-sm"
                        aria-label="Go back"
                    >
                        ←
                    </button>

                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight">
                            Settings
                        </h1>
                        <p className="text-slate-400 mt-1 text-sm">
                            Manage your profile, home banner, and preferences.
                        </p>
                    </div>
                </div>
            </header>

            <SettingsTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mt-4">
                {activeTab === "banner" && <HeroBackgroundEditor />}
                {activeTab === "profile" && <UserInfoSettings />}
                {activeTab === "preferences" && <UserPreferencesSettings />}

            </div>
        </div>
    );
}
