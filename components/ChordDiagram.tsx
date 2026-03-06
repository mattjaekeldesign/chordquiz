"use client";

import React from "react";

interface ChordDiagramProps {
  strings: (number | null)[];
  intervals: (string | null)[];
  showIntervals?: boolean;
}

const SVG_W = 200;
const SVG_H = 230;
const TOP = 45;       // space for X/O markers
const BOT = 25;       // space for string name labels
const LEFT = 28;
const RIGHT = 28;
const NUM_STRINGS = 6;
const NUM_FRETS = 5;

const STR_SPACING = (SVG_W - LEFT - RIGHT) / (NUM_STRINGS - 1); // 28.8
const FRET_H = (SVG_H - TOP - BOT) / NUM_FRETS;                 // 32

// String thicknesses from low E (thick) to high E (thin)
const STRING_WIDTHS = [2.2, 1.8, 1.4, 1.1, 0.9, 0.7];

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
  const fy = (i: number) => TOP + i * FRET_H;
  const dotY = (fret: number) => TOP + (fret - baseFret + 0.5) * FRET_H;

  const STRING_NAMES = ["E", "A", "D", "G", "B", "E"];

  return (
    <div className="inline-flex flex-col items-center">
      <div className="bg-amber-50 rounded-2xl shadow-xl border border-amber-200 p-3">
        <svg
          width={SVG_W}
          height={SVG_H}
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          aria-label="Guitar chord diagram"
        >
          {/* Fret lines */}
          {Array.from({ length: NUM_FRETS + 1 }, (_, i) => (
            <line
              key={`fret-${i}`}
              x1={LEFT}
              y1={fy(i)}
              x2={SVG_W - RIGHT}
              y2={fy(i)}
              stroke={i === 0 && showNut ? "#1a1208" : "#8b7355"}
              strokeWidth={i === 0 && showNut ? 5 : 1.5}
            />
          ))}

          {/* String lines */}
          {Array.from({ length: NUM_STRINGS }, (_, i) => (
            <line
              key={`str-${i}`}
              x1={sx(i)}
              y1={fy(0)}
              x2={sx(i)}
              y2={fy(NUM_FRETS)}
              stroke="#5c4a2a"
              strokeWidth={STRING_WIDTHS[i]}
            />
          ))}

          {/* Fret position label (when not starting at fret 1) */}
          {!showNut && (
            <text
              x={LEFT - 6}
              y={fy(0) + FRET_H / 2 + 4}
              textAnchor="end"
              fontSize={11}
              fill="#78614a"
              fontFamily="serif"
            >
              {baseFret}fr
            </text>
          )}

          {/* String markers (X, O) and fretted dots */}
          {strings.map((fret, i) => {
            const x = sx(i);
            const markerY = TOP - 16;

            if (fret === null) {
              // Muted string — X
              const s = 5;
              return (
                <g key={`mk-${i}`}>
                  <line
                    x1={x - s} y1={markerY - s}
                    x2={x + s} y2={markerY + s}
                    stroke="#c0392b" strokeWidth={2} strokeLinecap="round"
                  />
                  <line
                    x1={x + s} y1={markerY - s}
                    x2={x - s} y2={markerY + s}
                    stroke="#c0392b" strokeWidth={2} strokeLinecap="round"
                  />
                </g>
              );
            }

            if (fret === 0) {
              // Open string — circle
              return (
                <circle
                  key={`mk-${i}`}
                  cx={x} cy={markerY} r={6}
                  fill="none" stroke="#5c4a2a" strokeWidth={2}
                />
              );
            }

            // Fretted note — filled dot
            const dy = dotY(fret);
            return (
              <g key={`mk-${i}`}>
                <circle cx={x} cy={dy} r={11} fill="#1a1208" />
                {showIntervals && intervals[i] && (
                  <text
                    x={x}
                    y={dy + 4}
                    textAnchor="middle"
                    fontSize={intervals[i]!.length > 1 ? 8 : 10}
                    fill="#f5e6c8"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {intervals[i]}
                  </text>
                )}
              </g>
            );
          })}

          {/* String name labels at bottom */}
          {STRING_NAMES.map((name, i) => (
            <text
              key={`sl-${i}`}
              x={sx(i)}
              y={SVG_H - 5}
              textAnchor="middle"
              fontSize={10}
              fill="#78614a"
              fontFamily="sans-serif"
            >
              {name}
            </text>
          ))}
        </svg>

        {/* Interval row shown after answering */}
        {showIntervals && (
          <div
            className="flex justify-between mt-1 px-1"
            style={{ width: SVG_W }}
          >
            {strings.map((fret, i) => (
              <div
                key={`iv-${i}`}
                className="text-center font-mono font-bold text-xs"
                style={{ width: STR_SPACING, color: fret === null ? "#c0392b" : "#2d6a4f" }}
              >
                {fret === null ? "x" : (fret === 0 ? intervals[i] ?? "?" : "")}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
