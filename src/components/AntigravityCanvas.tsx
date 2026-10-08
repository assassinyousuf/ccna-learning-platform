"use client";

import React, { useEffect, useRef } from "react";

interface NodeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  pulseSpeed: number;
  pulsePhase: number;
  colorType: "primary" | "accent" | "muted";
  hasHalo: boolean;
}

export function AntigravityCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let dpr = window.devicePixelRatio || 1;
    let width = 0;
    let height = 0;

    let isDark = document.documentElement.classList.contains("dark");

    // Watch for theme changes on html element
    const themeObserver = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains("dark");
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Mouse tracking for interactive ethereal aura
    const mouse = {
      x: -2000,
      y: -2000,
      radius: 160,
    };

    let particles: NodeParticle[] = [];

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      const rect = parent?.getBoundingClientRect() || {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      width = rect.width;
      height = rect.height;
      dpr = window.devicePixelRatio || 1;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      // Calculate particle density: airy, elegant, not crowded
      const count = Math.min(Math.floor((width * height) / 14000), 75);

      for (let i = 0; i < count; i++) {
        const randType = Math.random();
        const colorType: "primary" | "accent" | "muted" =
          randType < 0.45 ? "primary" : randType < 0.75 ? "accent" : "muted";

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          baseRadius: 1.2 + Math.random() * 1.4, // Crisp, tiny micro-nodes (1.2px - 2.6px)
          pulseSpeed: 0.015 + Math.random() * 0.02,
          pulsePhase: Math.random() * Math.PI * 2,
          colorType,
          hasHalo: Math.random() < 0.25, // 25% have a soft luminous halo
        });
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handlePointerLeave = () => {
      mouse.x = -2000;
      mouse.y = -2000;
    };

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerleave", handlePointerLeave);

    resizeCanvas();

    let time = 0;

    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      // Color tokens adapted smoothly for dark and light modes
      const colors = isDark
        ? {
            primary: "rgba(56, 189, 248, ", // Cyan-400
            accent: "rgba(129, 140, 248, ",  // Indigo-400
            muted: "rgba(148, 163, 184, ",   // Slate-400
            line: "rgba(56, 189, 248, ",     // Filament
            cursorLine: "rgba(6, 182, 212, ",
          }
        : {
            primary: "rgba(2, 132, 199, ",   // Sky-600
            accent: "rgba(99, 102, 241, ",   // Indigo-500
            muted: "rgba(100, 116, 139, ",   // Slate-500
            line: "rgba(14, 116, 144, ",     // Filament
            cursorLine: "rgba(2, 132, 199, ",
          };

      const maxConnectDist = 135;
      const pLen = particles.length;

      // 1. Render delicate network filaments between close nodes
      for (let i = 0; i < pLen; i++) {
        const p1 = particles[i];

        for (let j = i + 1; j < pLen; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectDist) {
            // Ethereal gradient alpha: fades gracefully with distance
            const alpha = (1 - dist / maxConnectDist) * (isDark ? 0.16 : 0.12);
            ctx.strokeStyle = `${colors.line}${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Connection to interactive cursor aura
        const mdx = p1.x - mouse.x;
        const mdy = p1.y - mouse.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mDist < mouse.radius) {
          const mAlpha = (1 - mDist / mouse.radius) * (isDark ? 0.35 : 0.22);
          ctx.strokeStyle = `${colors.cursorLine}${mAlpha})`;
          ctx.lineWidth = 0.85;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      // 2. Render particle nodes
      for (let i = 0; i < pLen; i++) {
        const p = particles[i];

        // Smooth physics & gentle drift
        p.x += p.vx;
        p.y += p.vy;
        p.pulsePhase += p.pulseSpeed;

        // Interactive gentle repulsion from cursor
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius && dist > 0) {
          const force = (1 - dist / mouse.radius) * 1.8;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }

        // Soft screen edge boundary wrap
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Organic harmonic pulse
        const pulse = 0.8 + 0.25 * Math.sin(p.pulsePhase);
        const radius = p.baseRadius * pulse;
        const baseAlpha = isDark ? 0.65 : 0.55;
        const alpha = baseAlpha * pulse;

        const colorPrefix = colors[p.colorType];

        // Soft luminous halo for accent nodes
        if (p.hasHalo) {
          const haloGrad = ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            radius * (isDark ? 6 : 4.5)
          );
          haloGrad.addColorStop(0, `${colorPrefix}${isDark ? 0.3 : 0.18})`);
          haloGrad.addColorStop(1, `${colorPrefix}0)`);

          ctx.fillStyle = haloGrad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius * (isDark ? 6 : 4.5), 0, Math.PI * 2);
          ctx.fill();
        }

        // Crisp central node
        ctx.fillStyle = `${colorPrefix}${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      themeObserver.disconnect();
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}
