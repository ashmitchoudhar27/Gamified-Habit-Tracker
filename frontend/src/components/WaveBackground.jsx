// frontend/src/components/WaveBackground.jsx
import React from "react";

/**
 * Minimal subtle animated wave background for the login screen.
 * Uses SVG with gentle vertical movement.
 */
export default function WaveBackground() {
  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      <svg
        className="w-full h-full opacity-6"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1440 600"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="g1" x1="0" x2="1">
            <stop offset="0%" stopColor="#0b1220" />
            <stop offset="100%" stopColor="#071017" />
          </linearGradient>
          <linearGradient id="g2" x1="0" x2="1">
            <stop offset="0%" stopColor="#08111a" />
            <stop offset="100%" stopColor="#04101a" />
          </linearGradient>
        </defs>

        <g>
          <path
            d="M0,160 C200,250 400,80 720,120 C1040,160 1200,240 1440,200 L1440,600 L0,600 Z"
            fill="url(#g1)"
            className="animate-wave translate-y-0"
            style={{ transformOrigin: "center" }}
          />
          <path
            d="M0,200 C220,120 420,300 760,220 C1100,140 1280,220 1440,180 L1440,600 L0,600 Z"
            fill="url(#g2)"
            className="animate-wave-slow translate-y-0"
            style={{ transformOrigin: "center" }}
          />
        </g>
      </svg>
    </div>
  );
}
