/**
 * Full-screen "white aurora borealis" backdrop.
 *
 * Renders a very dark night-sky base with several soft, blurred white light
 * curtains that slowly drift, mimicking a rare white aurora. It sits behind all
 * page content (z-0) and is purely decorative / non-interactive.
 */
export const AuroraBackground = () => {
    return (
        <div aria-hidden="true" className="aurora-root pointer-events-none fixed inset-0 z-0 overflow-hidden">
            <div className="aurora-band aurora-band-1" />
            <div className="aurora-band aurora-band-2" />
            <div className="aurora-band aurora-band-3" />
            <div className="aurora-stars" />
            <div className="aurora-vignette" />
        </div>
    );
};
