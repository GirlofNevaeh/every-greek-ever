import { useId } from "react";
import type { Frame, Hair, Prop } from "@/data/catalog";

const ink = "var(--color-ink)";
const blue = "var(--color-blue)";
const card = "var(--color-card)";
const paper = "var(--color-paper)";

export function KeyStrip({ on = "blue" }: { on?: "blue" | "paper" }) {
  const id = useId();
  const stroke = on === "blue" ? card : blue;
  return (
    <svg className="h-4 w-full" viewBox="0 0 200 16" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <pattern id={id} width="28" height="16" patternUnits="userSpaceOnUse">
          <path
            d="M1 11 H8 V4 H15 V11 H22 V6 H18 V9 H11 V6 H5 V9 H1"
            fill="none"
            stroke={stroke}
            strokeWidth="2"
          />
        </pattern>
      </defs>
      <rect width="200" height="16" fill={`url(#${id})`} />
    </svg>
  );
}

function HairShape({ hair }: { hair: Hair }) {
  if (hair === "long") {
    return (
      <g>
        <path d="M48 78 C28 110 30 160 46 188 C54 150 58 120 70 100" fill={ink} stroke="none" />
        <path d="M112 78 C132 110 130 160 114 188 C106 150 102 120 90 100" fill={blue} stroke="none" />
        <path d="M52 74 Q80 36 108 74 Q100 52 80 50 Q60 52 52 74" fill={ink} stroke="none" />
      </g>
    );
  }
  if (hair === "bun") {
    return (
      <g>
        <circle cx="80" cy="40" r="12" fill={blue} stroke={ink} strokeWidth="3" />
        <path d="M54 76 Q80 46 106 76 Q98 58 80 56 Q62 58 54 76" fill={ink} stroke="none" />
      </g>
    );
  }
  if (hair === "wreath") {
    return (
      <g>
        <path d="M54 78 Q80 42 106 78" fill="none" stroke={blue} strokeWidth="5" />
        <path d="M58 70 Q80 50 102 70" fill="none" stroke={ink} strokeWidth="2" />
      </g>
    );
  }
  if (hair === "beard") {
    return (
      <g>
        <path d="M54 72 Q80 48 106 72 Q100 58 80 56 Q60 58 54 72" fill={ink} stroke="none" />
        <path d="M62 96 Q80 122 98 96 Q90 112 80 114 Q70 112 62 96" fill={ink} stroke="none" />
      </g>
    );
  }
  if (hair === "curls") {
    return (
      <g>
        <circle cx="58" cy="70" r="10" fill={blue} stroke={ink} strokeWidth="2" />
        <circle cx="102" cy="70" r="10" fill={blue} stroke={ink} strokeWidth="2" />
        <path d="M54 74 Q80 44 106 74" fill={ink} stroke="none" />
      </g>
    );
  }
  return <path d="M54 74 Q80 44 106 74 Q98 58 80 56 Q62 58 54 74" fill={ink} stroke="none" />;
}

function Figure({ woman, hair }: { woman: boolean; hair: Hair }) {
  return (
    <g stroke={ink} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
      {hair === "long" ? (
        <g fill="none">
          <path d="M38 78 C24 120 28 160 42 176" stroke={ink} />
          <path d="M102 78 C116 120 112 160 98 176" stroke={blue} />
        </g>
      ) : null}
      <path d="M46 108 L36 196 H104 L94 108 Q70 122 46 108 Z" fill={card} />
      <path d="M46 112 C28 140 34 180 48 190 L54 120 Z" fill={blue} />
      {woman ? <path d="M48 108 H92 L86 132 H54 Z" fill={paper} /> : null}
      <path d="M52 150 H90" fill="none" />
      <circle cx="70" cy="72" r="28" fill={card} />
      {hair === "beard" ? <path d="M52 84 Q70 108 88 84 Q78 100 70 102 Q62 100 52 84 Z" fill={ink} stroke="none" /> : null}
      {hair === "bun" ? <circle cx="70" cy="40" r="10" fill={blue} /> : null}
      {hair === "wreath" ? <path d="M44 64 Q70 36 96 64" fill="none" stroke={blue} strokeWidth="5" /> : null}
      {hair === "long" || hair === "bun" || hair === "curls" ? (
        <path d="M46 66 Q70 40 94 66 Q86 52 70 50 Q54 52 46 66 Z" fill={ink} stroke="none" />
      ) : (
        <path d="M46 64 Q70 42 94 64 Q84 52 70 50 Q56 52 46 64 Z" fill={ink} stroke="none" />
      )}
      <circle cx="60" cy="70" r="2.5" fill={ink} stroke="none" />
      <circle cx="80" cy="70" r="2.5" fill={ink} stroke="none" />
      <path d="M60 86 Q70 94 80 86" fill="none" />
      <path d="M44 196 H62 M78 196 H98" />
    </g>
  );
}

