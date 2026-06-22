"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function InteractiveLogo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 }); // Normalized coordinates (0 to 1)
  const [isHovered, setIsHovered] = useState(false);

  // Smooth mouse coordinates with interpolation
  const [smoothMouse, setSmoothMouse] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    if (!isHovered) {
      // Slow float/pulse when not hovered
      let start: number | null = null;
      let animId: number;

      const float = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        
        // Continuous organic path
        const x = 0.5 + Math.sin(progress / 2000) * 0.08;
        const y = 0.5 + Math.cos(progress / 2500) * 0.08;
        
        setSmoothMouse((prev) => ({
          x: prev.x + (x - prev.x) * 0.05,
          y: prev.y + (y - prev.y) * 0.05,
        }));

        animId = requestAnimationFrame(float);
      };

      animId = requestAnimationFrame(float);
      return () => cancelAnimationFrame(animId);
    } else {
      // Interpolate to actual mouse position
      let animId: number;
      
      const update = () => {
        setSmoothMouse((prev) => ({
          x: prev.x + (mousePos.x - prev.x) * 0.1,
          y: prev.y + (mousePos.y - prev.y) * 0.1,
        }));
        animId = requestAnimationFrame(update);
      };

      animId = requestAnimationFrame(update);
      return () => cancelAnimationFrame(animId);
    }
  }, [isHovered, mousePos]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
  };

  // Compute points based on mouse offsets (intensity is how much they shift)
  const offsetX = (smoothMouse.x - 0.5) * 80;
  const offsetY = (smoothMouse.y - 0.5) * 60;

  // Tracking grid lines based on smooth mouse
  // Horizontal lines move vertically
  const lineTopY = 113.5 + offsetY * 0.8;
  const lineBottomY = 411.5 + offsetY * 0.8;
  // Vertical lines move horizontally
  const lineLeftX = 495.3 + offsetX * 0.9;
  const lineRightX = 861.3 + offsetX * 0.9;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full max-w-[480px] max-h-full aspect-[4/3] overflow-hidden flex items-center justify-center cursor-crosshair group transition-all duration-500"
    >


      {/* Dynamic glow overlay */}
      <div className="absolute inset-0 bg-radial from-coral/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Dynamic Tracking Lines (horizontal & vertical) */}
      <div id="interactive--logo" className="tt--ab absolute inset-0 pointer-events-none z-10">
        {/* Horizontal Top Line */}
        <div
          className="h-line h-line--top absolute left-0 right-0 h-[1px] bg-ink/15 transition-transform duration-75"
          style={{ transform: `translateY(${lineTopY / 828 * 100}%)` }}
        />
        {/* Horizontal Bottom Line */}
        <div
          className="h-line h-line--bottom absolute left-0 right-0 h-[1px] bg-ink/15 transition-transform duration-75"
          style={{ transform: `translateY(${lineBottomY / 828 * 100}%)` }}
        />
        {/* Vertical Left Line */}
        <div
          className="h-line h-line--left absolute top-0 bottom-0 w-[1px] bg-ink/15 transition-transform duration-75"
          style={{ transform: `translateX(${lineLeftX / 1107 * 100}%)` }}
        />
        {/* Vertical Right Line */}
        <div
          className="h-line h-line--right absolute top-0 bottom-0 w-[1px] bg-ink/15 transition-transform duration-75"
          style={{ transform: `translateX(${lineRightX / 1107 * 100}%)` }}
        />
      </div>

      {/* Crystal emblem — 3D parallax tracking the cursor (idle float when not hovered) */}
      <div className="relative z-20 flex items-center justify-center w-full h-full [perspective:1000px] pointer-events-none">
        <div
          className="relative w-[95%] aspect-square will-change-transform transition-transform duration-75 group-hover:scale-[1.04]"
          style={{
            transform: `translate3d(${offsetX * 0.4}px, ${offsetY * 0.4}px, 0) rotateX(${(0.5 - smoothMouse.y) * 18}deg) rotateY(${(smoothMouse.x - 0.5) * 18}deg)`,
          }}
        >
          <Image
            src="/logo-dark.png"
            alt="Fix4U"
            fill
            priority
            sizes="(max-width: 768px) 60vw, 340px"
            className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.22)]"
          />
        </div>
      </div>

      {/* Corner Technical Labels */}
      <div className="absolute top-4 left-5 text-[9px] text-ink font-mono uppercase tracking-widest opacity-60">
        SYSTEM MODE: PERSPECTIVE
      </div>
      <div className="absolute bottom-4 right-5 text-[9px] text-ink font-mono uppercase tracking-widest flex items-center gap-1.5 opacity-60">
        <span className="w-1.5 h-1.5 bg-ink rounded-full animate-pulse" />
        X: {offsetX.toFixed(1)} &bull; Y: {offsetY.toFixed(1)}
      </div>
    </div>
  );
}
