export default function SubscriptionsPanel({ subs }) {
    const { idols, groups, albums, playlists } = subs;

    return (
        <div className="grid grid-cols-2 gap-6">

            <Section title="Followed Idols">
                {idols.map(i => (
                    <Item
                        key={i.idol_id}
                        img={i.profile_img_url}
                        title={i.name}
                        desc={i.group_name}
                    />
                ))}
            </Section>

            <Section title="Favorite Albums">
                {albums.map(a => (
                    <Item
                        key={a.album_id}
                        img={a.img_url}
                        title={a.title}
                    />
                ))}
            </Section>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div className="bg-slate-900 p-6 rounded-xl text-white">
            <h2 className="text-lg font-semibold mb-4">{title}</h2>
            {children}
        </div>
    );
}

function Item({ img, title, desc }) {
    return (
        <div className="flex items-center gap-3 mb-3">
            <img src={img} className="w-10 h-10 rounded object-cover" />
            <div className="flex-1">
                <p>{title}</p>
                {desc && <p className="text-xs text-slate-400">{desc}</p>}
            </div>
        </div>
    );
}
