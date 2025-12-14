// src/components/IdolDetailPanel.jsx
import React from 'react';

export default function IdolDetailPanel({
  idol,
  isSubscribed,
  loadingSub,
  onToggleSubscribe,
}) {
  if (!idol) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-slate-500">
        Select an idol to see details.
      </div>
    );
  }

  // 支援幾種命名：gallery_images / images
  const rawGallery = idol.gallery_images || idol.images || [];
  const galleryImages = Array.isArray(rawGallery)
    ? rawGallery.filter((img) => img && img.image_url)
    : [];

  // 新增欄位：MBTI + Instagram（多種欄位名稱相容）
  const mbti = idol.mbti || idol.MBTI || idol.mbti_type || null;

  const instagramRaw =
    idol.instagram || idol.instagram_handle || idol.instagram_url || null;

  let instagramHandle = null;
  let instagramLink = null;

  if (instagramRaw) {
    // 去掉前後空白
    const trimmed = String(instagramRaw).trim();

    // 如果已經是完整網址，就直接用
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      instagramLink = trimmed;
      instagramHandle = trimmed
        .replace(/^https?:\/\/(www\.)?instagram\.com\//, '')
        .replace(/\/$/, '');
    } else {
      // 當成帳號處理（可能有 @ 或沒有）
      const handle = trimmed.replace(/^@/, '');
      instagramHandle = handle;
      instagramLink = `https://instagram.com/${handle}`;
    }
  }

  console.log('idol detail:', idol);

  return (
    <div className="flex flex-col gap-4">
      {/* header */}
      <div className="flex gap-4 items-start">
        {idol.image_url && (
          <div className="w-32 h-32 rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 flex-shrink-0">
            <img
              src={idol.image_url}
              alt={idol.stage_name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex-1">
          <h2 className="text-lg font-semibold text-slate-50">
            {idol.stage_name}
          </h2>

          {idol.korean_name && (
            <p className="text-xs text-slate-400 mt-1">{idol.korean_name}</p>
          )}

          {idol.birth_name && (
            <p className="text-xs text-slate-500 mt-1">
              Birth name:{' '}
              <span className="text-slate-200">{idol.birth_name}</span>
            </p>
          )}

          {idol.group_name && (
            <p className="text-xs text-slate-400 mt-2">
              Group: <span className="text-slate-200">{idol.group_name}</span>
            </p>
          )}

          {idol.position && (
            <p className="text-xs text-slate-400">
              Position: <span className="text-slate-200">{idol.position}</span>
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2">
            {idol.birthdate && <span>Birth: {idol.birthdate}</span>}
            {idol.nationality && <span>Nationality: {idol.nationality}</span>}

            {/* MBTI badge */}
            {mbti && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-slate-600 bg-slate-900/70 text-[11px] font-semibold tracking-wide uppercase">
                MBTI&nbsp;
                <span className="text-pink-300">{mbti}</span>
              </span>
            )}

            {/* Instagram link */}
            {instagramLink && instagramHandle && (
              <a
                href={instagramLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-sky-300 hover:text-sky-200 underline underline-offset-2"
              >
                <span className="i-ph-instagram-logo-duotone" />@
                {instagramHandle}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* summary */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
        <h3 className="text-xs font-semibold text-slate-300 mb-1">Summary</h3>
        <p className="text-xs leading-relaxed text-slate-400">
          {idol.summary ||
            'Idol summary will be shown here after you add it to the database or connect an AI description service.'}
        </p>
      </div>

      {/* gallery block */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-slate-300">Gallery</h3>
          <p className="text-[11px] text-slate-500">
            {galleryImages.length} photos
          </p>
        </div>

        {galleryImages.length === 0 ? (
          <p className="text-[11px] text-slate-500">No gallery images yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {galleryImages.map((img, idx) => (
              <div
                key={img.id ?? idx}
                className="relative aspect-[3/4] overflow-hidden rounded-lg bg-slate-900 border border-slate-800"
              >
                <img
                  src={img.image_url}
                  alt={`${idol.stage_name} ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* subscribe block */}
      <div className="flex items-center justify-between mt-1">
        <div>
          <p className="text-xs font-medium text-slate-200">
            Subscribe to idol updates
          </p>
          <p className="text-[11px] text-slate-500">
            Get notified when new events, albums, or news are added.
          </p>
        </div>
        <button
          onClick={onToggleSubscribe}
          disabled={loadingSub}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition
                        ${
                          isSubscribed
                            ? 'bg-slate-900 border-pink-400 text-pink-200 hover:bg-slate-800'
                            : 'bg-pink-500 border-pink-500 text-white hover:bg-pink-400'
                        } ${loadingSub ? 'opacity-70 cursor-wait' : ''}`}
        >
          {loadingSub ? 'Saving...' : isSubscribed ? 'Subscribed' : 'Subscribe'}
        </button>
      </div>
    </div>
  );
}
