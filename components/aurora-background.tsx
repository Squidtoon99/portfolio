"use client";

import { useEffect, useRef } from "react";

/**
 * Canvas "white aurora borealis" backdrop.
 *
 * Renders a few smooth, wavy light *ribbons* (rather than discrete beams). Each
 * ribbon's top edge is a Catmull-Rom spline whose control points drift with
 * gentle low-frequency noise — with strong variation on the y-axis so the ridge
 * undulates up and down — while a soft curtain hangs below it. Ribbons are
 * fanned (their bottoms spread wider than their tops) so the curtain reads as if
 * seen from below, looking *up* at the aurora, while the page text stays flat in
 * front of it.
 *
 * All motion uses small, near-uniform angular speeds so it stays slow and steady
 * the whole time (never speeds up). Fixed, non-interactive, behind all content;
 * renders a single static frame under prefers-reduced-motion.
 */

const CONTROL_POINTS = 6;
const SAMPLES = 130;

type Layer = {
    baseY: number;
    yAmp: number;
    height: number;
    fan: number;
    blur: number;
    alpha: number;
    hue: string;
    speed: number;
    phase: number;
};

const LAYERS: Layer[] = [
    { baseY: 0.2, yAmp: 0.12, height: 0.34, fan: 1.42, blur: 16, alpha: 0.16, hue: "225, 242, 255", speed: 0.9, phase: 0.0 },
    { baseY: 0.15, yAmp: 0.15, height: 0.3, fan: 1.3, blur: 11, alpha: 0.2, hue: "255, 255, 255", speed: 1.0, phase: 2.3 },
    { baseY: 0.25, yAmp: 0.1, height: 0.24, fan: 1.18, blur: 8, alpha: 0.15, hue: "216, 255, 236", speed: 1.1, phase: 4.6 },
];

type Control = {
    baseX: number;
    baseYOff: number;
    phaseX: number;
    phaseY: number;
    speedX: number;
    speedY: number;
};

/** Two summed low-frequency sines -> smooth, steady, slow motion (no speed-ups). */
function smoothNoise(t: number, phase: number, speed: number): number {
    return Math.sin(t * speed + phase) * 0.6 + Math.sin(t * speed * 0.6 + phase * 1.3) * 0.4;
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
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

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
            baseYOff: Math.random() * 2 - 1,
            phaseX: Math.random() * Math.PI * 2,
            phaseY: Math.random() * Math.PI * 2,
            speedX: 0.09 + Math.random() * 0.03,
            speedY: 0.08 + Math.random() * 0.03,
        }));

        const draw = (nowMs: number) => {
            const t = nowMs / 1000;
            ctx.clearRect(0, 0, width, height);
            ctx.globalCompositeOperation = "lighter";
            const cx = width / 2;

            for (const layer of LAYERS) {
                const st = t * layer.speed;

                const ridge = controls.map((c) => {
                    const x =
                        cx +
                        (c.baseX - 0.5) * width * 1.12 +
                        smoothNoise(st, c.phaseX + layer.phase, c.speedX) * width * 0.06;
                    const y =
                        height * layer.baseY +
                        c.baseYOff * height * 0.075 +
                        smoothNoise(st, c.phaseY + layer.phase, c.speedY) * height * layer.yAmp;
                    return { x, y };
                });

                const topPts: Array<[number, number]> = [];
                const botPts: Array<[number, number]> = [];
                for (let s = 0; s < SAMPLES; s++) {
                    const f = s / (SAMPLES - 1);
                    const seg = f * (CONTROL_POINTS - 1);
                    const i = Math.min(Math.floor(seg), CONTROL_POINTS - 2);
                    const lt = seg - i;
                    const p0 = ridge[Math.max(0, i - 1)];
                    const p1 = ridge[i];
                    const p2 = ridge[i + 1];
                    const p3 = ridge[Math.min(CONTROL_POINTS - 1, i + 2)];
                    const X = catmullRom(p0.x, p1.x, p2.x, p3.x, lt);
                    const Y = catmullRom(p0.y, p1.y, p2.y, p3.y, lt);

                    // Taper the curtain toward the ends so the ribbon fades softly.
                    const taper = Math.sin(Math.PI * f);
                    const lenNoise = 0.82 + 0.18 * smoothNoise(st, f * 3 + layer.phase, 0.08);
                    const clen = height * layer.height * (0.5 + 0.5 * taper) * lenNoise;
                    // Fan: bottoms spread wider than tops -> "looking up" foreshortening.
                    const bx = cx + (X - cx) * layer.fan;

                    topPts.push([X, Y]);
                    botPts.push([bx, Y + clen]);
                }

                const traceRidge = () => {
                    ctx.beginPath();
                    ctx.moveTo(topPts[0][0], topPts[0][1]);
                    for (let i = 1; i < SAMPLES; i++) ctx.lineTo(topPts[i][0], topPts[i][1]);
                };

                // Soft curtain hanging below the ridge (downward haze).
                ctx.filter = `blur(${layer.blur}px)`;
                ctx.beginPath();
                ctx.moveTo(topPts[0][0], topPts[0][1]);
                for (let i = 1; i < SAMPLES; i++) ctx.lineTo(topPts[i][0], topPts[i][1]);
                for (let i = SAMPLES - 1; i >= 0; i--) ctx.lineTo(botPts[i][0], botPts[i][1]);
                ctx.closePath();
                const gTop = height * layer.baseY - height * 0.06;
                const gBot = height * (layer.baseY + layer.height + layer.yAmp);
                const body = ctx.createLinearGradient(0, gTop, 0, gBot);
                body.addColorStop(0, `rgba(${layer.hue}, 0)`);
                body.addColorStop(0.14, `rgba(${layer.hue}, ${layer.alpha * 0.6})`);
                body.addColorStop(0.55, `rgba(${layer.hue}, ${layer.alpha * 0.3})`);
                body.addColorStop(1, `rgba(${layer.hue}, 0)`);
                ctx.fillStyle = body;
                ctx.fill();

                // Wide soft haze around the ridge -> the outer part of the
                // haze -> line -> haze cross-profile.
                traceRidge();
                ctx.strokeStyle = `rgba(${layer.hue}, ${layer.alpha * 0.55})`;
                ctx.lineWidth = 20;
                ctx.lineJoin = "round";
                ctx.lineCap = "round";
                ctx.stroke();

                // Bright core line whose strength varies slowly along the length:
                // some stretches read as a crisp white ribbon, others fade to just
                // haze. The bright regions drift over time so folds travel.
                const core = ctx.createLinearGradient(0, 0, width, 0);
                const STOPS = 12;
                for (let k = 0; k <= STOPS; k++) {
                    const gx = k / STOPS;
                    const n = smoothNoise(st, gx * 6 + layer.phase, 0.1);
                    const strength = Math.max(0, (n + 0.25) / 1.25);
                    const a = Math.min(1, layer.alpha * 2 * strength);
                    core.addColorStop(gx, `rgba(${layer.hue}, ${a})`);
                }
                ctx.filter = "blur(2px)";
                traceRidge();
                ctx.strokeStyle = core;
                ctx.lineWidth = 2.2;
                ctx.stroke();

                ctx.filter = "none";
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
