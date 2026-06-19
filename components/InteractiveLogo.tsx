"use client";

import { useState, useRef, useEffect } from "react";

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

  // Base polygon definitions from Enerblock structure, shifting them to create perspective
  const pointsA = [
    [841.5 + offsetX * 0.6, 198 + offsetY * 0.6],
    [913.5 + offsetX * 0.8, 126 + offsetY * 0.4],
    [913.5 + offsetX * 0.8, 54 + offsetY * 0.2],
    [409.5 + offsetX * 0.2, 54 + offsetY * 0.2],
    [193.5 - offsetX * 0.2, 270 + offsetY * 0.4],
    [193.5 - offsetX * 0.2, 342 + offsetY * 0.6],
    [337.5 + offsetX * 0.1, 342 + offsetY * 0.6],
    [481.5 + offsetX * 0.3, 198 + offsetY * 0.6],
  ]
    .map((p) => p.join(","))
    .join(" ");

  const pointsB = [
    [985.5 + offsetX * 0.9, 198 + offsetY * 0.6],
    [841.5 + offsetX * 0.6, 198 + offsetY * 0.6],
    [697.5 + offsetX * 0.4, 342 + offsetY * 0.6],
    [337.5 + offsetX * 0.1, 342 + offsetY * 0.6],
    [121.5 - offsetX * 0.4, 558 + offsetY * 0.8],
    [121.5 - offsetX * 0.4, 630 + offsetY * 0.9],
    [265.5 - offsetX * 0.1, 630 + offsetY * 0.9],
    [409.5 + offsetX * 0.2, 486 + offsetY * 0.8],
    [769.5 + offsetX * 0.5, 486 + offsetY * 0.8],
    [985.5 + offsetX * 0.9, 270 + offsetY * 0.7],
  ]
    .map((p) => p.join(","))
    .join(" ");

  const pointsC = [
    [265.5 - offsetX * 0.1, 630 + offsetY * 0.9],
    [193.5 - offsetX * 0.3, 702 + offsetY * 0.95],
    [193.5 - offsetX * 0.3, 774 + offsetY * 1.0],
    [697.5 + offsetX * 0.4, 774 + offsetY * 1.0],
    [913.5 + offsetX * 0.8, 558 + offsetY * 0.8],
    [913.5 + offsetX * 0.8, 486 + offsetY * 0.8],
    [769.5 + offsetX * 0.5, 486 + offsetY * 0.8],
    [625.5 + offsetX * 0.3, 630 + offsetY * 0.9],
  ]
    .map((p) => p.join(","))
    .join(" ");

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

      {/* Monogram SVG Logo */}
      <svg
        viewBox="0 0 1107 828"
        className="w-[90%] h-[90%] select-none pointer-events-none transition-all duration-300 group-hover:scale-[1.01]"
      >
        {/* Filters for neon glow */}
        <defs>
          <filter id="neon-glow-coral" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="neon-glow-violet" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Monogram Polygon A (Black) */}
        <polygon
          points={pointsA}
          fill="#070709"
          stroke="#070709"
          strokeWidth="3.5"
          className="transition-all duration-75"
        />
        {/* Monogram Polygon B (Black) */}
        <polygon
          points={pointsB}
          fill="#070709"
          stroke="#070709"
          strokeWidth="3.5"
          className="transition-all duration-75"
        />
        {/* Monogram Polygon C (Black) */}
        <polygon
          points={pointsC}
          fill="#070709"
          stroke="#070709"
          strokeWidth="3.5"
          className="transition-all duration-75"
        />
      </svg>

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
