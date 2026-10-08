import React from 'react';

/**
 * Official Emblems for VB-GRAM G Act Portal:
 * Logo 1: State Emblem of India (Ashoka Lion Capital with Satyameva Jayate)
 * Logo 2: VB-GRAM G Act - Viksit Bharat 2047 Official Logo
 */

interface EmblemProps {
  className?: string;
  size?: number;
}

// Logo 1: State Emblem of India (Ashok Emblem)
export const NationalEmblemLogo: React.FC<EmblemProps> = ({ className = "w-10 h-12", size }) => {
  return (
    <svg 
      viewBox="0 0 100 135" 
      className={className} 
      style={size ? { width: size, height: (size * 1.35) } : undefined}
      fill="currentColor" 
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="State Emblem of India - Lion Capital of Ashoka"
    >
      <title>State Emblem of India - Lion Capital of Ashoka</title>
      {/* Central Lion Head */}
      <g fill="currentColor">
        {/* Top mane crest */}
        <path d="M42 12 C44 8 56 8 58 12 C62 13 65 16 64 20 C64 23 61 25 61 28 C64 30 66 34 65 38 C64 42 61 45 59 47 C57 53 52 57 50 57 C48 57 43 53 41 47 C39 45 36 42 35 38 C34 34 36 30 39 28 C39 25 36 23 36 20 C35 16 38 13 42 12 Z" />
        
        {/* Left Lion Head & Mane */}
        <path d="M26 24 C28 20 34 20 37 23 C36 27 34 31 35 36 C32 37 29 40 28 44 C27 48 29 52 32 55 C29 60 27 67 29 74 C26 73 23 70 22 66 C19 58 20 48 23 41 C21 39 20 34 22 29 C23 25 24 24 26 24 Z" />
        
        {/* Right Lion Head & Mane */}
        <path d="M74 24 C72 20 66 20 63 23 C64 27 66 31 65 36 C68 37 71 40 72 44 C73 48 71 52 68 55 C71 60 73 67 71 74 C74 73 77 70 78 66 C81 58 80 48 77 41 C79 39 80 34 78 29 C77 25 76 24 74 24 Z" />

        {/* Lion Faces Details (Negative Space Cutouts) */}
        {/* Center Lion Features */}
        <ellipse cx="50" cy="22" rx="6" ry="7" fill="none" stroke="#FFFFFF" strokeWidth="1.8" />
        <circle cx="47" cy="21" r="1.5" fill="#FFFFFF" />
        <circle cx="53" cy="21" r="1.5" fill="#FFFFFF" />
        <path d="M48 24 L52 24 L50 27 Z" fill="#FFFFFF" />
        <path d="M46 29 Q50 33 54 29" stroke="#FFFFFF" strokeWidth="1.6" fill="none" />
        {/* Whisker Tufts */}
        <path d="M42 27 L37 26 M42 29 L36 30 M58 27 L63 26 M58 29 L64 30" stroke="#FFFFFF" strokeWidth="1.2" />

        {/* Center Lion Chest & Legs */}
        <path d="M38 52 L38 80 L44 80 L44 54 Z" fill="currentColor" />
        <path d="M47 55 L47 80 L53 80 L53 55 Z" fill="currentColor" />
        <path d="M56 54 L56 80 L62 80 L62 52 Z" fill="currentColor" />
        {/* Muscular Mane Strands */}
        <path d="M36 42 C38 48 37 58 35 68 C34 73 35 78 37 80" stroke="#FFFFFF" strokeWidth="1.2" fill="none" />
        <path d="M64 42 C62 48 63 58 65 68 C66 73 65 78 63 80" stroke="#FFFFFF" strokeWidth="1.2" fill="none" />
        <path d="M45 42 Q50 48 55 42" stroke="#FFFFFF" strokeWidth="1.2" fill="none" />
        <path d="M44 48 Q50 54 56 48" stroke="#FFFFFF" strokeWidth="1.2" fill="none" />

        {/* Abacus / Circular Base Platform */}
        <path d="M18 80 L82 80 C84 80 86 82 85 85 L82 99 C81 102 78 104 75 104 L25 104 C22 104 19 102 18 99 L15 85 C14 82 16 80 18 80 Z" fill="currentColor" />
        
        {/* Ashoka Chakra in Center of Abacus */}
        <circle cx="50" cy="92" r="8" fill="#FFFFFF" />
        <circle cx="50" cy="92" r="7.2" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="50" cy="92" r="2" fill="currentColor" />
        {/* 16 visible spokes */}
        <line x1="50" y1="85" x2="50" y2="99" stroke="currentColor" strokeWidth="0.8" />
        <line x1="43" y1="92" x2="57" y2="92" stroke="currentColor" strokeWidth="0.8" />
        <line x1="45" y1="87" x2="55" y2="97" stroke="currentColor" strokeWidth="0.8" />
        <line x1="45" y1="97" x2="55" y2="87" stroke="currentColor" strokeWidth="0.8" />
        <line x1="48" y1="85.5" x2="52" y2="98.5" stroke="currentColor" strokeWidth="0.6" />
        <line x1="52" y1="85.5" x2="48" y2="98.5" stroke="currentColor" strokeWidth="0.6" />
        <line x1="43.5" y1="89.5" x2="56.5" y2="94.5" stroke="currentColor" strokeWidth="0.6" />
        <line x1="43.5" y1="94.5" x2="56.5" y2="89.5" stroke="currentColor" strokeWidth="0.6" />

        {/* Galloping Horse (Left of Chakra) */}
        <path d="M24 94 C26 91 30 90 33 93 C35 94 37 92 37 89 C35 88 33 88 30 89 C28 87 25 87 23 90 Z" fill="#FFFFFF" />
        {/* Bull (Right of Chakra) */}
        <path d="M76 94 C74 91 70 90 67 93 C65 94 63 92 63 89 C65 88 67 88 70 89 C72 87 75 87 77 90 Z" fill="#FFFFFF" />

        {/* Bell-shaped Lotus Pedestal Base */}
        <path d="M22 105 L78 105 C75 110 65 112 50 112 C35 112 25 110 22 105 Z" fill="currentColor" />
        
        {/* Motto Inscription: Satyameva Jayate (सत्यमेव जयते) */}
        <text 
          x="50" 
          y="126" 
          textAnchor="middle" 
          fontSize="11" 
          fontWeight="900" 
          letterSpacing="0.6"
          fontFamily="serif, system-ui"
          fill="currentColor"
        >
          सत्यमेव जयते
        </text>
      </g>
    </svg>
  );
};

