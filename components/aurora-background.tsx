"use client";

import { useEffect, useRef } from "react";

/**
 * Canvas "white aurora borealis" backdrop.
 *
 * A smooth Catmull-Rom spline defines the top "ridge" of the aurora curtain.
 * Its control points drift with layered-sine (smooth pseudo-random) jitter in
 * x / y / depth, so the ridge folds gently over time. Many vertical light beams
 * are hung from densely-sampled points along the ridge and projected with a
 * simple perspective (depth scales each beam's size, brightness and horizontal
 * convergence). Drawn additively, the packed beams read as one connected,
 * folding sheet of white light — like a real white aurora.
 *
 * A CSS hazy glow / starfield / vignette (see globals.css) sit around it. The
 * whole thing is fixed, non-interactive and behind all page content, and it
 * honors prefers-reduced-motion by rendering a single static frame.
 */

const CONTROL_POINTS = 7;
const SAMPLES = 220;
const FOCAL = 600;

type Control = {
    baseX: number;
    phaseX: number;
    phaseY: number;
    phaseZ: number;
    speedX: number;
    speedY: number;
    speedZ: number;
    tint: number;
};

/** Two summed sines -> smooth, non-repeating-looking motion in [-1, 1]. */
function smoothNoise(t: number, phase: number, speed: number): number {
    return Math.sin(t * speed + phase) * 0.6 + Math.sin(t * speed * 0.37 + phase * 1.7) * 0.4;
}

function catmullRom(p0: number, p1: number, p2: number, p3: number, t: number): number {
    const t2 = t * t;
    const t3 = t2 * t;
    return (
        0.5 *
        (2 * p1 +
            (-p0 + p2) * t +
            (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
            (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
    );
}

export const AuroraBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        let width = 0;
        let height = 0;
        let rafId = 0;
        let running = true;

        const resize = () => {
            width = canvas.clientWidth;
            height = canvas.clientHeight;
            canvas.width = Math.max(1, Math.floor(width * dpr));
            canvas.height = Math.max(1, Math.floor(height * dpr));
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();
        window.addEventListener("resize", resize);

        const controls: Control[] = Array.from({ length: CONTROL_POINTS }, (_, i) => ({
            baseX: i / (CONTROL_POINTS - 1),
            phaseX: Math.random() * Math.PI * 2,
            phaseY: Math.random() * Math.PI * 2,
            phaseZ: Math.random() * Math.PI * 2,
            speedX: 0.05 + Math.random() * 0.07,
            speedY: 0.04 + Math.random() * 0.06,
            speedZ: 0.05 + Math.random() * 0.08,
            tint: Math.random(),
        }));

        const draw = (nowMs: number) => {
            const t = nowMs / 1000;
            ctx.clearRect(0, 0, width, height);
            ctx.globalCompositeOperation = "lighter";

            const cx = width / 2;
            const ridgeY = height * 0.17;

            // Ridge control points in a fake-3D space (screen x/y + depth z).
            const pts = controls.map((c) => {
                const spread = (c.baseX - 0.5) * width * 1.15;
                const jitterX = smoothNoise(t, c.phaseX, c.speedX) * width * 0.05;
                const jitterY = smoothNoise(t, c.phaseY, c.speedY) * height * 0.05;
                const depth = smoothNoise(t, c.phaseZ, c.speedZ) * 240;
                return { x: cx + spread + jitterX, y: ridgeY + jitterY, z: depth, tint: c.tint };
            });

            for (let s = 0; s < SAMPLES; s++) {
                const f = s / (SAMPLES - 1);
                const seg = f * (CONTROL_POINTS - 1);
                const i = Math.min(Math.floor(seg), CONTROL_POINTS - 2);
                const lt = seg - i;
                const p0 = pts[Math.max(0, i - 1)];
                const p1 = pts[i];
                const p2 = pts[i + 1];
                const p3 = pts[Math.min(CONTROL_POINTS - 1, i + 2)];

                const rx = catmullRom(p0.x, p1.x, p2.x, p3.x, lt);
                const ry = catmullRom(p0.y, p1.y, p2.y, p3.y, lt);
                const rz = catmullRom(p0.z, p1.z, p2.z, p3.z, lt);
                const tint = catmullRom(p0.tint, p1.tint, p2.tint, p3.tint, lt);

                // Perspective: nearer (smaller z) beams are larger/brighter and
                // spread wider; farther beams converge toward centre.
                const scale = FOCAL / (FOCAL + rz + 240);
                const px = cx + (rx - cx) * scale;
                const py = ry;

                // Per-beam shimmer + a little length variation.
                const shimmer = 0.55 + 0.45 * Math.sin(f * 46 + t * 1.4 + tint * 6.283);
                const length = height * (0.34 + 0.16 * scale) * (0.85 + 0.15 * Math.sin(f * 22 - t));
                const lineWidth = Math.max(0.5, 2.1 * scale);
                const alpha = 0.14 * scale * shimmer;

                const green = 200 + Math.round(40 * tint);
                const blue = 235 + Math.round(20 * (1 - tint));

                const grad = ctx.createLinearGradient(px, py, px, py + length);
                grad.addColorStop(0, "rgba(255,255,255,0)");
                grad.addColorStop(0.06, `rgba(${230},${green + 20},255,${alpha * 1.25})`);
                grad.addColorStop(0.45, `rgba(255,255,255,${alpha})`);
                grad.addColorStop(1, `rgba(210,${green},${blue},0)`);

                ctx.strokeStyle = grad;
                ctx.lineWidth = lineWidth;
                ctx.beginPath();
                ctx.moveTo(px, py);
                ctx.lineTo(px, py + length);
                ctx.stroke();
            }

            if (running && !reduceMotion) {
                rafId = requestAnimationFrame(draw);
            }
        };

        if (reduceMotion) {
            draw(0);
        } else {
            rafId = requestAnimationFrame(draw);
        }

        return () => {
            running = false;
            cancelAnimationFrame(rafId);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <div aria-hidden="true" className="aurora-root pointer-events-none fixed inset-0 z-0 overflow-hidden">
            <div className="aurora-glow" />
            <canvas ref={canvasRef} className="aurora-canvas" />
            <div className="aurora-stars" />
            <div className="aurora-vignette" />
        </div>
    );
};
