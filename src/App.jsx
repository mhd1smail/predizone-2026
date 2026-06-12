/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Play, Award, LogOut, CheckCircle, User, Zap, Mail, Target, Lock, Unlock, Eye, Trophy, Calendar, Volume2, VolumeX } from "lucide-react";
import { useAuth } from "./context/AuthContext";
import { signInWithGoogle, signOutUser } from "./firebase/auth";
import { createUserProfile, getUserProfile, onAllUsers, savePrediction, saveResult, deleteKnockoutMatch, saveKnockoutMatch, onAllPredictions, onAllResults, onKnockoutMatches, onArenaSettings, updateArenaSettings, onFixtureOverrides, saveFixtureOverride, onUndoStatus, setUndoPoint, undoLastFixtureEdit } from "./firebase/firestore";

const FIXTURES = [
  // Group A
  { id: 1, group: "A", home: "Mexico", away: "South Africa", date: "2026-06-11T19:00:00Z", venue: "Estadio Azteca, Mexico City" },
  { id: 2, group: "A", home: "South Korea", away: "Czechia", date: "2026-06-12T02:00:00Z", venue: "Estadio Akron, Guadalajara" },
  { id: 3, group: "A", home: "Czechia", away: "South Africa", date: "2026-06-18T16:00:00Z", venue: "Mercedes-Benz Stadium, Atlanta" },
  { id: 4, group: "A", home: "Mexico", away: "South Korea", date: "2026-06-19T01:00:00Z", venue: "Estadio Akron, Guadalajara" },
  { id: 5, group: "A", home: "Czechia", away: "Mexico", date: "2026-06-25T01:00:00Z", venue: "Estadio Azteca, Mexico City" },
  { id: 6, group: "A", home: "South Africa", away: "South Korea", date: "2026-06-25T01:00:00Z", venue: "Estadio BBVA, Monterrey" },
  // Group B
  { id: 7, group: "B", home: "Canada", away: "Bosnia", date: "2026-06-12T19:00:00Z", venue: "BMO Field, Toronto" },
  { id: 8, group: "B", home: "Qatar", away: "Switzerland", date: "2026-06-13T19:00:00Z", venue: "Levi's Stadium, Santa Clara" },
  { id: 9, group: "B", home: "Switzerland", away: "Bosnia", date: "2026-06-18T19:00:00Z", venue: "SoFi Stadium, Inglewood" },
  { id: 10, group: "B", home: "Canada", away: "Qatar", date: "2026-06-18T22:00:00Z", venue: "BC Place, Vancouver" },
  { id: 11, group: "B", home: "Switzerland", away: "Canada", date: "2026-06-24T19:00:00Z", venue: "BC Place, Vancouver" },
  { id: 12, group: "B", home: "Bosnia", away: "Qatar", date: "2026-06-24T19:00:00Z", venue: "Lumen Field, Seattle" },
  // Group C
  { id: 13, group: "C", home: "Brazil", away: "Morocco", date: "2026-06-13T22:00:00Z", venue: "MetLife Stadium, East Rutherford" },
  { id: 14, group: "C", home: "Haiti", away: "Scotland", date: "2026-06-14T01:00:00Z", venue: "Gillette Stadium, Foxborough" },
  { id: 15, group: "C", home: "Scotland", away: "Morocco", date: "2026-06-19T22:00:00Z", venue: "Gillette Stadium, Foxborough" },
  { id: 16, group: "C", home: "Brazil", away: "Haiti", date: "2026-06-20T00:30:00Z", venue: "Lincoln Financial Field, Philadelphia" },
  { id: 17, group: "C", home: "Scotland", away: "Brazil", date: "2026-06-24T22:00:00Z", venue: "Hard Rock Stadium, Miami Gardens" },
  { id: 18, group: "C", home: "Morocco", away: "Haiti", date: "2026-06-24T22:00:00Z", venue: "Mercedes-Benz Stadium, Atlanta" },
  // Group D
  { id: 19, group: "D", home: "USA", away: "Paraguay", date: "2026-06-13T01:00:00Z", venue: "SoFi Stadium, Inglewood" },
  { id: 20, group: "D", home: "Australia", away: "Türkiye", date: "2026-06-14T04:00:00Z", venue: "BC Place, Vancouver" },
  { id: 21, group: "D", home: "USA", away: "Australia", date: "2026-06-19T19:00:00Z", venue: "Lumen Field, Seattle" },
  { id: 22, group: "D", home: "Türkiye", away: "Paraguay", date: "2026-06-20T03:00:00Z", venue: "Levi's Stadium, Santa Clara" },
  { id: 23, group: "D", home: "Türkiye", away: "USA", date: "2026-06-26T02:00:00Z", venue: "SoFi Stadium, Inglewood" },
  { id: 24, group: "D", home: "Paraguay", away: "Australia", date: "2026-06-26T02:00:00Z", venue: "Levi's Stadium, Santa Clara" },
  // Group E
  { id: 25, group: "E", home: "Germany", away: "Curaçao", date: "2026-06-14T17:00:00Z", venue: "NRG Stadium, Houston" },
  { id: 26, group: "E", home: "Ivory Coast", away: "Ecuador", date: "2026-06-14T23:00:00Z", venue: "Lincoln Financial Field, Philadelphia" },
  { id: 27, group: "E", home: "Germany", away: "Ivory Coast", date: "2026-06-20T20:00:00Z", venue: "BMO Field, Toronto" },
  { id: 28, group: "E", home: "Ecuador", away: "Curaçao", date: "2026-06-21T00:00:00Z", venue: "Arrowhead Stadium, Kansas City" },
  { id: 29, group: "E", home: "Curaçao", away: "Ivory Coast", date: "2026-06-25T20:00:00Z", venue: "Lincoln Financial Field, Philadelphia" },
  { id: 30, group: "E", home: "Ecuador", away: "Germany", date: "2026-06-25T20:00:00Z", venue: "MetLife Stadium, East Rutherford" },
  // Group F
  { id: 31, group: "F", home: "Netherlands", away: "Japan", date: "2026-06-14T20:00:00Z", venue: "AT&T Stadium, Arlington" },
  { id: 32, group: "F", home: "Sweden", away: "Tunisia", date: "2026-06-15T02:00:00Z", venue: "Estadio BBVA, Monterrey" },
  { id: 33, group: "F", home: "Netherlands", away: "Sweden", date: "2026-06-20T17:00:00Z", venue: "NRG Stadium, Houston" },
  { id: 34, group: "F", home: "Tunisia", away: "Japan", date: "2026-06-21T04:00:00Z", venue: "Estadio BBVA, Monterrey" },
  { id: 35, group: "F", home: "Japan", away: "Sweden", date: "2026-06-25T23:00:00Z", venue: "AT&T Stadium, Arlington" },
  { id: 36, group: "F", home: "Tunisia", away: "Netherlands", date: "2026-06-25T23:00:00Z", venue: "Arrowhead Stadium, Kansas City" },
  // Group G
  { id: 37, group: "G", home: "Belgium", away: "Egypt", date: "2026-06-15T19:00:00Z", venue: "Lumen Field, Seattle" },
  { id: 38, group: "G", home: "Iran", away: "New Zealand", date: "2026-06-16T01:00:00Z", venue: "SoFi Stadium, Inglewood" },
  { id: 39, group: "G", home: "Belgium", away: "Iran", date: "2026-06-21T19:00:00Z", venue: "SoFi Stadium, Inglewood" },
  { id: 40, group: "G", home: "New Zealand", away: "Egypt", date: "2026-06-22T01:00:00Z", venue: "BC Place, Vancouver" },
  { id: 41, group: "G", home: "Egypt", away: "Iran", date: "2026-06-27T03:00:00Z", venue: "Lumen Field, Seattle" },
  { id: 42, group: "G", home: "New Zealand", away: "Belgium", date: "2026-06-27T03:00:00Z", venue: "BC Place, Vancouver" },
  // Group H
  { id: 43, group: "H", home: "Spain", away: "Cape Verde", date: "2026-06-15T16:00:00Z", venue: "Mercedes-Benz Stadium, Atlanta" },
  { id: 44, group: "H", home: "Saudi Arabia", away: "Uruguay", date: "2026-06-15T22:00:00Z", venue: "Hard Rock Stadium, Miami Gardens" },
  { id: 45, group: "H", home: "Spain", away: "Saudi Arabia", date: "2026-06-21T16:00:00Z", venue: "Mercedes-Benz Stadium, Atlanta" },
  { id: 46, group: "H", home: "Uruguay", away: "Cape Verde", date: "2026-06-21T22:00:00Z", venue: "Hard Rock Stadium, Miami Gardens" },
  { id: 47, group: "H", home: "Cape Verde", away: "Saudi Arabia", date: "2026-06-27T00:00:00Z", venue: "NRG Stadium, Houston" },
  { id: 48, group: "H", home: "Uruguay", away: "Spain", date: "2026-06-27T00:00:00Z", venue: "Estadio Akron, Guadalajara" },
  // Group I
  { id: 49, group: "I", home: "France", away: "Senegal", date: "2026-06-16T19:00:00Z", venue: "MetLife Stadium, East Rutherford" },
  { id: 50, group: "I", home: "Iraq", away: "Norway", date: "2026-06-16T22:00:00Z", venue: "Gillette Stadium, Foxborough" },
  { id: 51, group: "I", home: "France", away: "Iraq", date: "2026-06-22T21:00:00Z", venue: "Lincoln Financial Field, Philadelphia" },
  { id: 52, group: "I", home: "Norway", away: "Senegal", date: "2026-06-23T00:00:00Z", venue: "MetLife Stadium, East Rutherford" },
  { id: 53, group: "I", home: "Norway", away: "France", date: "2026-06-26T19:00:00Z", venue: "Gillette Stadium, Foxborough" },
  { id: 54, group: "I", home: "Senegal", away: "Iraq", date: "2026-06-26T19:00:00Z", venue: "BMO Field, Toronto" },
  // Group J
  { id: 55, group: "J", home: "Argentina", away: "Algeria", date: "2026-06-17T01:00:00Z", venue: "Arrowhead Stadium, Kansas City" },
  { id: 56, group: "J", home: "Austria", away: "Jordan", date: "2026-06-17T04:00:00Z", venue: "Levi's Stadium, Santa Clara" },
  { id: 57, group: "J", home: "Argentina", away: "Austria", date: "2026-06-22T17:00:00Z", venue: "AT&T Stadium, Arlington" },
  { id: 58, group: "J", home: "Jordan", away: "Algeria", date: "2026-06-23T03:00:00Z", venue: "Levi's Stadium, Santa Clara" },
  { id: 59, group: "J", home: "Algeria", away: "Austria", date: "2026-06-28T02:00:00Z", venue: "Arrowhead Stadium, Kansas City" },
  { id: 60, group: "J", home: "Jordan", away: "Argentina", date: "2026-06-28T02:00:00Z", venue: "AT&T Stadium, Arlington" },
  // Group K
  { id: 61, group: "K", home: "Portugal", away: "DR Congo", date: "2026-06-17T17:00:00Z", venue: "NRG Stadium, Houston" },
  { id: 62, group: "K", home: "Uzbekistan", away: "Colombia", date: "2026-06-18T02:00:00Z", venue: "Estadio Azteca, Mexico City" },
  { id: 63, group: "K", home: "Portugal", away: "Uzbekistan", date: "2026-06-23T17:00:00Z", venue: "NRG Stadium, Houston" },
  { id: 64, group: "K", home: "Colombia", away: "DR Congo", date: "2026-06-24T02:00:00Z", venue: "Estadio Akron, Guadalajara" },
  { id: 65, group: "K", home: "Colombia", away: "Portugal", date: "2026-06-27T23:30:00Z", venue: "Hard Rock Stadium, Miami Gardens" },
  { id: 66, group: "K", home: "DR Congo", away: "Uzbekistan", date: "2026-06-27T23:30:00Z", venue: "Mercedes-Benz Stadium, Atlanta" },
  // Group L
  { id: 67, group: "L", home: "England", away: "Croatia", date: "2026-06-17T20:00:00Z", venue: "AT&T Stadium, Arlington" },
  { id: 68, group: "L", home: "Ghana", away: "Panama", date: "2026-06-17T23:00:00Z", venue: "BMO Field, Toronto" },
  { id: 69, group: "L", home: "England", away: "Ghana", date: "2026-06-23T20:00:00Z", venue: "Gillette Stadium, Foxborough" },
  { id: 70, group: "L", home: "Panama", away: "Croatia", date: "2026-06-23T23:00:00Z", venue: "BMO Field, Toronto" },
  { id: 71, group: "L", home: "Panama", away: "England", date: "2026-06-27T21:00:00Z", venue: "MetLife Stadium, East Rutherford" },
  { id: 72, group: "L", home: "Croatia", away: "Ghana", date: "2026-06-27T21:00:00Z", venue: "Lincoln Financial Field, Philadelphia" },
];

const ROUNDS = ["Round of 32", "Round of 16", "Quarterfinal", "Semifinal", "Third Place", "Final"];
const STUDY_YEARS = ["2nd Year", "3rd Year", "PG 1st Year", "PG 2nd Year"];

