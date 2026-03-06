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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Caveat:wght@400;500;600&family=Playfair+Display:wght@900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* Noise texture */}
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22300%22%3E%3Cfilter%20id%3D%22n%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.72%22%20numOctaves%3D%224%22%20stitchTiles%3D%22stitch%22%2F%3E%3CfeColorMatrix%20type%3D%22saturate%22%20values%3D%220%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22300%22%20height%3D%22300%22%20filter%3D%22url(%23n)%22%20opacity%3D%221%22%2F%3E%3C%2Fsvg%3E")`,
            backgroundRepeat: "repeat",
            opacity: 0.038,
            mixBlendMode: "multiply",
          }}
        />
        {/* Left accent line */}
        <div
          className="fixed left-0 top-0 h-full w-[3px] pointer-events-none z-0"
          style={{ backgroundColor: "rgb(122, 136, 96)", opacity: 0.18 }}
        />

        <div className="relative z-10 min-h-screen flex flex-col">
          <header
            className="flex-shrink-0 flex items-center justify-between px-5"
            style={{ height: 48, borderBottom: "1px solid rgba(122, 136, 96, 0.25)" }}
          >
            <div className="flex items-center gap-5">
              <span
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: "0.2em",
                  color: "rgb(122, 136, 96)",
                  textTransform: "uppercase",
                }}
              >
                CHORD · QUIZ
              </span>
              <span
                style={{
                  fontFamily: "Caveat, cursive",
                  fontSize: 14,
                  color: "rgb(181, 168, 152)",
                  fontWeight: 400,
                }}
              >
                — interval training
              </span>
            </div>
            <span
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 9,
                color: "rgb(197, 185, 168)",
                letterSpacing: "0.12em",
              }}
            >
              E · A · D · G · B · E
            </span>
          </header>

          <main className="flex-1 w-full">{children}</main>

          <footer
            style={{
              borderTop: "1px solid rgba(122, 136, 96, 0.25)",
              padding: "12px 56px 16px",
              backgroundColor: "rgba(245, 242, 232, 0.92)",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontFamily: "Caveat, cursive",
                fontSize: 13,
                color: "rgb(154, 144, 128)",
              }}
            >
              Practice identifying intervals in common guitar chord shapes
            </span>
          </footer>
        </div>
      </body>
    </html>
  );
}
