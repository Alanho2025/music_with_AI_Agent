// src/components/home/HeroSection.jsx
import React from 'react';
import { useEffect, useState } from 'react';
import { useSecureApi } from '../../api/secureClient';

export default function HeroSection({ displayName }) {
  const secureApi = useSecureApi();
  const [heroBg, setHeroBg] = useState(null);
  const [heroPosX, setHeroPosX] = useState(50);
  const [heroPosY, setHeroPosY] = useState(50);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const res = await secureApi.get('/users/me/hero-background');
        if (!isMounted) return;

        const data = res.data || {};
        setHeroBg(data.url || null);
        setHeroPosX(data.posX ?? 50);
        setHeroPosY(data.posY ?? 50);
      } catch (err) {
        if (err.response?.status === 401) {
          console.warn('Not authenticated, using default hero gradient');
        } else {
          console.error('Failed to load hero background', err);
        }
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [secureApi]);
  return (
    <div className="rounded-[32px] overflow-hidden shadow-lg">
      <section
        className="w-full aspect-[5/1] bg-cover bg-no-repeat"
        style={{
          backgroundImage: heroBg
            ? `url(${heroBg})`
            : 'linear-gradient(to right, #5b21b6, #1e3a8a)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: `${heroPosX}% ${heroPosY}%`,
        }}
      ></section>
    </div>
  );
}
