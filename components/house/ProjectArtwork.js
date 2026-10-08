export default function ProjectArtwork({ kind }) {
  if (kind === "face")
    return (
      <svg
        className="project-artwork"
        viewBox="0 0 600 330"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="face-light">
            <stop stopColor="#b1d0b8" />
            <stop offset="1" stopColor="#3a635b" />
          </radialGradient>
          <linearGradient
            id="face-fill"
            x1="220"
            y1="40"
            x2="380"
            y2="290"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#d7e5bf" />
            <stop offset="1" stopColor="#779f90" />
          </linearGradient>
        </defs>
        <path fill="url(#face-light)" d="M0 0h600v330H0z" />
        <g stroke="#d5e7d2" strokeOpacity=".17">
          <path d="M0 82h600M0 165h600M0 247h600M100 0v330M200 0v330M300 0v330M400 0v330M500 0v330" />
        </g>
        <g transform="translate(180 20)">
          <path
            d="M120 14 69 31 40 70 31 126 42 189 77 242 120 272 163 242 198 189 209 126 200 70 171 31Z"
            fill="url(#face-fill)"
            fillOpacity=".5"
            stroke="#e3eed1"
          />
          <g stroke="#e3eed1" strokeWidth=".8" strokeOpacity=".85">
            <path d="m120 14 0 258M69 31l51 43 51-43M40 70l80 4 80-4M31 126l51-27 38-25 38 25 51 27M42 189l38-39 40-34 40 34 38 39M77 242l13-42 30-24 30 24 13 42M31 126l49 24 2-51-42-29M209 126l-49 24-2-51 42-29M42 189l48 11-10-50M198 189l-48 11 10-50M90 200l30 72 30-72M80 150l40 26 40-26M69 31l13 68M171 31l-13 68M82 99l38 17 38-17M42 189l78 33 78-33M77 242l43-20 43 20" />
            <path d="m59 123 23-9 20 11-20 8Zm79 2 20-11 23 9-23 10ZM120 116l-13 47 13 10 13-10ZM93 194l27-6 27 6-27 12Z" />
          </g>
          {[
            [120, 14],
            [69, 31],
            [171, 31],
            [40, 70],
            [200, 70],
            [31, 126],
            [209, 126],
            [82, 99],
            [158, 99],
            [80, 150],
            [160, 150],
            [120, 116],
            [42, 189],
            [198, 189],
            [90, 200],
            [150, 200],
            [120, 176],
            [77, 242],
            [163, 242],
            [120, 272],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="2.5" fill="#eaf3d7" />
          ))}
        </g>
        <g stroke="#e1edd3" strokeWidth="1.3">
          <path d="M176 50h-18v25M424 50h18v25M176 280h-18v-25M424 280h18v-25" />
        </g>
        <text
          x="32"
          y="42"
          fill="#e4efdb"
          fontSize="13"
          fontFamily="sans-serif"
        >
          Live facial re-texturing
        </text>
        <circle cx="35" cy="296" r="3" fill="#e2edbb" />
        <text
          x="47"
          y="300"
          fill="#e4efdb"
          fontSize="11"
          fontFamily="sans-serif"
        >
          Face mesh · WebGL
        </text>
      </svg>
    );
  if (kind === "garden")
    return (
      <svg className="project-artwork" viewBox="0 0 600 330" aria-hidden="true">
        <rect width="600" height="330" fill="#ccd7b9" />
        <ellipse cx="300" cy="254" rx="195" ry="44" fill="#a7bc90" />
        <g stroke="#4c704b" strokeWidth="6" fill="none">
          <path d="M295 255V69M292 195l-64-57M298 151l56-51M295 226l64-45M294 119l-39-37" />
        </g>
        <g fill="#6d915a">
          <ellipse
            cx="256"
            cy="80"
            rx="23"
            ry="41"
            transform="rotate(-43 256 80)"
          />
          <ellipse
            cx="225"
            cy="132"
            rx="23"
            ry="44"
            transform="rotate(-52 225 132)"
          />
          <ellipse
            cx="355"
            cy="98"
            rx="23"
            ry="45"
            transform="rotate(45 355 98)"
          />
          <ellipse
            cx="360"
            cy="178"
            rx="24"
            ry="46"
            transform="rotate(57 360 178)"
          />
        </g>
        <g fill="#88a76b">
          <ellipse cx="296" cy="67" rx="22" ry="44" />
          <ellipse
            cx="237"
            cy="201"
            rx="22"
            ry="41"
            transform="rotate(-50 237 201)"
          />
        </g>
        <text
          x="32"
          y="42"
          fill="#355c39"
          fontSize="13"
          fontFamily="sans-serif"
        >
          A garden of medicinal knowledge
        </text>
        <text
          x="32"
          y="300"
          fill="#355c39"
          fontSize="11"
          fontFamily="sans-serif"
        >
          25 plants. Generated from botanical data.
        </text>
      </svg>
    );
  return (
    <svg className="project-artwork" viewBox="0 0 600 330" aria-hidden="true">
      <rect
        width="600"
        height="330"
        fill={
          kind === "cells"
            ? "#17272e"
            : kind === "study"
              ? "#d5d9ca"
              : "#d6c9ae"
        }
      />
      {kind === "cells" ? (
        <g>
          <text
            x="30"
            y="36"
            fill="#c7d9d8"
            fontSize="13"
            fontFamily="sans-serif"
          >
            CT volume / 3D neural networks
          </text>
          <ellipse
            cx="300"
            cy="176"
            rx="168"
            ry="116"
            fill="#81979b"
            stroke="#bdd1d1"
            strokeWidth="2"
          />
          <ellipse cx="300" cy="176" rx="153" ry="105" fill="#445b63" />
          <path
            d="M269 88C225 70 167 130 173 188C176 230 227 251 260 219C282 198 249 169 270 143C286 124 290 99 269 88Z"
            fill="#0c1b22"
            stroke="#a4b8bd"
            strokeWidth="2"
          />
          <path
            d="M331 88C375 70 433 130 427 188C424 230 373 251 340 219C318 198 351 169 330 143C314 124 310 99 331 88Z"
            fill="#0c1b22"
            stroke="#a4b8bd"
            strokeWidth="2"
          />
          <path
            d="m220 115 21 62-31 29m31-29-41-24m41 24 12 30m127-92-21 62 31 29m-31-29 41-24m-41 24-12 30"
            stroke="#718f9a"
            strokeWidth="3"
            fill="none"
          />
          <ellipse cx="300" cy="229" rx="18" ry="21" fill="#c6d6d2" />
          <circle cx="379" cy="186" r="9" fill="#d6b98b" />
          <circle
            cx="379"
            cy="186"
            r="20"
            fill="none"
            stroke="#d6b98b"
            strokeDasharray="3 4"
          />
          <path d="M399 186h72v-55h49" fill="none" stroke="#d6b98b" />
          <text
            x="30"
            y="303"
            fill="#a4b8bd"
            fontSize="11"
            fontFamily="sans-serif"
          >
            CAD-C · An experimental classification system
          </text>
        </g>
      ) : kind === "study" ? (
        <g fill="#f7f5eb" stroke="#9aab8d" strokeWidth="2">
          <rect x="155" y="60" width="290" height="215" rx="8" />
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <path d={`M185 ${105 + i * 40}h230`} />
              <rect
                x={185 + i * 35}
                y={88 + i * 40}
                width={80 + i * 12}
                height="21"
                rx="4"
                fill="#91a47a"
                stroke="none"
              />
            </g>
          ))}
        </g>
      ) : (
        <g stroke="#87795b" strokeWidth="2">
          <circle cx="225" cy="164" r="73" fill="#ede8d6" />
          <circle cx="375" cy="164" r="73" fill="#b4bda1" />
          <path
            d="M260 151h80m-18-18 18 18-18 18M340 180h-80m18-18-18 18 18 18"
            fill="none"
          />
        </g>
      )}
    </svg>
  );
}
