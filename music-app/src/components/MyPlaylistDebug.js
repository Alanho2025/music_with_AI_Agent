import { useEffect, useState } from "react";
import { useSecureApi } from "../api/secureClient";

function MyPlaylistsDebug() {
    const api = useSecureApi();
    const [data, setData] = useState(null);

    useEffect(() => {
        api
            .get("/playlists")
            .then((res) => setData(res.data))
            .catch((err) => console.error("playlists error", err));
    }, []);

    return (
        <pre className="text-xs">
            {JSON.stringify(data, null, 2)}
        </pre>
    );
}

export default MyPlaylistsDebug;