const FLAGS = {
  "Mexico": "🇲🇽", "South Africa": "🇿🇦", "South Korea": "🇰🇷", "Czechia": "🇨🇿",
  "Canada": "🇨🇦", "Bosnia": "🇧🇦", "Qatar": "🇶🇦", "Switzerland": "🇨🇭",
  "Brazil": "🇧🇷", "Morocco": "🇲🇦", "Haiti": "🇭🇹", "Scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  "USA": "🇺🇸", "Paraguay": "🇵🇾", "Australia": "🇦🇺", "Türkiye": "🇹🇷",
  "Germany": "🇩🇪", "Curaçao": "🇨🇼", "Ivory Coast": "🇨🇮", "Ecuador": "🇪🇨",
  "Netherlands": "🇳🇱", "Japan": "🇯🇵", "Sweden": "🇸🇪", "Tunisia": "🇹🇳",
  "Belgium": "🇧🇪", "Egypt": "🇪🇬", "Iran": "🇮🇷", "New Zealand": "🇳🇿",
  "Spain": "🇪🇸", "Cape Verde": "🇨🇻", "Saudi Arabia": "🇸🇦", "Uruguay": "🇺🇾",
  "France": "🇫🇷", "Senegal": "🇸🇳", "Iraq": "🇮🇶", "Norway": "🇳🇴",
  "Argentina": "🇦🇷", "Algeria": "🇩🇿", "Austria": "🇦🇹", "Jordan": "🇯🇴",
  "Portugal": "🇵🇹", "DR Congo": "🇨🇩", "Uzbekistan": "🇺🇿", "Colombia": "🇨🇴",
  "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "Croatia": "🇭🇷", "Ghana": "🇬🇭", "Panama": "🇵🇦",
  "Draw": "🤝"
};
const fl = t => FLAGS[t] || "🌍";
const HERO_VIDEO_SRC = "https://res.cloudinary.com/dl0yhguyp/video/upload/q_auto/f_auto/v1780865223/hero-bg_nfckfc.mp4";

const DASHBOARD_VIDEO_SRC = "https://res.cloudinary.com/dl0yhguyp/video/upload/q_auto/f_auto/v1780930655/bgm_yu1cch.mp4";
const HERO_VIDEO_FALLBACK = "https://res.cloudinary.com/dl0yhguyp/video/upload/q_auto/f_auto/v1780865223/hero-bg_nfckfc.mp4";
const BG_MUSIC_SRC = "/bgm.mp3";

