import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chord Interval Quiz",
  description: "Learn guitar chord intervals through interactive quizzes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-slate-900 flex flex-col">
          <header className="border-b border-slate-800 px-6 py-4">
            <div className="max-w-2xl mx-auto flex items-center gap-3">
              <svg
                className="w-7 h-7 text-amber-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z"
                />
              </svg>
              <h1 className="text-lg font-bold text-white tracking-tight">
                Chord Interval Quiz
              </h1>
              <span className="ml-auto text-xs text-slate-500 font-mono">
                Standard Tuning · E A D G B E
              </span>
            </div>
          </header>
          <main className="flex-1 max-w-2xl mx-auto w-full">{children}</main>
          <footer className="text-center text-slate-600 text-xs py-4">
            Practice identifying intervals in common guitar chord shapes
          </footer>
        </div>
      </body>
    </html>
  );
}
