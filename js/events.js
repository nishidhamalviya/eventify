/* ==========================================================
   Eventify – Event data
   Each event: id, title, category, date (ISO, local time),
   venue, city, price (0 = free), seats, featured, emoji,
   gradient (fallback), image, short, description, schedule[]
   ========================================================== */
const EVENTS = [
  {
    id: 1,
    title: "CodeSprint Hackathon 2026",
    category: "Tech",
    date: "2026-12-05T09:00:00",
    venue: "Tech Park Convention Hall",
    city: "Bhubaneswar",
    price: 0,
    seats: 200,
    featured: true,
    emoji: "💻",
    gradient: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    image: "https://picsum.photos/seed/hackathon/800/520",
    short: "36 hours of building, mentoring and pizza. Ship a project and win prizes worth ₹5 lakh.",
    description:
      "CodeSprint is the region's biggest student hackathon. Form teams of up to four, pick a theme — AI, FinTech, GreenTech or Social Good — and build a working prototype with guidance from industry mentors. Top teams pitch to a panel of founders and investors.",
    schedule: [
      "09:00 AM – Registration & breakfast",
      "11:00 AM – Opening keynote & theme reveal",
      "12:00 PM – Hacking begins",
      "Day 2, 06:00 PM – Final demos & awards"
    ]
  },
  {
    id: 2,
    title: "Sunset Beats Music Festival",
    category: "Music",
    date: "2026-12-12T17:00:00",
    venue: "Puri Beachfront Arena",
    city: "Puri",
    price: 999,
    seats: 1500,
    featured: true,
    emoji: "🎵",
    gradient: "linear-gradient(135deg,#f43f5e,#f97316)",
    image: "https://picsum.photos/seed/musicfest/800/520",
    short: "An evening of live bands, DJs and food stalls on the beach as the sun sets.",
    description:
      "Dance by the sea with 12 live acts across two stages — indie, electronic and folk fusion. Enjoy curated food trucks, art installations and a sparkling sunset finale.",
    schedule: [
      "05:00 PM – Gates open",
      "06:00 PM – Indie & folk stage",
      "08:30 PM – Headliner performance",
      "10:30 PM – DJ finale"
    ]
  },
  {
    id: 3,
    title: "UI/UX Design Workshop",
    category: "Workshop",
    date: "2026-11-28T10:00:00",
    venue: "Creative Studio, Jaydev Vihar",
    city: "Bhubaneswar",
    price: 499,
    seats: 60,
    featured: false,
    emoji: "🎨",
    gradient: "linear-gradient(135deg,#06b6d4,#3b82f6)",
    image: "https://picsum.photos/seed/designworkshop/800/520",
    short: "Hands-on workshop: learn wireframing, prototyping and usability testing in Figma.",
    description:
      "A beginner-friendly full-day workshop covering design thinking, wireframes, visual hierarchy and interactive prototypes. Bring a laptop — you'll leave with a portfolio-ready case study.",
    schedule: [
      "10:00 AM – Design thinking basics",
      "12:00 PM – Wireframing lab",
      "02:00 PM – Prototyping in Figma",
      "04:30 PM – Critique & feedback"
    ]
  },
  {
    id: 4,
    title: "Startup Pitch Night",
    category: "Business",
    date: "2026-12-19T18:00:00",
    venue: "Innovation Hub Auditorium",
    city: "Bhubaneswar",
    price: 199,
    seats: 150,
    featured: true,
    emoji: "🚀",
    gradient: "linear-gradient(135deg,#10b981,#14b8a6)",
    image: "https://picsum.photos/seed/startuppitch/800/520",
    short: "Ten early-stage startups pitch live to investors. Network over dinner afterwards.",
    description:
      "Watch founders present their ideas in five-minute pitches, followed by Q&A from a panel of angel investors. Stay for the networking dinner and meet the people building tomorrow's companies.",
    schedule: [
      "06:00 PM – Welcome & networking",
      "07:00 PM – Startup pitches",
      "08:30 PM – Investor panel",
      "09:00 PM – Dinner & networking"
    ]
  },
  {
    id: 5,
    title: "Inter-College Cricket Cup",
    category: "Sports",
    date: "2027-01-10T08:00:00",
    venue: "Kalinga Stadium Grounds",
    city: "Bhubaneswar",
    price: 0,
    seats: 800,
    featured: false,
    emoji: "🏏",
    gradient: "linear-gradient(135deg,#84cc16,#22c55e)",
    image: "https://picsum.photos/seed/cricketcup/800/520",
    short: "16 colleges, one trophy. Cheer for your team in this knockout T20 tournament.",
    description:
      "Sixteen college teams compete in a high-energy knockout T20 series. Free entry for spectators, with food counters, fan zones and live commentary all day.",
    schedule: [
      "08:00 AM – Opening ceremony",
      "09:00 AM – Quarter-finals",
      "02:00 PM – Semi-finals",
      "05:00 PM – Final & trophy ceremony"
    ]
  },
  {
    id: 6,
    title: "AI & Machine Learning Summit",
    category: "Tech",
    date: "2027-01-23T09:30:00",
    venue: "Grand Convention Centre",
    city: "Bhubaneswar",
    price: 1499,
    seats: 400,
    featured: true,
    emoji: "🤖",
    gradient: "linear-gradient(135deg,#0ea5e9,#6366f1)",
    image: "https://picsum.photos/seed/aisummit/800/520",
    short: "Talks and live demos from leading researchers and engineers on the future of AI.",
    description:
      "A one-day summit with keynotes, technical deep-dives and live demos on generative AI, responsible AI and MLOps. Includes lunch, swag and access to recorded sessions.",
    schedule: [
      "09:30 AM – Keynote: The AI decade",
      "11:30 AM – Technical tracks",
      "02:00 PM – Live demos",
      "04:30 PM – Panel & networking"
    ]
  },
  {
    id: 7,
    title: "Street Food & Culture Carnival",
    category: "Festival",
    date: "2027-01-30T11:00:00",
    venue: "Ekamra Haat Grounds",
    city: "Bhubaneswar",
    price: 0,
    seats: 2000,
    featured: false,
    emoji: "🎪",
    gradient: "linear-gradient(135deg,#f59e0b,#ef4444)",
    image: "https://picsum.photos/seed/foodcarnival/800/520",
    short: "Regional cuisines, folk dance, handicraft stalls and games for the whole family.",
    description:
      "Celebrate local culture with over 60 food stalls, folk dance performances, handicraft exhibitions and kids' activities. Free entry — bring your family and friends!",
    schedule: [
      "11:00 AM – Gates open",
      "01:00 PM – Folk dance showcase",
      "04:00 PM – Cooking contest",
      "07:00 PM – Cultural night"
    ]
  },
  {
    id: 8,
    title: "Photography Masterclass",
    category: "Workshop",
    date: "2027-02-07T10:00:00",
    venue: "Art Gallery Hall",
    city: "Cuttack",
    price: 799,
    seats: 40,
    featured: false,
    emoji: "📸",
    gradient: "linear-gradient(135deg,#a855f7,#ec4899)",
    image: "https://picsum.photos/seed/photoclass/800/520",
    short: "Learn composition, lighting and editing from an award-winning photographer.",
    description:
      "A practical masterclass with a morning classroom session and an afternoon outdoor shoot. Understand exposure, composition, natural light and basic editing workflow.",
    schedule: [
      "10:00 AM – Camera fundamentals",
      "12:00 PM – Composition & light",
      "02:00 PM – Outdoor photo walk",
      "04:30 PM – Editing session"
    ]
  }
];
