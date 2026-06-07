import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Play, Award, ShieldAlert, LogOut, CheckCircle, User, Zap, Mail, Target } from "lucide-react";

// ─── FIFA WC 2026 GROUP STAGE FIXTURES ────────────────────────────────────────
const FIXTURES = [
  { id: 1, group: "A", home: "Mexico", away: "Ecuador", date: "2026-06-11T20:00:00-05:00", venue: "SoFi Stadium, Los Angeles" },
  { id: 2, group: "A", home: "USA", away: "Bolivia", date: "2026-06-12T17:00:00-05:00", venue: "MetLife Stadium, New York" },
  { id: 3, group: "A", home: "Ecuador", away: "Bolivia", date: "2026-06-16T14:00:00-05:00", venue: "Levi's Stadium, San Francisco" },
  { id: 4, group: "A", home: "USA", away: "Mexico", date: "2026-06-16T20:00:00-05:00", venue: "AT&T Stadium, Dallas" },
  { id: 5, group: "A", home: "Bolivia", away: "USA", date: "2026-06-20T20:00:00-05:00", venue: "Rose Bowl, Los Angeles" },
  { id: 6, group: "A", home: "Ecuador", away: "Mexico", date: "2026-06-20T20:00:00-05:00", venue: "Arrowhead Stadium, Kansas City" },
  { id: 7, group: "B", home: "Argentina", away: "Morocco", date: "2026-06-13T17:00:00-05:00", venue: "MetLife Stadium, New York" },
  { id: 8, group: "B", home: "Ukraine", away: "Iraq", date: "2026-06-13T20:00:00-05:00", venue: "AT&T Stadium, Dallas" },
  { id: 9, group: "B", home: "Morocco", away: "Iraq", date: "2026-06-17T14:00:00-05:00", venue: "Arrowhead Stadium, Kansas City" },
  { id: 10, group: "B", home: "Argentina", away: "Ukraine", date: "2026-06-17T20:00:00-05:00", venue: "Rose Bowl, Los Angeles" },
  { id: 11, group: "B", home: "Iraq", away: "Argentina", date: "2026-06-21T16:00:00-05:00", venue: "SoFi Stadium, Los Angeles" },
  { id: 12, group: "B", home: "Ukraine", away: "Morocco", date: "2026-06-21T16:00:00-05:00", venue: "Levi's Stadium, San Francisco" },
  { id: 13, group: "C", home: "France", away: "Saudi Arabia", date: "2026-06-13T14:00:00-05:00", venue: "BC Place, Vancouver" },
  { id: 14, group: "C", home: "Japan", away: "New Zealand", date: "2026-06-14T17:00:00-05:00", venue: "Estadio Akron, Guadalajara" },
  { id: 15, group: "C", home: "Saudi Arabia", away: "New Zealand", date: "2026-06-18T14:00:00-05:00", venue: "BC Place, Vancouver" },
  { id: 16, group: "C", home: "France", away: "Japan", date: "2026-06-18T20:00:00-05:00", venue: "AT&T Stadium, Dallas" },
  { id: 17, group: "C", home: "New Zealand", away: "France", date: "2026-06-22T16:00:00-05:00", venue: "Estadio Akron, Guadalajara" },
  { id: 18, group: "C", home: "Saudi Arabia", away: "Japan", date: "2026-06-22T16:00:00-05:00", venue: "MetLife Stadium, New York" },
  { id: 19, group: "D", home: "Spain", away: "South Korea", date: "2026-06-14T14:00:00-05:00", venue: "Rose Bowl, Los Angeles" },
  { id: 20, group: "D", home: "Germany", away: "Nigeria", date: "2026-06-14T20:00:00-05:00", venue: "AT&T Stadium, Dallas" },
  { id: 21, group: "D", home: "South Korea", away: "Nigeria", date: "2026-06-18T17:00:00-05:00", venue: "SoFi Stadium, Los Angeles" },
  { id: 22, group: "D", home: "Spain", away: "Germany", date: "2026-06-19T20:00:00-05:00", venue: "MetLife Stadium, New York" },
  { id: 23, group: "D", home: "Nigeria", away: "Spain", date: "2026-06-23T16:00:00-05:00", venue: "Arrowhead Stadium, Kansas City" },
  { id: 24, group: "D", home: "South Korea", away: "Germany", date: "2026-06-23T16:00:00-05:00", venue: "Levi's Stadium, San Francisco" },
  { id: 25, group: "E", home: "Brazil", away: "Serbia", date: "2026-06-15T17:00:00-05:00", venue: "Estadio Azteca, Mexico City" },
  { id: 26, group: "E", home: "England", away: "Australia", date: "2026-06-15T20:00:00-05:00", venue: "AT&T Stadium, Dallas" },
  { id: 27, group: "E", home: "Serbia", away: "Australia", date: "2026-06-19T14:00:00-05:00", venue: "Rose Bowl, Los Angeles" },
  { id: 28, group: "E", home: "Brazil", away: "England", date: "2026-06-19T17:00:00-05:00", venue: "SoFi Stadium, Los Angeles" },
  { id: 29, group: "E", home: "Australia", away: "Brazil", date: "2026-06-23T20:00:00-05:00", venue: "MetLife Stadium, New York" },
  { id: 30, group: "E", home: "England", away: "Serbia", date: "2026-06-23T20:00:00-05:00", venue: "BC Place, Vancouver" },
  { id: 31, group: "F", home: "Portugal", away: "Cameroon", date: "2026-06-15T14:00:00-05:00", venue: "BC Place, Vancouver" },
  { id: 32, group: "F", home: "Belgium", away: "Venezuela", date: "2026-06-16T17:00:00-05:00", venue: "Estadio Akron, Guadalajara" },
  { id: 33, group: "F", home: "Cameroon", away: "Venezuela", date: "2026-06-20T14:00:00-05:00", venue: "Estadio Azteca, Mexico City" },
  { id: 34, group: "F", home: "Portugal", away: "Belgium", date: "2026-06-20T17:00:00-05:00", venue: "Rose Bowl, Los Angeles" },
  { id: 35, group: "F", home: "Venezuela", away: "Portugal", date: "2026-06-24T16:00:00-05:00", venue: "SoFi Stadium, Los Angeles" },
  { id: 36, group: "F", home: "Cameroon", away: "Belgium", date: "2026-06-24T16:00:00-05:00", venue: "AT&T Stadium, Dallas" },
  { id: 37, group: "G", home: "Netherlands", away: "Uruguay", date: "2026-06-16T14:00:00-05:00", venue: "Estadio Azteca, Mexico City" },
  { id: 38, group: "G", home: "Colombia", away: "Senegal", date: "2026-06-17T17:00:00-05:00", venue: "BC Place, Vancouver" },
  { id: 39, group: "G", home: "Uruguay", away: "Senegal", date: "2026-06-21T14:00:00-05:00", venue: "Estadio Akron, Guadalajara" },
  { id: 40, group: "G", home: "Netherlands", away: "Colombia", date: "2026-06-21T20:00:00-05:00", venue: "MetLife Stadium, New York" },
  { id: 41, group: "G", home: "Senegal", away: "Netherlands", date: "2026-06-25T16:00:00-05:00", venue: "Rose Bowl, Los Angeles" },
  { id: 42, group: "G", home: "Uruguay", away: "Colombia", date: "2026-06-25T16:00:00-05:00", venue: "Estadio Azteca, Mexico City" },
  { id: 43, group: "H", home: "Italy", away: "Ecuador", date: "2026-06-17T14:00:00-05:00", venue: "AT&T Stadium, Dallas" },
  { id: 44, group: "H", home: "Croatia", away: "Iran", date: "2026-06-17T20:00:00-05:00", venue: "SoFi Stadium, Los Angeles" },
  { id: 45, group: "H", home: "Ecuador", away: "Iran", date: "2026-06-21T17:00:00-05:00", venue: "MetLife Stadium, New York" },
  { id: 46, group: "H", home: "Italy", away: "Croatia", date: "2026-06-22T20:00:00-05:00", venue: "BC Place, Vancouver" },
  { id: 47, group: "H", home: "Iran", away: "Italy", date: "2026-06-26T16:00:00-05:00", venue: "Estadio Akron, Guadalajara" },
  { id: 48, group: "H", home: "Croatia", away: "Ecuador", date: "2026-06-26T16:00:00-05:00", venue: "Arrowhead Stadium, Kansas City" },
];

const ADMIN_CODE = "PREDIZONE_ADMIN_2026";
const STORAGE_KEYS = { users: "pz_users", predictions: "pz_predictions", results: "pz_results", session: "pz_session", knockout: "pz_knockout" };
const ROUNDS = ["Round of 32", "Round of 16", "Quarterfinal", "Semifinal", "Third Place", "Final"];
const STUDY_YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

// ─── FLAGS ────────────────────────────────────────────────────────────────────
const FLAGS = {
  "Mexico": "🇲🇽", "Ecuador": "🇪🇨", "USA": "🇺🇸", "Bolivia": "🇧🇴", "Argentina": "🇦🇷", "Morocco": "🇲🇦",
  "Ukraine": "🇺🇦", "Iraq": "🇮🇶", "France": "🇫🇷", "Saudi Arabia": "🇸🇦", "Japan": "🇯🇵", "New Zealand": "🇳🇿",
  "Spain": "🇪🇸", "South Korea": "🇰🇷", "Germany": "🇩🇪", "Nigeria": "🇳🇬", "Brazil": "🇧🇷", "Serbia": "🇷🇸",
  "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "Australia": "🇦🇺", "Portugal": "🇵🇹", "Cameroon": "🇨🇲", "Belgium": "🇧🇪",
  "Venezuela": "🇻🇪", "Netherlands": "🇳🇱", "Uruguay": "🇺🇾", "Colombia": "🇨🇴", "Senegal": "🇸🇳",
  "Italy": "🇮🇹", "Croatia": "🇭🇷", "Iran": "🇮🇷", "Draw": "🤝"
};
const fl = t => FLAGS[t] || "🌍";

