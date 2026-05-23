"use client";
import { useState, useEffect } from "react";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center gap-6 transition-opacity duration-500">
      {/* Logo with spinning ring */}
      <div className="relative flex items-center justify-center">
        {/* Spinning arc */}
        <svg
          className="absolute w-80 h-80 animate-spin"
          style={{ animationDuration: "1.4s" }}
          viewBox="0 0 320 320"
          fill="none"
        >
          <circle
            cx="160" cy="160" r="148"
            stroke="url(#goldGrad)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="680"
            strokeDashoffset="510"
          />
          <defs>
            <linearGradient id="goldGrad" x1="0" y1="0" x2="320" y2="320" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#C5A059" stopOpacity="0" />
              <stop offset="60%" stopColor="#C5A059" />
              <stop offset="100%" stopColor="#E6C97A" />
            </linearGradient>
          </defs>
        </svg>
        <img
          src="/images/logo-dark.png"
          alt="مكتب المحامية رقية عبدالرحمن"
          className="w-56 h-56 object-contain"
        />
      </div>
    </div>
  );
}