// Logo 2: VB-GRAM G Act - Viksit Bharat 2047 Official Logo
export const VbGramGActLogo: React.FC<EmblemProps> = ({ className = "w-28 h-16", size }) => {
  return (
    <svg 
      viewBox="0 0 320 180" 
      className={className} 
      style={size ? { width: size, height: (size * 0.5625) } : undefined}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="VB-GRAM G Act - Viksit Bharat 2047 Official Logo"
    >
      <title>VB-GRAM G Act - Viksit Bharat 2047 Official Logo</title>
      <defs>
        {/* Gradients */}
        <linearGradient id="vbSaffron" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF7A00" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>

        <linearGradient id="vbGreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#15803D" />
        </linearGradient>

        <linearGradient id="sunGlow" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#FDE047" />
        </linearGradient>
      </defs>

      {/* TOP: Navy Blue Ashoka Chakra (Dharma Chakra) */}
      <g transform="translate(160, 36)">
        {/* Outer Ring */}
        <circle cx="0" cy="0" r="28" fill="#FFFFFF" stroke="#0F296B" strokeWidth="3" />
        <circle cx="0" cy="0" r="25.5" fill="#FFFFFF" stroke="#0F296B" strokeWidth="1" strokeDasharray="1.5 1.5" />
        <circle cx="0" cy="0" r="5" fill="#0F296B" />
        <circle cx="0" cy="0" r="2" fill="#FFFFFF" />
        {/* 24 Spokes */}
        {[...Array(24)].map((_, i) => {
          const angle = (i * 360) / 24;
          return (
            <line
              key={i}
              x1="0"
              y1="0"
              x2="0"
              y2="-25"
              stroke="#0F296B"
              strokeWidth="1.2"
              transform={`rotate(${angle})`}
            />
          );
        })}
      </g>

      {/* CENTER BACKGROUND: Radiating Rising Sun */}
      <g>
        {/* Radiating sunrays */}
        {[...Array(9)].map((_, i) => {
          const angle = -50 + i * 12.5;
          const rad = (angle * Math.PI) / 180;
          const x1 = 115 + Math.sin(rad) * 16;
          const y1 = 52 - Math.cos(rad) * 16;
          const x2 = 115 + Math.sin(rad) * 26;
          const y2 = 52 - Math.cos(rad) * 26;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#F59E0B"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          );
        })}
        {/* Rising Sun Disk */}
        <circle cx="115" cy="52" r="14" fill="url(#sunGlow)" stroke="#F59E0B" strokeWidth="1" />
      </g>

      {/* RURAL LANDSCAPE & HILLS */}
      <g>
        {/* Green Hills */}
        <path d="M65 80 Q95 55 125 72 Q160 52 195 72 Q225 60 255 80 Z" fill="#84CC16" />
        <path d="M75 84 Q115 62 160 76 Q205 60 245 84 Z" fill="#4D7C0F" opacity="0.4" />

        {/* Winding Yellow/Golden Road in center leading to horizon */}
        <path d="M158 64 Q155 80 148 96 Q140 114 130 120 L165 120 Q162 108 166 94 Q168 78 162 64 Z" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1" />

        {/* Traditional Village House / Cottage */}
        <path d="M72 68 L88 56 L104 68 Z" fill="#78350F" stroke="#451A03" strokeWidth="1.2" />
        <rect x="76" y="68" width="24" height="15" fill="#FEF3C7" stroke="#451A03" strokeWidth="1.2" />
        <rect x="84" y="74" width="8" height="9" fill="#78350F" />
        <circle cx="80" cy="74" r="2.5" fill="#F59E0B" />

        {/* Farmer and Bullock Silhouettes */}
        <ellipse cx="106" cy="80" rx="6" ry="4" fill="#1E293B" />
        <circle cx="112" cy="78" r="2" fill="#1E293B" />
        <circle cx="118" cy="77" r="2.5" fill="#1E293B" />
        <path d="M117 79 L122 84 L116 84 Z" fill="#1E293B" />

        {/* Terraced Agricultural Field Contours (Right) */}
        <path d="M175 78 Q205 72 235 80 M182 84 Q212 78 242 86 M188 90 Q218 84 246 92" stroke="#FFFFFF" strokeWidth="1.2" fill="none" opacity="0.7" />
      </g>

      {/* MODERN INFRASTRUCTURE (Viksit Bharat Tech Icons) */}
      <g>
        {/* Power Grid Transmission Tower */}
        <g transform="translate(196, 45) scale(0.65)">
          <path d="M12 0 L6 40 M12 0 L18 40 M3 15 L21 15 M5 26 L19 26 M0 40 L24 40" stroke="#0F296B" strokeWidth="2" strokeLinecap="round" />
          <path d="M6 15 L18 26 M18 15 L6 26 M6 26 L18 40 M18 26 L6 40" stroke="#0F296B" strokeWidth="1.5" />
        </g>

        {/* Clean Energy Wind Turbine */}
        <g transform="translate(222, 24) scale(0.7)">
          <line x1="8" y1="20" x2="8" y2="55" stroke="#0F296B" strokeWidth="2.5" />
          <circle cx="8" cy="20" r="3" fill="#0F296B" />
          <line x1="8" y1="20" x2="-8" y2="10" stroke="#0F296B" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="8" y1="20" x2="24" y2="10" stroke="#0F296B" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="8" y1="20" x2="8" y2="38" stroke="#0F296B" strokeWidth="2.2" strokeLinecap="round" />
        </g>

        {/* Satellite Dish & Digital Signals */}
        <g transform="translate(204, 62) scale(0.7)">
          <path d="M4 18 C0 10 10 2 18 6 C22 8 20 16 14 18 Z" fill="#0F296B" />
          <line x1="10" y1="12" x2="18" y2="4" stroke="#0F296B" strokeWidth="2" />
          <line x1="10" y1="18" x2="10" y2="26" stroke="#0F296B" strokeWidth="2.5" />
        </g>

        {/* Digital Data / Binary Stream: 010101 */}
        <text x="218" y="60" fill="#0F296B" fontSize="6.5" fontWeight="bold" fontFamily="monospace">101</text>
        <text x="218" y="68" fill="#0F296B" fontSize="6.5" fontWeight="bold" fontFamily="monospace">010101</text>
        <text x="218" y="76" fill="#0F296B" fontSize="6.5" fontWeight="bold" fontFamily="monospace">010111</text>
      </g>

      {/* EMBRACING TRICOLOR HANDS */}
      {/* Left Hand: Orange / Saffron (#FF671F) */}
      <path 
        d="M55 48 C48 70 52 94 65 110 C80 128 115 136 156 120 C140 120 120 114 105 104 C92 95 86 82 88 68 C88 60 76 56 68 50 C62 46 58 46 55 48 Z" 
        fill="url(#vbSaffron)" 
      />
      {/* Cupped Saffron Palm Accent */}
      <path 
        d="M66 110 C90 134 130 134 162 120 C144 116 126 110 108 98 C94 88 84 74 85 60 C78 72 74 94 66 110 Z" 
        fill="#EA580C" 
      />

      {/* Right Hand: Green (#138808) */}
      <path 
        d="M265 48 C272 70 268 94 255 110 C240 128 205 136 164 120 C180 120 200 114 215 104 C228 95 234 82 232 68 C232 60 244 56 252 50 C258 46 262 46 265 48 Z" 
        fill="url(#vbGreen)" 
      />
      {/* Cupped Green Palm Accent */}
      <path 
        d="M254 110 C230 134 190 134 158 120 C176 116 194 110 212 98 C226 88 236 74 235 60 C242 72 246 94 254 110 Z" 
        fill="#15803D" 
      />

      {/* TYPOGRAPHY: VB-GRAM G Act */}
      <g id="logoText">
        {/* VB- in Orange */}
        <text x="52" y="156" fill="#EA580C" fontSize="27" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.5">
          VB-
        </text>

        {/* GRAM in Dark Navy Blue */}
        <text x="96" y="156" fill="#0A1D4E" fontSize="27" fontWeight="900" fontFamily="sans-serif" letterSpacing="1">
          GRAM
        </text>

        {/* G in Green */}
        <text x="188" y="156" fill="#15803D" fontSize="30" fontWeight="900" fontFamily="sans-serif">
          G
        </text>

        {/* Act in Green */}
        <text x="210" y="156" fill="#15803D" fontSize="27" fontWeight="800" fontFamily="sans-serif" fontStyle="italic">
          Act
        </text>

        {/* SUBTITLE: — Viksit Bharat 2047 — */}
        <line x1="58" y1="168" x2="88" y2="168" stroke="#EA580C" strokeWidth="1.8" strokeLinecap="round" />
        <text x="160" y="172" textAnchor="middle" fill="#EA580C" fontSize="13" fontWeight="800" fontFamily="sans-serif" letterSpacing="1.2">
          Viksit Bharat 2047
        </text>
        <line x1="232" y1="168" x2="262" y2="168" stroke="#EA580C" strokeWidth="1.8" strokeLinecap="round" />
      </g>
    </svg>
  );
};

