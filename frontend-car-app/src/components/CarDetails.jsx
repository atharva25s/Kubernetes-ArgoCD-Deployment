import React, { useState } from 'react';
import './../pages/ApiPage.css';

export default function CarDetails({ data }) {
  if (!data) return null;

  // Example response shape observed:
  // { car_name: 'bmw_x5', specs: ['3.0L Turbocharged Engine', '335 HP', ...], ... }
  const { car_name, specs, ...rest } = data;
  const [imgError, setImgError] = useState(false);

  // public/ files are served from the root in Vite, so use `/${car_name}.avif`
  const imageSrc = car_name ? `/${encodeURIComponent(car_name)}.avif` : null;

  return (
    <div style={{ maxWidth: 800 }}>
      {car_name && (
        <div style={{ marginBottom: 8 }}>
          <strong>Car:</strong> <span style={{ color: '#e94560' }}>{car_name}</span>
        </div>
      )}

      {/* Image (AVIF) */}
      {imageSrc && !imgError && (
        <div style={{ marginBottom: 12 }}>
          <picture>
            <source srcSet={imageSrc} type="image/avif" />
            <img
              src={imageSrc}
              alt={car_name}
              style={{ maxWidth: '100%', height: 'auto', borderRadius: 8 }}
              onError={() => setImgError(true)}
            />
          </picture>
        </div>
      )}

      {imgError && (
        <div style={{ marginBottom: 12, color: 'rgba(255,255,255,0.8)' }}>
          Image not available
        </div>
      )}

      {Array.isArray(specs) && specs.length > 0 && (
        <div style={{ marginBottom: 8 }}>
          <strong>Specs:</strong>
          <ul style={{ marginTop: 6 }}>
            {specs.map((s, i) => (
              <li key={i} style={{ color: 'white' }}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      {/* show remaining fields and raw payload for inspection */}
      {Object.keys(rest).length > 0 && (
        <div style={{ marginTop: 8 }}>
          <strong>Other:</strong>
          <pre style={{ marginTop: 6, background: 'rgba(0,0,0,0.3)', padding: 8, borderRadius: 6 }}>
            {JSON.stringify(rest, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ marginTop: 8 }}>
        <strong>Raw Response:</strong>
        <pre style={{ marginTop: 6, background: 'rgba(0,0,0,0.3)', padding: 8, borderRadius: 6 }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}