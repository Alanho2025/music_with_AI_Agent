// src/components/home/HeroSection.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSecureApi } from "../../api/secureClient";


export default function HeroSection({ displayName }) {
    const secureApi = useSecureApi();
    const [heroBg, setHeroBg] = useState(null);
    const [heroPosX, setHeroPosX] = useState(50);
    const [heroPosY, setHeroPosY] = useState(50);

    useEffect(() => {
        async function load() {
            const res = await secureApi.get("/users/me/hero-background");
            setHeroBg(res.data.url);
            setHeroPosX(res.data.posX ?? 50);
            setHeroPosY(res.data.posY ?? 50);
        }
        load();
    }, []);
    return (
        <div className="rounded-[32px] overflow-hidden shadow-lg">

        
        <section
            className="w-full aspect-[5/1] bg-cover bg-no-repeat"
            style={{
                backgroundImage: heroBg
                    ? `url(${heroBg})`
                    : "linear-gradient(to right, #5b21b6, #1e3a8a)",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: `${heroPosX}% ${heroPosY}%`,
        }}
        >
        </section>
        </div>
    );
}
