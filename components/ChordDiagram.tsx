"use client";

import React from "react";

interface ChordDiagramProps {
  strings: (number | null)[];
  intervals: (string | null)[];
  showIntervals?: boolean;
}

// Coordinate system matches reference design
const SVG_VW = 274;
const SVG_VH = 300;
const NUT_Y = 44;
const FRET_AREA_TOP = 50;
const FRET_AREA_BOT = 258;
const LABEL_Y = 286;
const MARKER_Y = 22;
const LEFT = 42;
const RIGHT = 42;
const NUM_STRINGS = 6;
const NUM_FRETS = 5;

const STR_SPACING = (SVG_VW - LEFT - RIGHT) / (NUM_STRINGS - 1); // 38
const FRET_H = (FRET_AREA_BOT - FRET_AREA_TOP) / NUM_FRETS;      // 41.6

// String thicknesses from low E (thick) to high E (thin)
const STRING_WIDTHS = [2.2, 1.9, 1.6, 1.3, 1.0, 0.8];

const STRING_NAMES = ["E", "A", "D", "G", "B", "e"];

function getBaseFret(strings: (number | null)[]): number {
  const fretted = strings.filter((f): f is number => f !== null && f > 0);
  if (fretted.length === 0) return 1;
  const minFret = Math.min(...fretted);
  const hasOpen = strings.some((f) => f === 0);
  return hasOpen || minFret === 1 ? 1 : minFret;
}

export default function ChordDiagram({
  strings,
  intervals,
  showIntervals = false,
}: ChordDiagramProps) {
  const baseFret = getBaseFret(strings);
  const showNut = baseFret === 1;

  const sx = (i: number) => LEFT + i * STR_SPACING;
  const fy = (i: number) => FRET_AREA_TOP + i * FRET_H;
  const dotY = (fret: number) => FRET_AREA_TOP + (fret - baseFret + 0.5) * FRET_H;

  return (
    <div className="inline-flex flex-col items-center">
      <div style={{ filter: "drop-shadow(rgba(26, 58, 255, 0.1) 0px 6px 28px)" }}>
        <svg
          width={SVG_VW}
          height={SVG_VH}
          viewBox={`0 0 ${SVG_VW} ${SVG_VH}`}
          aria-label="Guitar chord diagram"
          style={{ overflow: "visible" }}
        >
          {/* Nut or top fret line */}
          {showNut ? (
            <rect
              x={LEFT}
              y={NUT_Y}
              width={SVG_VW - LEFT - RIGHT}
              height={6}
              fill="#2A2820"
              rx={2}
            />
          ) : (
            <line
              x1={LEFT} y1={FRET_AREA_TOP}
              x2={SVG_VW - RIGHT} y2={FRET_AREA_TOP}
              stroke="#9A9080"
              strokeWidth={1}
            />
          )}

          {/* Fret lines (below nut) */}
          {Array.from({ length: NUM_FRETS }, (_, i) => (
            <line
              key={`fret-${i}`}
              x1={LEFT}
              y1={fy(i + 1)}
              x2={SVG_VW - RIGHT}
              y2={fy(i + 1)}
              stroke="#9A9080"
              strokeWidth={0.8}
            />
          ))}

          {/* String lines */}
          {Array.from({ length: NUM_STRINGS }, (_, i) => (
            <line
              key={`str-${i}`}
              x1={sx(i)}
              y1={FRET_AREA_TOP}
              x2={sx(i)}
              y2={FRET_AREA_BOT}
              stroke="#2A2820"
              strokeWidth={STRING_WIDTHS[i]}
            />
          ))}

          {/* Fret position label when not starting at fret 1 */}
          {!showNut && (
            <text
              x={LEFT - 8}
              y={fy(0) + FRET_H / 2 + 4}
              textAnchor="end"
              fontSize={10}
              fill="#9A9080"
              fontFamily="'JetBrains Mono', monospace"
            >
              {baseFret}fr
            </text>
          )}

          {/* String markers (X, O) and fretted dots */}
          {strings.map((fret, i) => {
            const x = sx(i);

            if (fret === null) {
              // Muted — X
              const s = 5;
              return (
                <g key={`mk-${i}`}>
                  <line
                    x1={x - s} y1={MARKER_Y - s}
                    x2={x + s} y2={MARKER_Y + s}
                    stroke="#B0A898" strokeWidth={1.5} strokeLinecap="round"
                  />
                  <line
                    x1={x + s} y1={MARKER_Y - s}
                    x2={x - s} y2={MARKER_Y + s}
                    stroke="#B0A898" strokeWidth={1.5} strokeLinecap="round"
                  />
                </g>
              );
            }

            if (fret === 0) {
              // Open string — dark circle outline
              return (
                <circle
                  key={`mk-${i}`}
                  cx={x} cy={MARKER_Y} r={8}
                  fill="none"
                  stroke="#2A2820"
                  strokeWidth={1.5}
                />
              );
            }

            // Fretted note — dark filled dot
            const dy = dotY(fret);
            return (
              <g key={`mk-${i}`}>
                <circle cx={x} cy={dy} r={11} fill="#2A2820" />
                {showIntervals && intervals[i] && (
                  <text
                    x={x}
                    y={dy + 4}
                    textAnchor="middle"
                    fontSize={intervals[i]!.length > 1 ? 8 : 10}
                    fill="#F5F2E8"
                    fontFamily="'JetBrains Mono', monospace"
                    fontWeight="bold"
                  >
                    {intervals[i]}
                  </text>
                )}
              </g>
            );
          })}

          {/* String name labels */}
          {STRING_NAMES.map((name, i) => (
            <text
              key={`sl-${i}`}
              x={sx(i)}
              y={LABEL_Y}
              textAnchor="middle"
              fontSize={10}
              fill="#9A9080"
              fontFamily="'JetBrains Mono', monospace"
              fontWeight="400"
            >
              {name}
            </text>
          ))}
        </svg>

        {/* Interval row for open strings, shown after answering */}
        {showIntervals && (
          <div
            className="flex justify-between mt-1"
            style={{ width: SVG_VW, paddingLeft: LEFT, paddingRight: RIGHT }}
          >
            {strings.map((fret, i) => (
              <div
                key={`iv-${i}`}
                className="text-center font-bold text-xs"
                style={{
                  width: STR_SPACING,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: fret === null ? "#B0A898" : "#2A2820",
                }}
              >
                {fret === null ? "x" : fret === 0 ? (intervals[i] ?? "?") : ""}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
