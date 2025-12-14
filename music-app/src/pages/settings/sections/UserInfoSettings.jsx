export default function UserInfoSettings() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">User Information</h2>
        <p className="text-slate-400 text-sm mt-1">
          Update your display name, avatar, and basic details.
        </p>
      </div>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
        <div>
          <label className="block text-sm mb-1">Display Name</label>
          <input
            type="text"
            placeholder="Alan"
            className="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Username</label>
          <input
            type="text"
            placeholder="alan_kpop"
            className="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded-md"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Avatar URL</label>
          <input
            type="url"
            placeholder="https://..."
            className="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded-md"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Bio</label>
          <textarea
            rows="3"
            placeholder="Short intro about you."
            className="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded-md"
          />
        </div>

        <div className="flex justify-end gap-3 md:col-span-2">
          <button className="px-3 py-2 border border-slate-600 rounded-md text-sm">
            Cancel
          </button>
          <button className="px-4 py-2 bg-sky-500 rounded-md text-sm hover:bg-sky-400">
            Save Changes
          </button>
        </div>
      </form>
    </section>
  );
}
