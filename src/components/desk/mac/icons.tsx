/**
 * App icons for fahadOS, drawn as simple SVGs in the desk's own palette
 * (the R65's cream, sage green and brick red). Original artwork, not Apple's.
 */
export type IconId = 'notes' | 'photos' | 'terminal' | 'gpu' | 'soccer' | 'mail' | 'preview' | 'folder' | 'about'

const SQUIRCLE = 'M32 2c20 0 30 10 30 30s-10 30-30 30S2 52 2 32 12 2 32 2z'

export function AppIcon({ id, size = 48 }: { id: IconId; size?: number }) {
  const uid = `${id}-${size}`
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className="drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)]">
      <defs>
        <clipPath id={`c-${uid}`}>
          <path d={SQUIRCLE} />
        </clipPath>
        <linearGradient id={`g-${uid}`} x1="0" y1="0" x2="0" y2="1">
          {id === 'notes' && [<stop key="a" offset="0" stopColor="#fffdf7" />, <stop key="b" offset="1" stopColor="#efe8d6" />]}
          {id === 'photos' && [<stop key="a" offset="0" stopColor="#fdfbf6" />, <stop key="b" offset="1" stopColor="#e9e2d2" />]}
          {id === 'terminal' && [<stop key="a" offset="0" stopColor="#3a3b3d" />, <stop key="b" offset="1" stopColor="#121314" />]}
          {id === 'gpu' && [<stop key="a" offset="0" stopColor="#233b30" />, <stop key="b" offset="1" stopColor="#0e1914" />]}
          {id === 'soccer' && [<stop key="a" offset="0" stopColor="#5b9a63" />, <stop key="b" offset="1" stopColor="#35683f" />]}
          {id === 'mail' && [<stop key="a" offset="0" stopColor="#6aa7ff" />, <stop key="b" offset="1" stopColor="#1f5fd6" />]}
          {id === 'preview' && [<stop key="a" offset="0" stopColor="#f3f6fa" />, <stop key="b" offset="1" stopColor="#d8e0ea" />]}
          {id === 'folder' && [<stop key="a" offset="0" stopColor="#8cc3f7" />, <stop key="b" offset="1" stopColor="#4d9be8" />]}
          {id === 'about' && [<stop key="a" offset="0" stopColor="#f1efe9" />, <stop key="b" offset="1" stopColor="#d6d3cc" />]}
        </linearGradient>
      </defs>
      {id === 'folder' ? (
        <g>
          <path d="M6 16c0-3 2-5 5-5h14l5 5h23c3 0 5 2 5 5v4H6z" fill="#5aa6ee" />
          <rect x="6" y="21" width="52" height="34" rx="5" fill={`url(#g-${uid})`} />
          <rect x="6" y="21" width="52" height="3" fill="#ffffff" opacity="0.35" />
        </g>
      ) : (
        <g clipPath={`url(#c-${uid})`}>
          <rect width="64" height="64" fill={`url(#g-${uid})`} />
          {id === 'notes' && (
            <g>
              <rect width="64" height="17" fill="#f2c14e" />
              {[26, 34, 42, 50].map((y) => (
                <rect key={y} x="12" y={y} width={y === 50 ? 26 : 40} height="2.4" rx="1.2" fill="#c9c2b2" />
              ))}
            </g>
          )}
          {id === 'photos' && (
            <g>
              <g transform="rotate(-12 32 34)">
                <rect x="13" y="16" width="30" height="34" rx="2" fill="#fff" stroke="#d8d0bf" />
                <rect x="16" y="19" width="24" height="22" fill="#a9444c" />
              </g>
              <g transform="rotate(9 32 34)">
                <rect x="21" y="14" width="30" height="34" rx="2" fill="#fff" stroke="#d8d0bf" />
                <rect x="24" y="17" width="24" height="22" fill="#4d8059" />
                <circle cx="42" cy="23" r="3" fill="#f2c14e" />
                <path d="M24 39l8-9 6 6 4-4 6 7z" fill="#2f5d3c" />
              </g>
            </g>
          )}
          {id === 'terminal' && (
            <g>
              <rect width="64" height="9" fill="#55575a" />
              <path d="M13 26l10 7-10 7" fill="none" stroke="#e9e6de" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="27" y="38.5" width="14" height="3.4" rx="1.2" fill="#e9e6de" />
            </g>
          )}
          {id === 'gpu' && (
            <g>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <rect
                  key={i}
                  x={12 + (i % 3) * 14}
                  y={18 + Math.floor(i / 3) * 16}
                  width="11"
                  height="12"
                  rx="2"
                  fill={['#7fc08c', '#efe6d6', '#7fc08c', '#a9444c', '#7fc08c', '#3a4a42'][i]}
                />
              ))}
              <rect x="10" y="48" width="44" height="3" rx="1.5" fill="#7fc08c" opacity="0.6" />
            </g>
          )}
          {id === 'soccer' && (
            <g>
              {[0, 1, 2, 3].map((i) => (
                <rect key={i} x={i * 16} width="8" height="64" fill="#ffffff" opacity="0.06" />
              ))}
              <circle cx="32" cy="33" r="14" fill="#fff" />
              <path d="M32 26l6 4-2 7h-8l-2-7z" fill="#1d1e20" />
              <path d="M32 19v7M38 30l6-3M36 37l4 6M28 37l-4 6M26 30l-6-3" stroke="#1d1e20" strokeWidth="1.6" />
            </g>
          )}
          {id === 'mail' && (
            <g>
              <rect x="12" y="19" width="40" height="27" rx="3" fill="#fff" />
              <path d="M13 21l19 14 19-14" fill="none" stroke="#1f5fd6" strokeWidth="2.4" strokeLinejoin="round" />
            </g>
          )}
          {id === 'preview' && (
            <g>
              <path d="M18 10h20l10 10v34H18z" fill="#fff" stroke="#c7ced8" />
              <path d="M38 10v10h10" fill="#e8edf3" stroke="#c7ced8" />
              {[26, 32, 38].map((y) => (
                <rect key={y} x="23" y={y} width="20" height="2" rx="1" fill="#b8c1cc" />
              ))}
              <rect x="14" y="42" width="22" height="10" rx="2" fill="#a9444c" />
              <text x="25" y="50" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#fff" fontFamily="Arial, sans-serif">
                PDF
              </text>
            </g>
          )}
          {id === 'about' && (
            <g>
              <rect x="13" y="18" width="38" height="24" rx="2" fill="#1b1c1e" />
              <rect x="15" y="20" width="34" height="20" fill="#2f5d4a" />
              <path d="M8 44h48l-3 4H11z" fill="#b8bcc0" />
            </g>
          )}
        </g>
      )}
    </svg>
  )
}

/** The fahadOS mark: a lowercase f in the showcase serif, used in the menu bar and at boot. */
export function FMark({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <span aria-hidden="true" className="font-showcase font-black leading-none inline-block" style={{ fontSize: size, color, width: size * 0.6, textAlign: 'center' }}>
      f
    </span>
  )
}
