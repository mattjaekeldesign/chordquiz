"use client";

import { useState, useCallback } from "react";
import { chords, ChordInfo, getIntervalString } from "@/data/chords";
import ChordDiagram from "./ChordDiagram";

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateOptions(correct: ChordInfo, all: ChordInfo[]): string[] {
  const correctStr = getIntervalString(correct.intervals);
  const correctIntervalSet = new Set(correct.intervals.filter((i) => i !== null));

  // Score all other chords by similarity to the correct one
  const candidates = all
    .filter((c) => getIntervalString(c.intervals) !== correctStr)
    .map((c) => {
      const candidateIntervals = c.intervals.filter((i) => i !== null);
      const candidateSet = new Set(candidateIntervals);
      
      // Calculate intersection (shared intervals)
      let sharedCount = 0;
      correctIntervalSet.forEach((interval) => {
        if (candidateSet.has(interval)) sharedCount++;
      });

      // Complexity penalty (difference in number of notes)
      const sizeDiff = Math.abs(correctIntervalSet.size - candidateSet.size);
      
      // Similarity score: more shared intervals is better, more size difference is worse
      const score = sharedCount * 2 - sizeDiff;

      return {
        str: getIntervalString(c.intervals),
        score,
      };
    });

  // Unique interval strings only
  const uniqueCandidates = Array.from(
    new Map(candidates.map((c) => [c.str, c])).values()
  );

  // Sort by score descending and take the top N most similar
  const sorted = uniqueCandidates.sort((a, b) => b.score - a.score);
  
  // Pick from the top 6 most similar distractors to maintain some variety
  const topCandidates = sorted.slice(0, 6);
  const distractors = shuffleArray(topCandidates).slice(0, 2).map(c => c.str);

  return shuffleArray([correctStr, ...distractors]);
}

function randomChord(): ChordInfo {
  return chords[Math.floor(Math.random() * chords.length)];
}

type AnswerState = "idle" | "correct" | "wrong";

const BLUE  = "rgb(26, 58, 255)";
const CREAM = "rgb(245, 242, 232)";
const OLIVE = "rgba(122, 136, 96, 0.4)";
const DARK  = "rgb(42, 40, 32)";
const MUTED = "rgb(192, 184, 168)";

function nameFontSize(name: string): number {
  if (name.length <= 1) return 88;
  if (name.length <= 2) return 76;
  if (name.length <= 3) return 64;
  return 52;
}

function makeQuestion() {
  const chord = randomChord();
  return { chord, options: generateOptions(chord, chords) };
}

