// src/pages/Home.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import api from "../api/client";

import HeroSection from "../components/home/HeroSection";
import FeatureGrid from "../components/home/FeatureGrid";
import ContinueListeningCard from "../components/home/ContinueListeningCard";
import RecommendationsRow from "../components/home/RecommendationsRow";
import SiteFooter from "../components/home/SiteFooter";
import FeaturedIdolCard from "../components/home/FeaturedIdolCard";

function shuffleArray(list) {
    const arr = [...list];
    for (let i = arr.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export default function Home() {
    const { profile } = useAuth() || {};
    const displayName = profile?.preferred_username || profile?.name;

    const [videos, setVideos] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        let cancelled = false;

        async function fetchData() {
            try {
                setLoading(true);

                // ✅ 使用 api client 並打 /videos/recommended 和 /albums/recommended
                const [videosRes, albumsRes] = await Promise.all([
                    api.get("/videos/recommended"),
                    api.get("/albums/recommended"),
                ]);

                if (cancelled) return;

                const videoList = videosRes.data || [];
                const albumList = albumsRes.data || [];

                console.log("recommended videos", videoList);
                console.log("recommended albums", albumList);

                setVideos(Array.isArray(videoList) ? videoList : []);
                setAlbums(Array.isArray(albumList) ? albumList : []);
            } catch (err) {
                console.error("Failed to load recommendations", err);
                if (!cancelled) {
                    setVideos([]);
                    setAlbums([]);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        fetchData();
        return () => {
            cancelled = true;
        };
    }, []);

    const recommendedVideos = useMemo(
        () => shuffleArray(videos).slice(0, 8),
        [videos],
    );
    const recommendedAlbums = useMemo(
        () => shuffleArray(albums).slice(0, 8),
        [albums],
    );
    return (
        <div className="flex flex-col gap-6 px-4 py-6 md:px-6 lg:px-8">
            <HeroSection displayName={displayName} />

            <FeatureGrid />

            <ContinueListeningCard />

            {/* 🔥 這一塊就是左右推薦區 */}
            <div className="grid gap-6 xl:grid-cols-2 xl:auto-rows-min">
                {/* 左邊：佔兩欄，videos 比較寬 */}
                <div className="xl:col-span-1">
                    <RecommendationsRow
                        title="Recommended videos"
                        type="video"
                        items={recommendedVideos}
                        loading={loading}
                        layout="grid"    
                    />
                </div>

                {/* 右邊：albums + featured idol 疊在一欄 */}
                <div className="flex flex-col gap-6">
                    <RecommendationsRow
                        title="Recommended albums"
                        type="album"
                        items={recommendedAlbums}
                        loading={loading}
                    />
                    <FeaturedIdolCard />
                </div>
            </div>
            <SiteFooter />
        </div>
    );
}
