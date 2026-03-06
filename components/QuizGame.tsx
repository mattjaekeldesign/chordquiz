"use client";

import { useState, useCallback, useRef, useEffect } from "react";
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
  const correctNotes = correct.intervals.filter((i) => i !== null);
  const correctIntervalSet = new Set(correctNotes);

  const candidates = all
    .filter((c) => getIntervalString(c.intervals) !== correctStr)
    .map((c) => {
      const candidateNotes = c.intervals.filter((i) => i !== null);
      const candidateSet = new Set(candidateNotes);
      let sharedUnique = 0;
      correctIntervalSet.forEach((interval) => {
        if (candidateSet.has(interval)) sharedUnique++;
      });
      let positionalMatches = 0;
      const minLen = Math.min(correctNotes.length, candidateNotes.length);
      for (let i = 0; i < minLen; i++) {
        if (correctNotes[i] === candidateNotes[i]) positionalMatches++;
      }
      const lengthDiff = Math.abs(correctNotes.length - candidateNotes.length);
      const sizeDiff = Math.abs(correctIntervalSet.size - candidateSet.size);
      const score = (sharedUnique * 2) + (positionalMatches * 10) - (lengthDiff * 15) - (sizeDiff * 2);
      return { str: getIntervalString(c.intervals), score };
    });

  const uniqueCandidates = Array.from(new Map(candidates.map((c) => [c.str, c])).values());
  const sorted = uniqueCandidates.sort((a, b) => b.score - a.score);
  const topCandidates = sorted.slice(0, 5);
  const distractors = shuffleArray(topCandidates).slice(0, 3).map(c => c.str);
  return shuffleArray([correctStr, ...distractors]);
}

function makeQuestion(isHardMode: boolean) {
  const filteredChords = isHardMode ? chords.filter(c => !c.isBasic) : chords;
  const chord = filteredChords[Math.floor(Math.random() * filteredChords.length)];
  return { chord, options: generateOptions(chord, chords) };
}

const ACCENT = "rgb(42, 40, 32)";
const GREEN  = "rgb(60, 140, 90)";
const CREAM  = "rgb(245, 242, 232)";
const OLIVE  = "rgba(122, 136, 96, 0.4)";
const DARK   = "rgb(42, 40, 32)";
const MUTED  = "rgb(154, 144, 128)";

const INTERVAL_EQUIVALENTS: Record<string, string[]> = {
  "2": ["9"], "9": ["2"],
  "4": ["11"], "11": ["4"],
  "6": ["13", "bb7"], "13": ["6", "bb7"], "bb7": ["6", "13"],
  "b5": ["#4"], "#4": ["b5"],
  "b3": ["#2"], "#2": ["b3"],
  "#5": ["b6", "b13"], "b13": ["#5", "b6"], "b6": ["#5", "b13"],
};

function areIntervalsEquivalent(a: string, b: string): boolean {
  const normA = a.trim().toLowerCase();
  const normB = b.trim().toLowerCase();
  if (normA === normB) return true;
  return INTERVAL_EQUIVALENTS[normA]?.includes(normB) || INTERVAL_EQUIVALENTS[normB]?.includes(normA) || false;
}

function getMaxIntervalLength(target: string): number {
  const norm = target.trim().toLowerCase();
  const synonyms = INTERVAL_EQUIVALENTS[norm] || [];
  return Math.max(norm.length, ...synonyms.map(s => s.length));
}

type AnswerState = "idle" | "correct" | "wrong";