// Official Prestigious Circular Seal of Bathuary Gram Panchayat
export const BathuaryGramPanchayatOfficialLogo: React.FC<EmblemProps> = ({ className = "w-16 h-16", size }) => {
  return (
    <svg 
      viewBox="0 0 200 200" 
      className={className} 
      style={size ? { width: size, height: size } : undefined}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="বাথুয়ারী গ্রাম পঞ্চায়েত অফিসিয়াল গোল সিলমোহর - Official Bathuary Gram Panchayat Seal"
    >
      <title>বাথুয়ারী গ্রাম পঞ্চায়েত অফিসিয়াল সিলমোহর (Bathuary Gram Panchayat Official Seal)</title>
      <defs>
        {/* Metallic Gold Gradients */}
        <linearGradient id="bseal_gold_outer" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF275" />
          <stop offset="25%" stopColor="#F59E0B" />
          <stop offset="50%" stopColor="#D97706" />
          <stop offset="75%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>

        <linearGradient id="bseal_gold_inner" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#B45309" />
          <stop offset="35%" stopColor="#F59E0B" />
          <stop offset="70%" stopColor="#FEF08A" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>

        {/* Deep Royal Navy Ring Gradient */}
        <linearGradient id="bseal_navy" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0B1A3F" />
          <stop offset="50%" stopColor="#081432" />
          <stop offset="100%" stopColor="#050C22" />
        </linearGradient>

        {/* Tricolor Ribbon Gradient */}
        <linearGradient id="bseal_saffron_ribbon" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C2410C" />
          <stop offset="25%" stopColor="#EA580C" />
          <stop offset="50%" stopColor="#F97316" />
          <stop offset="75%" stopColor="#EA580C" />
          <stop offset="100%" stopColor="#C2410C" />
        </linearGradient>

        {/* Center Sunburst Radial Gradient */}
        <radialGradient id="bseal_sunburst" cx="50%" cy="48%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#FFFBEB" />
          <stop offset="85%" stopColor="#FEF3C7" />
          <stop offset="100%" stopColor="#FDE68A" />
        </radialGradient>

        {/* Specular Glaze */}
        <linearGradient id="bseal_glass" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
          <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* 1. Outer Deep Shadow / Rim */}
      <circle cx="100" cy="100" r="98" fill="#78350F" opacity="0.15" />

      {/* 2. Outer Beaded Rim with Embossed Golden Studs */}
      <circle cx="100" cy="100" r="97" fill="url(#bseal_gold_outer)" stroke="#78350F" strokeWidth="1" />
      <circle cx="100" cy="100" r="93" fill="#92400E" />

      {/* 36 Golden Pearl Studs around the rim */}
      {[...Array(36)].map((_, i) => {
        const angle = (i * 360) / 36;
        const rad = (angle * Math.PI) / 180;
        const cx = 100 + 95 * Math.cos(rad);
        const cy = 100 + 95 * Math.sin(rad);
        return (
          <circle 
            key={i} 
            cx={cx.toFixed(1)} 
            cy={cy.toFixed(1)} 
            r="1.7" 
            fill="#FFFDE7" 
            stroke="#92400E" 
            strokeWidth="0.5" 
          />
        );
      })}

      {/* 3. Outer Polished Gold Border Ring */}
      <circle cx="100" cy="100" r="91" fill="none" stroke="url(#bseal_gold_outer)" strokeWidth="2.5" />
      <circle cx="100" cy="100" r="89" fill="none" stroke="#FEF08A" strokeWidth="0.8" />

      {/* 4. Royal Navy Circular Band for Typography */}
      <circle cx="100" cy="100" r="88" fill="url(#bseal_navy)" stroke="#78350F" strokeWidth="1" />

      {/* Inner Rim of Typography Band */}
      <circle cx="100" cy="100" r="65" fill="none" stroke="url(#bseal_gold_inner)" strokeWidth="2.5" />
      <circle cx="100" cy="100" r="63.5" fill="none" stroke="#FDE68A" strokeWidth="0.8" />

      {/* 5. Curved Text: Top Arc (বাথুয়ারী গ্রাম পঞ্চায়েত) */}
      {/* Clockwise arc over the top: radius 76.5 */}
      <path id="bseal_top_arc" d="M 23.5 100 A 76.5 76.5 0 0 1 176.5 100" fill="none" />
      <text fill="#FFFDF0" fontSize="10.5" fontWeight="900" letterSpacing="0.8" filter="drop-shadow(0 1px 1px rgba(0,0,0,0.8))">
        <textPath href="#bseal_top_arc" startOffset="50%" textAnchor="middle">
          বাথুয়ারী গ্রাম পঞ্চায়েত
        </textPath>
      </text>

      {/* Curved Text: Bottom Arc (BATHUARY GRAM PANCHAYAT) */}
      {/* Counter-clockwise arc along the bottom so text baseline is oriented outward, right side up */}
      <path id="bseal_bottom_arc" d="M 23.5 100 A 76.5 76.5 0 0 0 176.5 100" fill="none" />
      <text fill="#FDE047" fontSize="8.5" fontWeight="900" letterSpacing="0.9" filter="drop-shadow(0 1px 1px rgba(0,0,0,0.8))">
        <textPath href="#bseal_bottom_arc" startOffset="50%" textAnchor="middle">
          BATHUARY GRAM PANCHAYAT
        </textPath>
      </text>

      {/* Polished Five-Point Stars at Left & Right of Circular Band */}
      <g transform="translate(24, 100)">
        <polygon points="0,-4.5 1.4,-1.4 4.5,-1.2 2.1,1.1 2.8,4.2 0,2.5 -2.8,4.2 -2.1,1.1 -4.5,-1.2 -1.4,-1.4" fill="#FDE047" stroke="#92400E" strokeWidth="0.6" />
      </g>
      <g transform="translate(176, 100)">
        <polygon points="0,-4.5 1.4,-1.4 4.5,-1.2 2.1,1.1 2.8,4.2 0,2.5 -2.8,4.2 -2.1,1.1 -4.5,-1.2 -1.4,-1.4" fill="#FDE047" stroke="#92400E" strokeWidth="0.6" />
      </g>

      {/* 6. Central Disc: Ivory Sunburst with Fine Dotted Ring */}
      <circle cx="100" cy="100" r="62" fill="url(#bseal_sunburst)" />
      <circle cx="100" cy="100" r="59" fill="none" stroke="#D97706" strokeWidth="0.8" strokeDasharray="1.5 1.5" />

      {/* 16 Radiating Golden Sunbeams */}
      {[...Array(16)].map((_, i) => {
        const angle = (i * 360) / 16;
        return (
          <line
            key={i}
            x1="100"
            y1="93"
            x2="100"
            y2="45"
            stroke="#F59E0B"
            strokeWidth="0.75"
            strokeOpacity="0.45"
            strokeDasharray="2 3"
            transform={`rotate(${angle} 100 93)`}
          />
        );
      })}

      {/* 7. Golden Ears of Ripe Bengal Paddy (ধানের শীষ - Symmetrical Sheaves of Rice) */}
      {/* Left Paddy Stalk */}
      <g id="bseal_left_sheaf">
        <path d="M 68 118 C 69 98 78 84 87 75" fill="none" stroke="#B45309" strokeWidth="1.8" strokeLinecap="round" />
        <ellipse cx="69" cy="112" rx="3.5" ry="1.8" transform="rotate(-30 69 112)" fill="#F59E0B" stroke="#92400E" strokeWidth="0.5" />
        <ellipse cx="72" cy="104" rx="3.5" ry="1.8" transform="rotate(-36 72 104)" fill="#FBBF24" stroke="#92400E" strokeWidth="0.5" />
        <ellipse cx="76" cy="96" rx="3.5" ry="1.8" transform="rotate(-42 76 96)" fill="#F59E0B" stroke="#92400E" strokeWidth="0.5" />
        <ellipse cx="81" cy="88" rx="3.2" ry="1.7" transform="rotate(-48 81 88)" fill="#FBBF24" stroke="#92400E" strokeWidth="0.5" />
        <ellipse cx="87" cy="80" rx="3.0" ry="1.5" transform="rotate(-54 87 80)" fill="#F59E0B" stroke="#92400E" strokeWidth="0.5" />
      </g>

      {/* Right Paddy Stalk */}
      <g id="bseal_right_sheaf">
        <path d="M 132 118 C 131 98 122 84 113 75" fill="none" stroke="#B45309" strokeWidth="1.8" strokeLinecap="round" />
        <ellipse cx="131" cy="112" rx="3.5" ry="1.8" transform="rotate(30 131 112)" fill="#F59E0B" stroke="#92400E" strokeWidth="0.5" />
        <ellipse cx="128" cy="104" rx="3.5" ry="1.8" transform="rotate(36 128 104)" fill="#FBBF24" stroke="#92400E" strokeWidth="0.5" />
        <ellipse cx="124" cy="96" rx="3.5" ry="1.8" transform="rotate(42 124 96)" fill="#F59E0B" stroke="#92400E" strokeWidth="0.5" />
        <ellipse cx="119" cy="88" rx="3.2" ry="1.7" transform="rotate(48 119 88)" fill="#FBBF24" stroke="#92400E" strokeWidth="0.5" />
        <ellipse cx="113" cy="80" rx="3.0" ry="1.5" transform="rotate(54 113 80)" fill="#F59E0B" stroke="#92400E" strokeWidth="0.5" />
      </g>

      {/* 8. Centerpiece: Revered Dharma Chakra (Ashoka Chakra) with 24 Navy Spokes */}
      <g id="bseal_ashoka_chakra">
        {/* Outer White Glow Ring */}
        <circle cx="100" cy="93" r="21" fill="#FFFFFF" stroke="#0F296B" strokeWidth="2.4" />
        <circle cx="100" cy="93" r="19" fill="none" stroke="#0F296B" strokeWidth="0.8" strokeDasharray="1 1" />
        {/* Inner Hub */}
        <circle cx="100" cy="93" r="4.2" fill="#0F296B" />
        <circle cx="100" cy="93" r="1.8" fill="#FFFFFF" />
        {/* 24 Precise Spokes */}
        {[...Array(24)].map((_, i) => {
          const angle = (i * 360) / 24;
          return (
            <line
              key={i}
              x1="100"
              y1="93"
              x2="100"
              y2="73.5"
              stroke="#0F296B"
              strokeWidth="1.1"
              transform={`rotate(${angle} 100 93)`}
            />
          );
        })}
      </g>

      {/* 9. Dignified Tricolor Saffron Ribbon Banner Across Bottom */}
      <g id="bseal_ribbon">
        {/* Ribbon Fold Tails */}
        <path d="M 46 136 L 56 127 L 56 142 Z" fill="#9A3412" />
        <path d="M 154 136 L 144 127 L 144 142 Z" fill="#9A3412" />
        
        {/* Main Ribbon Body */}
        <path 
          d="M 52 131 C 80 123 120 123 148 131 L 145 146 C 118 138 82 138 55 146 Z" 
          fill="url(#bseal_saffron_ribbon)" 
          stroke="#78350F" 
          strokeWidth="1" 
        />

        {/* Ribbon Inner Gold Border */}
        <path 
          d="M 55 133 C 82 125 118 125 145 133" 
          fill="none" 
          stroke="#FDE68A" 
          strokeWidth="0.75" 
        />
        <path 
          d="M 57 144 C 83 136 117 136 143 144" 
          fill="none" 
          stroke="#FDE68A" 
          strokeWidth="0.75" 
        />

        {/* Ribbon Text: ১২৫ দিনের কাজ • e-KYC */}
        <text 
          x="100" 
          y="140" 
          textAnchor="middle" 
          fill="#FFFFFF" 
          fontSize="7.5" 
          fontWeight="900" 
          letterSpacing="0.4"
          filter="drop-shadow(0 1px 1px rgba(0,0,0,0.6))"
        >
          ১২৫ দিনের কাজ • e-KYC
        </text>
      </g>

      {/* 10. Bottom Subtitle: Govt. of West Bengal • Egra-II */}
      <text 
        x="100" 
        y="156" 
        textAnchor="middle" 
        fill="#166534" 
        fontSize="7" 
        fontWeight="900" 
        letterSpacing="0.6"
      >
        GOVT. OF WEST BENGAL • EGRA-II
      </text>

      {/* 11. Subtle Specular Glass Highlight Arch (Upper Sheen) */}
      <path 
        d="M 40 76 A 66 66 0 0 1 160 76 C 135 60 65 60 40 76 Z" 
        fill="url(#bseal_glass)" 
        pointerEvents="none" 
      />
    </svg>
  );
};

// Aliases for backwards-compatibility
export const BiswaBanglaLogo = NationalEmblemLogo;
export const MgnregaLogo = VbGramGActLogo;
export const BathuaryGpSeal = BathuaryGramPanchayatOfficialLogo;
export const AshokaEmblem = NationalEmblemLogo;
