# Chord Interval Quiz

Learn which interval (root, 3rd, 5th, 7th…) each string plays in common guitar chord shapes.

**Live app: https://chordquiz-tau.vercel.app**

## How to play

1. Open the [live app](https://chordquiz-tau.vercel.app).
2. A chord diagram appears. Work out the interval each string is playing.
3. Pick your answer. You get instant feedback and a running score.
4. Turn on **Hard mode** for harder chord shapes, where you fill in the interval for every string yourself.

## Run it locally

Requires Node.js 18+.

```bash
git clone https://github.com/mattjaekeldesign/chordquiz.git
cd chordquiz
npm install
npm run dev
```

Then open http://localhost:3000. The dev server listens on all interfaces, so you can also open it on your phone at `http://<your-computer-ip>:3000`.

Other scripts:

- `npm run build` creates a production build
- `npm start` serves the production build
- `npm run lint` runs ESLint

## Deployment

The app is hosted on Vercel and connected to this repo. Every push to `master` deploys to production automatically, and other branches get preview URLs.

To deploy by hand with the [Vercel CLI](https://vercel.com/docs/cli):

```bash
npm i -g vercel
vercel --prod
```

## Tech

Next.js 14 (App Router), React 18, TypeScript and Tailwind CSS. Chord shapes and their intervals live in `data/chords.ts`.