export default function QuizGame() {
  const [hasMounted, setHasMounted] = useState(false);
  const [isHardMode, setIsHardMode] = useState(false);
  const [question, setQuestion] = useState<{ chord: ChordInfo; options: string[] } | null>(null);
  const [questionNum, setQuestionNum] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [hardModeInputs, setHardModeInputs] = useState<string[]>([]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setHasMounted(true);
    setQuestion(makeQuestion(false));
  }, []);

  useEffect(() => {
    if (!question) return;
    const intervals = question.chord.intervals.filter(i => i !== null);
    setHardModeInputs(new Array(intervals.length).fill(""));
  }, [question]);

  useEffect(() => {
    if (hasMounted && isHardMode && question?.chord.isBasic && answerState === "idle") {
      const nextQ = makeQuestion(true);
      setQuestion(nextQ);
    }
  }, [isHardMode, question?.chord.isBasic, answerState, hasMounted]);

  useEffect(() => {
    if (isHardMode && answerState === "idle" && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [isHardMode, answerState, question]);

  const advance = useCallback(() => {
    const nextQ = makeQuestion(isHardMode);
    setQuestion(nextQ);
    setSelected(null);
    setAnswerState("idle");
    setQuestionNum((n) => n + 1);
  }, [isHardMode]);

  const handleSelect = (option: string) => {
    if (!question || answerState !== "idle") return;
    const correctAnswer = getIntervalString(question.chord.intervals);
    setSelected(option);
    setTotal((t) => t + 1);
    if (option === correctAnswer) {
      setAnswerState("correct");
      setScore((s) => s + 1);
      setTimeout(advance, 1600);
    } else {
      setAnswerState("wrong");
      setTimeout(advance, 2600);
    }
  };

  const checkHardModeAnswer = () => {
    if (!question || answerState !== "idle") return;
    const activeIntervals = question.chord.intervals.filter((i): i is string => i !== null);
    setTotal((t) => t + 1);
    const isCorrect = hardModeInputs.every((val, idx) => areIntervalsEquivalent(val, activeIntervals[idx] || ""));
    if (isCorrect) {
      setAnswerState("correct");
      setScore((s) => s + 1);
      setTimeout(advance, 1600);
    } else {
      setAnswerState("wrong");
      setTimeout(advance, 2600);
    }
  };

  const giveHint = () => {
    if (!question || answerState !== "idle") return;
    const activeIntervals = question.chord.intervals.filter((i): i is string => i !== null);
    const hintIdx = hardModeInputs.findIndex((val, idx) => !val.trim() || !areIntervalsEquivalent(val, activeIntervals[idx]));
    if (hintIdx !== -1) {
      const newInputs = [...hardModeInputs];
      newInputs[hintIdx] = activeIntervals[hintIdx];
      setHardModeInputs(newInputs);
      setTimeout(() => { if (inputRefs.current[hintIdx]) inputRefs.current[hintIdx]?.focus(); }, 10);
    }
  };

  const handleInputChange = (index: number, value: string) => {
    if (!question || answerState !== "idle") return;
    const activeIntervals = question.chord.intervals.filter((i): i is string => i !== null);
    const target = activeIntervals[index];
    const maxLen = getMaxIntervalLength(target);
    if (value.length > maxLen) return;
    const newInputs = [...hardModeInputs];
    newInputs[index] = value;
    setHardModeInputs(newInputs);
    if (value.length === maxLen || (value.length === 1 && /^[2-9]$/.test(value))) {
      if (index < hardModeInputs.length - 1) {
        setTimeout(() => { if (inputRefs.current[index + 1]) inputRefs.current[index + 1]?.focus(); }, 10);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === " ") {
      if (e.key === " ") e.preventDefault();
      if (index < hardModeInputs.length - 1) inputRefs.current[index + 1]?.focus();
    } else if (e.key === "ArrowLeft") {
      if (index > 0) inputRefs.current[index - 1]?.focus();
    } else if (e.key === "Enter") {
      checkHardModeAnswer();
    } else if (e.key === "Backspace" && hardModeInputs[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  function nameFontSize(name: string): number {
    if (name.length <= 1) return 88;
    if (name.length <= 2) return 76;
    if (name.length <= 3) return 64;
    return 52;
  }

  if (!hasMounted || !question) {
    return <div className="max-w-[800px] mx-auto w-full min-h-[400px] px-5 py-5" />;
  }

  const { chord: current, options } = question;
  const revealed = answerState !== "idle";
  const correctAnswer = getIntervalString(current.intervals);
  const activeIntervals = current.intervals.filter((i): i is string => i !== null);
  const chordAnimKey = answerState === "correct" ? `${questionNum}-correct` : `${questionNum}`;
  const chordAnimClass = answerState === "correct" ? "animate-chord-correct" : "animate-chord-enter";
  const pct = total > 0 ? Math.round((score / total) * 100) : 100;

  return (
    <div className="max-w-[800px] mx-auto w-full flex flex-col gap-3 px-5 py-5">
      <div className="flex items-center justify-between mb-2">
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.1em", color: "rgb(154, 144, 128)", textTransform: "uppercase" }}>
          Chord Interval Quiz
        </div>
        <label className="flex items-center gap-2 cursor-pointer select-none group">
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: isHardMode ? ACCENT : MUTED, transition: "color 0.2s" }}>
            HARD MODE
          </span>
          <div 
            className="relative inline-flex items-center h-5 w-9 rounded-full transition-colors duration-200"
            onClick={() => setIsHardMode(!isHardMode)}
            style={{ backgroundColor: isHardMode ? ACCENT : "rgba(122, 136, 96, 0.2)" }}
          >
            <div className={`inline-block w-3.5 h-3.5 transform bg-white rounded-full transition-transform duration-200 ${isHardMode ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </div>
        </label>
      </div>

      <div className="flex items-stretch gap-3">
        <div key={chordAnimKey} className={`${chordAnimClass} flex-1 min-w-0`} style={{ padding: "4px 0" }}>
          {(() => {
            const voicingMatch = current.name.match(/^(.*)\s\((Drop\s[23])\)$/);
            if (voicingMatch) {
              const [, base, voicing] = voicingMatch;
              return (
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900, fontSize: nameFontSize(base), color: "#1C1A16", letterSpacing: "-0.02em", lineHeight: 1, display: "flex", alignItems: "flex-start" }}>
                  {base}
                  <span style={{ fontSize: "max(12px, 0.28em)", marginLeft: 8, marginTop: "0.3em", color: "rgb(154, 144, 128)", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", backgroundColor: "rgba(122, 136, 96, 0.1)", padding: "2px 6px", borderRadius: 6, whiteSpace: "nowrap" }}>
                    {voicing}
                  </span>
                </div>
              );
            }
            return <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900, fontSize: nameFontSize(current.name), color: "#1C1A16", letterSpacing: "-0.02em", lineHeight: 1 }}>{current.name}</div>;
          })()}
          <div style={{ fontFamily: "Caveat, cursive", fontSize: 15, color: "rgb(122, 136, 96)", marginTop: 6 }}>
            {isHardMode ? "Type the intervals from bottom to top" : "What are the intervals?"}
          </div>
        </div>

        <div style={{ borderRadius: 16, border: "1px solid rgba(122, 136, 96, 0.22)", backgroundColor: "rgba(122, 136, 96, 0.03)", padding: "16px 20px", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, minWidth: 88 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, letterSpacing: "0.2em", color: "rgb(154, 144, 128)", textTransform: "uppercase" }}>SCORE</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 600, color: ACCENT }}>{score}/{total}</div>
          <div style={{ width: "60%", height: 1, backgroundColor: "rgba(122, 136, 96, 0.2)", margin: "3px 0" }} />
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgb(154, 144, 128)", letterSpacing: "0.12em" }}>{pct}%</div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 items-start">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexShrink: 0, padding: 12 }}>
          <ChordDiagram strings={current.strings} intervals={current.intervals} showIntervals={revealed} />
          <div style={{ height: 26, display: "flex", alignItems: "center" }}>
            {answerState === "correct" && (
              <div className="flex items-center gap-2 animate-fade-in" style={{ fontFamily: "Caveat, cursive", fontSize: 18, color: GREEN }}>
                <svg style={{ width: 16, height: 16 }} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Correct!
              </div>
            )}
            {answerState === "wrong" && (
              <div className="flex items-center gap-2 animate-fade-in" style={{ fontFamily: "Caveat, cursive", fontSize: 18, color: "rgb(180, 60, 60)" }}>
                <svg style={{ width: 16, height: 16 }} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {isHardMode ? `Actually: ${correctAnswer}` : "Not quite — see answer"}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 w-full flex flex-col gap-3">
          {isHardMode ? (
            <div className="flex flex-col gap-6 md:pt-4">
              <div className="flex flex-wrap gap-2.5 items-center justify-center md:justify-start">
                {hardModeInputs.map((val, i) => {
                  const isInputCorrect = areIntervalsEquivalent(val, activeIntervals[i] || "");
                  let borderColor = OLIVE;
                  let bgColor = "white";
                  let textColor = DARK;
                  if (revealed) {
                    borderColor = isInputCorrect ? GREEN : "rgb(180, 60, 60)";
                    bgColor = isInputCorrect ? "rgba(60, 140, 90, 0.05)" : "rgba(180, 60, 60, 0.05)";
                    textColor = isInputCorrect ? GREEN : "rgb(180, 60, 60)";
                  }
                  return (
                    <input
                      key={i}
                      ref={(el) => { inputRefs.current[i] = el; }}
                      type="text"
                      value={val}
                      onChange={(e) => handleInputChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      disabled={revealed}
                      placeholder="?"
                      autoComplete="off"
                      maxLength={getMaxIntervalLength(activeIntervals[i] || "1")}
                      className="focus:ring-2 focus:ring-black/5 focus:border-black"
                      style={{ width: 64, height: 52, borderRadius: 12, border: `2px solid ${borderColor}`, backgroundColor: bgColor, textAlign: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 600, color: textColor, outline: "none", transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)" }}
                    />
                  );
                })}
              </div>
              <div className="flex items-center gap-3">
                <button onClick={checkHardModeAnswer} disabled={revealed} className={!revealed ? "hover:translate-y-[-1px] active:translate-y-0 active:scale-[0.98]" : ""} style={{ padding: "12px 28px", borderRadius: 12, backgroundColor: revealed ? MUTED : ACCENT, color: CREAM, fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, letterSpacing: "0.05em", cursor: revealed ? "default" : "pointer", border: "none", transition: "all 0.2s", boxShadow: !revealed ? "0 4px 12px rgba(42, 40, 32, 0.15)" : "none" }}>CHECK ANSWER</button>
                <button onClick={giveHint} disabled={revealed} className={!revealed ? "hover:bg-[rgba(42,40,32,0.04)] active:scale-[0.98]" : ""} style={{ padding: "11px 20px", borderRadius: 12, backgroundColor: "transparent", color: ACCENT, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", cursor: revealed ? "default" : "pointer", border: `1.5px solid ${revealed ? MUTED : "rgba(42, 40, 32, 0.25)"}`, transition: "all 0.2s", opacity: revealed ? 0.5 : 1 }}>HINT</button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:flex md:flex-col gap-3 h-full">
              {options.map((option, i) => {
                const isCorrect = option === correctAnswer;
                const isSelected = option === selected;
                let borderColor = OLIVE;
                let bgColor = "transparent";
                let textColor = DARK;
                let fontWeight = 400;
                if (revealed) {
                  if (isCorrect) {
                    borderColor = ACCENT; bgColor = ACCENT; textColor = CREAM; fontWeight = 600;
                  } else if (isSelected && !isCorrect) {
                    borderColor = "rgba(180, 60, 60, 0.5)"; bgColor = "rgba(180, 60, 60, 0.06)"; textColor = "rgb(180, 60, 60)";
                  } else {
                    borderColor = "rgba(122, 136, 96, 0.2)"; textColor = MUTED;
                  }
                }
                return (
                  <button key={i} onClick={() => handleSelect(option)} disabled={revealed} className={!revealed ? "answer-btn" : ""} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, padding: "12px 10px", borderRadius: 14, border: `1.5px solid ${borderColor}`, backgroundColor: bgColor, color: textColor, fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight, letterSpacing: "0.04em", cursor: revealed ? "default" : "pointer", transition: "border-color 0.15s, background-color 0.15s, color 0.15s, transform 0.12s, box-shadow 0.12s", outline: "none", textAlign: "center", lineHeight: 1.5, minHeight: 60 }}>
                    <span>{option}</span>
                    {revealed && isCorrect && <svg style={{ width: 14, height: 14 }} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                    {revealed && isSelected && !isCorrect && <svg style={{ width: 14, height: 14 }} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div style={{ borderRadius: 14, border: "1px solid rgba(122, 136, 96, 0.2)", padding: "12px 20px", backgroundColor: "rgba(122, 136, 96, 0.03)" }}>
        <div style={{ fontFamily: "Caveat, cursive", fontSize: 12, color: "rgb(154, 144, 128)", marginBottom: 8 }}>interval guide</div>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {[
            { label: "1", desc: "Root" }, { label: "b3", desc: "Minor 3rd" }, { label: "3", desc: "Major 3rd" }, { label: "4", desc: "Perfect 4th" }, { label: "b5", desc: "Diminished 5th" }, { label: "5", desc: "Perfect 5th" }, { label: "b7", desc: "Minor 7th" }, { label: "bb7", desc: "Diminished 7th" }, { label: "7", desc: "Major 7th" }, { label: "b9", desc: "Minor 9th" }, { label: "9", desc: "Major 9th" }, { label: "11", desc: "Perfect 11th" }, { label: "13", desc: "Major 13th" }, { label: "#5", desc: "Augmented 5th" },
          ].map(({ label, desc }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: ACCENT, backgroundColor: "rgba(42, 40, 32, 0.08)", padding: "2px 7px", borderRadius: 4 }}>{label}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgb(154, 144, 128)" }}>{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
