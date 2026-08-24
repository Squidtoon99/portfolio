/**
 * Pure-CSS "white aurora borealis" backdrop.
 *
 * Recreates the look of white light-pillar auroras (bright hazy source near the
 * top with many thin white light pillars hanging down and fading, over a dark
 * starry sky). Layers, back to front:
 *   1. A dark night-sky base (on .aurora-root).
 *   2. A bright hazy glow band — the luminous "source" the pillars fall from.
 *   3. Three light-pillar curtains (far / mid / near) built from soft repeating
 *      gradients, masked to fade downward and outward, slowly drifting and
 *      shimmering at staggered speeds inside a 3D perspective scene for depth.
 *   4. A faint starfield and an edge vignette.
 *
 * Everything is CSS-driven, slow, fixed, non-interactive, and sits behind all
 * page content. Honors prefers-reduced-motion.
 */
export const AuroraBackground = () => {
    return (
        <div aria-hidden="true" className="aurora-root pointer-events-none fixed inset-0 z-0 overflow-hidden">
            <div className="aurora-glow" />
            <div className="aurora-scene">
                <div className="aurora-curtain aurora-curtain-far" />
                <div className="aurora-curtain aurora-curtain-mid" />
                <div className="aurora-curtain aurora-curtain-near" />
                <div className="aurora-haze" />
            </div>
            <div className="aurora-stars" />
            <div className="aurora-vignette" />
        </div>
    );
};