export default function QuizGame() {
  const [{ chord: current, options }, setQuestion] = useState(makeQuestion);
  const [questionNum, setQuestionNum] = useState(1);
  const [selected, setSelected]       = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [score, setScore]             = useState(0);
  const [total, setTotal]             = useState(0);

  const advance = useCallback(() => {
    setQuestion(makeQuestion());
    setSelected(null);
    setAnswerState("idle");
    setQuestionNum((n) => n + 1);
  }, []);

  const handleSelect = (option: string) => {
    if (answerState !== "idle") return;
    const correct = getIntervalString(current.intervals);
    setSelected(option);
    setTotal((t) => t + 1);
    if (option === correct) {
      setAnswerState("correct");
      setScore((s) => s + 1);
      setTimeout(advance, 1600);
    } else {
      setAnswerState("wrong");
      setTimeout(advance, 2600);
    }
  };

  const correctAnswer = getIntervalString(current.intervals);
  const revealed      = answerState !== "idle";

  // Key changes when chord changes (enter anim) OR when correct (correct anim)
  const chordAnimKey   = answerState === "correct" ? `${questionNum}-correct` : `${questionNum}`;
  const chordAnimClass = answerState === "correct" ? "animate-chord-correct" : "animate-chord-enter";
  const pct            = total > 0 ? Math.round((score / total) * 100) : 100;

  return (
    <div className="flex flex-col gap-3 px-5 py-5">

      {/* Top row: chord name card + score card */}
      <div className="flex items-stretch gap-3">

        {/* Chord name — no card */}
        <div
          key={chordAnimKey}
          className={`${chordAnimClass} flex-1 min-w-0`}
          style={{ padding: "4px 0" }}
        >
          <div style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 900,
            fontSize: nameFontSize(current.name),
            color: "#1C1A16",
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}>
            {current.name}
          </div>
          <div style={{
            fontFamily: "Caveat, cursive",
            fontSize: 15, color: "rgb(122, 136, 96)", marginTop: 6,
          }}>
            What are the intervals?
          </div>
        </div>

        {/* Score + accuracy bento card */}
        <div style={{
          borderRadius: 16,
          border: "1px solid rgba(122, 136, 96, 0.22)",
          backgroundColor: "rgba(122, 136, 96, 0.03)",
          padding: "16px 20px",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          minWidth: 88,
        }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 7, letterSpacing: "0.2em",
            color: "rgb(154, 144, 128)", textTransform: "uppercase" as const,
          }}>
            SCORE
          </div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 14, fontWeight: 600, color: BLUE,
          }}>
            {score}/{total}
          </div>
          <div style={{ width: "60%", height: 1, backgroundColor: "rgba(122, 136, 96, 0.2)", margin: "3px 0" }} />
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10, color: "rgb(154, 144, 128)", letterSpacing: "0.12em",
          }}>
            {pct}%
          </div>
        </div>
      </div>

      {/* Main bento row: diagram card + answer cards */}
      <div className="flex flex-col md:flex-row gap-3">

        {/* Diagram — no card */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          flexShrink: 0,
          padding: 12,
        }}>
          <ChordDiagram
            strings={current.strings}
            intervals={current.intervals}
            showIntervals={revealed}
          />
          {/* Feedback */}
          <div style={{ height: 26, display: "flex", alignItems: "center" }}>
            {answerState === "correct" && (
              <div className="flex items-center gap-2 animate-fade-in" style={{
                fontFamily: "Caveat, cursive", fontSize: 18, color: "rgb(60, 140, 90)",
              }}>
                <svg style={{ width: 16, height: 16 }} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Correct!
              </div>
            )}
            {answerState === "wrong" && (
              <div className="flex items-center gap-2 animate-fade-in" style={{
                fontFamily: "Caveat, cursive", fontSize: 18, color: "rgb(180, 60, 60)",
              }}>
                <svg style={{ width: 16, height: 16 }} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                Not quite — see answer
              </div>
            )}
          </div>
        </div>

        {/* Answer cards: row on mobile, stacked col on desktop */}
        <div className="flex flex-row md:flex-col gap-3 flex-1">
          {options.map((option, i) => {
            const isCorrect  = option === correctAnswer;
            const isSelected = option === selected;

            let borderColor = OLIVE;
            let bgColor     = "transparent";
            let textColor   = DARK;
            let fontWeight  = 400;

            if (revealed) {
              if (isCorrect) {
                borderColor = BLUE;
                bgColor     = BLUE;
                textColor   = CREAM;
                fontWeight  = 600;
              } else if (isSelected && !isCorrect) {
                borderColor = "rgba(180, 60, 60, 0.5)";
                bgColor     = "rgba(180, 60, 60, 0.06)";
                textColor   = "rgb(180, 60, 60)";
              } else {
                borderColor = "rgba(122, 136, 96, 0.2)";
                textColor   = MUTED;
              }
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(option)}
                disabled={revealed}
                className={!revealed ? "answer-btn" : ""}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "12px 10px",
                  borderRadius: 14,
                  border: `1.5px solid ${borderColor}`,
                  backgroundColor: bgColor,
                  color: textColor,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 13,
                  fontWeight,
                  letterSpacing: "0.04em",
                  cursor: revealed ? "default" : "pointer",
                  transition: "border-color 0.15s, background-color 0.15s, color 0.15s, transform 0.12s, box-shadow 0.12s",
                  outline: "none",
                  textAlign: "center" as const,
                  lineHeight: 1.5,
                  minHeight: 60,
                }}
              >
                <span>{option}</span>
                {revealed && isCorrect && (
                  <svg style={{ width: 14, height: 14 }} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {revealed && isSelected && !isCorrect && (
                  <svg style={{ width: 14, height: 14 }} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interval guide bento card */}
      <div style={{
        borderRadius: 14,
        border: "1px solid rgba(122, 136, 96, 0.2)",
        padding: "12px 20px",
        backgroundColor: "rgba(122, 136, 96, 0.03)",
      }}>
        <div style={{
          fontFamily: "Caveat, cursive",
          fontSize: 12, color: "rgb(154, 144, 128)", marginBottom: 8,
        }}>
          interval guide
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {[
            { label: "1",   desc: "Root" },
            { label: "b3",  desc: "Minor 3rd" },
            { label: "3",   desc: "Major 3rd" },
            { label: "4",   desc: "Perfect 4th" },
            { label: "b5",  desc: "Diminished 5th" },
            { label: "5",   desc: "Perfect 5th" },
            { label: "b7",  desc: "Minor 7th" },
            { label: "bb7", desc: "Diminished 7th" },
            { label: "7",   desc: "Major 7th" },
            { label: "b9",  desc: "Minor 9th" },
            { label: "9",   desc: "Major 9th" },
            { label: "11",  desc: "Perfect 11th" },
            { label: "13",  desc: "Major 13th" },
            { label: "#5",  desc: "Augmented 5th" },
          ].map(({ label, desc }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11, fontWeight: 600, color: BLUE,
                backgroundColor: "rgba(26, 58, 255, 0.08)",
                padding: "2px 7px", borderRadius: 4,
              }}>
                {label}
              </span>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10, color: "rgb(154, 144, 128)",
              }}>
                {desc}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
