import { useSecureApi } from "../../api/secureClient";
import { useState } from "react";

export default function PreferencesPanel({ prefs, refresh }) {
    const api = useSecureApi();
    const [data, setData] = useState(prefs);

    function update(key, val) {
        setData(prev => ({ ...prev, [key]: val }));
    }

    async function save() {
        await api.put("/users/preferences", data);
        refresh();
    }

    return (
        <div className="bg-slate-900 p-6 rounded-xl text-white">
            <h2 className="text-lg mb-4">Preferences</h2>

            <select
                className="bg-slate-800 p-2 rounded mb-4"
                value={data.home_banner_mode}
                onChange={e => update("home_banner_mode", e.target.value)}
            >
                <option value="latest">Latest Comeback</option>
                <option value="followed">My Idols</option>
                <option value="classic">Classic Album</option>
            </select>

            <div className="grid grid-cols-2 gap-2 mb-4">
                {prefCheckBox("pref_girl_group", "Girl Group")}
                {prefCheckBox("pref_boy_group", "Boy Group")}
                {prefCheckBox("pref_solo", "Solo")}
                {prefCheckBox("pref_gen3", "3rd Gen")}
                {prefCheckBox("pref_gen4", "4th Gen")}
            </div>

            <h3 className="mb-2">Notifications</h3>

            {prefCheckBox("notif_new_album", "New Album")}
            {prefCheckBox("notif_new_mv", "New MV")}
            {prefCheckBox("notif_playlist_update", "Playlist Updates")}

            <button
                onClick={save}
                className="mt-4 bg-slate-700 px-4 py-2 rounded">
                Save
            </button>
        </div>
    );

    function prefCheckBox(key, label) {
        return (
            <label>
                <input
                    type="checkbox"
                    checked={data[key]}
                    onChange={e => update(key, e.target.checked)}
                />
                <span className="ml-2">{label}</span>
            </label>
        );
    }
}
