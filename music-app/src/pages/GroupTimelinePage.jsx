import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AlbumTimelineHorizontal from "../components/AlbumTimelineHorizontal";
import AlbumDetailPanel from "../components/AlbumDetailPanel";
import GroupSelector from "../components/GroupSelector";
import api from "../api/client";

export default function GroupTimelinePage() {
    const { id } = useParams();
    const [groups, setGroups] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [selectedAlbum, setSelectedAlbum] = useState(null);

    // 1) 載入 group 列表
    useEffect(() => {
        api.get("/groups").then((res) => setGroups(res.data));
    }, []);

    // 2) 載入該 group 的 timeline
    useEffect(() => {
        if (!id) return;
        api
            .get(`/groups/${id}/albums`)
            .then((res) => {
                setAlbums(res.data);
                setSelectedAlbum(null);
            })
            .catch((err) => {
                console.error("Failed to load albums timeline", err);
            });
    }, [id]);

    return (
        <div className="flex gap-8">
            {/* 左側 group selector */}
            <GroupSelector groups={groups} />

            {/* 右側 timeline + detail */}
            <div className="flex-1">
                <AlbumTimelineHorizontal
                    albums={albums}
                    onSelectAlbum={setSelectedAlbum}
                    selectedAlbumId={selectedAlbum?.id}
                />
                <AlbumDetailPanel album={selectedAlbum} />
            </div>
        </div>
    );
}