export function PropIcon({ prop }: { prop: Prop }) {
  const common = { fill: "none" as const, stroke: ink, strokeWidth: 3, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  switch (prop) {
    case "scroll":
      return (
        <g {...common}>
          <rect x="8" y="18" width="64" height="48" rx="6" fill={card} />
          <path d="M18 32 H62 M18 44 H54" />
          <path d="M8 18 Q4 42 8 66" />
        </g>
      );
    case "owl":
      return (
        <g {...common}>
          <circle cx="40" cy="36" r="22" fill={card} />
          <circle cx="32" cy="34" r="7" fill={paper} />
          <circle cx="48" cy="34" r="7" fill={paper} />
          <circle cx="32" cy="34" r="2" fill={ink} stroke="none" />
          <circle cx="48" cy="34" r="2" fill={ink} stroke="none" />
          <path d="M40 40 L36 46 H44 Z" fill={blue} />
          <path d="M22 58 Q40 78 58 58" fill={blue} />
        </g>
      );
    case "trident":
      return (
        <g {...common}>
          <path d="M40 14 V74" />
          <path d="M22 28 V14 H58 V28" />
          <path d="M22 14 V32 M58 14 V32" />
          <path d="M28 62 H52" />
        </g>
      );
    case "bolt":
      return <path d="M48 8 L28 40 H44 L32 76 L64 36 H46 Z" fill={blue} stroke={ink} strokeWidth="3" strokeLinejoin="round" />;
    case "bow":
      return (
        <g {...common}>
          <path d="M24 10 Q56 40 24 72" />
          <path d="M24 10 L24 72" />
          <path d="M24 40 H58" />
        </g>
      );
    case "lyre":
      return (
        <g {...common}>
          <path d="M22 28 Q40 8 58 28 V58 Q40 74 22 58 Z" fill={card} />
          <path d="M32 30 V58 M40 26 V62 M48 30 V58" />
        </g>
      );
    case "sandals":
      return (
        <g {...common}>
          <path d="M14 48 Q20 34 40 36 Q58 38 60 50 Q40 58 18 52 Z" fill={card} />
          <path d="M22 28 L30 18 M48 20 L58 10" />
          <path d="M18 16 H34 M46 8 H62" />
        </g>
      );
    case "hearth":
      return (
        <g {...common}>
          <path d="M16 70 H64 L56 46 H24 Z" fill={card} />
          <path d="M40 46 Q28 30 36 16 Q40 28 48 18 Q44 34 52 42" fill={blue} />
        </g>
      );
    case "mask":
      return (
        <g {...common}>
          <path d="M18 22 Q40 8 62 22 Q70 46 40 70 Q10 46 18 22" fill={card} />
          <circle cx="30" cy="36" r="4" fill={ink} stroke="none" />
          <circle cx="50" cy="36" r="4" fill={ink} stroke="none" />
          <path d="M30 52 Q40 60 50 52" />
        </g>
      );
    case "flower":
      return (
        <g {...common}>
          <circle cx="40" cy="28" r="8" fill={card} />
          <circle cx="26" cy="36" r="8" fill={paper} />
          <circle cx="54" cy="36" r="8" fill={paper} />
          <circle cx="32" cy="50" r="8" fill={blue} />
          <circle cx="48" cy="50" r="8" fill={blue} />
          <path d="M40 58 V78" />
        </g>
      );
    case "key":
      return (
        <g {...common}>
          <circle cx="30" cy="28" r="14" fill={card} />
          <circle cx="30" cy="28" r="5" fill={paper} />
          <path d="M42 28 H70 V40 H62 V34" />
        </g>
      );
    case "hammer":
      return (
        <g {...common}>
          <rect x="14" y="16" width="36" height="20" rx="3" fill={blue} />
          <path d="M32 36 V74" />
        </g>
      );
    case "dove":
      return (
        <g {...common}>
          <path d="M14 46 Q30 24 52 36 Q68 28 74 40 Q58 48 48 58 Q36 70 24 58 Q20 50 14 46" fill={card} />
          <path d="M52 38 L66 46" />
        </g>
      );
    case "grain":
      return (
        <g {...common}>
          <path d="M40 74 V16" />
          <path d="M40 28 Q24 22 26 34 Q40 32 40 28 M40 40 Q56 34 54 46 Q40 44 40 40 M40 52 Q24 46 26 58 Q40 56 40 52" fill={blue} />
        </g>
      );
    case "peacock":
      return (
        <g {...common}>
          <path d="M18 58 Q40 10 62 58" fill={blue} />
          <circle cx="30" cy="40" r="4" fill={card} />
          <circle cx="44" cy="30" r="4" fill={card} />
          <circle cx="54" cy="44" r="4" fill={card} />
          <circle cx="40" cy="62" r="8" fill={card} />
        </g>
      );
    case "helmet":
      return (
        <g {...common}>
          <path d="M16 48 Q16 18 40 16 Q64 18 64 48 Z" fill={card} />
          <path d="M16 48 H64" />
          <path d="M40 16 V6" />
          <path d="M28 6 H52" />
        </g>
      );
    case "triangle":
      return (
        <g {...common}>
          <path d="M14 68 H66 L14 24 Z" fill={card} />
          <path d="M14 68 V24" stroke={blue} />
        </g>
      );
    case "jar":
      return (
        <g {...common}>
          <path d="M28 16 H52 L56 28 V64 Q40 76 24 64 V28 Z" fill={card} />
          <path d="M30 16 H50" />
        </g>
      );
    case "wings":
      return (
        <g {...common}>
          <path d="M40 40 Q18 20 10 36 Q22 40 40 48 Q22 56 12 70 Q28 60 40 52" fill={card} />
          <path d="M40 40 Q62 20 70 36 Q58 40 40 48 Q58 56 68 70 Q52 60 40 52" fill={paper} />
        </g>
      );
    case "horse":
      return (
        <g {...common}>
          <path d="M16 48 H58 L66 28 H50 L44 40 H28 Z" fill={card} />
          <path d="M24 48 V66 M50 48 V66" />
          <circle cx="58" cy="32" r="3" fill={ink} stroke="none" />
        </g>
      );
    case "thread":
      return (
        <g {...common}>
          <circle cx="24" cy="24" r="10" fill={card} />
          <path d="M30 30 C48 40 36 58 58 70" stroke={blue} />
        </g>
      );
    case "column":
      return (
        <g {...common}>
          <path d="M22 20 H58 M18 28 H62 V36 H18 Z M26 36 V64 H34 V36 M46 36 V64 H54 V36 M18 64 H62 V72 H18 Z" fill={card} />
        </g>
      );
    case "ship":
      return (
        <g {...common}>
          <path d="M12 50 H68 L58 66 H22 Z" fill={blue} />
          <path d="M40 50 V18" />
          <path d="M40 22 H58 L40 42 Z" fill={card} />
        </g>
      );
    case "water":
      return (
        <g {...common}>
          <path d="M16 28 Q28 44 40 28 Q52 44 64 28" />
          <path d="M16 46 Q28 62 40 46 Q52 62 64 46" />
          <path d="M28 66 H52" stroke={blue} />
        </g>
      );
    case "flame":
      return <path d="M40 70 C20 50 28 30 34 28 C32 42 42 40 40 24 C58 40 60 58 40 70 Z" fill={blue} stroke={ink} strokeWidth="3" />;
    case "laurel":
      return (
        <g {...common}>
          <path d="M24 64 Q40 16 56 64" />
          <path d="M30 30 Q22 36 28 44 M36 24 Q28 32 34 40 M48 28 Q58 36 50 46 M42 22 Q52 30 46 40" fill={blue} />
        </g>
      );
    case "mountain":
      return (
        <g {...common}>
          <path d="M8 68 L32 24 L48 50 L62 16 L78 68 Z" fill={blue} />
          <path d="M26 36 L32 24 L38 36" fill={card} />
        </g>
      );
    case "maze":
      return (
        <g {...common}>
          <rect x="14" y="14" width="52" height="52" fill={card} />
          <path d="M22 22 H54 V54 H30 V34 H42 V46" />
        </g>
      );
    case "cup":
      return (
        <g {...common}>
          <path d="M22 18 H54 L48 48 Q38 60 26 48 Z" fill={card} />
          <path d="M54 24 Q70 30 54 42" />
        </g>
      );
    case "apple":
      return (
        <g {...common}>
          <circle cx="40" cy="44" r="20" fill={card} />
          <path d="M40 24 V16 M40 18 Q52 14 50 24" fill={blue} />
        </g>
      );
    case "track":
      return (
        <g {...common}>
          <ellipse cx="40" cy="42" rx="28" ry="16" fill={card} />
          <ellipse cx="40" cy="42" rx="16" ry="8" />
          <path d="M22 42 H58" stroke={blue} />
        </g>
      );
    default:
      return null;
  }
}

export function Portrait({
  hair = "short",
  woman = false,
  prop = "scroll",
  frame = "stele",
  label,
}: {
  hair?: Hair;
  woman?: boolean;
  prop?: Prop;
  frame?: Frame;
  label: string;
}) {
  return (
    <svg viewBox="0 0 280 320" role="img" aria-label={label} className="h-auto w-full">
      {frame === "tondo" ? (
        <circle cx="140" cy="160" r="132" fill={paper} stroke={blue} strokeWidth="10" />
      ) : frame === "ask" ? (
        <rect x="16" y="16" width="248" height="288" rx="28" fill={paper} stroke={ink} strokeWidth="6" />
      ) : frame === "frieze" ? (
        <rect x="10" y="70" width="260" height="180" rx="18" fill={paper} stroke={blue} strokeWidth="8" />
      ) : frame === "land" ? (
        <path d="M20 250 L80 90 H200 L260 250 Z" fill={paper} stroke={blue} strokeWidth="8" />
      ) : (
        <g>
          <path d="M40 54 H240 L140 12 Z" fill={blue} />
          <rect x="28" y="54" width="224" height="246" fill={paper} stroke={blue} strokeWidth="8" />
        </g>
      )}
      <g transform="translate(36 36)">
        <Figure woman={woman} hair={hair} />
      </g>
      <g transform="translate(168 150)">
        <PropIcon prop={prop} />
      </g>
    </svg>
  );
}

export const creatureSrc: Record<string, string> = {
  maze: "/creatures/minotaur.jpg",
  odysseus: "/creatures/cyclops.jpg",
  heracles: "/creatures/lion.jpg",
  horse: "/creatures/horse.jpg",
  arachne: "/creatures/spider.jpg",
  athena: "/creatures/owl.jpg",
  hera: "/creatures/peacock.jpg",
};

export function CreatureArt({ id, label }: { id: string; label: string }) {
  const src = creatureSrc[id];
  if (!src) return null;
  return <img src={src} alt={label} className="aspect-[3/2] w-full bg-paper object-contain" />;
}

export function SymbolBadge({ prop, label }: { prop: Prop; label: string }) {
  return (
    <svg viewBox="0 0 120 120" role="img" aria-label={label} className="h-auto w-full">
      <circle cx="60" cy="60" r="54" fill={paper} stroke={blue} strokeWidth="6" />
      <g transform="translate(20 18) scale(1)">
        <PropIcon prop={prop} />
      </g>
    </svg>
  );
}
