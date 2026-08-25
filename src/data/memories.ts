// ============================================================
// แก้ไขข้อมูลของคุณตรงนี้ได้เลย — ไม่ต้องแตะไฟล์ Component หลัก
// ============================================================

export const couple = {
  name: "Your Name",
  partner: "Partner Name",
  // รูปแบบวันที่: "YYYY-MM-DDTHH:mm:ss"
  anniversaryDate: "2024-02-14T00:00:00",
};

export const openingText = {
  eyebrow: "For You",
  title: "Happy Anniversary",
  subtitle: "A little story about us",
  cta: "Start Our Story",
};

export const musicUrl = "/music/song.mp3";

export const introText = {
  lines: [
    "It all started with you.",
    "And somehow...",
    "you became my favorite part\nof every day.",
  ],
  cta: "Continue",
};

export const photos = {
  main: "/images/photo1.jpg",
  secondary: ["/images/photo2.jpg", "/images/photo3.jpg", "/images/photo4.jpg"],
  caption: "Every picture, a little proof that we happened.",
};

export const counterText = {
  intro: "We've been together for",
  days: "Days",
  hours: "Hours",
  minutes: "Minutes",
  seconds: "Seconds",
};

export const timelineTitle = "Our Timeline";
export const memoryCardsTitle = "Little Moments";

export type Memory = {
  date: string;
  year: string;
  title: string;
  description: string;
  image: string;
};

export const memories: Memory[] = [
  {
    date: "February 14, 2024",
    year: "2024",
    title: "The Beginning",
    description: "The day our story began.",
    image: "/images/photo1.jpg",
  },
  {
    date: "June 20, 2024",
    year: "2024",
    title: "Our First Trip",
    description: "A memory I will always keep.",
    image: "/images/photo2.jpg",
  },
  {
    date: "December 25, 2024",
    year: "2025",
    title: "More Memories",
    description: "So many quiet, ordinary days that became extraordinary.",
    image: "/images/photo3.jpg",
  },
  {
    date: "February 14, 2026",
    year: "2026",
    title: "Still Choosing You",
    description: "Every day, again and again, still you.",
    image: "/images/photo4.jpg",
  },
];

export const memoryCards = [
  {
    title: "Our First Photo",
    body: "That day became one of my favorite memories.",
    image: "/images/photo1.jpg",
  },
  {
    title: "That Rainy Evening",
    body: "We got soaked and laughed the whole way home.",
    image: "/images/photo2.jpg",
  },
  {
    title: "The Little Café",
    body: "Two coffees, one table, hours that felt like minutes.",
    image: "/images/photo3.jpg",
  },
];

export type GalaxyPhoto = {
  id: string;
  image: string;
  date: string;
  caption: string;
  // Orbit radius as a % of the scene's half-width/height, and starting angle in degrees.
  radius: number;
  angle: number;
  size: number;
};

export const galaxyPhotos: GalaxyPhoto[] = [
  {
    id: "g1",
    image: "/images/photo1.jpg",
    date: "14/02/2024",
    caption: "The day our story began.",
    radius: 0.92,
    angle: 20,
    size: 76,
  },
  {
    id: "g2",
    image: "/images/photo2.jpg",
    date: "20/06/2024",
    caption: "A trip I will always keep.",
    radius: 0.62,
    angle: 150,
    size: 92,
  },
  {
    id: "g3",
    image: "/images/photo3.jpg",
    date: "25/12/2024",
    caption: "So many ordinary days, made extraordinary.",
    radius: 1.0,
    angle: 255,
    size: 68,
  },
  {
    id: "g4",
    image: "/images/photo4.jpg",
    date: "14/02/2026",
    caption: "Still choosing you, every day.",
    radius: 0.75,
    angle: 320,
    size: 84,
  },
  {
    id: "g5",
    image: "/images/photo1.jpg",
    date: "02/04/2025",
    caption: "A quiet Sunday that felt like magic.",
    radius: 0.48,
    angle: 60,
    size: 58,
  },
  {
    id: "g6",
    image: "/images/photo3.jpg",
    date: "09/09/2025",
    caption: "You, the best part of every plan.",
    radius: 0.85,
    angle: 200,
    size: 64,
  },
];

export const galaxyIntro = {
  eyebrow: "Our Little Universe",
  title: "A galaxy made of us",
  hint: "Scroll or pinch to zoom \u00b7 tap a star to open a memory",
};

export const secretMessage = {
  prompt: "There is something\nI still want to tell you...",
  cta: "Open My Message",
  lines: [
    "Thank you for being\npart of my life.",
    "Thank you for all\nthe little moments.",
    "And thank you\nfor staying.",
  ],
  closing: "I hope we create\nmany more memories together.",
};

export const finalScene = {
  title: "Happy Anniversary",
  body: "Here's to us\nand all the memories\nstill waiting to be made.",
  signOff: "Always,",
};
