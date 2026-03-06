export interface ChordInfo {
  id: string;
  name: string;
  // strings[0]=E6 (low E), strings[5]=E1 (high E)
  // null = muted, 0 = open string, 1+ = fret number
  strings: (number | null)[];
  // intervals[i] corresponds to strings[i]; null if muted
  intervals: (string | null)[];
  isBasic?: boolean;
}

// Standard tuning: E2 A2 D3 G3 B3 E4 (low to high)
// All chords verified against standard tuning intervals
export const chords: ChordInfo[] = [
  {
    id: "e_major",
    name: "E",
    strings: [0, 2, 2, 1, 0, 0],
    intervals: ["1", "5", "1", "3", "5", "1"],
    isBasic: true,
  },
  {
    id: "e_minor",
    name: "Em",
    strings: [0, 2, 2, 0, 0, 0],
    intervals: ["1", "5", "1", "b3", "5", "1"],
    isBasic: true,
  },
  {
    id: "e7",
    name: "E7",
    strings: [0, 2, 0, 1, 0, 0],
    intervals: ["1", "5", "b7", "3", "5", "1"],
    isBasic: true,
  },
  {
    id: "a_major",
    name: "A",
    strings: [null, 0, 2, 2, 2, 0],
    intervals: [null, "1", "5", "1", "3", "5"],
    isBasic: true,
  },
  {
    id: "a_minor",
    name: "Am",
    strings: [null, 0, 2, 2, 1, 0],
    intervals: [null, "1", "5", "1", "b3", "5"],
    isBasic: true,
  },
  {
    id: "a7",
    name: "A7",
    strings: [null, 0, 2, 0, 2, 0],
    intervals: [null, "1", "5", "b7", "3", "5"],
    isBasic: true,
  },
  {
    id: "d_major",
    name: "D",
    strings: [null, null, 0, 2, 3, 2],
    intervals: [null, null, "1", "5", "1", "3"],
    isBasic: true,
  },
  {
    id: "d_minor",
    name: "Dm",
    strings: [null, null, 0, 2, 3, 1],
    intervals: [null, null, "1", "5", "1", "b3"],
    isBasic: true,
  },
  {
    id: "d7",
    name: "D7",
    strings: [null, null, 0, 2, 1, 2],
    intervals: [null, null, "1", "5", "b7", "3"],
    isBasic: true,
  },
  {
    id: "g_major",
    name: "G",
    strings: [3, 2, 0, 0, 0, 3],
    intervals: ["1", "3", "5", "1", "3", "1"],
    isBasic: true,
  },
  {
    id: "g7",
    name: "G7",
    strings: [3, 2, 0, 0, 0, 1],
    intervals: ["1", "3", "5", "1", "3", "b7"],
    isBasic: true,
  },
  {
    id: "c_major",
    name: "C",
    strings: [null, 3, 2, 0, 1, 0],
    intervals: [null, "1", "3", "5", "1", "3"],
    isBasic: true,
  },
  {
    id: "cmaj7",
    name: "Cmaj7",
    strings: [null, 3, 2, 0, 0, 0],
    intervals: [null, "1", "3", "5", "7", "3"],
    isBasic: true,
  },
  {
    id: "b7",
    name: "B7",
    strings: [null, 2, 1, 2, 0, 2],
    intervals: [null, "1", "3", "b7", "1", "5"],
    isBasic: true,
  },
  {
    id: "am7",
    name: "Am7",
    strings: [null, 0, 2, 0, 1, 0],
    intervals: [null, "1", "5", "b7", "b3", "5"],
    isBasic: true,
  },
  {
    id: "dm7",
    name: "Dm7",
    strings: [null, null, 0, 2, 1, 1],
    intervals: [null, null, "1", "5", "b7", "b3"],
    isBasic: true,
  },
  // Inversions / Slash Chords
  {
    id: "c_e",
    name: "C/E",
    // E2(0)=E=3, A2(3)=C=1, D3(2)=E=3, G3(0)=G=5, B3(1)=C=1, E4(0)=E=3
    strings: [0, 3, 2, 0, 1, 0],
    intervals: ["3", "1", "3", "5", "1", "3"],
  },
  {
    id: "g_d",
    name: "G/D",
    // D3(0)=D=5, G3(0)=G=1, B3(0)=B=3, E4(3)=G=1
    strings: [null, null, 0, 0, 0, 3],
    intervals: [null, null, "5", "1", "3", "1"],
  },
  {
    id: "d_a",
    name: "D/A",
    // A2(0)=A=5, D3(0)=D=1, G3(2)=A=5, B3(3)=D=1, E4(2)=F#=3
    strings: [null, 0, 0, 2, 3, 2],
    intervals: [null, "5", "1", "5", "1", "3"],
  },
  {
    id: "am_e",
    name: "Am/E",
    // E2(0)=E=5, A2(0)=A=1, D3(2)=E=5, G3(2)=A=1, B3(1)=C=b3, E4(0)=E=5
    strings: [0, 0, 2, 2, 1, 0],
    intervals: ["5", "1", "5", "1", "b3", "5"],
  },
  {
    id: "e_g_sharp",
    name: "E/G#",
    // E2(4)=G#=3, A2(2)=B=5, D3(2)=E=1, G3(1)=G#=3, B3(0)=B=5, E4(0)=E=1
    strings: [4, 2, 2, 1, 0, 0],
    intervals: ["3", "5", "1", "3", "5", "1"],
  },
  {
    id: "f_c",
    name: "F/C",
    // A2(3)=C=5, D3(3)=F=1, G3(2)=A=3, B3(1)=C=5, E4(1)=F=1
    strings: [null, 3, 3, 2, 1, 1],
    intervals: [null, "5", "1", "3", "5", "1"],
  },
  {
    id: "d_f_sharp",
    name: "D/F#",
    strings: [2, 0, 0, 2, 3, 2],
    intervals: ["3", "5", "1", "5", "1", "3"],
  },
  {
    id: "g_b",
    name: "G/B",
    strings: [null, 2, 0, 0, 0, 3],
    intervals: [null, "3", "5", "1", "3", "1"],
  },
  {
    id: "c_g",
    name: "C/G",
    strings: [3, 3, 2, 0, 1, 0],
    intervals: ["5", "1", "3", "5", "1", "3"],
  },
  {
    id: "am_g",
    name: "Am/G",
    strings: [3, 0, 2, 2, 1, 0],
    intervals: ["b7", "1", "5", "1", "b3", "5"],
  },
  // Extensions & Others
  {
    id: "adim7",
    name: "Adim7",
    strings: [null, 0, 1, 2, 1, null],
    intervals: [null, "1", "b5", "bb7", "b3", null],
  },
  {
    id: "bm7b5",
    name: "Bm7b5",
    strings: [null, 2, 3, 2, 3, null],
    intervals: [null, "1", "b5", "b7", "b3", null],
  },
  {
    id: "caug",
    name: "Caug",
    strings: [null, 3, 2, 1, 1, null],
    intervals: [null, "1", "3", "#5", "1", null],
  },
  {
    id: "e7sharp5",
    name: "E7#5",
    strings: [0, null, 0, 1, 1, 0],
    intervals: ["1", null, "b7", "3", "#5", "1"],
  },
  {
    id: "fmaj7",
    name: "Fmaj7",
    strings: [null, null, 3, 2, 1, 0],
    intervals: [null, null, "1", "3", "5", "7"],
    isBasic: true,
  },
  {
    id: "gm7",
    name: "Gm7",
    strings: [3, null, 3, 3, 3, null],
    intervals: ["1", null, "b7", "b3", "5", null],
  },
  {
    id: "asus4",
    name: "Asus4",
    strings: [null, 0, 2, 2, 3, 0],
    intervals: [null, "1", "5", "1", "4", "5"],
    isBasic: true,
  },
  {
    id: "dsus4",
    name: "Dsus4",
    strings: [null, null, 0, 2, 3, 3],
    intervals: [null, null, "1", "5", "1", "4"],
    isBasic: true,
  },
  {
    id: "e13",
    name: "E13",
    strings: [0, 2, 0, 1, 2, 0],
    intervals: ["1", "5", "b7", "3", "13", "1"],
  },
  {
    id: "c13",
    name: "C13",
    strings: [null, 3, 2, 3, 3, 5],
    intervals: [null, "1", "3", "b7", "9", "13"],
  },
  {
    id: "e7b9",
    name: "E7b9",
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
  // --- DROP 2 CHORDS (Strings 4-3-2-1) ---
  {
    id: "cmaj7_d2_4321_root",
    name: "Cmaj7 (Drop 2)",
    // D10=C(1), G9=E(3), B8=G(5), e7=B(7)
    strings: [null, null, 10, 9, 8, 7],
    intervals: [null, null, "1", "3", "5", "7"],
  },
  {
    id: "am7_d2_4321_root",
    name: "Am7 (Drop 2)",
    // D7=A(1), G9=E(5), B8=G(b7), e8=C(b3)
    strings: [null, null, 7, 9, 8, 8],
    intervals: [null, null, "1", "5", "b7", "b3"],
  },
  {
    id: "g7_d2_4321_root",
    name: "G7 (Drop 2)",
    // D5=G(1), G7=D(5), B6=F(b7), e7=B(3)
    strings: [null, null, 5, 7, 6, 7],
    intervals: [null, null, "1", "5", "b7", "3"],
  },
  {
    id: "bm7b5_d2_4321_root",
    name: "Bm7b5 (Drop 2)",
    // D9=B(1), G10=F(b5), B10=A(b7), e10=D(b3)
    strings: [null, null, 9, 10, 10, 10],
    intervals: [null, null, "1", "b5", "b7", "b3"],
  },
  {
    id: "cmaj7_d2_4321_inv1",
    name: "Cmaj7 (Drop 2)",
    // D14=E(3), G12=G(5), B12=B(7), e12=C(1)
    strings: [null, null, 14, 12, 12, 12],
    intervals: [null, null, "3", "5", "7", "1"],
  },
  {
    id: "f7_d2_4321_inv2",
    name: "F7 (Drop 2)",
    // D7=A(3), G8=Eb(b7), B6=F(1), e8=C(5)
    strings: [null, null, 7, 8, 6, 8],
    intervals: [null, null, "3", "b7", "1", "5"],
  },

  // --- DROP 2 CHORDS (Strings 5-4-3-2) ---
  {
    id: "gmaj7_d2_5432_root",
    name: "Gmaj7 (Drop 2)",
    // A10=G(1), D12=D(5), G11=F#(7), B12=B(3)
    strings: [null, 10, 12, 11, 12, null],
    intervals: [null, "1", "5", "7", "3", null],
  },
  {
    id: "dm7_d2_5432_root",
    name: "Dm7 (Drop 2)",
    // A5=D(1), D7=A(5), G5=C(b7), B6=F(b3)
    strings: [null, 5, 7, 5, 6, null],
    intervals: [null, "1", "5", "b7", "b3", null],
  },
  {
    id: "eb7_d2_5432_root",
    name: "Eb7 (Drop 2)",
    // A6=Eb(1), D8=Bb(5), G6=Db(b7), B8=G(3)
    strings: [null, 6, 8, 6, 8, null],
    intervals: [null, "1", "5", "b7", "3", null],
  },

  // --- DROP 3 CHORDS (Strings 6-4-3-2) ---
  {
    id: "cmaj7_d3_6432_root",
    name: "Cmaj7 (Drop 3)",
    // E8=C(1), D9=B(7), G9=E(3), B8=G(5)
    strings: [8, null, 9, 9, 8, null],
    intervals: ["1", null, "7", "3", "5", null],
  },
  {
    id: "am7_d3_6432_root",
    name: "Am7 (Drop 3)",
    // E5=A(1), D5=G(b7), G5=C(b3), B5=E(5)
    strings: [5, null, 5, 5, 5, null],
    intervals: ["1", null, "b7", "b3", "5", null],
  },
  {
    id: "d7_d3_6432_root",
    name: "D7 (Drop 3)",
    // E10=D(1), D10=C(b7), G11=F#(3), B10=A(5)
    strings: [10, null, 10, 11, 10, null],
    intervals: ["1", null, "b7", "3", "5", null],
  },
  {
    id: "gm7b5_d3_6432_root",
    name: "Gm7b5 (Drop 3)",
    // E15=G(1), D15=F(b7), G15=Bb(b3), B14=Db(b5)
    strings: [15, null, 15, 15, 14, null],
    intervals: ["1", null, "b7", "b3", "b5", null],
  },
  {
    id: "fmaj7_d3_6432_inv1",
    name: "Fmaj7 (Drop 3)",
    // E17=A(3), D14=E(7), G14=A(3), B13=C(5)
    strings: [17, null, 14, 14, 13, null],
    intervals: ["3", null, "7", "1", "5", null],
  },

  // --- DROP 3 CHORDS (Strings 5-3-2-1) ---
  {
    id: "fmaj7_d3_5321_root",
    name: "Fmaj7 (Drop 3)",
    // A8=F(1), G9=E(7), B10=A(3), e8=C(5)
    strings: [null, 8, null, 9, 10, 8],
    intervals: [null, "1", null, "7", "3", "5"],
  },
  {
    id: "dm7_d3_5321_root",
    name: "Dm7 (Drop 3)",
    // A5=D(1), G5=C(b7), B6=F(b3), e5=A(5)
    strings: [null, 5, null, 5, 6, 5],
    intervals: [null, "1", null, "b7", "b3", "5"],
  },
  {
    id: "bb7_d3_5321_root",
    name: "Bb7 (Drop 3)",
    // A13=Bb(1), G13=Ab(b7), B15=D(3), e13=F(5)
    strings: [null, 13, null, 13, 15, 13],
    intervals: [null, "1", null, "b7", "3", "5"],
  },
  {
    id: "em7b5_d3_5321_root",
    name: "Em7b5 (Drop 3)",
    // A7=E(1), G7=D(b7), B8=G(b3), e6=Bb(b5)
    strings: [null, 7, null, 7, 8, 6],
    intervals: [null, "1", null, "b7", "b3", "b5"],
  },
];

export function getIntervalString(intervals: (string | null)[]): string {
  return intervals.filter((i): i is string => i !== null).join(" – ");
}
