const tabs = [
    { id: "banner", label: "Hero Banner" },
    { id: "profile", label: "User Info" },
    { id: "preferences", label: "Preferences" },
];

export default function SettingsTabs({ activeTab, setActiveTab }) {
    return (
        <div className="flex gap-2 border-b border-slate-800">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={[
                        "px-4 py-2 text-sm rounded-t-lg border-b-2 transition",
                        activeTab === tab.id
                            ? "border-sky-400 text-slate-50 bg-slate-900"
                            : "border-transparent text-slate-400 hover:text-slate-100 hover:bg-slate-900/40",
                    ].join(" ")}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
  