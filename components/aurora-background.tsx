"use client";

import { useEffect, useRef } from "react";

/**
 * Canvas "white aurora borealis" backdrop.
 *
 * A SINGLE soft aurora ribbon that slowly drifts across the screen. Its centre
 * is a horizontal sweep (so the whole ribbon travels left/right) plus a vertical
 * "snake" (summed sine + fBm) so it folds as it moves. The ribbon is a Gaussian
 * band across x (bright-ish core fading to haze at the edges) carrying fine
 * vertical rays/"lines" sampled in the ribbon's own moving frame, so the sense
 * of lines travels with it. It is full opacity at the top and gradients to
 * nothing toward the bottom.
 *
 * For smoothness + performance the field is computed on a small offscreen buffer
 * and upscaled with bilinear smoothing (which doubles as the blur). Motion uses
 * small, constant speeds so it stays slow and steady; a single static frame is
 * drawn under prefers-reduced-motion.
 */

const FADE_END = 0.85; // ribbon dissolves to nothing by ~85% down the screen
const FADE_CURVE = 1.25;
const GAIN = 1.55; // keep the ribbon soft, not overpowering

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
            // More horizontal resolution so the vertical rays survive upscaling.
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

            // The whole (wide) ribbon drifts slowly and gently across the screen.
            const sweep = Math.sin(t * 0.03) * 0.2 + Math.sin(t * 0.014 + 1.3) * 0.06;

            // Per-row ribbon centre / width / vertical fade.
            const cxRow = new Float32Array(lh);
            const wRow = new Float32Array(lh);
            const fadeRow = new Float32Array(lh);
            for (let py = 0; py < lh; py++) {
                const Y = py / lh;
                const snake =
                    Math.sin(Y * 2.2 + t * 0.13) * 0.14 + (fbm(Y * 1.3 + 4.0, t * 0.13) - 0.5) * 0.4;
                cxRow[py] = sweep + snake;
                // Wide ribbon that spans most of the screen.
                wRow[py] = 0.46 + 0.12 * fbm(Y * 2.4, t * 0.18);
                // Full opacity at the top, dissolving to nothing by FADE_END.
                fadeRow[py] = Math.pow(Math.max(0, 1 - Y / FADE_END), FADE_CURVE);
            }

            for (let py = 0; py < lh; py++) {
                const Y = py / lh;
                const fade = fadeRow[py];
                const cx = cxRow[py];
                const w = wRow[py];
                const alive = fade > 0.002;
                for (let px = 0; px < lw; px++) {
                    const X = (px / lw - 0.5) * aspect;
                    let inten = 0;
                    if (alive) {
                        const dx = (X - cx) / w;
                        const band = Math.exp(-dx * dx);
                        if (band > 0.004) {
                            // Fine vertical rays sampled in the ribbon's own moving
                            // frame, so the "lines" travel with the ribbon.
                            const lx = X - cx;
                            const rn =
                                valueNoise(lx * 20.0 + t * 0.04, Y * 0.8) * 0.55 +
                                valueNoise(lx * 40.0 - t * 0.07, Y * 1.4 + 3.0) * 0.3 +
                                valueNoise(lx * 66.0 + 7.0, Y * 2.0) * 0.15;
                            const ray = Math.pow(0.32 + 0.68 * rn, 1.4);
                            inten = band * fade * ray;
                        }
                    }

                    const a = 1 - Math.exp(-inten * GAIN);
                    const idx = (py * lw + px) * 4;
                    // Near-white with a faint cool tint drifting to a hint of green.
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
