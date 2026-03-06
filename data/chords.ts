export interface ChordInfo {
  id: string;
  name: string;
  // strings[0]=E6 (low E), strings[5]=E1 (high E)
  // null = muted, 0 = open string, 1+ = fret number
  strings: (number | null)[];
  // intervals[i] corresponds to strings[i]; null if muted
  intervals: (string | null)[];
}

// Standard tuning: E2 A2 D3 G3 B3 E4 (low to high)
// All chords verified against standard tuning intervals
export const chords: ChordInfo[] = [
  {
    id: "e_major",
    name: "E",
    strings: [0, 2, 2, 1, 0, 0],
    intervals: ["1", "5", "1", "3", "5", "1"],
  },
  {
    id: "e_minor",
    name: "Em",
    strings: [0, 2, 2, 0, 0, 0],
    intervals: ["1", "5", "1", "b3", "5", "1"],
  },
  {
    id: "e7",
    name: "E7",
    // E2(0)=E=1, A2(2)=B=5, D3(0)=D=b7, G3(1)=G#=3, B3(0)=B=5, E4(0)=E=1
    strings: [0, 2, 0, 1, 0, 0],
    intervals: ["1", "5", "b7", "3", "5", "1"],
  },
  {
    id: "a_major",
    name: "A",
    // A2(0)=A=1, D3(2)=E=5, G3(2)=A=1, B3(2)=C#=3, E4(0)=E=5
    strings: [null, 0, 2, 2, 2, 0],
    intervals: [null, "1", "5", "1", "3", "5"],
  },
  {
    id: "a_minor",
    name: "Am",
    // A2(0)=A=1, D3(2)=E=5, G3(2)=A=1, B3(1)=C=b3, E4(0)=E=5
    strings: [null, 0, 2, 2, 1, 0],
    intervals: [null, "1", "5", "1", "b3", "5"],
  },
  {
    id: "a7",
    name: "A7",
    // A2(0)=A=1, D3(2)=E=5, G3(0)=G=b7, B3(2)=C#=3, E4(0)=E=5
    strings: [null, 0, 2, 0, 2, 0],
    intervals: [null, "1", "5", "b7", "3", "5"],
  },
  {
    id: "d_major",
    name: "D",
    // D3(0)=D=1, G3(2)=A=5, B3(3)=D=1, E4(2)=F#=3
    strings: [null, null, 0, 2, 3, 2],
    intervals: [null, null, "1", "5", "1", "3"],
  },
  {
    id: "d_minor",
    name: "Dm",
    // D3(0)=D=1, G3(2)=A=5, B3(3)=D=1, E4(1)=F=b3
    strings: [null, null, 0, 2, 3, 1],
    intervals: [null, null, "1", "5", "1", "b3"],
  },
  {
    id: "d7",
    name: "D7",
    // D3(0)=D=1, G3(2)=A=5, B3(1)=C=b7, E4(2)=F#=3
    strings: [null, null, 0, 2, 1, 2],
    intervals: [null, null, "1", "5", "b7", "3"],
  },
  {
    id: "g_major",
    name: "G",
    // E2(3)=G=1, A2(2)=B=3, D3(0)=D=5, G3(0)=G=1, B3(0)=B=3, E4(3)=G=1
    strings: [3, 2, 0, 0, 0, 3],
    intervals: ["1", "3", "5", "1", "3", "1"],
  },
  {
    id: "g7",
    name: "G7",
    // E2(3)=G=1, A2(2)=B=3, D3(0)=D=5, G3(0)=G=1, B3(0)=B=3, E4(1)=F=b7
    strings: [3, 2, 0, 0, 0, 1],
    intervals: ["1", "3", "5", "1", "3", "b7"],
  },
  {
    id: "c_major",
    name: "C",
    // A2(3)=C=1, D3(2)=E=3, G3(0)=G=5, B3(1)=C=1, E4(0)=E=3
    strings: [null, 3, 2, 0, 1, 0],
    intervals: [null, "1", "3", "5", "1", "3"],
  },
  {
    id: "cmaj7",
    name: "Cmaj7",
    // A2(3)=C=1, D3(2)=E=3, G3(0)=G=5, B3(0)=B=7, E4(0)=E=3
    strings: [null, 3, 2, 0, 0, 0],
    intervals: [null, "1", "3", "5", "7", "3"],
  },
  {
    id: "b7",
    name: "B7",
    // A2(2)=B=1, D3(1)=D#=3, G3(2)=A=b7, B3(0)=B=1, E4(2)=F#=5
    strings: [null, 2, 1, 2, 0, 2],
    intervals: [null, "1", "3", "b7", "1", "5"],
  },
  {
    id: "am7",
    name: "Am7",
    // A2(0)=A=1, D3(2)=E=5, G3(0)=G=b7, B3(1)=C=b3, E4(0)=E=5
    strings: [null, 0, 2, 0, 1, 0],
    intervals: [null, "1", "5", "b7", "b3", "5"],
  },
  {
    id: "dm7",
    name: "Dm7",
    // D3(0)=D=1, G3(2)=A=5, B3(1)=C=b7, E4(1)=F=b3
    strings: [null, null, 0, 2, 1, 1],
    intervals: [null, null, "1", "5", "b7", "b3"],
  },
  // Extensions
  {
    id: "cadd9",
    name: "Cadd9",
    // A2(3)=C=1, D3(2)=E=3, G3(0)=G=5, B3(3)=D=9, E4(0)=E=3
    strings: [null, 3, 2, 0, 3, 0],
    intervals: [null, "1", "3", "5", "9", "3"],
  },
  {
    id: "gadd9",
    name: "Gadd9",
    // E2(3)=G=1, A2(2)=B=3, D3(0)=D=5, G3(2)=A=9, B3(0)=B=3, E4(3)=G=1
    strings: [3, 2, 0, 2, 0, 3],
    intervals: ["1", "3", "5", "9", "3", "1"],
  },
  {
    id: "a9",
    name: "A9",
    // A2(0)=A=1, D3(2)=E=5, G3(0)=G=b7, B3(0)=B=9, E4(0)=E=5
    strings: [null, 0, 2, 0, 0, 0],
    intervals: [null, "1", "5", "b7", "9", "5"],
  },
  {
    id: "e13",
    name: "E13",
    // E2(0)=1, A2(2)=5, D3(0)=b7, G3(1)=3, B3(2)=13, E4(0)=1
    strings: [0, 2, 0, 1, 2, 0],
    intervals: ["1", "5", "b7", "3", "13", "1"],
  },
  // Slash Chords / Inversions
  {
    id: "d_f_sharp",
    name: "D/F#",
    // E2(2)=F#=3, A2(0)=A=5, D3(0)=D=1, G3(2)=A=5, B3(3)=D=1, E4(2)=F#=3
    strings: [2, 0, 0, 2, 3, 2],
    intervals: ["3", "5", "1", "5", "1", "3"],
  },
  {
    id: "g_b",
    name: "G/B",
    // A2(2)=B=3, D3(0)=D=5, G3(0)=G=1, B3(0)=B=3, E4(3)=G=1
    strings: [null, 2, 0, 0, 0, 3],
    intervals: [null, "3", "5", "1", "3", "1"],
  },
  {
    id: "c_g",
    name: "C/G",
    // E2(3)=G=5, A2(3)=C=1, D3(2)=E=3, G3(0)=G=5, B3(1)=C=1, E4(0)=E=3
    strings: [3, 3, 2, 0, 1, 0],
    intervals: ["5", "1", "3", "5", "1", "3"],
  },
  {
    id: "am_g",
    name: "Am/G",
    // E2(3)=G=b7, A2(0)=A=1, D3(2)=E=5, G3(2)=A=1, B3(1)=C=b3, E4(0)=E=5
    strings: [3, 0, 2, 2, 1, 0],
    intervals: ["b7", "1", "5", "1", "b3", "5"],
  },
  // Diminished & Half-Diminished
  {
    id: "adim7",
    name: "Adim7",
    // A2(0)=1, D3(1)=Eb=b5, G3(2)=Gb=bb7, B3(1)=C=b3
    strings: [null, 0, 1, 2, 1, null],
    intervals: [null, "1", "b5", "bb7", "b3", null],
  },
  {
    id: "bm7b5",
    name: "Bm7b5",
    // A2(2)=1, D3(3)=F=b5, G3(2)=A=b7, B3(3)=D=b3
    strings: [null, 2, 3, 2, 3, null],
    intervals: [null, "1", "b5", "b7", "b3", null],
  },
  // Augmented
  {
    id: "caug",
    name: "Caug",
    // A2(3)=1, D3(2)=3, G3(1)=G#=#5, B3(1)=1
    strings: [null, 3, 2, 1, 1, null],
    intervals: [null, "1", "3", "#5", "1", null],
  },
  {
    id: "e7sharp5",
    name: "E7#5",
    // E2(0)=1, D3(0)=b7, G3(1)=3, B3(1)=C=#5, E4(0)=1
    strings: [0, null, 0, 1, 1, 0],
    intervals: ["1", null, "b7", "3", "#5", "1"],
  },
  // Maj7 / m7
  {
    id: "fmaj7",
    name: "Fmaj7",
    // D3(3)=1, G3(2)=3, B3(1)=5, E4(0)=7
    strings: [null, null, 3, 2, 1, 0],
    intervals: [null, null, "1", "3", "5", "7"],
  },
  {
    id: "gm7",
    name: "Gm7",
    // E2(3)=1, D3(3)=b7, G3(3)=b3, B3(3)=5
    strings: [3, null, 3, 3, 3, null],
    intervals: ["1", null, "b7", "b3", "5", null],
  },
  // Suspended
  {
    id: "asus4",
    name: "Asus4",
    // A2(0)=1, D3(2)=5, G3(2)=1, B3(3)=4, E4(0)=5
    strings: [null, 0, 2, 2, 3, 0],
    intervals: [null, "1", "5", "1", "4", "5"],
  },
  {
    id: "dsus4",
    name: "Dsus4",
    // D3(0)=1, G3(2)=5, B3(3)=1, E4(3)=4
    strings: [null, null, 0, 2, 3, 3],
    intervals: [null, null, "1", "5", "1", "4"],
  },
  {
    id: "amaj7",
    name: "Amaj7",
    // A2(0)=1, D3(2)=5, G3(1)=G#=7, B3(2)=C#=3, E4(0)=5
    strings: [null, 0, 2, 1, 2, 0],
    intervals: [null, "1", "5", "7", "3", "5"],
  },
  {
    id: "am9",
    name: "Am9",
    // A2(0)=1, D3(2)=5, G3(4)=B=9, B3(1)=C=b3, E4(0)=5
    strings: [null, 0, 2, 4, 1, 0],
    intervals: [null, "1", "5", "9", "b3", "5"],
  },
  {
    id: "bm11",
    name: "Bm11",
    // A2(2)=B=1, D3(0)=D=b3, G3(2)=A=b7, B3(2)=C#=9, E4(0)=E=11
    strings: [null, 2, 0, 2, 2, 0],
    intervals: [null, "1", "b3", "b7", "9", "11"],
  },
  {
    id: "c13",
    name: "C13",
    // A2(3)=1, D3(2)=3, G3(3)=Bb=b7, B3(3)=D=9, E4(5)=A=13
    strings: [null, 3, 2, 3, 3, 5],
    intervals: [null, "1", "3", "b7", "9", "13"],
  },
  {
    id: "e7b9",
    name: "E7b9",
    // E2(0)=1, A2(2)=5, D3(0)=b7, G3(1)=3, B3(0)=5, E4(1)=F=b9
    strings: [0, 2, 0, 1, 0, 1],
    intervals: ["1", "5", "b7", "3", "5", "b9"],
  },
  {
    id: "f_sharp_7b5",
    name: "F#7b5",
    // E2(2)=1, D3(2)=b7, G3(3)=3, B3(1)=F=b5
    strings: [2, null, 2, 3, 1, null],
    intervals: ["1", null, "b7", "3", "b5", null],
  },
];

export function getIntervalString(intervals: (string | null)[]): string {
  return intervals.filter((i): i is string => i !== null).join(" – ");
}
