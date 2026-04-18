import type { ChartConfig } from "@/components/ui/chart";

export const events = [
  {
    id: "evt-1",
    type: "workshops",
    title: "Design Systems Meetup",
    date: "2025-07-15",
    location: "AI Auditorium C",
    image: "https://images.unsplash.com/photo-1566438480900-0609be27a4be?fm=jpg&q=60&w=3000&auto=format&fit=crop",
    organizer: { handle: "@nextjs", description: "The React Framework – created and maintained by @vercel.", joined: "December 2021" },
  },
  {
    id: "evt-2",
    type: "workshops",
    title: "Advanced React Patterns",
    date: "2025-07-22",
    location: "Tech Hall B",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?fm=jpg&q=60&w=3000&auto=format&fit=crop",
    organizer: { handle: "@reactjs", description: "A JavaScript library for building user interfaces.", joined: "May 2013" },
  },
  {
    id: "evt-3",
    type: "webinar",
    title: "Scaling Next.js Apps",
    date: "2025-08-01",
    location: "Online Webinar",
    image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?fm=jpg&q=60&w=3000&auto=format&fit=crop",
    organizer: { handle: "@vercel", description: "Develop. Preview. Ship.", joined: "April 2020" },
  },
  {
    id: "evt-4",
    type: "cultural",
    title: "Annual Cultural Fest",
    date: "2025-08-10",
    location: "Open Grounds",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?fm=jpg&q=60&w=3000&auto=format&fit=crop",
    organizer: { handle: "@campuslife", description: "Celebrating diversity and creativity.", joined: "January 2019" },
  },
  {
    id: "evt-5",
    type: "cultural",
    title: "Tech Innovation Summit",
    date: "2025-08-17",
    location: "Main Hall",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?fm=jpg&q=60&w=3000&auto=format&fit=crop",
    organizer: { handle: "@techsummit", description: "Bringing together innovators and creators.", joined: "March 2020" },
  },
  {
    id: "evt-6",
    type: "workshops",
    title: "AI & Machine Learning Workshop",
    date: "2025-08-24",
    location: "Lab Block B",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?fm=jpg&q=60&w=3000&auto=format&fit=crop",
    organizer: { handle: "@aiworkshop", description: "Hands-on AI/ML training for students.", joined: "June 2022" },
  },
];

export const chartConfig = {
  visitors: { label: "Score" },
  chrome: { label: "Mathematics", color: "var(--chart-1)" },
  safari: { label: "Physics", color: "var(--chart-2)" },
  firefox: { label: "Chemistry", color: "var(--chart-3)" },
  edge: { label: "English", color: "var(--chart-4)" },
  other: { label: "History", color: "var(--chart-5)" },
} satisfies ChartConfig;

export const chartData = [
  { browser: "chrome", visitors: 87, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 74, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 91, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 68, fill: "var(--color-edge)" },
  { browser: "other", visitors: 82, fill: "var(--color-other)" },
];
