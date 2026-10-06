"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  angle: number;
  ringRadius: number;
  color: string;
  length: number;
  width: number;
  phase: number;
  speed: number;
}

interface DustParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  pulsePhase: number;
}

export function AntigravityCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Spectrum colors matching https://antigravity.google/
    const spectrumColors = [
      "#38bdf8", // Sky Blue
      "#3b82f6", // Royal Blue
      "#6366f1", // Indigo
      "#8b5cf6", // Violet
      "#ec4899", // Magenta
      "#f43f5e", // Rose
      "#f97316", // Coral Orange
      "#eab308", // Sun Gold
      "#10b981", // Emerald
      "#06b6d4", // Cyan
    ];

    let particles: Particle[] = [];
    let dust: DustParticle[] = [];

    // Mouse tracking for dynamic antigravity repulsion
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 170, // Repulsion vortex radius
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const initParticles = () => {
      particles = [];
      dust = [];
      const centerX = width / 2;
      const centerY = height * 0.44; // Positioned behind the main hero title

      // Concentric Radial Swarm (14 expanding orbital rings)
      const ringCount = 14;
      const minRadius = 90;
      const maxRadius = Math.max(width * 0.46, 520);
      const ringStep = (maxRadius - minRadius) / ringCount;

      for (let r = 0; r < ringCount; r++) {
        const ringRadius = minRadius + r * ringStep;
        // More particles in outer rings to maintain density
        const countInRing = Math.floor(18 + r * 5.2);

        for (let i = 0; i < countInRing; i++) {
          const angle = (i / countInRing) * Math.PI * 2 + (r % 2 === 0 ? 0 : 0.08);
          // Chromatic spectrum gradient mapped to angle and ring index
          const colorIndex = Math.floor(
            ((angle / (Math.PI * 2) + r * 0.04) % 1) * spectrumColors.length
          );
          const color = spectrumColors[colorIndex] || "#38bdf8";

          // Calculate initial position on ring with subtle natural jitter
          const jitterR = ringRadius + (Math.random() - 0.5) * 14;
          const px = centerX + Math.cos(angle) * jitterR;
          const py = centerY + Math.sin(angle) * jitterR * 0.82; // Slight elliptical ratio

          particles.push({
            baseX: px,
            baseY: py,
            x: px,
            y: py,
            vx: 0,
            vy: 0,
            radius: jitterR,
            angle: angle,
            ringRadius: ringRadius,
            color: color,
            length: 5.5 + Math.random() * 5.5, // Pill dash length
            width: 2.2 + Math.random() * 1.4, // Pill dash width
            phase: Math.random() * Math.PI * 2,
            speed: 0.0008 + Math.random() * 0.0012,
          });
        }
      }

      // Ambient Space Dust (micro-particles floating in deep space)
      const dustCount = Math.floor((width * height) / 16000);
      for (let i = 0; i < dustCount; i++) {
        dust.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          size: 0.8 + Math.random() * 1.6,
          alpha: 0.2 + Math.random() * 0.4,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    const handleResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
      initParticles();
    };

    window.addEventListener("resize", handleResize);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    initParticles();

    let time = 0;

    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height * 0.44;

      // 1. Render Ambient Space Dust
      for (let i = 0; i < dust.length; i++) {
        const d = dust[i];
        d.x += d.vx;
        d.y += d.vy;
        d.pulsePhase += 0.02;

        if (d.x < 0) d.x = width;
        if (d.x > width) d.x = 0;
        if (d.y < 0) d.y = height;
        if (d.y > height) d.y = 0;

        const currentAlpha = d.alpha * (0.6 + 0.4 * Math.sin(d.pulsePhase));
        ctx.fillStyle = `rgba(148, 163, 184, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Render Antigravity Radial Swarm Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Harmonic zero-gravity breathing motion
        const breathingOffset = Math.sin(time * 0.015 + p.phase) * 8;
        const targetRadius = p.ringRadius + breathingOffset;
        
        // Gentle angular drift
        const targetAngle = p.angle + Math.cos(time * 0.008 + p.phase) * 0.02;
        
        const targetX = centerX + Math.cos(targetAngle) * targetRadius;
        const targetY = centerY + Math.sin(targetAngle) * targetRadius * 0.82;

        // Antigravity Cursor Repulsion Physics
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius && dist > 0) {
          // Force inversely proportional to distance (gravitational repulsion vortex)
          const force = (1 - dist / mouse.radius) * 14;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Spring return to harmonic equilibrium
        const springK = 0.045;
        const dampening = 0.88;

        p.vx += (targetX - p.x) * springK;
        p.vy += (targetY - p.y) * springK;

        p.vx *= dampening;
        p.vy *= dampening;

        p.x += p.vx;
        p.y += p.vy;

        // Calculate tangent dash orientation
        const renderAngle = Math.atan2(p.y - centerY, p.x - centerX) + Math.PI / 2;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(renderAngle);

        // Render rounded dash pill
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;

        ctx.beginPath();
        const halfL = p.length / 2;
        const halfW = p.width / 2;
        ctx.roundRect(-halfW, -halfL, p.width, p.length, p.width);
        ctx.fill();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{ zIndex: 1 }}
    />
  );
}
