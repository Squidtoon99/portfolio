/**
 * "White aurora borealis" backdrop.
 *
 * Layers, from back to front:
 *   1. An optional real-footage video layer. Drop a file at `public/aurora-bg.mp4`
 *      (e.g. the referenced white-aurora clip) and it is used automatically; when
 *      the file is absent the <video> simply renders nothing and the animated
 *      layers below act as the fallback.
 *   2. A soft ambient white glow for atmosphere.
 *   3. Animated SVG "aurora ribbons": thin luminous white lines that wave (their
 *      paths morph) and shimmer (their opacity pulses), like drifting curtains.
 *   4. A faint starfield and an edge vignette for depth.
 *
 * The whole thing is fixed, non-interactive, and sits behind all page content.
 */

const AURORA_VIDEO_SRC = "/aurora-bg.mp4";

type Ribbon = {
    x: number;
    width: number;
    dur: number;
    shimmerDur: number;
    opacity: number;
};

const RIBBONS: Ribbon[] = [
    { x: 150, width: 3, dur: 9, shimmerDur: 5.5, opacity: 0.9 },
    { x: 360, width: 2, dur: 12.5, shimmerDur: 7, opacity: 0.7 },
    { x: 560, width: 4, dur: 8, shimmerDur: 4.5, opacity: 1 },
    { x: 770, width: 2.5, dur: 13.5, shimmerDur: 6.5, opacity: 0.75 },
    { x: 980, width: 3.2, dur: 10.5, shimmerDur: 5, opacity: 0.85 },
];

/** Build a mostly-vertical wavy path so ribbons read as tall aurora curtains. */
function wavePath(x: number, bend: number): string {
    return (
        `M ${x} -80 ` +
        `C ${x + bend} 180, ${x - bend} 380, ${x + bend * 0.6} 560 ` +
        `S ${x - bend} 900, ${x + bend * 0.4} 1080`
    );
}

export const AuroraBackground = () => {
    return (
        <div aria-hidden="true" className="aurora-root pointer-events-none fixed inset-0 z-0 overflow-hidden">
            <video className="aurora-video" autoPlay muted loop playsInline preload="auto">
                <source src={AURORA_VIDEO_SRC} type="video/mp4" />
            </video>

            <div className="aurora-ambient" />

            <svg
                className="aurora-lines"
                viewBox="0 0 1120 1000"
                preserveAspectRatio="xMidYMid slice"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient id="auroraLineGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                        <stop offset="22%" stopColor="#eaf3ff" stopOpacity="0.95" />
                        <stop offset="55%" stopColor="#ffffff" stopOpacity="0.75" />
                        <stop offset="100%" stopColor="#cfe3ff" stopOpacity="0" />
                    </linearGradient>
                    <filter id="auroraGlow" x="-60%" y="-60%" width="220%" height="220%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                <g className="aurora-lines-group" filter="url(#auroraGlow)">
                    {RIBBONS.map((ribbon) => {
                        const from = wavePath(ribbon.x, 65);
                        const mid = wavePath(ribbon.x, -55);
                        return (
                            <path
                                key={ribbon.x}
                                d={from}
                                fill="none"
                                stroke="url(#auroraLineGradient)"
                                strokeWidth={ribbon.width}
                                strokeLinecap="round"
                                opacity={ribbon.opacity}
                            >
                                <animate
                                    attributeName="d"
                                    dur={`${ribbon.dur}s`}
                                    repeatCount="indefinite"
                                    calcMode="spline"
                                    keyTimes="0;0.5;1"
                                    keySplines="0.45 0 0.55 1;0.45 0 0.55 1"
                                    values={`${from};${mid};${from}`}
                                />
                                <animate
                                    attributeName="stroke-opacity"
                                    dur={`${ribbon.shimmerDur}s`}
                                    repeatCount="indefinite"
                                    keyTimes="0;0.25;0.5;0.75;1"
                                    values="0.25;0.9;0.45;1;0.25"
                                />
                            </path>
                        );
                    })}
                </g>
            </svg>

            <div className="aurora-stars" />
            <div className="aurora-vignette" />
        </div>
    );
};
