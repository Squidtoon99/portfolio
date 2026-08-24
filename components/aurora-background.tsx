"use client";

import { useEffect, useRef } from "react";

/**
 * Canvas "white aurora borealis" backdrop.
 *
 * Uses the classic shader technique for auroras, adapted to 2D canvas:
 *   - Several curtain layers whose horizontal centre "snakes" as a function of
 *     height + time (summed sines + fBm value noise), so the ribbons flow.
 *   - Each curtain is a Gaussian band across x: a bright core that fades softly
 *     to haze on both sides (haze -> line -> haze). The band width varies along
 *     height, so some stretches read as a crisp ribbon and others as soft haze.
 *   - A vertical falloff (bright ceiling near the top, exponential fade down)
 *     plus fBm "pleats" give vertical structure.
 *   - Layers are summed (additive) and tone-mapped to white with a faint cool
 *     tint.
 *
 * For smoothness + performance the field is computed on a small offscreen buffer
 * and upscaled with bilinear smoothing (which doubles as the blur). All motion
 * uses small, constant speeds so it stays slow and steady. Fixed and behind all
 * content; renders a single static frame under prefers-reduced-motion.
 */

type Layer = { base: number; weight: number; speed: number; phase: number };

const LAYERS: Layer[] = [
    { base: -0.42, weight: 0.9, speed: 0.42, phase: 0.0 },
    { base: -0.14, weight: 1.0, speed: 0.5, phase: 1.7 },
    { base: 0.16, weight: 0.95, speed: 0.46, phase: 3.4 },
    { base: 0.44, weight: 0.8, speed: 0.54, phase: 5.1 },
];

function hash2(x: number, y: number): number {
    const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return n - Math.floor(n);
}

function valueNoise(x: number, y: number): number {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;
    const u = xf * xf * (3 - 2 * xf);
    const v = yf * yf * (3 - 2 * yf);
    const a = hash2(xi, yi);
    const b = hash2(xi + 1, yi);
    const c = hash2(xi, yi + 1);
    const d = hash2(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

function fbm(x: number, y: number): number {
    let value = 0;
    let amp = 0.5;
    let px = x;
    let py = y;
    for (let i = 0; i < 4; i++) {
        value += amp * valueNoise(px, py);
        px = px * 1.9 + 3.0;
        py = py * 1.9 + 1.7;
        amp *= 0.55;
    }
    return value;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
    const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
}

export const AuroraBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

        const off = document.createElement("canvas");
        const offCtx = off.getContext("2d");
        if (!offCtx) return;

        let width = 0;
        let height = 0;
        let lw = 0;
        let lh = 0;
        let img: ImageData | null = null;
        let rafId = 0;
        let running = true;

        const resize = () => {
            width = canvas.clientWidth;
            height = canvas.clientHeight;
            canvas.width = Math.max(1, Math.floor(width * dpr));
            canvas.height = Math.max(1, Math.floor(height * dpr));
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            // More horizontal resolution so the vertical rays survive upscaling;
            // fewer rows is fine because the rays run vertically.
            lw = Math.max(120, Math.min(420, Math.floor(width / 3)));
            lh = Math.max(70, Math.min(120, Math.floor(height / 7)));
            off.width = lw;
            off.height = lh;
            img = offCtx.createImageData(lw, lh);
        };
        resize();
        window.addEventListener("resize", resize);

        const draw = (nowMs: number) => {
            if (!img) return;
            const t = nowMs / 1000;
            const aspect = lw / lh;
            const data = img.data;

            // Per-row curtain centre / width / vertical fade (cheap: depends on y).
            const L = LAYERS.length;
            const cxRow = new Float32Array(lh * L);
            const wRow = new Float32Array(lh * L);
            const vFade = new Float32Array(lh);
            for (let py = 0; py < lh; py++) {
                const Y = py / lh;
                // Bright near the top (ceiling ~ upper area), fading downward.
                vFade[py] = smoothstep(0, 0.06, Y) * Math.max(0, 1 - Y / 0.62);
                for (let i = 0; i < L; i++) {
                    const layer = LAYERS[i];
                    const st = t * layer.speed;
                    const snake =
                        Math.sin(Y * 3.0 + st + layer.phase) * 0.16 +
                        (fbm(Y * 1.6 + layer.phase * 3.0, st * 0.9) - 0.5) * 0.55;
                    cxRow[py * L + i] = layer.base + snake;
                    wRow[py * L + i] = 0.07 + 0.055 * fbm(Y * 3.0 + layer.phase, st * 0.7);
                }
            }

            for (let py = 0; py < lh; py++) {
                const Y = py / lh;
                const fade = vFade[py];
                for (let px = 0; px < lw; px++) {
                    const X = (px / lw - 0.5) * aspect;
                    let inten = 0;
                    if (fade > 0.001) {
                        for (let i = 0; i < L; i++) {
                            const dx = (X - cxRow[py * L + i]) / wRow[py * L + i];
                            inten += Math.exp(-dx * dx) * LAYERS[i].weight;
                        }
                        // Vertical rays: higher-frequency, mostly along x, drifting
                        // slowly and bending gently with height, with contrast so
                        // bright pleats separate with darker gaps.
                        const rn =
                            valueNoise(X * 9.0 + t * 0.15, Y * 0.8) * 0.6 +
                            valueNoise(X * 19.0 - t * 0.22, Y * 1.4 + 3.0) * 0.4;
                        const ray = Math.pow(0.26 + 0.74 * rn, 1.6);
                        inten *= fade * ray;
                    }

                    const a = 1 - Math.exp(-inten * 2.3);
                    const idx = (py * lw + px) * 4;
                    data[idx] = 232;
                    data[idx + 1] = 244;
                    data[idx + 2] = 255;
                    data[idx + 3] = Math.max(0, Math.min(255, a * 255));
                }
            }

            offCtx.putImageData(img, 0, 0);
            ctx.clearRect(0, 0, width, height);
            ctx.imageSmoothingEnabled = true;
            ctx.drawImage(off, 0, 0, lw, lh, 0, 0, width, height);

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
            <canvas ref={canvasRef} className="aurora-canvas" />
            <div className="aurora-stars" />
            <div className="aurora-vignette" />
        </div>
    );
};
