/**
 * "White aurora borealis" backdrop.
 *
 * Layers, from back to front:
 *   1. A real-footage white-aurora video (defaults to the bundled
 *      `public/aurora-bg.mp4`; override with NEXT_PUBLIC_AURORA_VIDEO_SRC), with
 *      a dark scrim on top so white foreground text stays legible.
 *   2. Animated SVG aurora curtains inside a 3D perspective scene, layered over
 *      the footage for extra life:
 *        - a soft hazy white glow that sits between the ribbons, and
 *        - thin luminous white "ribbons" whose paths morph (wave) and whose
 *          opacity pulses (shimmer).
 *      The whole curtain slowly rotates/tilts under perspective and the ribbons
 *      drift at staggered speeds, so it reads as depth / motion in 3D space.
 *   3. A faint starfield and an edge vignette for depth.
 *
 * The curtain is intentionally contained near screen-center (not full-bleed),
 * and every motion is slow. Fixed, non-interactive, behind all page content.
 */

const AURORA_VIDEO_SRC = process.env.NEXT_PUBLIC_AURORA_VIDEO_SRC ?? "/aurora-bg.mp4";

type Ribbon = {
    x: number;
    width: number;
    /** Base opacity — lower values read as ribbons further back in space. */
    opacity: number;
    /** Seconds for one wave (path morph) cycle. */
    waveDur: number;
    /** Seconds for one shimmer (opacity pulse) cycle. */
    shimmerDur: number;
    /** Seconds for one 3D parallax drift cycle. */
    driftDur: number;
    driftDelay: number;
};

// Clustered near the horizontal centre (viewBox is 1120 wide) so the aurora is
// a contained curtain rather than a full-screen wash.
const RIBBONS: Ribbon[] = [
    { x: 452, width: 2.4, opacity: 0.55, waveDur: 26, shimmerDur: 13, driftDur: 30, driftDelay: 0 },
    { x: 512, width: 3.2, opacity: 0.85, waveDur: 30, shimmerDur: 16, driftDur: 26, driftDelay: -6 },
    { x: 568, width: 4, opacity: 1, waveDur: 24, shimmerDur: 11, driftDur: 34, driftDelay: -3 },
    { x: 624, width: 3, opacity: 0.8, waveDur: 32, shimmerDur: 15, driftDur: 28, driftDelay: -9 },
    { x: 684, width: 2.2, opacity: 0.5, waveDur: 28, shimmerDur: 14, driftDur: 32, driftDelay: -4 },
];

/**
 * Build a short, mostly-vertical wavy path confined to a central band
 * (roughly y: 170 → 690) so ribbons read as small aurora curtains.
 */
function wavePath(x: number, bend: number): string {
    return (
        `M ${x} 175 ` +
        `C ${x + bend} 300, ${x - bend} 410, ${x + bend * 0.55} 520 ` +
        `S ${x - bend} 650, ${x + bend * 0.4} 690`
    );
}

export const AuroraBackground = () => {
    return (
        <div aria-hidden="true" className="aurora-root pointer-events-none fixed inset-0 z-0 overflow-hidden">
            <video className="aurora-video" autoPlay muted loop playsInline preload="auto">
                <source src={AURORA_VIDEO_SRC} type="video/mp4" />
            </video>
            <div className="aurora-video-scrim" />

            <div className="aurora-scene">
                <svg
                    className="aurora-lines"
                    viewBox="0 0 1120 1000"
                    preserveAspectRatio="xMidYMid slice"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id="auroraLineGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                            <stop offset="24%" stopColor="#eaf3ff" stopOpacity="0.95" />
                            <stop offset="55%" stopColor="#ffffff" stopOpacity="0.75" />
                            <stop offset="100%" stopColor="#cfe3ff" stopOpacity="0" />
                        </linearGradient>
                        <radialGradient id="auroraHazeGradient" cx="50%" cy="46%" r="55%">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.32" />
                            <stop offset="45%" stopColor="#dbeafe" stopOpacity="0.14" />
                            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                        </radialGradient>
                        <filter id="auroraGlow" x="-60%" y="-60%" width="220%" height="220%">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                        <filter id="auroraHazeBlur" x="-80%" y="-80%" width="260%" height="260%">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="34" />
                        </filter>
                    </defs>

                    {/* Hazy white glow that sits between the ribbons */}
                    <ellipse
                        className="aurora-haze"
                        cx="568"
                        cy="430"
                        rx="230"
                        ry="240"
                        fill="url(#auroraHazeGradient)"
                        filter="url(#auroraHazeBlur)"
                    />

                    <g className="aurora-lines-group" filter="url(#auroraGlow)">
                        {RIBBONS.map((ribbon) => {
                            const from = wavePath(ribbon.x, 42);
                            const mid = wavePath(ribbon.x, -34);
                            return (
                                <path
                                    key={ribbon.x}
                                    className="aurora-ribbon"
                                    style={{
                                        animationDuration: `${ribbon.driftDur}s`,
                                        animationDelay: `${ribbon.driftDelay}s`,
                                    }}
                                    d={from}
                                    fill="none"
                                    stroke="url(#auroraLineGradient)"
                                    strokeWidth={ribbon.width}
                                    strokeLinecap="round"
                                    opacity={ribbon.opacity}
                                >
                                    <animate
                                        attributeName="d"
                                        dur={`${ribbon.waveDur}s`}
                                        repeatCount="indefinite"
                                        calcMode="spline"
                                        keyTimes="0;0.5;1"
                                        keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
                                        values={`${from};${mid};${from}`}
                                    />
                                    <animate
                                        attributeName="stroke-opacity"
                                        dur={`${ribbon.shimmerDur}s`}
                                        repeatCount="indefinite"
                                        keyTimes="0;0.25;0.5;0.75;1"
                                        values="0.35;0.9;0.5;1;0.35"
                                    />
                                </path>
                            );
                        })}
                    </g>
                </svg>
            </div>

            <div className="aurora-stars" />
            <div className="aurora-vignette" />
        </div>
    );
};
