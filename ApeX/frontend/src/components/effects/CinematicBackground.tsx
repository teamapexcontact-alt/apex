/**
 * Fixed CSS cinematic backdrop — no WebGL, no RAF.
 * Renders immediately with solid fallback; drift animates only when allowed.
 */
export function CinematicBackground() {
  return (
    <div className="cinematic-bg" aria-hidden>
      <div className="cinematic-bg__base" />
      <div className="cinematic-bg__glow cinematic-bg__glow--cyan" />
      <div className="cinematic-bg__glow cinematic-bg__glow--purple" />
      <div className="cinematic-bg__glow cinematic-bg__glow--magenta" />
      <div className="cinematic-bg__vignette" />
      <div className="cinematic-bg__noise" />
    </div>
  );
}
