/** CSS-driven hero orbs — no Framer Motion RAF loop */
export function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div
        className="absolute rounded-full blur-3xl floating-orb"
        style={{
          width: 400,
          height: 400,
          left: "10%",
          top: "20%",
          background:
            "radial-gradient(circle, rgba(0,245,255,0.12) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute rounded-full blur-3xl floating-orb floating-orb--delay-1"
        style={{
          width: 300,
          height: 300,
          left: "75%",
          top: "15%",
          background:
            "radial-gradient(circle, rgba(155,77,255,0.1) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute rounded-full blur-3xl floating-orb floating-orb--delay-2"
        style={{
          width: 250,
          height: 250,
          left: "60%",
          top: "70%",
          background:
            "radial-gradient(circle, rgba(255,45,155,0.08) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
