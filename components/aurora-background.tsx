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

// fadeEnd controls how far down the layer survives before dissolving to nothing
// (full opacity at the top, 0 by Y = fadeEnd). Varying it per layer makes the
// curtains fade out at different "speeds"/heights.
type Layer = { base: number; weight: number; speed: number; phase: number; wScale: number; fadeEnd: number };

const LAYERS: Layer[] = [
    { base: -0.52, weight: 0.7, speed: 0.4, phase: 0.0, wScale: 0.95, fadeEnd: 0.55 },
    { base: -0.3, weight: 0.95, speed: 0.48, phase: 1.1, wScale: 0.7, fadeEnd: 0.92 },
    { base: -0.08, weight: 1.0, speed: 0.44, phase: 2.4, wScale: 0.6, fadeEnd: 0.68 },
    { base: 0.14, weight: 1.0, speed: 0.5, phase: 3.5, wScale: 0.65, fadeEnd: 1.0 },
    { base: 0.34, weight: 0.9, speed: 0.46, phase: 4.6, wScale: 0.75, fadeEnd: 0.6 },
    { base: 0.54, weight: 0.7, speed: 0.52, phase: 5.7, wScale: 0.95, fadeEnd: 0.8 },
];

const FADE_CURVE = 1.25;

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
            const fadeRow = new Float32Array(lh * L);
            const ambFade = new Float32Array(lh);
            const rowMax = new Float32Array(lh);
            for (let py = 0; py < lh; py++) {
                const Y = py / lh;
                let mx = 0;
                for (let i = 0; i < L; i++) {
                    const layer = LAYERS[i];
                    const st = t * layer.speed;
                    const snake =
                        Math.sin(Y * 3.0 + st + layer.phase) * 0.16 +
                        (fbm(Y * 1.6 + layer.phase * 3.0, st * 0.9) - 0.5) * 0.55;
                    cxRow[py * L + i] = layer.base + snake;
                    wRow[py * L + i] = (0.055 + 0.05 * fbm(Y * 3.0 + layer.phase, st * 0.7)) * layer.wScale;
                    // Full opacity at the top, dissolving to nothing at Y = fadeEnd.
                    const f = Math.pow(Math.max(0, 1 - Y / layer.fadeEnd), FADE_CURVE);
                    fadeRow[py * L + i] = f;
                    if (f > mx) mx = f;
                }
                // The ambient haze fades on its own, gentler curve.
                ambFade[py] = Math.pow(Math.max(0, 1 - Y / 0.78), 1.15);
                if (ambFade[py] > mx) mx = ambFade[py];
                rowMax[py] = mx;
            }

            for (let py = 0; py < lh; py++) {
                const Y = py / lh;
                const alive = rowMax[py] > 0.002;
                for (let px = 0; px < lw; px++) {
                    const X = (px / lw - 0.5) * aspect;
                    let inten = 0;
                    if (alive) {
                        for (let i = 0; i < L; i++) {
                            const dx = (X - cxRow[py * L + i]) / wRow[py * L + i];
                            inten += Math.exp(-dx * dx) * LAYERS[i].weight * fadeRow[py * L + i];
                        }
                        // Broad ambient haze across the centre so the rays sit on a
                        // continuous glow rather than isolated columns.
                        const ax = X * 0.85;
                        inten += Math.exp(-ax * ax) * 0.4 * ambFade[py];
                        // Fine vertical rays: multi-octave, mostly along x, drifting
                        // slowly and bending gently with height, with contrast so
                        // bright pleats separate with darker gaps.
                        const rn =
                            valueNoise(X * 12.0 + t * 0.07, Y * 0.7) * 0.5 +
                            valueNoise(X * 26.0 - t * 0.11, Y * 1.3 + 3.0) * 0.32 +
                            valueNoise(X * 46.0 + 7.0, Y * 2.0) * 0.18;
                        const ray = Math.pow(0.3 + 0.7 * rn, 1.35);
                        inten *= ray;
                    }

                    const a = 1 - Math.exp(-inten * 2.5);
                    const idx = (py * lw + px) * 4;
                    // Near-white with a faint cool tint up top drifting to a hint of
                    // green lower down (subtle spectral realism).
                    data[idx] = 226 - 6 * Y;
                    data[idx + 1] = 247;
                    data[idx + 2] = 255 - 18 * Y;
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