// Hero background video — hosted on Cloudinary CDN for Vercel streaming compatibility
// ⚠️  Paste your Cloudinary video URL below (see README or Cloudinary Media Library)
const HERO_VIDEO_SRC = "https://res.cloudinary.com/dl0yhguyp/video/upload/q_auto/f_auto/v1780865223/hero-bg_nfckfc.mp4";
const HERO_VIDEO_FALLBACK = "https://media.roboflow.com/inference/soccer.mp4";

// Creator footer links — update when ready
const CREATOR_LINKS = {
  linkedin: "https://www.linkedin.com/in/muhammedismaila/",
  email: "mailto:ismail.threathunt@gmail.com",
  github: "https://github.com/mhd1smail",
};

function IconLinkedIn({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.126 0 2.063 2.063 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function IconGitHub({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

// ─── TEAM JERSEY CAROUSEL (all WC 2026 group-stage teams from fixtures) ─────
const JERSEY_PLACEHOLDER = "/jerseys/argentina.png";
const TEAM_BG_PALETTE = ["#F4845F", "#6BBF7A", "#E882B4", "#6EB5FF", "#C9A84C", "#9B7FD4", "#E85D5D", "#4ECDC4"];

function teamJerseyPath(name) {
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  return `/jerseys/${slug}.png`;
}

function buildTeamsFromFixtures() {
  const seen = new Map();
  const groupOrder = ["A", "B", "C", "D", "E", "F", "G", "H"];

  FIXTURES.forEach((f) => {
    if (!seen.has(f.home)) seen.set(f.home, f.group);
    if (!seen.has(f.away)) seen.set(f.away, f.group);
  });

  return Array.from(seen.entries())
    .sort((a, b) => {
      const g = groupOrder.indexOf(a[1]) - groupOrder.indexOf(b[1]);
      return g !== 0 ? g : a[0].localeCompare(b[0]);
    })
    .map(([name, group], i) => ({
      name,
      team: name.toUpperCase(),
      group,
      jersey: teamJerseyPath(name),
      bg: TEAM_BG_PALETTE[i % TEAM_BG_PALETTE.length],
    }));
}

const TEAMS = buildTeamsFromFixtures();

// ─── SPONSORS DATA ────────────────────────────────────────────────────────────
const SPONSORS = [
  {
    label: "FULVA",
    name: "Fulva Café & Bakery",
    desc: "Official Catering & Refreshments Partner",
    logo: "/sponsor_fulva.png"
  },
  {
    label: "RF INDUSTRIES",
    name: "RF Apparel",
    desc: "Official Apparel & Sports Gear Supplier",
    logo: "/sponsor_rf.png"
  }
];

const HERO_STEPS = [
  {
    icon: User,
    title: "Sign In",
    desc: "Log in with Google using your name, department, and year of study.",
  },
  {
    icon: Target,
    title: "Predict",
    desc: "Pick match winners and exact scorelines before kickoff — each match locks 30 min early.",
  },
  {
    icon: Award,
    title: "Compete",
    desc: "Earn up to 5 points per match and climb the campus leaderboard for 1st, 2nd, and 3rd place.",
  },
];

const OFFICIAL_RULES = [
  { num: 1, text: "All predictions must be submitted through the official Predizone website." },
  { num: 2, text: "Participants must log in using their full name, department, and year of study before submitting predictions." },
  { num: 3, text: "Predictions for each match will open in the morning and close 30 minutes before the match begins." },
  {
    num: 4,
    text: "Participants must predict:",
    bullets: ["The winner of the match, and/or", "The exact final scoreline."],
  },
  {
    num: 5,
    text: "Score predictions must be entered in the correct order. For example, if the match is Argentina vs Brazil and you predict 3–2, it means Argentina 3 – Brazil 2.",
  },
  {
    num: 6,
    text: "Points will be awarded as follows:",
    bullets: [
      "Correct winner prediction: 3 points",
      "Correct scoreline prediction: 2 points",
      "Correct winner and scoreline prediction: 5 points",
    ],
  },
  { num: 7, text: "Participants can track their scores and rankings through the Predizone leaderboard on the official website." },
  { num: 8, text: "At the end of the tournament, the participants with the highest points will be awarded 1st, 2nd, and 3rd places." },
  { num: 9, text: "In the event of a tie, the final decision will be made by the Predizone Organizing Team." },
];

// ─── FALLBACK STORAGE ─────────────────────────────────────────────────────────
async function load(key) {
  try {
    if (window.storage && typeof window.storage.get === 'function') {
      const r = await window.storage.get(key);
      return r ? JSON.parse(r.value) : null;
    } else {
      const r = localStorage.getItem(key);
      return r ? JSON.parse(r) : null;
    }
  } catch (e) {
    console.error("Storage load failed:", e);
    return null;
  }
}

async function save(key, val) {
  try {
    if (window.storage && typeof window.storage.set === 'function') {
      await window.storage.set(key, JSON.stringify(val));
    } else {
      localStorage.setItem(key, JSON.stringify(val));
    }
  } catch (e) {
    console.error("Storage save failed:", e);
  }
}

// ─── UTILITIES & RULES ────────────────────────────────────────────────────────
function isSameLocalDay(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

function isLocked(fixture) {
  const lock = new Date(new Date(fixture.date).getTime() - 1800000); // 30 minutes lockout
  return new Date() >= lock;
}

function getStatus(fixture) {
  const now = new Date(), match = new Date(fixture.date);
  const lock = new Date(match.getTime() - 1800000);
  if (now < lock) return "open";
  if (now < match) return "locked";
  return "played";
}

function formatDate(ds) {
  const d = new Date(ds);
  return d.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" }) +
    " • " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

function todayLabel() {
  return new Date().toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

function hasScoreline(entry) {
  return entry?.homeGoals !== undefined && entry?.awayGoals !== undefined;
}

function formatScoreline(homeGoals, awayGoals) {
  return `${homeGoals}–${awayGoals}`;
}

function winnerFromScore(home, away, homeTeam, awayTeam) {
  const h = parseInt(home, 10);
  const a = parseInt(away, 10);
  if (h > a) return homeTeam;
  if (a > h) return awayTeam;
  return "Draw";
}

function calcPoints(pred, res, fixture) {
  if (!pred || !res) return 0;
  const winnerCorrect = pred.winner && res.winner && pred.winner === res.winner;
  const scorelineCorrect =
    hasScoreline(pred) &&
    hasScoreline(res) &&
    parseInt(pred.homeGoals, 10) === parseInt(res.homeGoals, 10) &&
    parseInt(pred.awayGoals, 10) === parseInt(res.awayGoals, 10);

  if (winnerCorrect && scorelineCorrect) return 5;
  if (winnerCorrect) return 3;
  if (scorelineCorrect) return 2;

  // Legacy combined-goals scoring for older stored data
  if (!fixture || pred.goals === undefined || res.goals === undefined) return 0;
  let p = 0;
  if (pred.winner === res.winner) p += 3;
  if (parseInt(pred.goals, 10) === parseInt(res.goals, 10)) p += 2;
  return p > 5 ? 5 : p;
}

function formatPredictionSummary(pred, fixture) {
  if (!pred) return "";
  const parts = [];
  if (pred.winner) parts.push(`${fl(pred.winner)} ${pred.winner}`);
  if (hasScoreline(pred) && fixture) {
    parts.push(`${fixture.home} ${formatScoreline(pred.homeGoals, pred.awayGoals)} ${fixture.away}`);
  } else if (pred.goals !== undefined) {
    parts.push(`${pred.goals} combined goals`);
  }
  return parts.join(" · ");
}

function formatResultSummary(res, fixture) {
  if (!res) return "";
  const parts = [];
  if (res.winner) parts.push(`${fl(res.winner)} ${res.winner}`);
  if (hasScoreline(res) && fixture) {
    parts.push(`${fixture.home} ${formatScoreline(res.homeGoals, res.awayGoals)} ${fixture.away}`);
  } else if (res.goals !== undefined) {
    parts.push(`${res.goals} combined goals`);
  }
  return parts.join(" · ");
}

function buildLeaderboard(users, predictions, results, knockoutFixtures) {
  const allFixtures = [...FIXTURES, ...knockoutFixtures];
  return Object.values(users).map(u => {
    let pts = 0;
    allFixtures.forEach(fix => {
      const pred = predictions[`${u.id}_${fix.id}`];
      const res = results[fix.id];
      if (pred && res) pts += calcPoints(pred, res, fix);
    });
    return { ...u, points: pts };
  }).sort((a, b) => b.points - a.points);
}

function decodeJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("JWT decoding error:", e);
    return null;
  }
}

function makeUserId(name, dept) {
  const n = name.trim().toLowerCase().replace(/\s+/g, " ").replace(/[^a-z0-9 ]/g, "");
  const d = dept.trim().toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "");
  return `${n}__${d}`;
}

function normaliseName(name) {
  return name.trim().replace(/\s+/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

function normaliseDept(dept) {
  return dept.trim().replace(/\s+/g, " ");
}

function addRipple(e) {
  const btn = e.currentTarget;
  const dot = document.createElement("span");
  const rect = btn.getBoundingClientRect();
  dot.className = "ripple-dot";
  dot.style.top = (e.clientY - rect.top) + "px";
  dot.style.left = (e.clientX - rect.left) + "px";
  btn.appendChild(dot);
  setTimeout(() => dot.remove(), 600);
}

if (typeof window !== "undefined") {
  const originalError = console.error;
  console.error = (...args) => {
    if (args[0] && args[0].includes && args[0].includes("Framer Motion")) return;
    originalError(...args);
  };
}

// ─── FIXED LOOPING VIDEO (splash page — stays put while content scrolls) ─────
function FixedVideoBackground({ src, fallbackSrc }) {
  const [activeSrc, setActiveSrc] = useState(src);
  const videoRef = useRef(null);

  useEffect(() => {
    setActiveSrc(src);
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = () => {
      const p = video.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => { });
      }
    };

    tryPlay();
    video.addEventListener("canplay", tryPlay);
    return () => video.removeEventListener("canplay", tryPlay);
  }, [activeSrc]);

  return (
    <div className="fixed-video-bg" aria-hidden="true">
      <video
        ref={videoRef}
        src={activeSrc}
        className="fixed-video-bg__video"
        muted
        loop
        autoPlay
        playsInline
        preload="auto"
        onError={() => {
          if (fallbackSrc && activeSrc !== fallbackSrc) setActiveSrc(fallbackSrc);
        }}
      />
      <div className="fixed-video-bg__overlay video-bg-overlay--gradient" />
    </div>
  );
}

// ─── BLUR TEXT WORD-BY-WORD ANIMATION ────────────────────────────────────────
function BlurText({ text, className }) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  const words = text.split(" ");

  return (
    <p
      ref={ref}
      className={className}
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        rowGap: "0.1em",
      }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
          animate={
            isInView
              ? {
                filter: ["blur(10px)", "blur(5px)", "blur(0px)"],
                opacity: [0, 0.5, 1],
                y: [50, -5, 0],
              }
              : {}
          }
          transition={{
            duration: 0.7,
            times: [0, 0.5, 1],
            ease: "easeOut",
            delay: (i * 100) / 1000,
          }}
          style={{
            display: "inline-block",
            marginRight: "0.28em",
          }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
}

// ─── MAIN APP COMPONENT ──────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("splash");
  const [isAdminView, setIsAdminView] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // App database states
  const [users, setUsers] = useState({});
  const [predictions, setPredictions] = useState({});
  const [results, setResults] = useState({});
  const [knockoutFixtures, setKnockoutFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Scroll snap page index
  const [currentSlide, setCurrentSlide] = useState(0);

  // 3D mascot carousel indexes
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Admin section sub-tabs
  const [adminTab, setAdminTab] = useState("results");
  const [adminGroup, setAdminGroup] = useState("A");

  // First-time registration profile collection states
  const [pendingGoogleUser, setPendingGoogleUser] = useState(null);
  const [registerName, setRegisterName] = useState("");
  const [registerDept, setRegisterDept] = useState("");
  const [registerYear, setRegisterYear] = useState("1st Year");

  const [adminCode, setAdminCode] = useState("");

  // Modals controllers
  const [predFixture, setPredFixture] = useState(null);
  const [predWinner, setPredWinner] = useState("");
  const [predHomeGoals, setPredHomeGoals] = useState("");
  const [predAwayGoals, setPredAwayGoals] = useState("");

  const [selFixture, setSelFixture] = useState(null);
  const [resHomeGoals, setResHomeGoals] = useState("");
  const [resAwayGoals, setResAwayGoals] = useState("");

  const [showAddMatch, setShowAddMatch] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [newRound, setNewRound] = useState("Round of 32");
  const [newHome, setNewHome] = useState("");
  const [newAway, setNewAway] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newVenue, setNewVenue] = useState("");

  const containerRef = useRef(null);

  // ─── AUTHENTICATION SIGN IN / UP CALLBACKS ───────────────────────────────
  const handleGoogleCredentialResponse = async (response) => {
    const payload = decodeJwt(response.credential);
    if (!payload) {
      showToast("Google Authentication failed to parse token!", "error");
      return;
    }

    const email = payload.email;
    const name = payload.name;
    const picture = payload.picture;
    const sub = payload.sub; // Unique Google user ID

    const savedUsers = await load(STORAGE_KEYS.users) || {};

    // Check if the user is a returning player
    if (savedUsers[sub]) {
      const user = savedUsers[sub];
      setCurrentUser(user);
      setIsAdmin(false);
      await save(STORAGE_KEYS.session, { user, isAdmin: false });
      setPage("home");
      showToast(`Welcome back, ${user.name}!`);
    } else {
      // First-time signup flow: store details in state and display profile completion panel
      setPendingGoogleUser({
        sub: sub,
        email: email,
        picture: picture,
        name: name
      });
      setRegisterName(normaliseName(name));
      setRegisterDept("");
      setRegisterYear("1st Year");
      showToast("Verification successful! Please complete your campus profile.");
    }
  };

  const handleCompleteRegistration = async () => {
    if (!pendingGoogleUser) return;

    const rawName = registerName.trim();
    const rawDept = registerDept.trim();

    if (rawName.length < 3) { showToast("Enter your full name (min 3 characters)!", "error"); return; }
    if (!/^[a-zA-Z\s]+$/.test(rawName)) { showToast("Name should only contain letters!", "error"); return; }
    if (rawDept.length < 2) { showToast("Enter your department name!", "error"); return; }

    const name = normaliseName(rawName);
    const dept = normaliseDept(rawDept);

    const newUser = {
      id: pendingGoogleUser.sub,
      name: name,
      dept: dept,
      year: registerYear,
      email: pendingGoogleUser.email,
      picture: pendingGoogleUser.picture,
      joinedAt: new Date().toISOString()
    };

    const savedUsers = await load(STORAGE_KEYS.users) || {};
    const newUsersList = { ...savedUsers, [pendingGoogleUser.sub]: newUser };
    setUsers(newUsersList);
    await save(STORAGE_KEYS.users, newUsersList);

    setCurrentUser(newUser);
    setIsAdmin(false);
    await save(STORAGE_KEYS.session, { user: newUser, isAdmin: false });
    setPendingGoogleUser(null);
    setPage("home");
    showToast(`Account registered! Welcome to the Arena, ${newUser.name}!`);
  };

  const handleAdminLogin = async () => {
    if (adminCode.trim() !== ADMIN_CODE) {
      showToast("Invalid admin security code!", "error");
      return;
    }
    const au = { id: "admin", name: "System Admin", dept: "Tech Operations", year: "Staff", isAdmin: true, picture: null };
    setCurrentUser(au);
    setIsAdmin(true);
    await save(STORAGE_KEYS.session, { user: au, isAdmin: true });
    setPage("admin");
    showToast("System administrator access granted!");
  };

  const handleLogout = async () => {
    setCurrentUser(null);
    setIsAdmin(false);
    await save(STORAGE_KEYS.session, null);
    setAdminCode("");
    setPendingGoogleUser(null);
    setPage("splash");
    setCurrentSlide(0);
    if (window.history.pushState) {
      const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
      window.history.pushState({ path: newurl }, '', newurl);
    }
    setIsAdminView(false);
  };

  // ─── INITIALIZATION & RESIZE ────────────────────────────────────────────────
  useEffect(() => {
    [JERSEY_PLACEHOLDER, ...TEAMS.map((t) => t.jersey)].forEach((src) => {
      const i = new Image();
      i.src = src;
    });

    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("admin") === "true") {
      setIsAdminView(true);
    }

    (async () => {
      const [u, p, r, s, k] = await Promise.all([
        load(STORAGE_KEYS.users),
        load(STORAGE_KEYS.predictions),
        load(STORAGE_KEYS.results),
        load(STORAGE_KEYS.session),
        load(STORAGE_KEYS.knockout)
      ]);
      if (u) setUsers(u);
      if (p) setPredictions(p);
      if (r) setResults(r);
      if (k) setKnockoutFixtures(k);
      if (s) {
        setCurrentUser(s.user);
        setIsAdmin(s.isAdmin || false);
        if (s.isAdmin) {
          setIsAdminView(true);
          setPage("admin");
        } else {
          setPage("home");
        }
      }
      setLoading(false);
    })();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // ─── Initialize & render the Google Sign-In button ─────────────────────────
  // Uses a MutationObserver to wait for #google-signin-btn to be in the DOM,
  // then renders immediately — no longer depends on currentSlide.
  const googleInitRef = useRef(false);

  useEffect(() => {
    if (currentUser || pendingGoogleUser || page !== "splash") return;
    if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.includes("PASTE_YOUR")) return;

    const tryRender = () => {
      const btn = document.getElementById("google-signin-btn");
      if (!btn || typeof window.google === "undefined") return false;
      try {
        if (!googleInitRef.current) {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });
          googleInitRef.current = true;
        }
        btn.innerHTML = "";
        window.google.accounts.id.renderButton(btn, {
          theme: "filled_black",
          size: "large",
          width: 300,
          text: "signin_with",
          shape: "pill",
          logo_alignment: "center",
        });
        return true;
      } catch (e) {
        console.error("Google button render error:", e);
        return false;
      }
    };

    // Try immediately, then observe DOM for the button element
    if (!tryRender()) {
      const observer = new MutationObserver(() => {
        if (tryRender()) observer.disconnect();
      });
      observer.observe(document.body, { childList: true, subtree: true });
      return () => observer.disconnect();
    }
  }, [page, currentUser, pendingGoogleUser]);

  // ─── SCROLLSNAP INDICATOR ──────────────────────────────────────────────────
  const handleScroll = () => {
    if (!containerRef.current) return;
    const scrollTop = containerRef.current.scrollTop;
    const height = containerRef.current.clientHeight;
    const slideIndex = Math.round(scrollTop / height);
    if (slideIndex !== currentSlide) {
      setCurrentSlide(slideIndex);
    }
  };

  const scrollToSlide = (index) => {
    if (!containerRef.current) return;
    containerRef.current.scrollTo({
      top: index * containerRef.current.clientHeight,
      behavior: "smooth"
    });
  };

  // ─── GAME CONTROLLERS ───────────────────────────────────────────────────────
  const handleSavePrediction = async () => {
    const hasWinner = !!predWinner;
    const hasScore =
      predHomeGoals !== "" &&
      predAwayGoals !== "" &&
      !isNaN(predHomeGoals) &&
      !isNaN(predAwayGoals) &&
      parseInt(predHomeGoals, 10) >= 0 &&
      parseInt(predAwayGoals, 10) >= 0;

    if (!hasWinner && !hasScore) {
      showToast("Predict the winner and/or exact scoreline!", "error");
      return;
    }
    if (hasScore && hasWinner) {
      const derivedWinner = winnerFromScore(predHomeGoals, predAwayGoals, predFixture.home, predFixture.away);
      if (derivedWinner !== predWinner) {
        showToast("Winner must match your scoreline!", "error");
        return;
      }
    }
    if (isLocked(predFixture)) { showToast("Match predictions are locked!", "error"); return; }

    const key = `${currentUser.id}_${predFixture.id}`;
    if (predictions[key]) { showToast("Prediction already locked!", "error"); return; }

    const newPreds = {
      ...predictions,
      [key]: {
        ...(hasWinner ? { winner: predWinner } : {}),
        ...(hasScore ? { homeGoals: parseInt(predHomeGoals, 10), awayGoals: parseInt(predAwayGoals, 10) } : {}),
        submittedAt: new Date().toISOString(),
      },
    };
    setPredictions(newPreds);
    await save(STORAGE_KEYS.predictions, newPreds);
    setPredFixture(null);
    setPredWinner("");
    setPredHomeGoals("");
    setPredAwayGoals("");
    showToast("Prediction locked successfully!");
  };

  const handleSaveResult = async () => {
    if (resHomeGoals === "" || resAwayGoals === "" || isNaN(resHomeGoals) || isNaN(resAwayGoals)) {
      showToast("Enter the full scoreline!", "error");
      return;
    }

    const homeGoals = parseInt(resHomeGoals, 10);
    const awayGoals = parseInt(resAwayGoals, 10);
    if (homeGoals < 0 || awayGoals < 0) {
      showToast("Enter a valid scoreline!", "error");
      return;
    }

    const newResults = {
      ...results,
      [selFixture.id]: {
        winner: winnerFromScore(homeGoals, awayGoals, selFixture.home, selFixture.away),
        homeGoals,
        awayGoals,
        enteredAt: new Date().toISOString(),
      },
    };
    setResults(newResults);
    await save(STORAGE_KEYS.results, newResults);
    setSelFixture(null);
    setResHomeGoals("");
    setResAwayGoals("");
    showToast("Score updated. Leaderboards re-calculated!");
  };

  const handleDeleteMatch = async (matchId) => {
    const updated = knockoutFixtures.filter(f => f.id !== matchId);
    setKnockoutFixtures(updated);
    await save(STORAGE_KEYS.knockout, updated);
    showToast("Match removed from database.");
  };

  // ─── TOAST NOTIFICATION ─────────────────────────────────────────────────────
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ─── CAROUSEL HELPERS ───────────────────────────────────────────────────────
  const getRoleStyle = (i) => {
    const total = TEAMS.length;
    let diff = i - activeIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    if (diff === 0) {
      return {
        top: "50%",
        transform: "translate(-50%, -50%) scale(1)",
        filter: "brightness(1)",
        zIndex: 20,
        opacity: 1,
        width: isMobile ? "min(68vw, 300px)" : "clamp(200px, 38vw, 420px)",
        height: isMobile ? "min(42vh, 360px)" : "auto",
      };
    } else if (Math.abs(diff) === 1) {
      const side = diff > 0 ? 1 : -1;
      const offset = isMobile ? 34 : 45;
      return {
        top: "50%",
        transform: `translate(calc(-50% + ${side * offset}%), -50%) scale(${isMobile ? 0.82 : 0.78})`,
        filter: "brightness(0.72)",
        zIndex: 10,
        opacity: 0.85,
        width: isMobile ? "min(52vw, 230px)" : "clamp(160px, 30vw, 340px)",
        height: isMobile ? "min(34vh, 300px)" : "auto",
      };
    } else {
      const side = diff > 0 ? 1 : -1;
      const offset = isMobile ? 68 : 80;
      return {
        top: "50%",
        transform: `translate(calc(-50% + ${side * offset}%), -50%) scale(0.55)`,
        filter: "brightness(0.45)",
        zIndex: 1,
        opacity: 0,
        width: isMobile ? "min(38vw, 170px)" : "clamp(120px, 22vw, 260px)",
        height: isMobile ? "min(24vh, 220px)" : "auto",
      };
    }
  };

  const jerseySwipeStart = useRef(null);

  const navigateTeams = (dir) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => {
      if (dir === "next") return (prev + 1) % TEAMS.length;
      return (prev - 1 + TEAMS.length) % TEAMS.length;
    });
    setTimeout(() => setIsAnimating(false), 700);
  };

  const handleJerseyTouchStart = (e) => {
    jerseySwipeStart.current = e.touches[0].clientX;
  };

  const handleJerseyTouchEnd = (e) => {
    if (jerseySwipeStart.current === null) return;
    const deltaX = e.changedTouches[0].clientX - jerseySwipeStart.current;
    if (Math.abs(deltaX) > 48) {
      navigateTeams(deltaX < 0 ? "next" : "prev");
    }
    jerseySwipeStart.current = null;
  };

  // ─── ADMIN HELPERS ───────────────────────────────────────────────────────────
  const openAddMatch = (fix = null) => {
    if (fix) {
      setEditingMatch(fix);
      setNewRound(fix.round || "Round of 32");
      setNewHome(fix.home);
      setNewAway(fix.away);
      const d = new Date(fix.date);
      setNewDate(d.toISOString().split("T")[0]);
      setNewTime(d.toTimeString().slice(0, 5));
      setNewVenue(fix.venue);
    } else {
      setEditingMatch(null);
      setNewRound("Round of 32");
      setNewHome("");
      setNewAway("");
      setNewDate("");
      setNewTime("");
      setNewVenue("");
    }
    setShowAddMatch(true);
  };

  const handleSaveMatch = async () => {
    if (!newHome.trim() || !newAway.trim()) { showToast("Enter both team names!", "error"); return; }
    if (!newDate || !newTime) { showToast("Enter match date and time!", "error"); return; }

    const dateStr = `${newDate}T${newTime}:00`;
    const matchData = {
      id: editingMatch ? editingMatch.id : Date.now(),
      round: newRound,
      home: newHome.trim(),
      away: newAway.trim(),
      date: dateStr,
      venue: newVenue.trim() || "TBD",
      isKnockout: true,
    };

    let updated;
    if (editingMatch) {
      updated = knockoutFixtures.map(f => f.id === editingMatch.id ? matchData : f);
    } else {
      updated = [...knockoutFixtures, matchData];
    }

    setKnockoutFixtures(updated);
    await save(STORAGE_KEYS.knockout, updated);
    setShowAddMatch(false);
    setEditingMatch(null);
    showToast(editingMatch ? "Match updated!" : "Knockout match added!");
  };

  const leaderboard = buildLeaderboard(users, predictions, results, knockoutFixtures);
  const allFixtures = [...FIXTURES, ...knockoutFixtures];
  const todayFixtures = allFixtures.filter(f => isSameLocalDay(f.date));
  const groups = ["A", "B", "C", "D", "E", "F", "G", "H"];

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white gap-4">
      <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      <span className="font-body text-xs tracking-widest uppercase opacity-60">Initializing Predictor...</span>
    </div>
  );

  return (
    <div className="relative w-full overflow-hidden bg-black text-white font-body selection:bg-white/20">

      {/* Toast Alert */}
      {toast && (
        <div className="toast-msg glass-panel p-4 rounded-[1.25rem] flex items-center gap-3 bg-black/90 border border-white/25 shadow-2xl max-w-sm pointer-events-auto">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 text-white font-bold">
            {toast.type === "error" ? "!" : "✓"}
          </div>
          <p className="text-sm font-medium text-white/95 leading-tight">{toast.msg}</p>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────
          1. SECRET ADMIN PANEL VIEW (?admin=true)
          ─────────────────────────────────────────────────────────────────────── */}
      {isAdminView && (!currentUser || !isAdmin) && (
        <div className="min-h-screen flex items-center justify-center p-6 bg-black relative">
          <div className="absolute inset-0 pointer-events-none z-0 opacity-40 bg-[url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22><filter id=%22noise%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/></filter><rect width=%22200%22 height=%22200%22 filter=%22url(%23noise)%22 opacity=%220.08%22/></svg>')] bg-repeat" />
          <div className="liquid-glass p-8 w-full max-w-sm rounded-[1.25rem] z-10 flex flex-col items-center border border-white/10 shadow-2xl">
            <ShieldAlert className="h-12 w-12 text-white mb-4" />
            <h2 className="font-heading italic text-3xl text-white tracking-tight text-center">System Lock</h2>
            <p className="text-xs text-white/60 uppercase tracking-widest mt-1 mb-6">Security Access Required</p>

            <div className="w-full mb-6">
              <label className="block text-[11px] font-semibold text-white/80 uppercase tracking-wider mb-2">Security Code</label>
              <input
                className="input-glass w-full px-4 py-3 rounded-xl text-center text-lg tracking-widest font-semibold"
                type="password"
                placeholder="••••••••••••••"
                value={adminCode}
                onChange={e => setAdminCode(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAdminLogin()}
              />
            </div>

            <button className="btn-primary w-full py-3 rounded-full text-sm font-semibold tracking-wide" onClick={handleAdminLogin}>
              Access Console
            </button>
            <button className="btn-secondary w-full mt-3 py-2.5 rounded-full text-sm font-semibold" onClick={() => { setIsAdminView(false); setPage("splash"); }}>
              Exit Portal
            </button>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────
          2. LANDING SCREEN SNAP-SCROLL SLIDES (Public Flow)
          ─────────────────────────────────────────────────────────────────────── */}
      {page === "splash" && !currentUser && (
        <>
          <FixedVideoBackground
            src={HERO_VIDEO_SRC}
            fallbackSrc={HERO_VIDEO_FALLBACK}
          />

          <nav className="fixed top-4 left-0 w-full px-8 lg:px-16 z-50 flex items-center justify-between pointer-events-auto">
            <button
              type="button"
              className="liquid-glass px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full cursor-pointer select-none"
              onClick={() => scrollToSlide(0)}
            >
              <span className="font-heading italic text-base sm:text-xl tracking-tight text-white uppercase font-bold">PREDIZONE</span>
            </button>
            <div className="hidden sm:flex liquid-glass px-1.5 py-1.5 rounded-full items-center gap-1 shadow-lg">
              {["Welcome", "How to Play", "Teams", "Sponsors", "Join"].map((item, index) => (
                <button
                  key={item}
                  className="px-4 py-1.5 text-xs uppercase tracking-wider text-white/80 hover:text-white font-medium transition-colors"
                  onClick={() => scrollToSlide(index)}
                >
                  {item}
                </button>
              ))}
            </div>
            <button
              className="px-5 py-2.5 rounded-full bg-white text-black text-xs font-semibold uppercase tracking-wider hover:bg-white/90 transition-colors shadow-lg whitespace-nowrap flex items-center gap-1.5"
              onClick={() => scrollToSlide(4)}
            >
              Enter Arena <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </nav>

          <div ref={containerRef} onScroll={handleScroll} className="scroll-container scroll-container--over-video">

            {/* SLIDE 1: Hero welcome page */}
            <div className="scroll-section scroll-section--over-video scroll-section--hero">
              <div className="scroll-slide-inner px-4 max-w-4xl text-center mx-auto w-full">

                {/* Football tournament badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
                  className="lg:mt-24 py-2 px-3 sm:py-1.5 sm:pl-1.5 sm:pr-4 rounded-full inline-flex items-center justify-center gap-2 sm:gap-3 text-xs mt-0 md:mt-0 mb-6 max-w-full mx-auto bg-red-950/40 border border-red-500/30 backdrop-blur-md shadow-lg flex-nowrap whitespace-nowrap"
                >
                  <span className="bg-white text-black px-2.5 py-1 rounded-full font-bold uppercase tracking-wider text-[10px] shrink-0">WC 2026</span>
                  <span className="text-white/95 text-[11px] sm:text-xs leading-none font-medium tracking-wide">
                    FIFA World Cup College Prediction Arena
                  </span>
                </motion.div>

                {/* Staggered word blur-in title */}
                <BlurText
                  text="PREDICT MATCHES. WIN THE LEAGUE."
                  className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-heading italic text-white leading-[0.9] max-w-3xl justify-center tracking-[-2px] sm:tracking-[-3px] uppercase font-bold"
                />

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 }}
                  className="mt-6 text-sm md:text-base text-white/80 max-w-xl mx-auto font-light leading-relaxed"
                >
                  Predizone is your official FIFA World Cup 2026 prediction arena. Sign in, submit your picks for today&apos;s fixtures, earn points for correct winners and scorelines, and compete with students across campus.
                </motion.p>

                {/* CTA trigger */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 1.1 }}
                  className="flex items-center justify-center gap-6 mt-8"
                >
                  <button className="liquid-glass-strong px-7 py-3 rounded-full text-xs uppercase tracking-wider font-semibold text-white flex items-center gap-2" onClick={() => scrollToSlide(4)}>
                    Start Predicting <ArrowUpRight className="h-4 w-4" />
                  </button>
                  <button className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-white hover:opacity-80 transition-opacity" onClick={() => scrollToSlide(1)}>
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20"><Play className="h-3 w-3 fill-current text-white" /></div> View Rules
                  </button>
                </motion.div>

                {/* How it works */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 1.3 }}
                  className="mt-8 sm:mt-12 w-full max-w-3xl"
                >
                  <p className="text-[10px] sm:text-xs text-white/45 uppercase tracking-[0.2em] font-semibold mb-4">
                    How it works
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-left mb-8 pb-8">
                    {HERO_STEPS.map((step, i) => {
                      const Icon = step.icon;
                      return (
                        <div key={step.title} className="liquid-glass p-3 sm:p-4 rounded-[1.25rem] border border-white/5">
                          <div className="frozen-inner rounded-xl p-4 h-full">
                            <div className="flex items-center gap-2.5 mb-3">
                              <span className="frozen-tag w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold text-white/70">
                                {i + 1}
                              </span>
                              <Icon className="h-5 w-5 text-white/90 shrink-0" />
                            </div>
                            <h3 className="font-heading italic text-xl text-white uppercase tracking-tight leading-none">
                              {step.title}
                            </h3>
                            <p className="mt-2 text-[11px] sm:text-xs text-white/60 leading-relaxed font-light">
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>

              </div>
            </div>

            {/* SLIDE 2: Official tournament rules */}
            <div className="scroll-section scroll-section--over-video scroll-section--predict">
              <div className="predict-slide__inner relative z-10 px-4 sm:px-8 md:px-16 lg:px-20 flex flex-col w-full max-w-7xl mx-auto justify-start gap-5 md:gap-8">

                <div className="text-left shrink-0">
                  <h2 className="font-heading italic text-white text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] leading-[0.9] tracking-[-3px] uppercase">
                    OFFICIAL RULES
                  </h2>
                  <p className="mt-3 text-xs sm:text-sm text-white/55 uppercase tracking-widest font-semibold">
                    Predizone tournament guidelines
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 w-full pb-20">
                  {OFFICIAL_RULES.map((rule) => (
                    <div
                      key={rule.num}
                      className="liquid-glass rounded-[1.25rem] p-4 sm:p-5 border border-white/5 hover:border-white/10 transition-colors flex flex-col gap-3"
                    >
                      <div className="frozen-inner rounded-xl px-3 py-2.5 flex items-center gap-3">
                        <span className="frozen-tag w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold text-white shrink-0">
                          {rule.num}
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-white/45 font-bold">
                          Rule {rule.num}
                        </span>
                      </div>
                      <div className="frozen-inner rounded-xl p-4 flex-1">
                        <p className="text-xs sm:text-[13px] text-white/75 leading-relaxed font-light">
                          {rule.text}
                        </p>
                        {rule.bullets && (
                          <ul className="mt-2.5 space-y-1.5">
                            {rule.bullets.map((item) => (
                              <li key={item} className="text-xs text-white/65 leading-relaxed font-light flex gap-2">
                                <span className="text-white/35 shrink-0">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* SLIDE 3: Team jersey carousel — solid overlay, hides fixed video */}
            <div
              className="scroll-section scroll-section--solid scroll-section--teams transition-colors duration-[650ms]"
              style={{ backgroundColor: TEAMS[activeIndex].bg }}
            >
              {/* SVG Grain Overlay */}
              <div className="absolute inset-0 pointer-events-none z-50 opacity-40 bg-[url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22><filter id=%22noise%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/></filter><rect width=%22200%22 height=%22200%22 filter=%22url(%23noise)%22 opacity=%220.08%22/></svg>')] bg-repeat" />

              <div className="teams-slide__shell">
                <div className="teams-slide__header">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-white/80 uppercase">
                    TEAM JERSEYS · {activeIndex + 1} / {TEAMS.length}
                  </span>
                  <button
                    className="sm:hidden flex items-center gap-1 text-white/80 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors"
                    onClick={() => scrollToSlide(3)}
                  >
                    Sponsors <ArrowRight className="h-3 w-3" />
                  </button>
                  <button
                    className="hidden sm:flex items-center gap-1 text-white hover:opacity-85 transition-opacity"
                    onClick={() => scrollToSlide(3)}
                  >
                    <span className="font-heading uppercase font-normal tracking-tight leading-none text-2xl" style={{ fontFamily: "'Anton', sans-serif" }}>
                      DISCOVER SPONSORS
                    </span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>

                <div className="teams-slide__stage">
                  <div className="contenders-bg absolute inset-x-0 flex items-center justify-center pointer-events-none select-none z-[2] font-heading font-black opacity-30 text-white tracking-tight leading-none text-center">
                    <span className="font-heading font-bold" style={{ fontSize: "clamp(64px, 22vw, 380px)", fontFamily: "'Anton', sans-serif" }}>CONTENDERS</span>
                  </div>

                  <div
                    className="jersey-carousel jersey-carousel--swipeable z-[3]"
                    onTouchStart={handleJerseyTouchStart}
                    onTouchEnd={handleJerseyTouchEnd}
                  >
                    {TEAMS.map((entry, i) => {
                      const roleStyle = getRoleStyle(i);
                      return (
                        <div
                          key={entry.name}
                          className={`jersey-carousel__slide absolute left-1/2 origin-center${i === activeIndex ? " jersey-carousel__slide--active" : ""}`}
                          style={{
                            ...roleStyle,
                            aspectRatio: "0.72 / 1",
                            transition: "transform 650ms cubic-bezier(0.4,0,0.2,1), filter 650ms cubic-bezier(0.4,0,0.2,1), opacity 650ms cubic-bezier(0.4,0,0.2,1), left 650ms cubic-bezier(0.4,0,0.2,1)",
                            willChange: "transform, filter, opacity"
                          }}
                        >
                          <span className="jersey-carousel__shadow" aria-hidden="true" />
                          <img
                            src={entry.jersey}
                            alt={`${entry.name} jersey`}
                            className="relative z-[1] w-full h-full object-contain object-center select-none"
                            draggable="false"
                            onError={(e) => {
                              if (e.currentTarget.src !== JERSEY_PLACEHOLDER) {
                                e.currentTarget.src = JERSEY_PLACEHOLDER;
                              }
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="teams-slide__footer jersey-carousel__footer sm:max-w-[320px] text-left">
                  <div className="flex items-center justify-between sm:block gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 sm:mb-2">
                        <span className="text-xl sm:text-2xl shrink-0">{fl(TEAMS[activeIndex].name)}</span>
                        <h3 className="font-semibold uppercase tracking-widest text-sm sm:text-[22px] text-white leading-tight truncate">
                          {TEAMS[activeIndex].team}
                        </h3>
                      </div>
                      <p className="text-[10px] sm:text-xs text-white/70 leading-relaxed font-light mb-0 sm:mb-5">
                        Group {TEAMS[activeIndex].group} · WC 2026
                      </p>
                    </div>
                    <div className="hidden sm:flex items-center gap-3 shrink-0">
                      <button
                        className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center text-white hover:scale-105 hover:bg-white/10 transition-all active:scale-95"
                        onClick={() => navigateTeams("prev")}
                        aria-label="Previous team"
                      >
                        <ArrowLeft className="h-6 w-6" />
                      </button>
                      <button
                        className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center text-white hover:scale-105 hover:bg-white/10 transition-all active:scale-95"
                        onClick={() => navigateTeams("next")}
                        aria-label="Next team"
                      >
                        <ArrowRight className="h-6 w-6" />
                      </button>
                    </div>
                    <p className="sm:hidden text-[10px] text-white/45 uppercase tracking-widest shrink-0">
                      Swipe to browse
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* SLIDE 4: Sponsors */}
            <div className="scroll-section scroll-section--over-video scroll-section--sponsors">
              <div className="sponsors-slide__inner relative z-10 px-6 max-w-4xl text-center w-full flex flex-col items-center justify-center gap-4 mx-auto">
                <h2 className="font-heading italic text-white text-5xl md:text-7xl lg:text-[5.5rem] leading-[0.9] tracking-[-3px] uppercase mb-3 sm:mb-4">
                  PROUD SPONSORS
                </h2>
                <p className="text-white/50 text-xs uppercase tracking-widest mb-6 sm:mb-12 font-semibold">
                  Backed by campus organizations and local businesses
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-xl mx-auto">
                  {SPONSORS.map((sp) => (
                    <div key={sp.label} className="liquid-glass rounded-[1.25rem] p-4 sm:p-5 text-center border border-white/5">
                      <div className="frozen-inner rounded-xl p-4 sm:p-5 flex flex-col items-center gap-3 sm:gap-4 h-full">
                        <div className="w-full h-24 sm:h-32 rounded-xl frozen-inner flex items-center justify-center p-3 sm:p-4 relative overflow-hidden group">
                          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                          <img
                            src={sp.logo}
                            alt={`${sp.name} logo`}
                            className="h-full max-h-16 sm:max-h-24 object-contain filter brightness-100 contrast-100 transition-transform duration-300 group-hover:scale-105 select-none"
                            draggable="false"
                          />
                        </div>
                        <div className="frozen-tag px-4 py-1.5 rounded-full text-white font-bold tracking-widest text-[11px] uppercase inline-block">
                          {sp.label}
                        </div>
                        <div className="flex flex-col gap-1">
                          <h4 className="text-sm font-semibold text-white/95 leading-tight">{sp.name}</h4>
                          <p className="text-[11px] text-white/45">{sp.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="btn-primary mt-6 sm:mt-12 px-7 py-3 rounded-full text-xs uppercase tracking-wider font-semibold" onClick={() => scrollToSlide(4)}>
                  Go To Portal
                </button>
              </div>
            </div>

            {/* SLIDE 5: Signup or Login page (Google Sign-In) */}
            <div className="scroll-section scroll-section--over-video scroll-section--dimmed">
              <div className="scroll-slide-inner px-4 w-full justify-between">
                <div className="flex-1 flex items-center justify-center w-full min-h-0 py-4">
                  <div className="liquid-glass-strong p-8 w-full max-w-md rounded-[1.25rem] border border-white/10 shadow-2xl flex flex-col items-center">

                    <div className="text-center mb-8">
                      <div className="frozen-inner w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Award className="h-7 w-7 text-white" />
                      </div>
                      <h3 className="font-heading italic text-white text-3xl tracking-tight uppercase">SECURE SIGN IN</h3>
                      <p className="text-white/50 text-[11px] uppercase tracking-wider mt-1.5">Authenticate via Google to lock in your predictions</p>
                    </div>

                    {GOOGLE_CLIENT_ID && !GOOGLE_CLIENT_ID.includes("PASTE_YOUR") ? (
                      <div className="my-2 flex justify-center w-full min-h-[50px]">
                        <div id="google-signin-btn"></div>
                      </div>
                    ) : (
                      <div className="w-full my-2 bg-amber-950/40 border border-amber-700/40 rounded-xl p-4 text-center">
                        <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">⚙️ OAuth Not Configured</p>
                        <p className="text-amber-300/70 text-[10px] leading-relaxed">Add your <code className="bg-white/10 px-1 rounded">VITE_GOOGLE_CLIENT_ID</code> to <code className="bg-white/10 px-1 rounded">.env</code> to enable Google Sign-In.</p>
                      </div>
                    )}

                    <div className="frozen-inner rounded-xl p-3.5 text-left text-[11px] text-white/60 leading-relaxed w-full mt-4">
                      🛡️ <strong>Secure &amp; Private:</strong> Google Sign-In ensures only you can access your predictions — no passwords stored.
                    </div>

                  </div>
                </div>

                <footer className="splash-footer shrink-0 w-full text-center pt-4">
                  <p className="text-[10px] text-white/35 tracking-wide mb-2">say hi to me</p>
                  <div className="flex items-center justify-center gap-4">
                    <a
                      href={CREATOR_LINKS.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/30 hover:text-white/70 transition-colors"
                      aria-label="LinkedIn"
                    >
                      <IconLinkedIn className="h-3.5 w-3.5" />
                    </a>
                    <a
                      href={CREATOR_LINKS.email}
                      className="text-white/30 hover:text-white/70 transition-colors"
                      aria-label="Email"
                    >
                      <Mail className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </a>
                    <a
                      href={CREATOR_LINKS.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/30 hover:text-white/70 transition-colors"
                      aria-label="GitHub"
                    >
                      <IconGitHub className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </footer>
              </div>
            </div>

          </div>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════════
          PROFILE COMPLETION OVERLAY — appears immediately after Google auth
          for first-time users, on top of everything.
      ═══════════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {pendingGoogleUser && (
          <motion.div
            key="profile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[999] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(18px)" }}
          >
            <motion.div
              initial={{ scale: 0.92, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 20, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-md"
            >
              <div className="liquid-glass-strong rounded-[1.5rem] border border-white/15 shadow-2xl overflow-hidden">

                {/* Green header bar */}
                <div className="bg-gradient-to-r from-green-900/60 to-emerald-900/40 border-b border-white/10 px-8 pt-8 pb-6 text-center">
                  {pendingGoogleUser.picture ? (
                    <img
                      src={pendingGoogleUser.picture}
                      alt="Profile"
                      className="w-20 h-20 rounded-full border-4 border-white/20 mx-auto mb-4 shadow-xl"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-4">
                      <User className="h-8 w-8 text-white" />
                    </div>
                  )}
                  <div className="inline-flex items-center gap-1.5 bg-green-500/20 border border-green-500/30 px-3 py-1 rounded-full mb-3">
                    <CheckCircle className="h-3 w-3 text-green-400" />
                    <span className="text-green-400 text-[10px] font-bold uppercase tracking-widest">Google Verified</span>
                  </div>
                  <h2 className="font-heading italic text-white text-2xl uppercase tracking-tight leading-tight">
                    One Last Step
                  </h2>
                  <p className="text-white/50 text-xs mt-1">
                    Hey <span className="text-white font-semibold">{pendingGoogleUser.name?.split(" ")[0]}</span>, complete your campus profile to enter the arena.
                  </p>
                </div>

                {/* Form body */}
                <div className="px-8 py-6 space-y-4">

                  <div>
                    <label className="block text-[10px] font-bold text-white/70 uppercase tracking-widest mb-1.5">
                      Full Name
                    </label>
                    <input
                      id="reg-name"
                      className="input-glass w-full px-4 py-3 rounded-xl text-sm"
                      placeholder="e.g. Rahul Sharma"
                      value={registerName}
                      onChange={e => setRegisterName(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && document.getElementById("reg-dept")?.focus()}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-white/70 uppercase tracking-widest mb-1.5">
                      Department
                    </label>
                    <input
                      id="reg-dept"
                      className="input-glass w-full px-4 py-3 rounded-xl text-sm"
                      placeholder="e.g. Computer Science"
                      value={registerDept}
                      onChange={e => setRegisterDept(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleCompleteRegistration()}
                    />
                    <p className="text-[9px] text-white/35 mt-1 pl-1">Type your full department name</p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-white/70 uppercase tracking-widest mb-1.5">
                      Year of Study
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {STUDY_YEARS.map(y => (
                        <button
                          key={y}
                          className={`py-2.5 rounded-xl text-xs font-bold uppercase border transition-all ${registerYear === y
                            ? "bg-white text-black border-white"
                            : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/30"
                            }`}
                          onClick={() => setRegisterYear(y)}
                        >
                          {y.replace(" Year", "")}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    className="btn-primary w-full py-3.5 rounded-full text-sm font-bold uppercase tracking-widest mt-2 flex items-center justify-center gap-2"
                    onClick={handleCompleteRegistration}
                  >
                    <CheckCircle className="h-4 w-4" />
                    Complete & Enter Arena
                  </button>

                  <button
                    className="text-[10px] text-white/30 uppercase tracking-widest block mx-auto text-center hover:text-white/60 transition-colors"
                    onClick={() => setPendingGoogleUser(null)}
                  >
                    ← Back to Sign In
                  </button>

                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ───────────────────────────────────────────────────────────────────────
          3. AUTHENTICATED WORKSPACE (Dashboard / Standings)
          ─────────────────────────────────────────────────────────────────────── */}
      {currentUser && (page === "home" || page === "leaderboard" || page === "admin") && (
        <div className="max-w-3xl mx-auto px-4 pb-24 min-h-screen pt-4 relative z-10">

          {/* Header Panel */}
          <header className="liquid-glass p-4 rounded-[1.25rem] flex items-center justify-between border border-white/10 mb-6 sticky top-4 z-40">
            <div className="flex items-center gap-2 select-none">
              <span className="text-xl">🏆</span>
              <span className="font-heading italic text-xl tracking-tight text-white uppercase font-bold">PREDIZONE</span>
            </div>

            <div className="flex items-center gap-1.5">
              {!isAdmin && (
                <>
                  <button
                    className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors ${page === "home" ? "bg-white text-black" : "text-white/70 hover:text-white"}`}
                    onClick={() => setPage("home")}
                  >
                    Fixtures
                  </button>
                  <button
                    className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors ${page === "leaderboard" ? "bg-white text-black" : "text-white/70 hover:text-white"}`}
                    onClick={() => setPage("leaderboard")}
                  >
                    Standings
                  </button>
                </>
              )}
              {isAdmin && (
                <span className="px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white/60 bg-white/10 rounded-lg border border-white/10">Admin Control</span>
              )}
              <button className="p-2 rounded-lg text-red-400 hover:bg-white/5 transition-colors" onClick={handleLogout} title="Logout">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </header>

          {/* User Metrics overview panel */}
          {!isAdmin && (
            <div className="liquid-glass px-6 py-4 rounded-[1.25rem] flex items-center justify-between border border-white/5 mb-6">
              <div className="flex items-center gap-3 text-left">
                {currentUser.picture ? (
                  <img src={currentUser.picture} alt={currentUser.name} className="w-10 h-10 rounded-full border border-white/20" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/15"><User className="h-4 w-4 text-white" /></div>
                )}
                <div>
                  <h3 className="text-sm font-semibold text-white/95 flex items-center gap-1">{currentUser.name} <Zap className="h-3.5 w-3.5 text-amber-400 fill-current" /></h3>
                  <span className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5 block">{currentUser.dept} • {currentUser.year || "1st Year"} • {currentUser.email}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-0.5">Your Points</span>
                <span className="font-heading italic text-2xl text-white tracking-tight">{leaderboard.find(l => l.id === currentUser.id)?.points || 0} PTS</span>
              </div>
            </div>
          )}

          {/* TAB: Participant Fixtures inputs */}
          {page === "home" && !isAdmin && (
            <div className="space-y-4">
              <div className="text-left mb-6">
                <h2 className="font-heading italic text-3xl uppercase tracking-tight text-white">TODAY'S FIXTURES</h2>
                <p className="text-xs text-white/50 mt-1 uppercase tracking-wider">{todayLabel()}</p>
              </div>

              {todayFixtures.length === 0 ? (
                <div className="liquid-glass rounded-[1.25rem] p-12 text-center border border-white/5">
                  <span className="text-4xl mb-4 block">📅</span>
                  <h3 className="font-heading italic text-xl text-white/70">No Matches Configured</h3>
                  <p className="text-xs text-white/40 max-w-sm mx-auto mt-2 leading-relaxed">
                    There are no World Cup group stage or knockout stage fixtures scheduled for today. Explore the campus rankings!
                  </p>
                  <button className="btn-secondary mt-6 px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider" onClick={() => setPage("leaderboard")}>
                    Open standings
                  </button>
                </div>
              ) : (
                todayFixtures.map(fix => {
                  const status = getStatus(fix);
                  const key = `${currentUser.id}_${fix.id}`;
                  const myPred = predictions[key];
                  const res = results[fix.id];
                  const pts = myPred && res ? calcPoints(myPred, res, fix) : null;

                  return (
                    <div key={fix.id} className="liquid-glass p-5 rounded-[1.25rem] border border-white/5 flex flex-col text-left">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{fix.isKnockout ? fix.round : `Group ${fix.group}`}</span>
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${status === "open" ? "bg-green-950 text-green-400 border border-green-800" : "bg-amber-950/80 text-amber-400 border border-amber-900"}`}>
                          {status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between my-4 max-w-md mx-auto w-full">
                        <div className="text-center flex-1">
                          <span className="text-4xl block">{fl(fix.home)}</span>
                          <span className="text-xs font-semibold text-white/90 mt-2 block">{fix.home}</span>
                        </div>
                        <span className="font-heading italic text-sm text-white/30 uppercase tracking-widest font-black px-6">VS</span>
                        <div className="text-center flex-1">
                          <span className="text-4xl block">{fl(fix.away)}</span>
                          <span className="text-xs font-semibold text-white/90 mt-2 block">{fix.away}</span>
                        </div>
                      </div>

                      <p className="text-[10px] text-white/40 text-center mb-4 leading-none">{formatDate(fix.date)} &nbsp;•&nbsp; {fix.venue}</p>

                      {res && (
                        <div className="frozen-inner rounded-xl p-3 flex justify-between items-center text-xs mb-3">
                          <div>
                            <span className="text-white/50">Result: </span>
                            <span className="font-semibold text-white">{formatResultSummary(res, fix)}</span>
                          </div>
                          {pts !== null && (
                            <span className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${pts > 0 ? "bg-green-950 text-green-400" : "frozen-tag text-white/40"}`}>
                              {pts > 0 ? `+${pts} PTS` : "0 PTS"}
                            </span>
                          )}
                        </div>
                      )}

                      {myPred && (
                        <div className="frozen-inner rounded-xl p-3 text-xs flex items-center justify-between">
                          <div>
                            <span className="text-white/50">Your prediction: </span>
                            <span className="font-semibold text-white">{formatPredictionSummary(myPred, fix)}</span>
                          </div>
                          <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider flex items-center gap-1">🔒 Locked</span>
                        </div>
                      )}

                      {status === "open" && !myPred && (
                        <button className="btn-primary w-full py-2.5 rounded-xl text-xs mt-3 uppercase tracking-wider font-semibold" onClick={() => { setPredFixture(fix); setPredWinner(""); setPredHomeGoals(""); setPredAwayGoals(""); }}>
                          Submit prediction
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB: Participant Standings list */}
          {page === "leaderboard" && !isAdmin && (
            <div>
              <div className="text-left mb-6">
                <h2 className="font-heading italic text-3xl uppercase tracking-tight text-white">CAMPUS LEADERBOARD</h2>
                <p className="text-xs text-white/50 mt-1 uppercase tracking-wider">{leaderboard.length} students registered standings</p>
              </div>

              <div className="space-y-2">
                {leaderboard.map((u, i) => {
                  const isMe = u.id === currentUser.id;
                  return (
                    <div
                      key={u.id}
                      className={`liquid-glass p-4 rounded-xl flex items-center gap-4 ${isMe ? "border border-white/20 bg-white/5" : "border border-white/5"}`}
                    >
                      <span className="font-heading italic text-lg font-bold w-10 text-center text-white/60">
                        {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                      </span>
                      {u.picture ? (
                        <img src={u.picture} alt={u.name} className="w-9 h-9 rounded-full border border-white/10" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center border border-white/15"><User className="h-3.5 w-3.5 text-white/70" /></div>
                      )}
                      <div className="flex-1 text-left">
                        <h4 className="text-sm font-semibold text-white leading-tight">
                          {u.name} {isMe && <span className="text-[10px] text-white/55 font-normal ml-1">(You)</span>}
                        </h4>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">{u.dept} • {u.year || "1st Year"}</p>
                      </div>
                      <span className="font-heading italic text-lg text-white font-bold">{u.points} PTS</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: Admin Management console */}
          {page === "admin" && isAdmin && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading italic text-2xl uppercase tracking-tight text-white">Console</h2>
                <button className="btn-secondary px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider" onClick={() => openAddMatch()}>
                  + Add Knockout
                </button>
              </div>

              <div className="flex gap-1.5 p-1 rounded-xl bg-white/5 border border-white/5 mb-6">
                {["results", "matches", "leaderboard", "participants"].map((tab) => (
                  <button
                    key={tab}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${adminTab === tab ? "bg-white text-black" : "text-white/60 hover:text-white"}`}
                    onClick={() => setAdminTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Sub-tab: Results scores input */}
              {adminTab === "results" && (
                <div className="space-y-4">
                  <div className="flex gap-1.5 overflow-x-auto pb-2 no-scrollbar">
                    {groups.map(g => (
                      <button
                        key={g}
                        className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg whitespace-nowrap transition-colors ${adminGroup === g ? "bg-white text-black" : "bg-white/5 text-white/60 hover:text-white"}`}
                        onClick={() => setAdminGroup(g)}
                      >
                        Group {g}
                      </button>
                    ))}
                  </div>

                  {FIXTURES.filter(f => f.group === adminGroup).map(fix => {
                    const res = results[fix.id];
                    return (
                      <div key={fix.id} className="liquid-glass p-4 rounded-xl border border-white/5 flex items-center justify-between text-left">
                        <div>
                          <h4 className="text-sm font-semibold text-white">{fl(fix.home)} {fix.home} vs {fix.away} {fl(fix.away)}</h4>
                          <p className="text-[10px] text-white/40 mt-1">{formatDate(fix.date)}</p>
                          {res && (
                            <div className="frozen-inner rounded-lg px-3 py-2 text-xs font-semibold text-white/80 mt-2 inline-block">
                              Result: {formatResultSummary(res, fix)}
                            </div>
                          )}
                        </div>
                        <button className="btn-secondary px-4 py-1.5 rounded-lg text-xs font-semibold" onClick={() => { setSelFixture(fix); setResHomeGoals(res?.homeGoals !== undefined ? String(res.homeGoals) : ""); setResAwayGoals(res?.awayGoals !== undefined ? String(res.awayGoals) : ""); }}>
                          {res ? "Edit" : "Result"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Sub-tab: Manage custom knockouts */}
              {adminTab === "matches" && (
                <div className="space-y-3">
                  {knockoutFixtures.length === 0 ? (
                    <p className="text-xs text-white/40 py-8 text-center">No knockout stage fixtures configured yet.</p>
                  ) : (
                    knockoutFixtures.map(fix => {
                      const res = results[fix.id];
                      return (
                        <div key={fix.id} className="liquid-glass p-4 rounded-xl border border-white/5 flex flex-col text-left">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="bg-white/10 border border-white/10 px-2.5 py-0.5 rounded text-[10px] text-white font-bold uppercase tracking-wider">{fix.round}</span>
                              <h4 className="text-sm font-semibold text-white mt-3">{fl(fix.home)} {fix.home} vs {fix.away} {fl(fix.away)}</h4>
                              <p className="text-[10px] text-white/45 mt-1">{formatDate(fix.date)} &nbsp;•&nbsp; {fix.venue}</p>
                              {res && (
                                <p className="frozen-inner rounded-lg px-3 py-2 text-xs font-bold text-white/80 mt-2 inline-block">Result: {formatResultSummary(res, fix)}</p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button className="btn-secondary px-3 py-1 rounded text-[10px] font-semibold" onClick={() => openAddMatch(fix)}>Edit</button>
                              <button className="btn-secondary px-3 py-1 rounded text-[10px] font-semibold border-red-500/30 text-red-400 hover:bg-red-500/10" onClick={() => handleDeleteMatch(fix.id)}>Delete</button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* Sub-tab: Standings */}
              {adminTab === "leaderboard" && (
                <div className="space-y-2">
                  {leaderboard.map((u, i) => (
                    <div key={u.id} className="liquid-glass p-3.5 rounded-xl border border-white/5 flex justify-between items-center text-left">
                      <div>
                        <h4 className="text-sm font-semibold text-white">{u.name}</h4>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">{u.dept} • {u.year || "1st Year"}</p>
                      </div>
                      <span className="font-heading italic text-lg text-white font-bold">{u.points} PTS</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Sub-tab: Participants statistics */}
              {adminTab === "participants" && (
                <div className="space-y-2">
                  {Object.values(users).map(u => {
                    const count = allFixtures.filter(f => predictions[`${u.id}_${f.id}`]).length;
                    return (
                      <div key={u.id} className="liquid-glass p-4 rounded-xl border border-white/5 flex items-center justify-between text-left">
                        <div>
                          <h4 className="text-sm font-semibold text-white">{u.name}</h4>
                          <span className="text-[10px] text-white/40 uppercase tracking-widest block mt-0.5">{u.dept} • {u.year || "1st Year"} • {u.email}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold text-white block">{count} / {allFixtures.length} predictions</span>
                          <span className="text-[9px] text-white/40 block mt-1">Joined: {new Date(u.joinedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────
          4. OVERLAYS & MODALS
          ─────────────────────────────────────────────────────────────────────── */}
      {/* Participant Score Predictions Modal */}
      {predFixture && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setPredFixture(null)}>
          <div className="liquid-glass p-6 w-full max-w-sm rounded-[1.25rem] border border-white/10 shadow-2xl relative text-left">
            <h3 className="font-heading italic text-2xl text-white tracking-tight uppercase">Lock Prediction</h3>
            <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1 mb-6">{formatDate(predFixture.date)} • {predFixture.venue}</p>

            <div className="frozen-inner rounded-xl p-4 flex items-center justify-around mb-6">
              <div className="text-center">
                <span className="text-4xl block">{fl(predFixture.home)}</span>
                <span className="text-xs font-semibold text-white/80 mt-1 block">{predFixture.home}</span>
              </div>
              <span className="text-xs font-bold text-white/20">VS</span>
              <div className="text-center">
                <span className="text-4xl block">{fl(predFixture.away)}</span>
                <span className="text-xs font-semibold text-white/80 mt-1 block">{predFixture.away}</span>
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-[10px] font-bold text-white/70 uppercase tracking-wider mb-2">Select winner (optional)</label>
              <div className="flex gap-2">
                {[predFixture.home, "Draw", predFixture.away].map(opt => (
                  <button
                    key={opt}
                    className={`flex-1 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all ${predWinner === opt ? "bg-white text-black border-white" : "frozen-inner text-white/60 hover:text-white"}`}
                    onClick={() => setPredWinner(opt)}
                  >
                    <div className="text-lg mb-1 leading-none">{fl(opt)}</div>
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-[10px] font-bold text-white/70 uppercase tracking-wider mb-2">Exact scoreline (optional)</label>
              <div className="frozen-inner rounded-xl p-4 flex items-center gap-3">
                <div className="flex-1 text-center">
                  <p className="text-[9px] text-white/45 uppercase tracking-wider mb-2 truncate">{predFixture.home}</p>
                  <input
                    className="input-glass w-full px-3 py-3 rounded-xl text-center text-lg font-semibold"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={predHomeGoals}
                    onChange={e => setPredHomeGoals(e.target.value)}
                  />
                </div>
                <span className="text-sm font-bold text-white/25 pt-5">–</span>
                <div className="flex-1 text-center">
                  <p className="text-[9px] text-white/45 uppercase tracking-wider mb-2 truncate">{predFixture.away}</p>
                  <input
                    className="input-glass w-full px-3 py-3 rounded-xl text-center text-lg font-semibold"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={predAwayGoals}
                    onChange={e => setPredAwayGoals(e.target.value)}
                  />
                </div>
              </div>
              <p className="text-[10px] text-white/40 mt-1.5 leading-snug">
                Enter scores in home–away order. Example: 3–2 means {predFixture.home} 3, {predFixture.away} 2.
              </p>
            </div>

            <div className="frozen-inner rounded-xl p-3.5 text-[11px] text-white/50 leading-relaxed mb-6">
              Predict the winner, the exact scoreline, or both. Once submitted, your prediction is <strong className="text-white">locked and cannot be modified</strong>.
            </div>

            <div className="flex gap-3">
              <button className="btn-primary flex-1 py-3 rounded-full text-xs uppercase tracking-widest font-bold" onClick={handleSavePrediction}>Lock Score</button>
              <button className="btn-secondary px-6 py-3 rounded-full text-xs font-semibold" onClick={() => setPredFixture(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Score Result submission Modal */}
      {selFixture && isAdmin && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setSelFixture(null)}>
          <div className="liquid-glass p-6 w-full max-w-sm rounded-[1.25rem] border border-white/15 shadow-2xl relative text-left">
            <h3 className="font-heading italic text-2xl text-white tracking-tight uppercase mb-2 text-amber-500">Record Match Score</h3>
            <p className="text-sm font-semibold text-white/90 mb-6">{fl(selFixture.home)} {selFixture.home} vs {selFixture.away} {fl(selFixture.away)}</p>

            <div className="mb-6">
              <label className="block text-[10px] font-bold text-white/70 uppercase tracking-wider mb-2">Final scoreline</label>
              <div className="frozen-inner rounded-xl p-4 flex items-center gap-3">
                <div className="flex-1 text-center">
                  <p className="text-[9px] text-white/45 uppercase tracking-wider mb-2 truncate">{selFixture.home}</p>
                  <input
                    className="input-glass w-full px-3 py-3 rounded-xl text-center text-lg font-semibold"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={resHomeGoals}
                    onChange={e => setResHomeGoals(e.target.value)}
                  />
                </div>
                <span className="text-sm font-bold text-white/25 pt-5">–</span>
                <div className="flex-1 text-center">
                  <p className="text-[9px] text-white/45 uppercase tracking-wider mb-2 truncate">{selFixture.away}</p>
                  <input
                    className="input-glass w-full px-3 py-3 rounded-xl text-center text-lg font-semibold"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={resAwayGoals}
                    onChange={e => setResAwayGoals(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="btn-primary flex-1 py-3 rounded-full text-xs uppercase tracking-widest font-bold" onClick={handleSaveResult}>Save Score</button>
              <button className="btn-secondary px-6 py-3 rounded-full text-xs font-semibold" onClick={() => setSelFixture(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Add/Edit Knockout Match Modal */}
      {showAddMatch && isAdmin && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setShowAddMatch(false)}>
          <div className="liquid-glass p-6 w-full max-w-md rounded-[1.25rem] border border-white/15 shadow-2xl relative text-left">
            <h3 className="font-heading italic text-2xl text-white tracking-tight uppercase mb-4 text-amber-500">
              {editingMatch ? "Edit Knockout Match" : "Add Knockout Match"}
            </h3>

            <div className="mb-5">
              <label className="block text-[10px] font-bold text-white/70 uppercase tracking-wider mb-2">Knockout Round</label>
              <div className="flex gap-1.5 flex-wrap">
                {ROUNDS.map(r => (
                  <button
                    key={r}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase border transition-all ${newRound === r ? "bg-white text-black border-white" : "bg-white/5 border-white/10 text-white/60 hover:text-white"}`}
                    onClick={() => setNewRound(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-5">
              <div>
                <label className="block text-[10px] font-bold text-white/70 uppercase tracking-wider mb-1.5">Home Team</label>
                <input className="input-glass w-full px-3 py-2 rounded-lg text-xs" placeholder="e.g. Argentina" value={newHome} onChange={e => setNewHome(e.target.value)} style={{ width: "100%", padding: 10, borderRadius: 8, fontSize: 13 }} />
              </div>
              <span className="text-center text-[10px] font-bold text-white/20 mt-4 hidden md:inline">VS</span>
              <div>
                <label className="block text-[10px] font-bold text-white/70 uppercase tracking-wider mb-1.5">Away Team</label>
                <input className="input-glass w-full px-3 py-2 rounded-lg text-xs" placeholder="e.g. France" value={newAway} onChange={e => setNewAway(e.target.value)} style={{ width: "100%", padding: 10, borderRadius: 8, fontSize: 13 }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-[10px] font-bold text-white/70 uppercase tracking-wider mb-1.5">Match Date</label>
                <input className="input-glass w-full px-3 py-2 rounded-lg text-xs" type="date" value={newDate} onChange={e => setNewDate(e.target.value)} style={{ width: "100%", padding: 10, borderRadius: 8, fontSize: 13 }} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-white/70 uppercase tracking-wider mb-1.5">Kick-off Time</label>
                <input className="input-glass w-full px-3 py-2 rounded-lg text-xs" type="time" value={newTime} onChange={e => setNewTime(e.target.value)} style={{ width: "100%", padding: 10, borderRadius: 8, fontSize: 13 }} />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-[10px] font-bold text-white/70 uppercase tracking-wider mb-1.5">Venue</label>
              <input className="input-glass w-full px-3 py-2 rounded-lg text-xs" placeholder="e.g. MetLife Stadium, New York" value={newVenue} onChange={e => setNewVenue(e.target.value)} style={{ width: "100%", padding: 10, borderRadius: 8, fontSize: 13 }} />
            </div>

            <div className="flex gap-3">
              <button className="btn-primary flex-1 py-3 rounded-full text-xs uppercase tracking-widest font-bold" onClick={handleSaveMatch}>
                {editingMatch ? "Update Match" : "Create Match"}
              </button>
              <button className="btn-secondary px-6 py-3 rounded-full text-xs font-semibold" onClick={() => setShowAddMatch(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
