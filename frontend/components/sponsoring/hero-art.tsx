/**
 * Illustration décorative du hero (plan-masse de chantier), recolorée aux
 * tokens Welearn : wl-tint #A9CBEF, wl-orange #E8721C, blanc.
 * Purement décorative : pointer-events none, masquée sous 900px.
 */
export function HeroArt() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-y-0 right-0 hidden w-[44%] min-w-[320px] min-[900px]:block"
      style={{
        maskImage:
          "linear-gradient(to left, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 100%)",
        WebkitMaskImage:
          "linear-gradient(to left, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 100%)",
      }}
    >
      <svg
        viewBox="0 0 420 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute bottom-0 right-0 h-auto w-full opacity-40"
      >
        <g opacity=".9">
          <rect x="40" y="150" width="60" height="150" fill="none" stroke="#A9CBEF" strokeWidth="1.4" />
          <rect x="52" y="165" width="12" height="14" fill="#A9CBEF" opacity=".35" />
          <rect x="72" y="165" width="12" height="14" fill="#A9CBEF" opacity=".35" />
          <rect x="52" y="190" width="12" height="14" fill="#A9CBEF" opacity=".25" />
          <rect x="72" y="190" width="12" height="14" fill="#A9CBEF" opacity=".25" />
          <rect x="52" y="215" width="12" height="14" fill="#A9CBEF" opacity=".25" />
          <rect x="72" y="215" width="12" height="14" fill="#A9CBEF" opacity=".25" />

          <rect x="115" y="90" width="80" height="210" fill="none" stroke="#FFFFFF" strokeWidth="1.4" />
          <line x1="115" y1="120" x2="195" y2="120" stroke="#FFFFFF" strokeWidth="1" opacity=".5" />
          <line x1="115" y1="150" x2="195" y2="150" stroke="#FFFFFF" strokeWidth="1" opacity=".5" />
          <line x1="115" y1="180" x2="195" y2="180" stroke="#FFFFFF" strokeWidth="1" opacity=".5" />
          <line x1="115" y1="210" x2="195" y2="210" stroke="#FFFFFF" strokeWidth="1" opacity=".5" />
          <line x1="115" y1="240" x2="195" y2="240" stroke="#FFFFFF" strokeWidth="1" opacity=".5" />
          <line x1="115" y1="270" x2="195" y2="270" stroke="#FFFFFF" strokeWidth="1" opacity=".5" />
          <line x1="140" y1="90" x2="140" y2="300" stroke="#FFFFFF" strokeWidth="1" opacity=".35" />
          <line x1="170" y1="90" x2="170" y2="300" stroke="#FFFFFF" strokeWidth="1" opacity=".35" />

          <rect x="215" y="180" width="55" height="120" fill="none" stroke="#A9CBEF" strokeWidth="1.4" />
          <line x1="215" y1="205" x2="270" y2="205" stroke="#A9CBEF" strokeWidth="1" opacity=".5" />
          <line x1="215" y1="230" x2="270" y2="230" stroke="#A9CBEF" strokeWidth="1" opacity=".5" />
          <line x1="215" y1="255" x2="270" y2="255" stroke="#A9CBEF" strokeWidth="1" opacity=".5" />
          <line x1="215" y1="280" x2="270" y2="280" stroke="#A9CBEF" strokeWidth="1" opacity=".5" />

          <line x1="330" y1="300" x2="330" y2="60" stroke="#E8721C" strokeWidth="2" />
          <line x1="330" y1="60" x2="410" y2="70" stroke="#E8721C" strokeWidth="2" />
          <line x1="330" y1="60" x2="300" y2="72" stroke="#E8721C" strokeWidth="2" />
          <line x1="330" y1="72" x2="392" y2="80" stroke="#E8721C" strokeWidth="1" opacity=".7" />
          <line x1="390" y1="70" x2="390" y2="110" stroke="#E8721C" strokeWidth="1.4" />
          <circle cx="330" cy="60" r="3.5" fill="#E8721C" />
          <line x1="300" y1="300" x2="360" y2="300" stroke="#E8721C" strokeWidth="2" />

          <line x1="10" y1="300" x2="410" y2="300" stroke="#FFFFFF" strokeWidth="1" opacity=".3" />
        </g>
      </svg>
    </div>
  );
}
