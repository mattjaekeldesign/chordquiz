"use client";

import { useState, useEffect, useCallback } from "react";
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
  const distractors = shuffleArray(
    [...new Set(
      all
        .filter((c) => c.id !== correct.id)
        .map((c) => getIntervalString(c.intervals))
        .filter((s) => s !== correctStr)
    )]
  ).slice(0, 3);
  return shuffleArray([correctStr, ...distractors]);
}

type AnswerState = "idle" | "correct" | "wrong";

export default function QuizGame() {
  const [deck, setDeck] = useState<ChordInfo[]>([]);
  const [index, setIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const startNewGame = useCallback(() => {
    const shuffled = shuffleArray(chords);
    setDeck(shuffled);
    setIndex(0);
    setScore(0);
    setSelected(null);
    setAnswerState("idle");
    setGameOver(false);
    setOptions(generateOptions(shuffled[0], chords));
  }, []);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  useEffect(() => {
    if (deck.length > 0 && index < deck.length) {
      setOptions(generateOptions(deck[index], chords));
      setSelected(null);
      setAnswerState("idle");
    }
  }, [index, deck]);

  const advance = useCallback(() => {
    if (index + 1 >= deck.length) {
      setGameOver(true);
    } else {
      setIndex((i) => i + 1);
    }
  }, [index, deck.length]);

  const handleSelect = (option: string) => {
    if (answerState !== "idle") return;

    const current = deck[index];
    const correct = getIntervalString(current.intervals);
    setSelected(option);

    if (option === correct) {
      setAnswerState("correct");
      setScore((s) => s + 1);
      setTimeout(advance, 1600);
    } else {
      setAnswerState("wrong");
      setTimeout(advance, 2600);
    }
  };

  if (deck.length === 0) {
    return (
      <div className="text-slate-400 text-center py-16">Loading...</div>
    );
  }

  if (gameOver) {
    const pct = Math.round((score / deck.length) * 100);
    return (
      <div className="flex flex-col items-center gap-6 py-10 px-4 text-center">
        <div className="text-6xl font-bold text-amber-400">{score}/{deck.length}</div>
        <div className="text-xl text-slate-300">
          {pct >= 90
            ? "Excellent! You know your intervals cold."
            : pct >= 70
            ? "Great job! Keep practicing."
            : pct >= 50
            ? "Good effort! A bit more study will help."
            : "Keep at it — practice makes perfect!"}
        </div>
        <div className="w-64 h-3 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${pct}%`,
              background: pct >= 70 ? "#22c55e" : pct >= 50 ? "#eab308" : "#ef4444",
            }}
          />
        </div>
        <button
          onClick={startNewGame}
          className="mt-4 px-8 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl text-lg transition-colors"
        >
          Play Again
        </button>
      </div>
    );
  }

  const current = deck[index];
  const correctAnswer = getIntervalString(current.intervals);
  const revealed = answerState !== "idle";

  return (
    <div className="flex flex-col items-center gap-6 px-4 py-6 max-w-lg mx-auto">
      {/* Progress bar + score */}
      <div className="w-full flex items-center justify-between text-sm text-slate-400">
        <span>
          Question <span className="text-white font-semibold">{index + 1}</span> of{" "}
          <span className="text-white font-semibold">{deck.length}</span>
        </span>
        <span>
          Score{" "}
          <span className="text-amber-400 font-bold">
            {score}/{index + (answerState === "correct" ? 1 : 0)}
          </span>
        </span>
      </div>

      <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-500 rounded-full transition-all duration-500"
          style={{ width: `${((index) / deck.length) * 100}%` }}
        />
      </div>

      {/* Chord name + prompt */}
      <div className="text-center">
        <div className="text-5xl font-bold text-amber-400 tracking-tight mb-1">
          {current.name}
        </div>
        <div className="text-slate-400 text-sm">
          What are the intervals for each string?
        </div>
      </div>

      {/* Chord diagram */}
      <ChordDiagram
        strings={current.strings}
        intervals={current.intervals}
        showIntervals={revealed}
      />

      {/* Feedback message */}
      <div className="h-7 flex items-center justify-center">
        {answerState === "correct" && (
          <div className="flex items-center gap-2 text-green-400 font-semibold text-base animate-fade-in">
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Correct!
          </div>
        )}
        {answerState === "wrong" && (
          <div className="flex items-center gap-2 text-red-400 font-semibold text-base animate-fade-in">
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            Not quite — see the correct answer below
          </div>
        )}
      </div>

      {/* Answer options */}
      <div className="w-full flex flex-col gap-3">
        {options.map((option, i) => {
          const isCorrect = option === correctAnswer;
          const isSelected = option === selected;

          let bg = "bg-slate-800 border-slate-600 text-slate-100 hover:bg-slate-700 hover:border-slate-500";
          if (revealed) {
            if (isCorrect) {
              bg = "bg-green-900/60 border-green-500 text-green-300";
            } else if (isSelected && !isCorrect) {
              bg = "bg-red-900/60 border-red-500 text-red-300";
            } else {
              bg = "bg-slate-800/50 border-slate-700 text-slate-500";
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(option)}
              disabled={revealed}
              className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border-2 font-mono text-base font-semibold transition-all duration-200 cursor-pointer disabled:cursor-default ${bg}`}
            >
              <span className="tracking-wide">{option}</span>
              {revealed && isCorrect && (
                <svg className="w-5 h-5 text-green-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
              {revealed && isSelected && !isCorrect && (
                <svg className="w-5 h-5 text-red-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {/* Interval legend */}
      <div className="w-full bg-slate-800/50 rounded-xl p-3 border border-slate-700">
        <div className="text-xs text-slate-500 font-semibold uppercase tracking-widest mb-2">
          Interval Guide
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "1", desc: "Root" },
            { label: "b3", desc: "Minor 3rd" },
            { label: "3", desc: "Major 3rd" },
            { label: "5", desc: "Perfect 5th" },
            { label: "b7", desc: "Minor 7th" },
            { label: "7", desc: "Major 7th" },
          ].map(({ label, desc }) => (
            <div
              key={label}
              className="flex items-center gap-1 text-xs text-slate-400"
            >
              <span className="font-mono font-bold text-amber-400 bg-slate-700 px-1.5 py-0.5 rounded">
                {label}
              </span>
              <span>{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