const CREATOR_LINKS = {
  linkedin: "https://www.linkedin.com/in/muhammedismaila/",
  email: "mailto:ismail.threathunt@gmail.com",
  github: "https://github.com/mhd1smail",
  instagram: "https://www.instagram.com/1sm8il/",
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

function IconInstagram({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

const JERSEY_PLACEHOLDER = "/jerseys/argentina.png";
const TEAM_BG_PALETTE = ["#F4845F", "#6BBF7A", "#E882B4", "#6EB5FF", "#C9A84C", "#9B7FD4", "#E85D5D", "#4ECDC4"];

function teamJerseyPath(name) {
  const slug = name.toLowerCase().replace(/\s+/g, "-").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return `/jerseys/${slug}.png`;
}

function buildTeamsFromFixtures() {
  const seen = new Map();
  const groupOrder = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
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

const SPONSORS = [
  { label: "FULVA", name: "Fulva Café & Bakery", desc: "Official Catering & Refreshments Partner", logo: "/sponsor_fulva.png" },
  { label: "RF INDUSTRIES", name: "RF Apparel", desc: "Official Apparel & Sports Gear Supplier", logo: "/sponsor_rf.png" }
];

const HERO_STEPS = [
  { icon: User, title: "Sign In", desc: "Log in with Google using your name, department, and year of study." },
  { icon: Target, title: "Predict", desc: "Pick match winners and exact scorelines before kickoff — each match locks 30 min early." },
  { icon: Award, title: "Compete", desc: "Earn up to 5 points per match and climb the campus leaderboard for 1st, 2nd, and 3rd place." },
];

const OFFICIAL_RULES = [
  { num: 1, text: "All predictions must be submitted through the official Predizone website." },
  { num: 2, text: "Participants must log in using their full name, department, and year of study before submitting predictions." },
  { num: 3, text: "Predictions for each match will open in the morning and close 30 minutes before the match begins." },
  { num: 4, text: "Participants must predict:", bullets: ["The winner of the match, and/or", "The exact final scoreline."] },
  { num: 5, text: "Score predictions must be entered in the correct order. For example, if the match is Argentina vs Brazil and you predict 3–2, it means Argentina 3 – Brazil 2." },
  { num: 6, text: "Points will be awarded as follows:", bullets: ["Correct winner prediction: 3 points", "Correct scoreline prediction: 2 points", "Correct winner and scoreline prediction: 5 points"] },
  { num: 7, text: "Participants can track their scores and rankings through the Predizone leaderboard on the official website." },
  { num: 8, text: "At the end of the tournament, the participants with the highest points will be awarded 1st, 2nd, and 3rd places." },
  { num: 9, text: "In the event of a tie, the final decision will be made by the Predizone Organizing Team." },
];

function isSameLocalDay(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

function isLocked(fixture, arenaLocked) {
  if (arenaLocked) return true;
  const now = new Date();
  const match = new Date(fixture.date);
  const lock = new Date(match.getTime() - 1800000);
  const unlock = new Date(match.getTime() - 86400000);
  return now < unlock || now >= lock;
}

function getStatus(fixture, arenaLocked) {
  const now = new Date(), match = new Date(fixture.date);
  const lock = new Date(match.getTime() - 1800000);
  const unlock = new Date(match.getTime() - 86400000);
  if (arenaLocked) return "locked";
  if (now >= lock) return "played";
  if (now < unlock) return "locked";
  return "open";
}

function formatDate(ds) {
  const d = new Date(ds);
  const date = d.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", weekday: "short", month: "short", day: "numeric" });
  const time = d.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" });
  return date + " • " + time + " IST";
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

function mergeFixtures(base, overrides) {
  return base.map(f => overrides[f.id] ? { ...f, ...overrides[f.id] } : f);
}

function buildLeaderboard(users, predictions, results, knockoutFixtures, fixtureOverrides) {
  const merged = mergeFixtures(FIXTURES, fixtureOverrides || {});
  const allFixtures = [...merged, ...knockoutFixtures];
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

function getFixturePredictionStats(fixtureId, allPreds, homeTeam, awayTeam) {
  const fixturePreds = Object.values(allPreds).filter(p => String(p.fixtureId) === String(fixtureId) && p.winner);
  const total = fixturePreds.length;
  if (total === 0) return null;
  const merged = {};
  fixturePreds.forEach(p => {
    const raw = typeof p.winner === "string" ? p.winner.trim() : String(p.winner);
    const key = raw.toLowerCase();
    const isHome = key === (homeTeam || '').toLowerCase();
    const isAway = key === (awayTeam || '').toLowerCase();
    const isDraw = !isHome && !isAway;
    const finalKey = isDraw ? 'draw' : key;
    if (!merged[finalKey]) merged[finalKey] = { team: isDraw ? 'Draw' : raw, count: 0 };
    merged[finalKey].count += 1;
  });
  const bars = Object.values(merged)
    .sort((a, b) => b.count - a.count)
    .map(bar => ({ ...bar, pct: Math.round((bar.count / total) * 100) }));
  return { total, bars };
}

function getUserStats(uid, preds, res, fixtures) {
  const userPreds = Object.values(preds).filter(p => p.uid === uid);
  const scored = userPreds.filter(p => res[p.fixtureId]);
  const correctWinners = scored.filter(p => {
    const r = res[p.fixtureId];
    return p.winner && r.winner && p.winner === r.winner;
  });
  const scoredWithScore = scored.filter(p => hasScoreline(p));
  const correctScorelines = scoredWithScore.filter(p => {
    const r = res[p.fixtureId];
    return hasScoreline(r) &&
      parseInt(p.homeGoals, 10) === parseInt(r.homeGoals, 10) &&
      parseInt(p.awayGoals, 10) === parseInt(r.awayGoals, 10);
  });
  const winnerAcc = scored.length > 0 ? Math.round((correctWinners.length / scored.length) * 100) : 0;
  const scorelineAcc = scoredWithScore.length > 0 ? Math.round((correctScorelines.length / scoredWithScore.length) * 100) : winnerAcc;
  const totalPossible = fixtures.length;
  return {
    totalPredictions: userPreds.length,
    scoredPredictions: scored.length,
    correctWinners: correctWinners.length,
    accuracy: winnerAcc,
    correctScorelines: correctScorelines.length,
    totalScorelinePreds: scoredWithScore.length,
    scorelineAccuracy: scorelineAcc,
    overallAccuracy: Math.round((winnerAcc + scorelineAcc) / 2),
    totalPossible,
  };
}

function normaliseName(name) {
  return name.trim().replace(/\s+/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

function normaliseDept(dept) {
  return dept.trim().replace(/\s+/g, " ");
}

if (typeof window !== "undefined") {
  const originalError = console.error;
  console.error = (...args) => {
    if (args[0] && args[0].includes && args[0].includes("Framer Motion")) return;
    originalError(...args);
  };
}

function FixedVideoBackground({ src, fallbackSrc, muted = true }) {
  const [activeSrc, setActiveSrc] = useState(src);
  const videoRef = useRef(null);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const tryPlay = () => { const p = video.play(); if (p && typeof p.catch === "function") { p.catch(() => { }); } };
    tryPlay();
    video.addEventListener("canplay", tryPlay);
    return () => video.removeEventListener("canplay", tryPlay);
  }, [activeSrc]);
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);
  return (
    <div className="fixed-video-bg" aria-hidden="true">
      <video ref={videoRef} src={activeSrc} className="fixed-video-bg__video" loop autoPlay playsInline preload="auto"
        onError={() => { if (fallbackSrc && activeSrc !== fallbackSrc) setActiveSrc(fallbackSrc); }} />
      <div className="fixed-video-bg__overlay video-bg-overlay--gradient" />
    </div>
  );
}

function BlurText({ text, className }) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsInView(true); }, { threshold: 0.1 });
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, []);
  const words = text.split(" ");
  return (
    <p ref={ref} className={className} style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", rowGap: "0.1em" }}>
      {words.map((word, i) => (
        <motion.span key={i}
          initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
          animate={isInView ? { filter: ["blur(10px)", "blur(5px)", "blur(0px)"], opacity: [0, 0.5, 1], y: [50, -5, 0] } : {}}
          transition={{ duration: 0.7, times: [0, 0.5, 1], ease: "easeOut", delay: i * 0.1 }}
          style={{ display: "inline-block", marginRight: "0.28em" }}>
          {word}
        </motion.span>
      ))}
    </p>
  );
}

export default function App() {
  const { currentUser, isAdmin, loading: authLoading, setCurrentUser } = useAuth();
  const [page, setPage] = useState("splash");
  const [userTab, setUserTab] = useState("fixtures");
  const [users, setUsers] = useState({});
  const [predictions, setPredictions] = useState({});
  const [results, setResults] = useState({});
  const [knockoutFixtures, setKnockoutFixtures] = useState([]);
  const [arenaSettings, setArenaSettings] = useState({ arenaLocked: false });
  const [toast, setToast] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);
  const [adminTab, setAdminTab] = useState("results");
  const [adminGroup, setAdminGroup] = useState("A");
  const [viewingParticipant, setViewingParticipant] = useState(null);
  const [registerName, setRegisterName] = useState("");
  const [registerDept, setRegisterDept] = useState("");
  const [registerYear, setRegisterYear] = useState("2nd Year");
  const [predFixture, setPredFixture] = useState(null);
  const [predWinner, setPredWinner] = useState("");
  const [predHomeGoals, setPredHomeGoals] = useState("");
  const [predAwayGoals, setPredAwayGoals] = useState("");
  const [selFixture, setSelFixture] = useState(null);
  const [resHomeGoals, setResHomeGoals] = useState("");
  const [resAwayGoals, setResAwayGoals] = useState("");
  const [showAddMatch, setShowAddMatch] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [fixtureOverrides, setFixtureOverrides] = useState({});
  const [undoInfo, setUndoInfo] = useState(null);
  const [editFixture, setEditFixture] = useState(null);
  const [editFixtureHome, setEditFixtureHome] = useState("");
  const [editFixtureAway, setEditFixtureAway] = useState("");
  const [editFixtureDate, setEditFixtureDate] = useState("");
  const [editFixtureTime, setEditFixtureTime] = useState("");
  const [editFixtureVenue, setEditFixtureVenue] = useState("");
  const [newRound, setNewRound] = useState("Round of 32");
  const [newHome, setNewHome] = useState("");
  const [newAway, setNewAway] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newVenue, setNewVenue] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  const [needsProfile, setNeedsProfile] = useState(false);
  const [pendingFbUser, setPendingFbUser] = useState(null);
  const containerRef = useRef(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const play = () => { el.play().catch(() => {}); };
    play();
    const handler = () => { play(); document.removeEventListener("click", handler); };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  useEffect(() => {
    [JERSEY_PLACEHOLDER, ...TEAMS.map((t) => t.jersey)].forEach((src) => { const i = new Image(); i.src = src; });
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const initialPageSet = useRef(false);
  useEffect(() => {
    if (initialPageSet.current) return;
    if (authLoading) return;
    if (currentUser && !currentUser.isAdmin) {
      setPage("home");
      setNeedsProfile(false);
    } else if (currentUser && currentUser.isAdmin) {
      setPage("admin");
      setNeedsProfile(false);
    } else if (!currentUser) {
      setPage("splash");
    }
    initialPageSet.current = true;
  }, [currentUser, authLoading]);

  useEffect(() => {
    const unsubArena = onArenaSettings((s) => setArenaSettings(s));
    const unsubOverrides = onFixtureOverrides((o) => setFixtureOverrides(o));
    return () => { unsubArena(); unsubOverrides(); };
  }, []);

  useEffect(() => {
    const unsubUndo = onUndoStatus((info) => setUndoInfo(info));
    return () => unsubUndo();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const unsubUsers = onAllUsers((u) => setUsers(u));
    const unsubResults = onAllResults((r) => setResults(r));
    const unsubKnock = onKnockoutMatches((k) => setKnockoutFixtures(k));
    const unsubPreds = onAllPredictions((preds) => {
      setPredictions(preds);
    });

    return () => { unsubUsers(); unsubResults(); unsubKnock(); unsubPreds(); };
  }, [currentUser]);

  const handleGoogleSignIn = async () => {
    if (signingIn) return;
    setSigningIn(true);
    const { user: fbUser, error } = await signInWithGoogle();
    setSigningIn(false);
    if (error) { showToast(error, "error"); return; }
    if (!fbUser) { showToast("Sign in cancelled.", "error"); return; }

    const profile = await getUserProfile(fbUser.uid);
    if (profile) {
      setCurrentUser(profile);
      if (profile.isAdmin) { setPage("admin"); } else { setPage("home"); }
      showToast(`Welcome back, ${profile.name}!`);
    } else {
      setPendingFbUser(fbUser);
      setRegisterName(normaliseName(fbUser.displayName || ""));
      setRegisterDept("");
      setRegisterYear("1st Year");
      setNeedsProfile(true);
    }
  };

  const handleCompleteRegistration = async () => {
    if (!needsProfile || !pendingFbUser) return;

    const rawName = registerName.trim();
    const rawDept = registerDept.trim();
    if (rawName.length < 3) { showToast("Enter your full name (min 3 characters)!", "error"); return; }
    if (!/^[a-zA-Z\s]+$/.test(rawName)) { showToast("Name should only contain letters!", "error"); return; }
    if (rawDept.length < 2) { showToast("Enter your department name!", "error"); return; }

    const name = normaliseName(rawName);
    const dept = normaliseDept(rawDept);
    const fbUser = pendingFbUser;

    const uid = fbUser.uid;
    await createUserProfile(uid, {
      name,
      dept,
      year: registerYear,
      email: fbUser.email || "",
      photoURL: fbUser.photoURL || "",
    });

    const profile = await getUserProfile(uid);
    setCurrentUser(profile);
    setNeedsProfile(false);
    setPendingFbUser(null);
    setPage("home");
    showToast(`Account registered! Welcome to the Arena, ${name}!`);
  };

  const handleLogout = async () => {
    await signOutUser();
    setPage("splash");
    setCurrentSlide(0);
    setNeedsProfile(false);
    setPendingFbUser(null);
    if (window.history.pushState) {
      const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
      window.history.pushState({ path: newurl }, '', newurl);
    }
  };

  const handleSavePrediction = async () => {
    if (!currentUser || !predFixture) return;
    const hasWinner = !!predWinner;
    const hasScore = predHomeGoals !== "" && predAwayGoals !== "" && !isNaN(predHomeGoals) && !isNaN(predAwayGoals) && parseInt(predHomeGoals, 10) >= 0 && parseInt(predAwayGoals, 10) >= 0;
    if (!hasWinner && !hasScore) { showToast("Predict the winner and/or exact scoreline!", "error"); return; }
    if (hasScore && hasWinner) {
      const derivedWinner = winnerFromScore(predHomeGoals, predAwayGoals, predFixture.home, predFixture.away);
      if (derivedWinner !== predWinner) { showToast("Winner must match your scoreline!", "error"); return; }
    }
    if (isLocked(predFixture, arenaSettings.arenaLocked)) { showToast("Match predictions are locked!", "error"); return; }

    const key = `${currentUser.id}_${predFixture.id}`;
    if (predictions[key]) { showToast("Prediction already locked!", "error"); return; }

    await savePrediction(currentUser.id, predFixture.id, {
      ...(hasWinner ? { winner: predWinner } : {}),
      ...(hasScore ? { homeGoals: parseInt(predHomeGoals, 10), awayGoals: parseInt(predAwayGoals, 10) } : {}),
    });

    setPredFixture(null);
    setPredWinner("");
    setPredHomeGoals("");
    setPredAwayGoals("");
    showToast("Prediction locked successfully!");
  };

  const handleSaveResult = async () => {
    if (!selFixture) return;
    if (resHomeGoals === "" || resAwayGoals === "" || isNaN(resHomeGoals) || isNaN(resAwayGoals)) { showToast("Enter the full scoreline!", "error"); return; }
    const homeGoals = parseInt(resHomeGoals, 10);
    const awayGoals = parseInt(resAwayGoals, 10);
    if (homeGoals < 0 || awayGoals < 0) { showToast("Enter a valid scoreline!", "error"); return; }

    await saveResult(selFixture.id, {
      winner: winnerFromScore(homeGoals, awayGoals, selFixture.home, selFixture.away),
      homeGoals,
      awayGoals,
    });

    setSelFixture(null);
    setResHomeGoals("");
    setResAwayGoals("");
    showToast("Score updated. Leaderboards re-calculated!");
  };

  const handleDeleteMatch = async (matchId) => {
    await deleteKnockoutMatch(matchId);
    showToast("Match removed from database.");
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    const scrollTop = containerRef.current.scrollTop;
    const height = containerRef.current.clientHeight;
    const slideIndex = Math.round(scrollTop / height);
    if (slideIndex !== currentSlide) setCurrentSlide(slideIndex);
  };

  const scrollToSlide = (index) => {
    if (!containerRef.current) return;
    const sections = containerRef.current.querySelectorAll(".scroll-section");
    if (!sections[index]) return;
    containerRef.current.scrollTo({ top: sections[index].offsetTop, behavior: "smooth" });
  };

  const getRoleStyle = (i) => {
    const total = TEAMS.length;
    let diff = i - activeIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    if (diff === 0) {
      return { display: "block", top: "50%", transform: "translate(-50%, -50%) scale(1)", filter: "brightness(1)", zIndex: 20, opacity: 1, width: isMobile ? "min(68vw, 300px)" : "clamp(200px, 38vw, 420px)", height: isMobile ? "min(42vh, 360px)" : "auto" };
    } else if (Math.abs(diff) === 1) {
      const side = diff > 0 ? 1 : -1;
      const offset = isMobile ? 34 : 45;
      return { display: "block", top: "50%", transform: `translate(calc(-50% + ${side * offset}%), -50%) scale(${isMobile ? 0.82 : 0.78})`, filter: "brightness(0.72)", zIndex: 10, opacity: 0.85, width: isMobile ? "min(52vw, 230px)" : "clamp(160px, 30vw, 340px)", height: isMobile ? "min(34vh, 300px)" : "auto" };
    } else if (Math.abs(diff) === 2) {
      const side = diff > 0 ? 1 : -1;
      const offset = isMobile ? 68 : 80;
      return { display: "block", top: "50%", transform: `translate(calc(-50% + ${side * offset}%), -50%) scale(0.55)`, filter: "brightness(0.45)", zIndex: 1, opacity: 0, width: isMobile ? "min(38vw, 170px)" : "clamp(120px, 22vw, 260px)", height: isMobile ? "min(24vh, 220px)" : "auto" };
    } else {
      return { display: "none" };
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

  const handleJerseyTouchStart = (e) => { jerseySwipeStart.current = e.touches[0].clientX; };
  const handleJerseyTouchEnd = (e) => {
    if (jerseySwipeStart.current === null) return;
    const deltaX = e.changedTouches[0].clientX - jerseySwipeStart.current;
    if (Math.abs(deltaX) > 48) navigateTeams(deltaX < 0 ? "next" : "prev");
    jerseySwipeStart.current = null;
  };

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
    };

    await saveKnockoutMatch(matchData);
    setShowAddMatch(false);
    setEditingMatch(null);
    showToast(editingMatch ? "Match updated!" : "Knockout match added!");
  };

  const openEditFixture = (fix) => {
    setEditFixture(fix);
    setEditFixtureHome(fix.home);
    setEditFixtureAway(fix.away);
    const d = new Date(fix.date);
    setEditFixtureDate(d.toISOString().split("T")[0]);
    setEditFixtureTime(d.toTimeString().slice(0, 5));
    setEditFixtureVenue(fix.venue);
  };

  const handleSaveFixtureEdit = async () => {
    if (!editFixture) return;
    if (!editFixtureDate || !editFixtureTime) { showToast("Enter date and time!", "error"); return; }
    const prev = fixtureOverrides?.[editFixture.id] || null;
    const override = {
      date: `${editFixtureDate}T${editFixtureTime}:00`,
      venue: editFixtureVenue.trim() || editFixture.venue,
    };
    if (editFixtureHome.trim()) override.home = editFixtureHome.trim();
    if (editFixtureAway.trim()) override.away = editFixtureAway.trim();
    await setUndoPoint(editFixture.id, prev);
    await saveFixtureOverride(editFixture.id, override);
    setEditFixture(null);
    showToast("Fixture updated!");
  };

  const handleUndoFixtureEdit = async () => {
    const result = await undoLastFixtureEdit();
    if (result === "expired") { showToast("Undo window expired (1 hour)", "error"); }
    else if (result === "undone") { showToast("Edit undone!"); }
  };

  const leaderboard = buildLeaderboard(users, predictions, results, knockoutFixtures, fixtureOverrides);
  const allFixtures = [...mergeFixtures(FIXTURES, fixtureOverrides || {}), ...knockoutFixtures];
  const now = new Date();
  const sortedFixtures = [...allFixtures].sort((a, b) => new Date(a.date) - new Date(b.date));
  const todayFixtures = allFixtures.filter(f => isSameLocalDay(f.date));
  const futureFixtures = sortedFixtures.filter(f => new Date(f.date) > now);
  const upcomingFiltered = sortedFixtures;
  const finishedFixtures = sortedFixtures.filter(f => new Date(f.date).getTime() - 1800000 <= now);
  const groups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
  const isLockedGlobal = arenaSettings.arenaLocked;

  if (authLoading) return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white gap-4">
      <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      <span className="font-body text-xs tracking-widest uppercase opacity-60">Initializing Predictor...</span>
    </div>
  );

  return (
    <div className="relative w-full overflow-hidden bg-black text-white font-body selection:bg-white/20">

      {toast && (
        <div className="toast-msg glass-panel p-4 rounded-[1.25rem] flex items-center gap-3 bg-black/90 border border-white/25 shadow-2xl max-w-sm pointer-events-auto">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 text-white font-bold">
            {toast.type === "error" ? "!" : "✓"}
          </div>
          <p className="text-sm font-medium text-white/95 leading-tight">{toast.msg}</p>
        </div>
      )}

      {page === "splash" && !currentUser && !needsProfile && (
        <>
          <FixedVideoBackground src={HERO_VIDEO_SRC} fallbackSrc={HERO_VIDEO_FALLBACK} />

          <nav className="fixed top-4 left-0 w-full px-8 lg:px-16 z-50 flex items-center justify-between pointer-events-auto">
            <button type="button" className="liquid-glass px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full cursor-pointer select-none" onClick={() => scrollToSlide(0)}>
              <span className="font-heading italic text-base sm:text-xl tracking-tight text-white uppercase font-bold">PREDIZONE</span>
            </button>
            <div className="hidden sm:flex liquid-glass px-1.5 py-1.5 rounded-full items-center gap-1 shadow-lg">
              {["Welcome", "How to Play", "Teams", "Sponsors", "Join"].map((item, index) => (
                <button key={item} className="px-4 py-1.5 text-xs uppercase tracking-wider text-white/80 hover:text-white font-medium transition-colors" onClick={() => scrollToSlide(index)}>{item}</button>
              ))}
            </div>
            <button className="px-5 py-2.5 rounded-full bg-white text-black text-xs font-semibold uppercase tracking-wider hover:bg-white/90 transition-colors shadow-lg whitespace-nowrap flex items-center gap-1.5" onClick={() => scrollToSlide(4)}>
              Enter Arena <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </nav>

          <div ref={containerRef} onScroll={handleScroll} className="scroll-container scroll-container--over-video">

            <div className="scroll-section scroll-section--over-video scroll-section--hero">
              <div className="scroll-slide-inner px-4 max-w-4xl text-center mx-auto w-full">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
                  className="lg:mt-24 py-2 px-3 sm:py-1.5 sm:pl-1.5 sm:pr-4 rounded-full inline-flex items-center justify-center gap-2 sm:gap-3 text-xs mt-0 md:mt-0 mb-6 max-w-full mx-auto bg-red-950/40 border border-red-500/30 backdrop-blur-md shadow-lg flex-nowrap whitespace-nowrap">
                  <span className="bg-white text-black px-2.5 py-1 rounded-full font-bold uppercase tracking-wider text-[10px] shrink-0">WC 2026</span>
                  <span className="text-white/95 text-[11px] sm:text-xs leading-none font-medium tracking-wide">FIFA World Cup College Prediction Arena</span>
                </motion.div>

                <BlurText text="PREDICT MATCHES. WIN THE LEAGUE."
                  className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-heading italic text-white leading-[0.9] max-w-3xl justify-center tracking-[-2px] sm:tracking-[-3px] uppercase font-bold" />

                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 }}
                  className="mt-6 text-sm md:text-base text-white/80 max-w-xl mx-auto font-light leading-relaxed">
                  Predizone is your official FIFA World Cup 2026 prediction arena. Sign in, submit your picks for today&apos;s fixtures, earn points for correct winners and scorelines, and compete with students across campus.
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut", delay: 1.1 }}
                  className="flex items-center justify-center gap-6 mt-8">
                  <button className="liquid-glass-strong px-7 py-3 rounded-full text-xs uppercase tracking-wider font-semibold text-white flex items-center gap-2" onClick={() => scrollToSlide(4)}>
                    Start Predicting <ArrowUpRight className="h-4 w-4" />
                  </button>
                  <button className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-white hover:opacity-80 transition-opacity" onClick={() => scrollToSlide(1)}>
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20"><Play className="h-3 w-3 fill-current text-white" /></div> View Rules
                  </button>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut", delay: 1.3 }} className="mt-8 sm:mt-12 w-full max-w-3xl">
                  <p className="text-[10px] sm:text-xs text-white/45 uppercase tracking-[0.2em] font-semibold mb-4">How it works</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-left mb-8 pb-8">
                    {HERO_STEPS.map((step, i) => {
                      const Icon = step.icon;
                      return (
                        <div key={step.title} className="liquid-glass p-3 sm:p-4 rounded-[1.25rem] border border-white/5">
                          <div className="frozen-inner rounded-xl p-4 h-full">
                            <div className="flex items-center gap-2.5 mb-3">
                              <span className="frozen-tag w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold text-white/70">{i + 1}</span>
                              <Icon className="h-5 w-5 text-white/90 shrink-0" />
                            </div>
                            <h3 className="font-heading italic text-xl text-white uppercase tracking-tight leading-none">{step.title}</h3>
                            <p className="mt-2 text-[11px] sm:text-xs text-white/60 leading-relaxed font-light">{step.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="scroll-section scroll-section--over-video scroll-section--predict">
              <div className="predict-slide__inner relative z-10 px-4 sm:px-8 md:px-16 lg:px-20 flex flex-col w-full max-w-7xl mx-auto justify-start gap-5 md:gap-8">
                <div className="text-left shrink-0">
                  <h2 className="font-heading italic text-white text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] leading-[0.9] tracking-[-3px] uppercase">OFFICIAL RULES</h2>
                  <p className="mt-3 text-xs sm:text-sm text-white/55 uppercase tracking-widest font-semibold">Predizone tournament guidelines</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 w-full pb-20">
                  {OFFICIAL_RULES.map((rule) => (
                    <div key={rule.num} className="liquid-glass rounded-[1.25rem] p-4 sm:p-5 border border-white/5 hover:border-white/10 transition-colors flex flex-col gap-3">
                      <div className="frozen-inner rounded-xl px-3 py-2.5 flex items-center gap-3">
                        <span className="frozen-tag w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold text-white shrink-0">{rule.num}</span>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-white/45 font-bold">Rule {rule.num}</span>
                      </div>
                      <div className="frozen-inner rounded-xl p-4 flex-1">
                        <p className="text-xs sm:text-[13px] text-white/75 leading-relaxed font-light">{rule.text}</p>
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

            <div className="scroll-section scroll-section--solid scroll-section--teams transition-colors duration-[650ms]" style={{ backgroundColor: TEAMS[activeIndex].bg }}>
              <div className="absolute inset-0 pointer-events-none z-50 opacity-40 bg-[url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22><filter id=%22noise%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/></filter><rect width=%22200%22 height=%22200%22 filter=%22url(%23noise)%22 opacity=%220.08%22/></svg>')] bg-repeat" />
              <div className="teams-slide__shell">
                <div className="teams-slide__header">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-white/80 uppercase">TEAM JERSEYS · {activeIndex + 1} / {TEAMS.length}</span>
                  <button className="sm:hidden flex items-center gap-1 text-white/80 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors" onClick={() => scrollToSlide(3)}>
                    Sponsors <ArrowRight className="h-3 w-3" />
                  </button>
                  <button className="hidden sm:flex items-center gap-1 text-white hover:opacity-85 transition-opacity" onClick={() => scrollToSlide(3)}>
                    <span className="font-heading uppercase font-normal tracking-tight leading-none text-2xl" style={{ fontFamily: "'Anton', sans-serif" }}>DISCOVER SPONSORS</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>

                <div className="teams-slide__stage">
                  <div className="contenders-bg absolute inset-x-0 flex items-center justify-center pointer-events-none select-none z-[2] font-heading font-black opacity-30 text-white tracking-tight leading-none text-center">
                    <span className="font-heading font-bold" style={{ fontSize: "clamp(64px, 22vw, 380px)", fontFamily: "'Anton', sans-serif" }}>CONTENDERS</span>
                  </div>
                  <div className="jersey-carousel jersey-carousel--swipeable z-[3]" onTouchStart={handleJerseyTouchStart} onTouchEnd={handleJerseyTouchEnd}>
                    {TEAMS.map((entry, i) => {
                      const roleStyle = getRoleStyle(i);
                      const isNear = Math.abs(((i - activeIndex + TEAMS.length) % TEAMS.length)) <= 2 ||
                                     Math.abs(((i - activeIndex + TEAMS.length) % TEAMS.length) - TEAMS.length) <= 2;
                      return (
                        <div key={entry.name}
                          className={`jersey-carousel__slide absolute left-1/2 origin-center${i === activeIndex ? " jersey-carousel__slide--active" : ""}`}
                          style={{
                            ...roleStyle, aspectRatio: "0.72 / 1",
                            transition: roleStyle.display !== "none" ? "transform 650ms cubic-bezier(0.4,0,0.2,1), opacity 650ms cubic-bezier(0.4,0,0.2,1)" : "none",
                            willChange: roleStyle.display !== "none" ? "transform, opacity" : "auto"
                          }}>
                          <span className="jersey-carousel__shadow" aria-hidden="true" />
                          <img src={entry.jersey} alt={`${entry.name} jersey`}
                            className="relative z-[1] w-full h-full object-contain object-center select-none"
                            draggable="false"
                            loading={isNear ? "eager" : "lazy"}
                            onError={(e) => { if (e.currentTarget.src !== JERSEY_PLACEHOLDER) e.currentTarget.src = JERSEY_PLACEHOLDER; }} />
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
                        <h3 className="font-semibold uppercase tracking-widest text-sm sm:text-[22px] text-white leading-tight truncate">{TEAMS[activeIndex].team}</h3>
                      </div>
                      <p className="text-[10px] sm:text-xs text-white/70 leading-relaxed font-light mb-0 sm:mb-5">Group {TEAMS[activeIndex].group} · WC 2026</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-3 shrink-0">
                      <button className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center text-white hover:scale-105 hover:bg-white/10 transition-all active:scale-95" onClick={() => navigateTeams("prev")} aria-label="Previous team">
                        <ArrowLeft className="h-6 w-6" />
                      </button>
                      <button className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center text-white hover:scale-105 hover:bg-white/10 transition-all active:scale-95" onClick={() => navigateTeams("next")} aria-label="Next team">
                        <ArrowRight className="h-6 w-6" />
                      </button>
                    </div>
                    <p className="sm:hidden text-[10px] text-white/45 uppercase tracking-widest shrink-0">Swipe to browse</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="scroll-section scroll-section--over-video scroll-section--sponsors">
              <div className="sponsors-slide__inner relative z-10 px-6 max-w-4xl text-center w-full flex flex-col items-center justify-center gap-4 mx-auto">
                <h2 className="font-heading italic text-white text-5xl md:text-7xl lg:text-[5.5rem] leading-[0.9] tracking-[-3px] uppercase mb-3 sm:mb-4">PROUD SPONSORS</h2>
                <p className="text-white/50 text-xs uppercase tracking-widest mb-6 sm:mb-12 font-semibold">Backed by campus organizations and local businesses</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-xl mx-auto">
                  {SPONSORS.map((sp) => (
                    <div key={sp.label} className="liquid-glass rounded-[1.25rem] p-4 sm:p-5 text-center border border-white/5">
                      <div className="frozen-inner rounded-xl p-4 sm:p-5 flex flex-col items-center gap-3 sm:gap-4 h-full">
                        <div className="w-full h-24 sm:h-32 rounded-xl frozen-inner flex items-center justify-center p-3 sm:p-4 relative overflow-hidden group">
                          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                          <img src={sp.logo} alt={`${sp.name} logo`} className="h-full max-h-16 sm:max-h-24 object-contain filter brightness-100 contrast-100 transition-transform duration-300 group-hover:scale-105 select-none" draggable="false" />
                        </div>
                        <div className="frozen-tag px-4 py-1.5 rounded-full text-white font-bold tracking-widest text-[11px] uppercase inline-block">{sp.label}</div>
                        <div className="flex flex-col gap-1">
                          <h4 className="text-sm font-semibold text-white/95 leading-tight">{sp.name}</h4>
                          <p className="text-[11px] text-white/45">{sp.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="btn-primary mt-6 sm:mt-12 px-7 py-3 rounded-full text-xs uppercase tracking-wider font-semibold" onClick={() => scrollToSlide(4)}>Go To Portal</button>
              </div>
            </div>

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

                    <button
                      className="btn-primary w-full py-3 rounded-full text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
                      onClick={handleGoogleSignIn}
                      disabled={signingIn}
                    >
                      {signingIn ? (
                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      ) : (
                        <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                      )}
                      {signingIn ? "Signing in..." : "Continue with Google"}
                    </button>

                    <div className="frozen-inner rounded-xl p-3.5 text-left text-[11px] text-white/60 leading-relaxed w-full mt-4">
                      🛡️ <strong>Secure &amp; Private:</strong> Google Sign-In ensures only you can access your predictions — no passwords stored.
                    </div>
                  </div>
                </div>

                <footer className="splash-footer shrink-0 w-full text-center pt-4">
                  <p className="text-[10px] text-white/35 tracking-wide mb-2">say hi to me</p>
                  <div className="flex items-center justify-center gap-4">
                    <a href={CREATOR_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/70 transition-colors" aria-label="LinkedIn">
                      <IconLinkedIn className="h-3.5 w-3.5" />
                    </a>
                    <a href={CREATOR_LINKS.email} className="text-white/30 hover:text-white/70 transition-colors" aria-label="Email">
                      <Mail className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </a>
                    <a href={CREATOR_LINKS.github} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/70 transition-colors" aria-label="GitHub">
                      <IconGitHub className="h-3.5 w-3.5" />
                    </a>
                    <a href={CREATOR_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/70 transition-colors" aria-label="Instagram">
                      <IconInstagram className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </footer>
              </div>
            </div>

          </div>
        </>
      )}

      {needsProfile && pendingFbUser && (
        <div className="fixed inset-0 z-[999] flex items-start sm:items-center justify-center p-4 overflow-y-auto" style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(18px)" }}>
          <div className="w-full max-w-md my-4">
            <div className="liquid-glass-strong rounded-[1.5rem] border border-white/15 shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-900/60 to-emerald-900/40 border-b border-white/10 px-8 pt-8 pb-6 text-center">
                {pendingFbUser.photoURL ? (
                  <img src={pendingFbUser.photoURL} alt="Profile" className="w-20 h-20 rounded-full border-4 border-white/20 mx-auto mb-4 shadow-xl" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-4">
                    <User className="h-8 w-8 text-white" />
                  </div>
                )}
                <div className="inline-flex items-center gap-1.5 bg-green-500/20 border border-green-500/30 px-3 py-1 rounded-full mb-3">
                  <CheckCircle className="h-3 w-3 text-green-400" />
                  <span className="text-green-400 text-[10px] font-bold uppercase tracking-widest">Google Verified</span>
                </div>
                <h2 className="font-heading italic text-white text-2xl uppercase tracking-tight leading-tight">One Last Step</h2>
                <p className="text-white/50 text-xs mt-1">
                  Hey <span className="text-white font-semibold">{pendingFbUser.displayName?.split(" ")[0] || "there"}</span>, complete your campus profile to enter the arena.
                </p>
              </div>
              <div className="px-8 py-6 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-white/70 uppercase tracking-widest mb-1.5">Full Name</label>
                  <input className="input-glass w-full px-4 py-3 rounded-xl text-sm" placeholder="e.g. Rahul Sharma"
                    value={registerName} onChange={e => setRegisterName(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && document.getElementById("reg-dept")?.focus()} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-white/70 uppercase tracking-widest mb-1.5">Department</label>
                  <input id="reg-dept" className="input-glass w-full px-4 py-3 rounded-xl text-sm" placeholder="e.g. Computer Science"
                    value={registerDept} onChange={e => setRegisterDept(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleCompleteRegistration()} />
                  <p className="text-[9px] text-white/35 mt-1 pl-1">Type your full department name</p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-white/70 uppercase tracking-widest mb-1.5">Year of Study</label>
                  <div className="grid grid-cols-4 gap-2">
                    {STUDY_YEARS.map(y => (
                      <button key={y}
                        className={`py-2.5 rounded-xl text-xs font-bold uppercase border transition-all ${registerYear === y ? "bg-white text-black border-white" : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/30"}`}
                        onClick={() => setRegisterYear(y)}>
                        {y.replace(" Year", "")}
                      </button>
                    ))}
                  </div>
                </div>
                <button className="btn-primary w-full py-3.5 rounded-full text-sm font-bold uppercase tracking-widest mt-2 flex items-center justify-center gap-2" onClick={handleCompleteRegistration}>
                  <CheckCircle className="h-4 w-4" />
                  Complete & Enter Arena
                </button>
                <button className="text-[10px] text-white/30 uppercase tracking-widest block mx-auto text-center hover:text-white/60 transition-colors" onClick={() => { setNeedsProfile(false); handleLogout(); }}>
                  ← Back to Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentUser && !needsProfile && !isAdmin && (
        <FixedVideoBackground src={DASHBOARD_VIDEO_SRC} fallbackSrc={HERO_VIDEO_FALLBACK} muted={isMuted} />
      )}

      {currentUser && !needsProfile && (
        <div className="max-w-3xl mx-auto px-4 h-screen flex flex-col pt-4 relative z-10 no-scrollbar">
          <header className="liquid-glass rounded-[1.25rem] border border-white/10 mb-6 shrink-0">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2 select-none">
                <span className="text-xl">🏆</span>
                <span className="font-heading italic text-xl tracking-tight text-white uppercase font-bold">PREDIZONE</span>
              </div>
              <div className="flex items-center">
                {!isAdmin && (
                  <button className="p-2 rounded-lg text-white/40 hover:text-white/80 transition-colors" onClick={() => setIsMuted(v => !v)} title={isMuted ? "Unmute" : "Mute"}>
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </button>
                )}
                <button className="p-2 rounded-lg text-red-400 hover:bg-white/5 transition-colors" onClick={handleLogout} title="Logout">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex gap-1 px-3 pb-3 overflow-x-auto no-scrollbar">
              {!isAdmin ? (
                <>
                  <button className={`px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider rounded-lg whitespace-nowrap transition-colors ${userTab === "fixtures" ? "bg-white text-black" : "text-white/70 hover:text-white border border-white/10"}`} onClick={() => setUserTab("fixtures")}>
                    <Target className="h-3 w-3 inline mr-1" />Predict
                  </button>
                  <button className={`px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider rounded-lg whitespace-nowrap transition-colors ${userTab === "upcoming" ? "bg-white text-black" : "text-white/70 hover:text-white border border-white/10"}`} onClick={() => setUserTab("upcoming")}>
                    <Calendar className="h-3 w-3 inline mr-1" />All
                  </button>
                  <button className={`px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider rounded-lg whitespace-nowrap transition-colors ${userTab === "finished" ? "bg-white text-black" : "text-white/70 hover:text-white border border-white/10"}`} onClick={() => setUserTab("finished")}>
                    <CheckCircle className="h-3 w-3 inline mr-1" />Finished
                  </button>
                  <button className={`px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider rounded-lg whitespace-nowrap transition-colors ${userTab === "leaderboard" ? "bg-white text-black" : "text-white/70 hover:text-white border border-white/10"}`} onClick={() => setUserTab("leaderboard")}>
                    <Trophy className="h-3 w-3 inline mr-1" />Standings
                  </button>
                  <button className={`px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider rounded-lg whitespace-nowrap transition-colors ${userTab === "you" ? "bg-white text-black" : "text-white/70 hover:text-white border border-white/10"}`} onClick={() => setUserTab("you")}>
                    <User className="h-3 w-3 inline mr-1" />You
                  </button>
                </>
              ) : (
                <span className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white/60">Admin Console</span>
              )}
            </div>
          </header>
          <audio ref={audioRef} src={BG_MUSIC_SRC} loop autoPlay />
          <div className="pb-8 flex-1 overflow-y-auto no-scrollbar flex flex-col pb-4 pb-safe">

            {!isAdmin && (
              <div className="liquid-glass px-5 py-6 sm:px-6 sm:py-8 rounded-[1.25rem] border border-white/5 mb-6 min-h-[100px] md:min-h-[110px] overflow-hidden cursor-pointer" onClick={() => setUserTab("you")}>
                <div className="flex flex-row items-center gap-3 sm:gap-0 sm:justify-between">
                  <div className="flex items-center gap-3 text-left min-w-0 flex-shrink">
                    {currentUser.photoURL ? (
                      <img src={currentUser.photoURL} alt={currentUser.name} className="w-10 h-10 rounded-full border border-white/20 shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/15 shrink-0"><User className="h-4 w-4 text-white" /></div>
                    )}
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-white/95 flex items-center gap-1 truncate">{currentUser.name} <Zap className="h-3.5 w-3.5 text-amber-400 fill-current shrink-0" /></h3>
                      <span className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5 block truncate">{currentUser.dept} • {currentUser.year || "1st Year"} • {currentUser.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                    {isLockedGlobal && <div className="bg-amber-950/60 border border-amber-800/50 px-3 py-1 rounded-full shrink-0"><Lock className="h-3 w-3 inline text-amber-400 mr-1" /><span className="text-amber-400 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">Predictions Locked</span></div>}
                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-0.5">Your Points</span>
                      <span className="font-heading italic text-2xl text-white tracking-tight">{leaderboard.find(l => l.id === currentUser.id)?.points || 0} PTS</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─── USER: Fixtures / Predict ─── */}
            {userTab === "fixtures" && !isAdmin && (() => {
              const openFixtures = sortedFixtures.filter(f => {
                const s = getStatus(f, isLockedGlobal);
                return (s === "open" || (s === "played" && !results[f.id])) && !results[f.id];
              });
              return (
              <div className="space-y-4">
                <div className="text-left mb-6">
                  <h2 className="font-heading italic text-3xl uppercase tracking-tight text-white">OPEN PREDICTIONS</h2>
                  <p className="text-xs text-white/50 mt-1 uppercase tracking-wider">{openFixtures.length} matches available</p>
                </div>

                {openFixtures.length > 0 ? openFixtures.map(fix => {
                  const status = getStatus(fix, isLockedGlobal);
                  const key = `${currentUser.id}_${fix.id}`;
                  const myPred = predictions[key];
                  const res = results[fix.id];
                  const pts = myPred && res ? calcPoints(myPred, res, fix) : null;
                  const canPredict = status === "open" && !myPred;
                  return (
                    <div key={fix.id} className="liquid-glass p-6 rounded-[1.5rem] border border-white/10 text-center">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{fix.isKnockout ? fix.round : `Group ${fix.group}`}</span>
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${status === "open" ? "bg-green-950 text-green-400 border border-green-800" : status === "played" ? "bg-blue-950 text-blue-400 border border-blue-800" : "bg-amber-950/80 text-amber-400 border border-amber-900"}`}>{status}</span>
                      </div>
                      <div className="flex items-center justify-between my-6 max-w-sm mx-auto w-full">
                        <div className="text-center flex-1">
                          <span className="text-5xl block mb-2">{fl(fix.home)}</span>
                          <span className="text-sm font-semibold text-white/90">{fix.home}</span>
                        </div>
                        <div className="flex flex-col items-center px-4">
                          <span className="font-heading italic text-lg text-white/30 uppercase tracking-widest">VS</span>
                          <span className="text-[10px] text-white/30 mt-2">{new Date(fix.date).toLocaleDateString("en-IN", { weekday: "short" })}</span>
                        </div>
                        <div className="text-center flex-1">
                          <span className="text-5xl block mb-2">{fl(fix.away)}</span>
                          <span className="text-sm font-semibold text-white/90">{fix.away}</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-white/40 mb-5">{formatDate(fix.date)} &nbsp;•&nbsp; {fix.venue}</p>

                      {res ? (
                        <div className="relative frozen-inner rounded-xl p-4 max-w-xs mx-auto">
                          <div className="flex items-center justify-center gap-6 mb-2">
                            <div className={`text-center relative ${res.winner === fix.home ? "scale-110" : "opacity-60"}`}>
                              <span className="text-4xl block mb-1">{fl(fix.home)}</span>
                              <span className="text-[10px] font-semibold text-white/90 block">{fix.home}</span>
                              {res.winner === fix.home && (
                                <>
                                  {[...Array(6)].map((_, i) => (
                                    <div key={`c${i}`} className="confetti-piece" style={{
                                      left: `${10 + i * 14}%`, top: `${10 + (i % 2) * 30}%`,
                                      background: `hsl(${i * 60}, 80%, 60%)`,
                                      animationDelay: `${i * 0.15}s`,
                                    }} />
                                  ))}
                                  {[...Array(4)].map((_, i) => (
                                    <div key={`f${i}`} className="firecracker" style={{
                                      left: `${30 + i * 14}%`, top: `${5 + i * 8}%`,
                                      background: `hsl(${i * 90 + 20}, 90%, 60%)`,
                                      animationDelay: `${i * 0.2}s`,
                                    }} />
                                  ))}
                                </>
                              )}
                            </div>
                            <div className="text-center font-heading italic text-2xl text-white">
                              {res.homeGoals ?? "?"}–{res.awayGoals ?? "?"}
                            </div>
                            <div className={`text-center relative ${res.winner === fix.away ? "scale-110" : "opacity-60"}`}>
                              <span className="text-4xl block mb-1">{fl(fix.away)}</span>
                              <span className="text-[10px] font-semibold text-white/90 block">{fix.away}</span>
                              {res.winner === fix.away && (
                                <>
                                  {[...Array(6)].map((_, i) => (
                                    <div key={`c${i}`} className="confetti-piece" style={{
                                      left: `${10 + i * 14}%`, top: `${10 + (i % 2) * 30}%`,
                                      background: `hsl(${i * 60 + 30}, 80%, 60%)`,
                                      animationDelay: `${i * 0.15}s`,
                                    }} />
                                  ))}
                                  {[...Array(4)].map((_, i) => (
                                    <div key={`f${i}`} className="firecracker" style={{
                                      left: `${30 + i * 14}%`, top: `${5 + i * 8}%`,
                                      background: `hsl(${i * 90 + 50}, 90%, 60%)`,
                                      animationDelay: `${i * 0.2}s`,
                                    }} />
                                  ))}
                                </>
                              )}
                            </div>
                          </div>
                          {pts !== null && (
                            <div className="text-center mb-2">
                              <span className={`font-semibold px-3 py-1 rounded-full text-xs ${pts > 0 ? "bg-green-950 text-green-400" : "frozen-tag text-white/40"}`}>{pts > 0 ? `+${pts} PTS` : "0 PTS"}</span>
                            </div>
                          )}
                          {(() => {
                            const stats = getFixturePredictionStats(fix.id, predictions, fix.home, fix.away);
                            if (!stats || stats.bars.length === 0) return null;
                            return (
                              <div className="mt-3 pt-3 border-t border-white/10">
                                <p className="text-[9px] text-white/40 uppercase tracking-wider text-center mb-2">Prediction Distribution</p>
                                <div className="space-y-1.5">
                                  {stats.bars.map((bar, bi) => (
                                    <div key={`${bar.team}-${bi}`} className="flex items-center gap-2">
                                      <span className="text-[8px] text-white/50 w-10 text-right leading-tight truncate shrink-0">{bar.team === fix.home ? fix.home : bar.team === fix.away ? fix.away : "Draw"}</span>
                                      <div className="flex-1 h-4 rounded-full bg-white/5 overflow-hidden">
                                        <div className="h-full rounded-full transition-all duration-500" style={{
                                          width: `${bar.pct}%`,
                                          background: bar.team === fix.home ? "#22c55e" : bar.team === fix.away ? "#3b82f6" : "#ffffff",
                                        }} />
                                      </div>
                                      <span className="text-[9px] font-bold text-white/70 w-8 text-left shrink-0">{bar.pct}%</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      ) : status === "played" ? (
                        <div className="frozen-inner rounded-xl p-4 max-w-xs mx-auto">
                          {(() => {
                            const stats = getFixturePredictionStats(fix.id, predictions, fix.home, fix.away);
                            if (!stats || stats.bars.length === 0) return <p className="text-[10px] text-white/40 text-center">No predictions yet</p>;
                            return (
                              <div>
                                <p className="text-[9px] text-white/40 uppercase tracking-wider text-center mb-3">Prediction Distribution</p>
                                <div className="space-y-1.5">
                                  {stats.bars.map((bar, bi) => (
                                    <div key={`${bar.team}-${bi}`} className="flex items-center gap-2">
                                      <span className="text-[8px] text-white/50 w-10 text-right leading-tight truncate shrink-0">{bar.team === fix.home ? fix.home : bar.team === fix.away ? fix.away : "Draw"}</span>
                                      <div className="flex-1 h-4 rounded-full bg-white/5 overflow-hidden">
                                        <div className="h-full rounded-full transition-all duration-500" style={{
                                          width: `${bar.pct}%`,
                                          background: bar.team === fix.home ? "#22c55e" : bar.team === fix.away ? "#3b82f6" : "#ffffff",
                                        }} />
                                      </div>
                                      <span className="text-[9px] font-bold text-white/70 w-8 text-left shrink-0">{bar.pct}%</span>
                                    </div>
                                  ))}
                                </div>
                                <p className="text-[9px] text-white/30 text-center mt-2">{stats.total} total predictions</p>
                              </div>
                            );
                          })()}
                          {myPred ? (
                            <div className="mt-3 pt-2 border-t border-white/10 text-center">
                              <span className="text-[9px] text-white/50 uppercase tracking-wider">Your prediction: </span>
                              <span className="text-[10px] font-semibold text-white">{formatPredictionSummary(myPred, fix)}</span>
                            </div>
                          ) : (
                            <div className="mt-3 pt-2 border-t border-white/10 text-center">
                              <span className="text-[9px] text-white/40 italic">You didn't predict this match</span>
                            </div>
                          )}
                        </div>
                      ) : null}

                      {!res && status !== "played" && myPred && (
                        <div className="frozen-inner rounded-xl p-4 text-sm max-w-xs mx-auto">
                          <span className="text-white/50 text-xs">Your prediction: </span>
                          <span className="font-semibold text-white">{formatPredictionSummary(myPred, fix)}</span>
                          <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider ml-2">🔒 Locked</span>
                        </div>
                      )}

                      {canPredict && (
                        <button className="btn-primary px-10 py-3 rounded-full text-sm font-bold uppercase tracking-wider" onClick={() => { setPredFixture(fix); setPredWinner(""); setPredHomeGoals(""); setPredAwayGoals(""); }}>
                          Make Prediction
                        </button>
                      )}

                      {status === "locked" && !myPred && (
                        <div className="frozen-inner rounded-xl p-4 text-xs text-white/50 max-w-xs mx-auto flex items-center gap-2 justify-center">
                          <Lock className="h-3 w-3" /> Predictions open 24h before match, lock 30min before kickoff
                        </div>
                      )}
                    </div>
                  );
                }) : (
                  <div className="liquid-glass rounded-[1.5rem] p-12 text-center border border-white/5">
                    <span className="text-5xl mb-4 block">📅</span>
                    <h3 className="font-heading italic text-2xl text-white/70">No Matches Available</h3>
                    <p className="text-xs text-white/40 max-w-sm mx-auto mt-3 leading-relaxed">No fixtures scheduled. Check the upcoming tab for future matches.</p>
                    <button className="btn-secondary mt-6 px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider" onClick={() => setUserTab("upcoming")}>View Upcoming</button>
                  </div>
                )}
              </div>
              );
            })()}

            {/* ─── USER: All Fixtures ─── */}
            {userTab === "upcoming" && !isAdmin && (
              <div className="space-y-4">
                <div className="text-left mb-6">
                  <h2 className="font-heading italic text-3xl uppercase tracking-tight text-white">ALL FIXTURES</h2>
                  <p className="text-xs text-white/50 mt-1 uppercase tracking-wider">{upcomingFiltered.length} matches</p>
                </div>
                {upcomingFiltered.length === 0 ? (
                  <div className="liquid-glass rounded-[1.5rem] p-12 text-center border border-white/5">
                    <span className="text-4xl mb-4 block">📅</span>
                    <h3 className="font-heading italic text-xl text-white/70">No Fixtures</h3>
                    <p className="text-xs text-white/40 max-w-sm mx-auto mt-2">No matches have been added yet.</p>
                  </div>
                ) : (
                  upcomingFiltered.map(fix => {
                    const status = getStatus(fix, isLockedGlobal);
                    const key = `${currentUser.id}_${fix.id}`;
                    const myPred = predictions[key];
                    const res = results[fix.id];
                    const pts = res && myPred ? calcPoints(myPred, res, fix) : null;
                    return (
                      <div key={fix.id} className="liquid-glass p-4 rounded-xl border border-white/5 flex items-center justify-between text-left">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="text-center min-w-[50px]">
                            <span className="text-xs font-semibold text-white/70 block">{new Date(fix.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                            <span className="text-[9px] text-white/40">{new Date(fix.date).toLocaleDateString("en-IN", { weekday: "short" })}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{fl(fix.home)}</span>
                              <span className="text-xs font-semibold text-white/90">{fix.home}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-lg">{fl(fix.away)}</span>
                              <span className="text-xs font-semibold text-white/90">{fix.away}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          {status === "played" && res ? (
                            <div>
                              <p className="text-xs font-bold text-white/90">{res.homeGoals ?? "?"}–{res.awayGoals ?? "?"}</p>
                              <p className="text-[8px] text-white/40 uppercase tracking-wider mt-0.5">FT</p>
                              {pts !== null && <p className={`text-[9px] font-bold mt-1 ${pts > 0 ? "text-green-400" : "text-white/40"}`}>{pts > 0 ? `+${pts}` : "0"} PTS</p>}
                            </div>
                          ) : (
                            <>
                              <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${status === "open" ? "bg-green-950 text-green-400 border border-green-800" : "bg-amber-950/80 text-amber-400 border border-amber-900"}`}>{status}</span>
                              {myPred && <p className="text-[9px] text-white/40 mt-1">✓ Predicted</p>}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* ─── USER: Finished Matches ─── */}
            {userTab === "finished" && !isAdmin && (() => {
              return (
                <div className="space-y-4">
                <div className="text-left mb-6">
                  <h2 className="font-heading italic text-3xl uppercase tracking-tight text-white">FINISHED MATCHES</h2>
                  <p className="text-xs text-white/50 mt-1 uppercase tracking-wider">{finishedFixtures.filter(f => results[f.id]).length} matches played</p>
                </div>
                {finishedFixtures.length === 0 ? (
                  <div className="liquid-glass rounded-[1.5rem] p-12 text-center border border-white/5">
                    <span className="text-4xl mb-4 block">📅</span>
                    <h3 className="font-heading italic text-xl text-white/70">No Finished Matches</h3>
                    <p className="text-xs text-white/40 max-w-sm mx-auto mt-2">Completed matches will appear here.</p>
                  </div>
                ) : (
                  finishedFixtures.filter(f => results[f.id]).map(fix => {
                    const key = `${currentUser.id}_${fix.id}`;
                    const myPred = predictions[key];
                    const res = results[fix.id];
                    const pts = res && myPred ? calcPoints(myPred, res, fix) : null;
                    return (
                      <div key={fix.id} className="liquid-glass p-6 rounded-[1.5rem] border border-white/10 text-center">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{fix.isKnockout ? fix.round : `Group ${fix.group}`}</span>
                          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-950 text-blue-400 border border-blue-800">FT</span>
                        </div>
                        <p className="text-[10px] text-white/40 mb-4">{formatDate(fix.date)}</p>
                        <div className="relative frozen-inner rounded-xl p-4 max-w-xs mx-auto">
                          <div className="flex items-center justify-center gap-6 mb-2">
                            <div className={`text-center relative ${res.winner === fix.home ? "scale-110" : "opacity-60"}`}>
                              <span className="text-4xl block mb-1">{fl(fix.home)}</span>
                              <span className="text-[10px] font-semibold text-white/90 block">{fix.home}</span>
                              {res.winner === fix.home && (
                                <>
                                  {[...Array(6)].map((_, i) => (
                                    <div key={`c${i}`} className="confetti-piece" style={{
                                      left: `${10 + i * 14}%`, top: `${10 + (i % 2) * 30}%`,
                                      background: `hsl(${i * 60}, 80%, 60%)`,
                                      animationDelay: `${i * 0.15}s`,
                                    }} />
                                  ))}
                                  {[...Array(4)].map((_, i) => (
                                    <div key={`f${i}`} className="firecracker" style={{
                                      left: `${30 + i * 14}%`, top: `${5 + i * 8}%`,
                                      background: `hsl(${i * 90 + 20}, 90%, 60%)`,
                                      animationDelay: `${i * 0.2}s`,
                                    }} />
                                  ))}
                                </>
                              )}
                            </div>
                            <div className="text-center font-heading italic text-2xl text-white">
                              {res.homeGoals ?? "?"}–{res.awayGoals ?? "?"}
                            </div>
                            <div className={`text-center relative ${res.winner === fix.away ? "scale-110" : "opacity-60"}`}>
                              <span className="text-4xl block mb-1">{fl(fix.away)}</span>
                              <span className="text-[10px] font-semibold text-white/90 block">{fix.away}</span>
                              {res.winner === fix.away && (
                                <>
                                  {[...Array(6)].map((_, i) => (
                                    <div key={`c${i}`} className="confetti-piece" style={{
                                      left: `${10 + i * 14}%`, top: `${10 + (i % 2) * 30}%`,
                                      background: `hsl(${i * 60 + 30}, 80%, 60%)`,
                                      animationDelay: `${i * 0.15}s`,
                                    }} />
                                  ))}
                                  {[...Array(4)].map((_, i) => (
                                    <div key={`f${i}`} className="firecracker" style={{
                                      left: `${30 + i * 14}%`, top: `${5 + i * 8}%`,
                                      background: `hsl(${i * 90 + 50}, 90%, 60%)`,
                                      animationDelay: `${i * 0.2}s`,
                                    }} />
                                  ))}
                                </>
                              )}
                            </div>
                          </div>
                          {pts !== null && (
                            <div className="text-center mb-2">
                              <span className={`font-semibold px-3 py-1 rounded-full text-xs ${pts > 0 ? "bg-green-950 text-green-400" : "frozen-tag text-white/40"}`}>{pts > 0 ? `+${pts} PTS` : "0 PTS"}</span>
                            </div>
                          )}
                          {(() => {
                            const stats = getFixturePredictionStats(fix.id, predictions, fix.home, fix.away);
                            if (!stats || stats.bars.length === 0) return null;
                            return (
                              <div className="mt-3 pt-3 border-t border-white/10">
                                <p className="text-[9px] text-white/40 uppercase tracking-wider text-center mb-2">Prediction Distribution</p>
                                <div className="space-y-1.5">
                                  {stats.bars.map((bar, bi) => (
                                    <div key={`${bar.team}-${bi}`} className="flex items-center gap-2">
                                      <span className="text-[8px] text-white/50 w-10 text-right leading-tight truncate shrink-0">{bar.team === fix.home ? fix.home : bar.team === fix.away ? fix.away : "Draw"}</span>
                                      <div className="flex-1 h-4 rounded-full bg-white/5 overflow-hidden">
                                        <div className="h-full rounded-full transition-all duration-500" style={{
                                          width: `${bar.pct}%`,
                                          background: bar.team === fix.home ? "#22c55e" : bar.team === fix.away ? "#3b82f6" : "#ffffff",
                                        }} />
                                      </div>
                                      <span className="text-[9px] font-bold text-white/70 w-8 text-left shrink-0">{bar.pct}%</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    );
                  })
                )
                }
                </div>
              );
            })()}

            {/* ─── USER: Leaderboard ─── */}
            {userTab === "leaderboard" && !isAdmin && (
              <div>
                <div className="text-left mb-6">
                  <h2 className="font-heading italic text-3xl uppercase tracking-tight text-white">CAMPUS LEADERBOARD</h2>
                  <p className="text-xs text-white/50 mt-1 uppercase tracking-wider">{leaderboard.length} students registered</p>
                </div>
                <div className="space-y-2">
                  {leaderboard.map((u, i) => {
                    const isMe = u.id === currentUser.id;
                    return (
                      <div key={u.id} className={`liquid-glass p-4 rounded-xl flex items-center gap-4 ${isMe ? "border border-white/20 bg-white/5" : "border border-white/5"}`}>
                        <span className="font-heading italic text-lg font-bold w-10 text-center text-white/60">
                          {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                        </span>
                        {u.photoURL ? (
                          <img src={u.photoURL} alt={u.name} className="w-9 h-9 rounded-full border border-white/10" />
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

            {/* ─── USER: You (Profile & Stats) ─── */}
            {userTab === "you" && !isAdmin && (() => {
              const stats = getUserStats(currentUser.id, predictions, results, allFixtures);
              const myLeader = leaderboard.find(l => l.id === currentUser.id);
              const myPoints = myLeader?.points || 0;
              const rank = leaderboard.findIndex(l => l.id === currentUser.id) + 1;
              const myPredsList = Object.values(predictions).filter(p => p.uid === currentUser.id)
                .sort((a, b) => {
                  const fixA = allFixtures.find(f => String(f.id) === String(a.fixtureId));
                  const fixB = allFixtures.find(f => String(f.id) === String(b.fixtureId));
                  return (fixB ? new Date(fixB.date) : 0) - (fixA ? new Date(fixA.date) : 0);
                });
              return (
                <div className="space-y-6">
                  <div className="text-left mb-2">
                    <h2 className="font-heading italic text-3xl uppercase tracking-tight text-white">YOUR STATS</h2>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="liquid-glass p-4 rounded-xl border border-white/5 text-center">
                      <span className="text-2xl font-bold text-white">{myPoints}</span>
                      <p className="text-[9px] text-white/50 uppercase tracking-widest mt-1">Points</p>
                    </div>
                    <div className="liquid-glass p-4 rounded-xl border border-white/5 text-center">
                      <span className="text-2xl font-bold text-white">#{rank}</span>
                      <p className="text-[9px] text-white/50 uppercase tracking-widest mt-1">Rank</p>
                    </div>
                    <div className="liquid-glass p-4 rounded-xl border border-white/5 text-center">
                      <span className="text-2xl font-bold text-white">{stats.totalPredictions}</span>
                      <p className="text-[9px] text-white/50 uppercase tracking-widest mt-1">Predictions</p>
                    </div>
                    <div className="liquid-glass p-4 rounded-xl border border-white/5 text-center">
                      <span className="text-2xl font-bold text-white">{stats.overallAccuracy}%</span>
                      <p className="text-[9px] text-white/50 uppercase tracking-widest mt-1">Accuracy</p>
                    </div>
                  </div>

                  <div className="liquid-glass p-6 rounded-xl border border-white/5 text-center">
                    <h3 className="text-sm font-semibold text-white/80 mb-4 uppercase tracking-wider">Prediction Accuracy</h3>
                    <div className="flex items-center justify-center gap-8">
                      <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
                        <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
                        <circle cx="60" cy="60" r="52" fill="none" stroke={stats.accuracy > 50 ? "#22c55e" : "#eab308"} strokeWidth="10"
                          strokeDasharray={`${(stats.accuracy / 100) * 327} 327`}
                          strokeLinecap="round" />
                        <circle cx="60" cy="60" r="38" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                        <circle cx="60" cy="60" r="38" fill="none" stroke={stats.scorelineAccuracy > 50 ? "#3b82f6" : "#a855f7"} strokeWidth="8"
                          strokeDasharray={`${(stats.scorelineAccuracy / 100) * 239} 239`}
                          strokeLinecap="round" />
                      </svg>
                      <div className="text-left">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="w-3 h-3 rounded-full bg-green-500" />
                          <span className="text-xs text-white/70">Winner Correct: {stats.correctWinners}</span>
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="w-3 h-3 rounded-full bg-white/20" />
                          <span className="text-xs text-white/70">Winner Incorrect: {stats.scoredPredictions - stats.correctWinners}</span>
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="w-3 h-3 rounded-full bg-blue-500" />
                          <span className="text-xs text-white/70">Scoreline Correct: {stats.correctScorelines}</span>
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="w-3 h-3 rounded-full bg-white/20" />
                          <span className="text-xs text-white/70">Scoreline Incorrect: {stats.totalScorelinePreds - stats.correctScorelines}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="w-3 h-3 rounded-full bg-white/10" />
                          <span className="text-xs text-white/70">Unscored: {stats.totalPredictions - stats.scoredPredictions}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-left">
                    <h3 className="font-heading italic text-xl uppercase tracking-tight text-white mb-4">Prediction History</h3>
                  </div>
                  {myPredsList.length === 0 ? (
                    <div className="liquid-glass rounded-xl p-8 text-center border border-white/5">
                      <span className="text-3xl block mb-2">🔮</span>
                      <p className="text-xs text-white/50">No predictions yet</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {myPredsList.map(pred => {
                        const fix = allFixtures.find(f => String(f.id) === String(pred.fixtureId));
                        const res = results[pred.fixtureId];
                        const pts = fix && res ? calcPoints(pred, res, fix) : null;
                        return (
                          <div key={pred.id || `${pred.uid}_${pred.fixtureId}`} className="liquid-glass p-4 rounded-xl border border-white/5">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-xs font-semibold text-white">
                                  {fix ? `${fl(fix.home)} ${fix.home} vs ${fix.away} ${fl(fix.away)}` : `Match #${pred.fixtureId}`}
                                </p>
                                <p className="text-[10px] text-white/40 mt-1">
                                  {fix ? formatDate(fix.date) : ""}
                                  {pred.submittedAt && ` • Predicted: ${new Date(pred.submittedAt?.toMillis ? pred.submittedAt.toMillis() : pred.submittedAt).toLocaleString("en-IN")}`}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] text-white/70 font-semibold">{formatPredictionSummary(pred, fix)}</p>
                                {pts !== null && <p className={`text-[10px] font-bold mt-1 ${pts > 0 ? "text-green-400" : "text-white/40"}`}>{pts > 0 ? `+${pts} PTS` : "0 PTS"}</p>}
                                {res && <p className="text-[9px] text-white/40 mt-0.5">Result: {formatResultSummary(res, fix)}</p>}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* ═══════════════════════════════════════════════════════════════════
              ADMIN DASHBOARD
          ═══════════════════════════════════════════════════════════════════ */}
            {page === "admin" && isAdmin && (
              <div>
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                  <h2 className="font-heading italic text-2xl uppercase tracking-tight text-white">Console</h2>
                  <div className="flex items-center gap-3">
                    <button className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${isLockedGlobal ? "bg-green-950 text-green-400 border border-green-800" : "bg-amber-950 text-amber-400 border border-amber-800"}`}
                      onClick={() => updateArenaSettings({ arenaLocked: !isLockedGlobal })}>
                      {isLockedGlobal ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                      {isLockedGlobal ? "Unlock Arena" : "Lock Arena"}
                    </button>
                    <button className="btn-secondary px-4 py-1.5 rounded-full text-[10px] font-semibold" onClick={() => openAddMatch()}>+ Add Match</button>
                    {undoInfo && (
                      <button className="btn-secondary px-3 py-1.5 rounded-full text-[10px] font-semibold border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10" onClick={handleUndoFixtureEdit}>
                        ↩ Undo Edit
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/5 mb-6 overflow-x-auto no-scrollbar">
                  {["results", "matches", "custommatch", "winners", "upcoming", "finished", "leaderboard", "participants"].map((tab) => (
                    <button key={tab}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-semibold uppercase tracking-wider whitespace-nowrap transition-colors ${adminTab === tab ? "bg-white text-black" : "text-white/60 hover:text-white border border-white/10"}`}
                      onClick={() => setAdminTab(tab)}>{tab === "custommatch" ? "Custom Match" : tab === "winners" ? "Winners" : tab}</button>
                  ))}
                </div>

                {/* ADMIN: Results */}
                {adminTab === "results" && (
                  <div className="space-y-4">
                    <div className="flex gap-1.5 overflow-x-auto pb-2 no-scrollbar">
                      {groups.map(g => (
                        <button key={g}
                          className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg whitespace-nowrap transition-colors ${adminGroup === g ? "bg-white text-black" : "bg-white/5 text-white/60 hover:text-white"}`}
                          onClick={() => setAdminGroup(g)}>Group {g}</button>
                      ))}
                    </div>
                    {mergeFixtures(FIXTURES, fixtureOverrides || {}).filter(f => f.group === adminGroup).map(fix => {
                      const res = results[fix.id];
                      return (
                        <div key={fix.id} className="liquid-glass p-4 rounded-xl border border-white/5 flex items-center justify-between text-left">
                          <div>
                            <h4 className="text-sm font-semibold text-white">{fl(fix.home)} {fix.home} vs {fix.away} {fl(fix.away)}</h4>
                            <p className="text-[10px] text-white/40 mt-1">{formatDate(fix.date)}</p>
                            {res && <div className="frozen-inner rounded-lg px-3 py-2 text-xs font-semibold text-white/80 mt-2 inline-block">Result: {formatResultSummary(res, fix)}</div>}
                          </div>
                          <div className="flex items-center gap-1">
                            <button className="btn-secondary p-2 rounded-lg text-[10px] font-semibold" title="Edit fixture" onClick={() => openEditFixture(fix)}>✏️</button>
                            <button className="btn-secondary px-3 py-1.5 rounded-lg text-xs font-semibold" onClick={() => { setSelFixture(fix); setResHomeGoals(res?.homeGoals !== undefined ? String(res.homeGoals) : ""); setResAwayGoals(res?.awayGoals !== undefined ? String(res.awayGoals) : ""); }}>
                              {res ? "Edit" : "Result"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* ADMIN: Matches (admin-created) */}
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
                                <span className="bg-white/10 border border-white/10 px-2.5 py-0.5 rounded text-[10px] text-white font-bold uppercase tracking-wider">{fix.round || "Custom"}</span>
                                <h4 className="text-sm font-semibold text-white mt-3">{fl(fix.home)} {fix.home} vs {fix.away} {fl(fix.away)}</h4>
                                <p className="text-[10px] text-white/45 mt-1">{formatDate(fix.date)} &nbsp;•&nbsp; {fix.venue}</p>
                                {res && <p className="frozen-inner rounded-lg px-3 py-2 text-xs font-bold text-white/80 mt-2 inline-block">Result: {formatResultSummary(res, fix)}</p>}
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

                {/* ADMIN: Custom Match (same as add match, dedicated tab) */}
                {adminTab === "custommatch" && (
                  <div className="liquid-glass p-6 rounded-xl border border-white/10">
                    <h3 className="font-heading italic text-xl text-white uppercase tracking-tight mb-6">Create Custom Match</h3>
                    <div className="mb-5">
                      <label className="block text-[10px] font-bold text-white/70 uppercase tracking-wider mb-2">Round / Label</label>
                      <div className="flex gap-1.5 flex-wrap">
                        {ROUNDS.concat(["Custom"]).map(r => (
                          <button key={r} className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase border transition-all ${newRound === r ? "bg-white text-black border-white" : "bg-white/5 border-white/10 text-white/60 hover:text-white"}`} onClick={() => setNewRound(r)}>{r}</button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end mb-5">
                      <div>
                        <label className="block text-[10px] font-bold text-white/70 uppercase tracking-wider mb-1.5">Home Team</label>
                        <input className="input-glass w-full px-3 py-2.5 rounded-lg text-xs" placeholder="e.g. Argentina" value={newHome} onChange={e => setNewHome(e.target.value)} />
                      </div>
                      <span className="text-center text-[10px] font-bold text-white/20 pb-2 hidden sm:block">VS</span>
                      <div>
                        <label className="block text-[10px] font-bold text-white/70 uppercase tracking-wider mb-1.5">Away Team</label>
                        <input className="input-glass w-full px-3 py-2.5 rounded-lg text-xs" placeholder="e.g. France" value={newAway} onChange={e => setNewAway(e.target.value)} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-5">
                      <div>
                        <label className="block text-[10px] font-bold text-white/70 uppercase tracking-wider mb-1.5">Date</label>
                        <input className="input-glass w-full px-3 py-2.5 rounded-lg text-xs" type="date" value={newDate} onChange={e => setNewDate(e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-white/70 uppercase tracking-wider mb-1.5">Time</label>
                        <input className="input-glass w-full px-3 py-2.5 rounded-lg text-xs" type="time" value={newTime} onChange={e => setNewTime(e.target.value)} />
                      </div>
                    </div>
                    <div className="mb-6">
                      <label className="block text-[10px] font-bold text-white/70 uppercase tracking-wider mb-1.5">Venue</label>
                      <input className="input-glass w-full px-3 py-2.5 rounded-lg text-xs" placeholder="e.g. MetLife Stadium" value={newVenue} onChange={e => setNewVenue(e.target.value)} />
                    </div>
                    <button className="btn-primary px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider" onClick={handleSaveMatch}>Create Custom Match</button>
                  </div>
                )}

                {/* ADMIN: Winners entry (quick result entry) */}
                {adminTab === "winners" && (
                  <div className="space-y-4">
                    <p className="text-[11px] text-white/50 uppercase tracking-wider mb-4">Enter results for any match</p>
                    {allFixtures.filter(f => new Date(f.date) < new Date()).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 20).map(fix => {
                      const res = results[fix.id];
                      return (
                        <div key={fix.id} className="liquid-glass p-4 rounded-xl border border-white/5 flex items-center justify-between text-left">
                          <div>
                            <h4 className="text-sm font-semibold text-white">{fl(fix.home)} {fix.home} vs {fix.away} {fl(fix.away)}</h4>
                            <p className="text-[10px] text-white/40 mt-1">{formatDate(fix.date)}</p>
                            {res && <div className="frozen-inner rounded-lg px-3 py-2 text-xs font-semibold text-white/80 mt-2 inline-block">Result: {formatResultSummary(res, fix)}</div>}
                          </div>
                          <button className="btn-secondary px-4 py-1.5 rounded-lg text-xs font-semibold" onClick={() => { setSelFixture(fix); setResHomeGoals(res?.homeGoals !== undefined ? String(res.homeGoals) : ""); setResAwayGoals(res?.awayGoals !== undefined ? String(res.awayGoals) : ""); }}>
                            {res ? "Edit" : "Enter"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* ADMIN: All Fixtures */}
                {adminTab === "upcoming" && (
                  <div className="space-y-3">
                    {upcomingFiltered.length === 0 ? (
                      <p className="text-xs text-white/40 py-8 text-center">No matches.</p>
                    ) : (
                      upcomingFiltered.map(fix => {
                        const status = getStatus(fix, isLockedGlobal);
                        const res = results[fix.id];
                        return (
                          <div key={fix.id} className="liquid-glass p-4 rounded-xl border border-white/5 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] text-white/50">{fix.isKnockout ? fix.round : `Group ${fix.group}`}</span>
                              <h4 className="text-sm font-semibold text-white mt-1">{fl(fix.home)} {fix.home} vs {fix.away} {fl(fix.away)}</h4>
                              <p className="text-[10px] text-white/40 mt-1">{formatDate(fix.date)}</p>
                            </div>
                            <div className="text-right">
                              {status === "played" && res ? (
                                <div>
                                  <p className="text-xs font-bold text-white/90">{res.homeGoals ?? "?"}–{res.awayGoals ?? "?"}</p>
                                  <p className="text-[8px] text-white/40 uppercase tracking-wider mt-0.5">FT</p>
                                </div>
                              ) : (
                                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${status === "open" ? "bg-green-950 text-green-400" : "bg-amber-950/80 text-amber-400"}`}>{status}</span>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                {/* ADMIN: Finished */}
                {adminTab === "finished" && (
                  <div className="space-y-3">
                {finishedFixtures.filter(f => results[f.id]).length === 0 ? (
                      <p className="text-xs text-white/40 py-8 text-center">No finished matches.</p>
                    ) : (
                      finishedFixtures.map(fix => {
                        const res = results[fix.id];
                        return (
                          <div key={fix.id} className="liquid-glass p-4 rounded-xl border border-white/5 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] text-white/50">{fix.isKnockout ? fix.round : `Group ${fix.group}`}</span>
                              <h4 className="text-sm font-semibold text-white mt-1">{fl(fix.home)} {fix.home} vs {fix.away} {fl(fix.away)}</h4>
                              <p className="text-[10px] text-white/40 mt-1">{formatDate(fix.date)}</p>
                            </div>
                            <div className="text-right">
                              {res ? (
                                <div>
                                  <p className="text-xs font-bold text-white/90">{res.homeGoals ?? "?"}–{res.awayGoals ?? "?"}</p>
                                  <p className="text-[8px] text-white/40 uppercase tracking-wider mt-0.5">FT</p>
                                </div>
                              ) : (
                                <span className="text-[9px] text-white/40">No result</span>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                {/* ADMIN: Leaderboard */}
                {adminTab === "leaderboard" && (
                  <div className="space-y-2">
                    {leaderboard.map((u) => (
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

                {/* ADMIN: Participants (clickable for history) */}
                {adminTab === "participants" && !viewingParticipant && (
                  <div className="space-y-2">
                    {Object.values(users).map(u => {
                      const count = allFixtures.filter(f => predictions[`${u.id}_${f.id}`]).length;
                      return (
                        <div key={u.id} className="liquid-glass p-4 rounded-xl border border-white/5 flex items-center justify-between text-left cursor-pointer hover:border-white/20 transition-colors"
                          onClick={() => setViewingParticipant(u)}>
                          <div>
                            <h4 className="text-sm font-semibold text-white">{u.name}</h4>
                            <span className="text-[10px] text-white/40 uppercase tracking-widest block mt-0.5">{u.dept} • {u.year || "1st Year"}</span>
                          </div>
                          <div className="text-right flex items-center gap-3">
                            <span className="text-xs font-semibold text-white block">{count} / {allFixtures.length}</span>
                            <Eye className="h-3.5 w-3.5 text-white/40" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {adminTab === "participants" && viewingParticipant && (() => {
                  const u = viewingParticipant;
                  const stats = getUserStats(u.id, predictions, results, allFixtures);
                  const pLeader = leaderboard.find(l => l.id === u.id);
                  const pPoints = pLeader?.points || 0;
                  const rank = leaderboard.findIndex(l => l.id === u.id) + 1;
                  const pPredsList = Object.values(predictions).filter(p => p.uid === u.id)
                    .sort((a, b) => {
                      const fixA = allFixtures.find(f => String(f.id) === String(a.fixtureId));
                      const fixB = allFixtures.find(f => String(f.id) === String(b.fixtureId));
                      return (fixB ? new Date(fixB.date) : 0) - (fixA ? new Date(fixA.date) : 0);
                    });
                  return (
                    <div className="space-y-6">
                      <button className="flex items-center gap-1.5 text-[10px] text-white/50 uppercase tracking-widest hover:text-white transition-colors"
                        onClick={() => setViewingParticipant(null)}>
                        <ArrowLeft className="h-3 w-3" /> Participants
                      </button>

                      <div className="text-left">
                        <h2 className="font-heading italic text-2xl uppercase tracking-tight text-white">{u.name}</h2>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">{u.dept} • {u.year || "1st Year"}</p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="liquid-glass p-4 rounded-xl border border-white/5 text-center">
                          <span className="text-2xl font-bold text-white">{pPoints}</span>
                          <p className="text-[9px] text-white/50 uppercase tracking-widest mt-1">Points</p>
                        </div>
                        <div className="liquid-glass p-4 rounded-xl border border-white/5 text-center">
                          <span className="text-2xl font-bold text-white">#{rank}</span>
                          <p className="text-[9px] text-white/50 uppercase tracking-widest mt-1">Rank</p>
                        </div>
                        <div className="liquid-glass p-4 rounded-xl border border-white/5 text-center">
                          <span className="text-2xl font-bold text-white">{stats.totalPredictions}</span>
                          <p className="text-[9px] text-white/50 uppercase tracking-widest mt-1">Predictions</p>
                        </div>
                        <div className="liquid-glass p-4 rounded-xl border border-white/5 text-center">
                          <span className="text-2xl font-bold text-white">{stats.overallAccuracy}%</span>
                          <p className="text-[9px] text-white/50 uppercase tracking-widest mt-1">Accuracy</p>
                        </div>
                      </div>

                      <div className="liquid-glass p-6 rounded-xl border border-white/5 text-center">
                        <h3 className="text-sm font-semibold text-white/80 mb-4 uppercase tracking-wider">Prediction Accuracy</h3>
                        <div className="flex items-center justify-center gap-8">
                          <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
                            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
                            <circle cx="60" cy="60" r="52" fill="none" stroke={stats.accuracy > 50 ? "#22c55e" : "#eab308"} strokeWidth="10"
                              strokeDasharray={`${(stats.accuracy / 100) * 327} 327`}
                              strokeLinecap="round" />
                            <circle cx="60" cy="60" r="38" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                            <circle cx="60" cy="60" r="38" fill="none" stroke={stats.scorelineAccuracy > 50 ? "#3b82f6" : "#a855f7"} strokeWidth="8"
                              strokeDasharray={`${(stats.scorelineAccuracy / 100) * 239} 239`}
                              strokeLinecap="round" />
                          </svg>
                          <div className="text-left">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="w-3 h-3 rounded-full bg-green-500" />
                              <span className="text-xs text-white/70">Winner Correct: {stats.correctWinners}</span>
                            </div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="w-3 h-3 rounded-full bg-white/20" />
                              <span className="text-xs text-white/70">Winner Incorrect: {stats.scoredPredictions - stats.correctWinners}</span>
                            </div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="w-3 h-3 rounded-full bg-blue-500" />
                              <span className="text-xs text-white/70">Scoreline Correct: {stats.correctScorelines}</span>
                            </div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="w-3 h-3 rounded-full bg-white/20" />
                              <span className="text-xs text-white/70">Scoreline Incorrect: {stats.totalScorelinePreds - stats.correctScorelines}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="w-3 h-3 rounded-full bg-white/10" />
                              <span className="text-xs text-white/70">Unscored: {stats.totalPredictions - stats.scoredPredictions}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-left">
                        <h3 className="font-heading italic text-xl uppercase tracking-tight text-white mb-4">Prediction History</h3>
                      </div>
                      {pPredsList.length === 0 ? (
                        <div className="liquid-glass rounded-xl p-8 text-center border border-white/5">
                          <span className="text-3xl block mb-2">🔮</span>
                          <p className="text-xs text-white/50">No predictions yet</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {pPredsList.map(pred => {
                            const fix = allFixtures.find(f => String(f.id) === String(pred.fixtureId));
                            const res = results[pred.fixtureId];
                            const pts = fix && res ? calcPoints(pred, res, fix) : null;
                            return (
                              <div key={pred.id || `${pred.uid}_${pred.fixtureId}`} className="liquid-glass p-4 rounded-xl border border-white/5">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="text-xs font-semibold text-white">
                                      {fix ? `${fl(fix.home)} ${fix.home} vs ${fix.away} ${fl(fix.away)}` : `Match #${pred.fixtureId}`}
                                    </p>
                                    <p className="text-[10px] text-white/40 mt-1">
                                      {fix ? formatDate(fix.date) : ""}
                                      {pred.submittedAt && ` • Predicted: ${new Date(pred.submittedAt?.toMillis ? pred.submittedAt.toMillis() : pred.submittedAt).toLocaleString("en-IN")}`}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-[10px] text-white/70 font-semibold">{formatPredictionSummary(pred, fix)}</p>
                                    {pts !== null && <p className={`text-[10px] font-bold mt-1 ${pts > 0 ? "text-green-400" : "text-white/40"}`}>{pts > 0 ? `+${pts} PTS` : "0 PTS"}</p>}
                                    {res && <p className="text-[9px] text-white/40 mt-0.5">Result: {formatResultSummary(res, fix)}</p>}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            <footer className="mb-24 mt-auto text-center pb-4 shrink-0">
              {!isAdmin && userTab === "you" ? (
                <>
                  <p className="text-[10px] text-white/20 tracking-wide mb-2">say hi to me</p>
                  <div className="flex items-center justify-center gap-4">
                    <a href={CREATOR_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-white/70 transition-colors" aria-label="Instagram">
                      <IconInstagram className="h-3.5 w-3.5" />
                    </a>
                    <a href={CREATOR_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-white/70 transition-colors" aria-label="LinkedIn">
                      <IconLinkedIn className="h-3.5 w-3.5" />
                    </a>
                    <a href={CREATOR_LINKS.github} target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-white/70 transition-colors" aria-label="GitHub">
                      <IconGitHub className="h-3.5 w-3.5" />
                    </a>
                    <a href={CREATOR_LINKS.email} className="text-white/20 hover:text-white/70 transition-colors" aria-label="Email">
                      <Mail className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </a>
                  </div>
                </>
              ) : (
                <div className="pb-20 flex items-center justify-center gap-6 pt-16">
                  {SPONSORS.map(sp => (
                    <img key={sp.label} src={sp.logo} alt={sp.name} className="h-8 sm:h-10 object-contain opacity-30 hover:opacity-60 transition-opacity rounded-2xl" />
                  ))}
                </div>
              )}
            </footer>
          </div>
        </div>
      )}

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
                  <button key={opt}
                    className={`flex-1 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all ${predWinner === opt ? "bg-white text-black border-white" : "frozen-inner text-white/60 hover:text-white"}`}
                    onClick={() => setPredWinner(opt)}>
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
                  <input className="input-glass w-full px-3 py-3 rounded-xl text-center text-lg font-semibold" type="number" min="0" placeholder="0" value={predHomeGoals} onChange={e => setPredHomeGoals(e.target.value)} />
                </div>
                <span className="text-sm font-bold text-white/25 pt-5">–</span>
                <div className="flex-1 text-center">
                  <p className="text-[9px] text-white/45 uppercase tracking-wider mb-2 truncate">{predFixture.away}</p>
                  <input className="input-glass w-full px-3 py-3 rounded-xl text-center text-lg font-semibold" type="number" min="0" placeholder="0" value={predAwayGoals} onChange={e => setPredAwayGoals(e.target.value)} />
                </div>
              </div>
              <p className="text-[10px] text-white/40 mt-1.5 leading-snug">Enter scores in home–away order. Example: 3–2 means {predFixture.home} 3, {predFixture.away} 2.</p>
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
                  <input className="input-glass w-full px-3 py-3 rounded-xl text-center text-lg font-semibold" type="number" min="0" placeholder="0" value={resHomeGoals} onChange={e => setResHomeGoals(e.target.value)} />
                </div>
                <span className="text-sm font-bold text-white/25 pt-5">–</span>
                <div className="flex-1 text-center">
                  <p className="text-[9px] text-white/45 uppercase tracking-wider mb-2 truncate">{selFixture.away}</p>
                  <input className="input-glass w-full px-3 py-3 rounded-xl text-center text-lg font-semibold" type="number" min="0" placeholder="0" value={resAwayGoals} onChange={e => setResAwayGoals(e.target.value)} />
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
                  <button key={r}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase border transition-all ${newRound === r ? "bg-white text-black border-white" : "bg-white/5 border-white/10 text-white/60 hover:text-white"}`}
                    onClick={() => setNewRound(r)}>{r}</button>
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
              <button className="btn-primary flex-1 py-3 rounded-full text-xs uppercase tracking-widest font-bold" onClick={handleSaveMatch}>{editingMatch ? "Update Match" : "Create Match"}</button>
              <button className="btn-secondary px-6 py-3 rounded-full text-xs font-semibold" onClick={() => setShowAddMatch(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {editFixture && isAdmin && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setEditFixture(null)}>
          <div className="liquid-glass p-6 w-full max-w-md rounded-[1.25rem] border border-white/15 shadow-2xl relative text-left">
            <h3 className="font-heading italic text-2xl text-white tracking-tight uppercase mb-4 text-amber-500">
              Edit Fixture
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-5">
              <div>
                <label className="block text-[10px] font-bold text-white/70 uppercase tracking-wider mb-1.5">Home Team</label>
                <input className="input-glass w-full px-3 py-2 rounded-lg text-xs" placeholder="Home" value={editFixtureHome} onChange={e => setEditFixtureHome(e.target.value)} style={{ width: "100%", padding: 10, borderRadius: 8, fontSize: 13 }} />
              </div>
              <span className="text-center text-[10px] font-bold text-white/20 mt-4 hidden md:inline">VS</span>
              <div>
                <label className="block text-[10px] font-bold text-white/70 uppercase tracking-wider mb-1.5">Away Team</label>
                <input className="input-glass w-full px-3 py-2 rounded-lg text-xs" placeholder="Away" value={editFixtureAway} onChange={e => setEditFixtureAway(e.target.value)} style={{ width: "100%", padding: 10, borderRadius: 8, fontSize: 13 }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-[10px] font-bold text-white/70 uppercase tracking-wider mb-1.5">Match Date</label>
                <input className="input-glass w-full px-3 py-2 rounded-lg text-xs" type="date" value={editFixtureDate} onChange={e => setEditFixtureDate(e.target.value)} style={{ width: "100%", padding: 10, borderRadius: 8, fontSize: 13 }} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-white/70 uppercase tracking-wider mb-1.5">Kick-off Time</label>
                <input className="input-glass w-full px-3 py-2 rounded-lg text-xs" type="time" value={editFixtureTime} onChange={e => setEditFixtureTime(e.target.value)} style={{ width: "100%", padding: 10, borderRadius: 8, fontSize: 13 }} />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-[10px] font-bold text-white/70 uppercase tracking-wider mb-1.5">Venue</label>
              <input className="input-glass w-full px-3 py-2 rounded-lg text-xs" placeholder="e.g. MetLife Stadium" value={editFixtureVenue} onChange={e => setEditFixtureVenue(e.target.value)} style={{ width: "100%", padding: 10, borderRadius: 8, fontSize: 13 }} />
            </div>
            <div className="flex gap-3">
              <button className="btn-primary flex-1 py-3 rounded-full text-xs uppercase tracking-widest font-bold" onClick={handleSaveFixtureEdit}>Save Changes</button>
              <button className="btn-secondary px-6 py-3 rounded-full text-xs font-semibold" onClick={() => setEditFixture(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}