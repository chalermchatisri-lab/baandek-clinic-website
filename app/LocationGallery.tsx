"use client";

import { useState } from "react";

export type LocationZone = {
  slug: string;
  title: string;
  caption: string;
  images: { src: string; alt: string }[];
};

function ZoneCarousel({ zone }: { zone: LocationZone }) {
  const [index, setIndex] = useState(0);
  const hasMultiple = zone.images.length > 1;
  const go = (delta: number) => setIndex(i => (i + delta + zone.images.length) % zone.images.length);
  return (
    <div className="v2-zone-carousel">
      <div className="v2-zone-carousel-stage">
        <img src={zone.images[index].src} alt={zone.images[index].alt} />
        {hasMultiple && <>
          <button type="button" className="v2-zone-nav left" onClick={() => go(-1)} aria-label="ภาพก่อนหน้า">‹</button>
          <button type="button" className="v2-zone-nav right" onClick={() => go(1)} aria-label="ภาพถัดไป">›</button>
        </>}
      </div>
      {hasMultiple && <div className="v2-zone-dots">
        {zone.images.map((_, i) => (
          <button type="button" key={i} className={`v2-zone-dot${i === index ? " is-active" : ""}`} onClick={() => setIndex(i)} aria-label={`ภาพที่ ${i + 1}`} />
        ))}
      </div>}
    </div>
  );
}

export default function LocationGallery({ zones }: { zones: LocationZone[] }) {
  return (
    <div className="v2-zone-list">
      {zones.map((zone, i) => (
        <section className={`v2-zone${i % 2 === 1 ? " is-reverse" : ""}`} id={zone.slug} key={zone.slug}>
          <div className="v2-zone-media">
            {zone.images.length > 1
              ? <ZoneCarousel zone={zone} />
              : <img src={zone.images[0].src} alt={zone.images[0].alt} />}
          </div>
          <div className="v2-zone-copy">
            <span className="v2-zone-index">{String(i + 1).padStart(2, "0")}</span>
            <h3>{zone.title}</h3>
            <p>{zone.caption}</p>
          </div>
        </section>
      ))}
    </div>
  );
}
