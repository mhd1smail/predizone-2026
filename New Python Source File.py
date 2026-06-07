import { useState, useEffect, useRef } from "react";
// ─── FIFA WC 2026 GROUP STAGE FIXTURES ────────────────────────────────────────
const FIXTURES = [
  { id: 1,  group:"A", home:"Mexico",      away:"Ecuador",     date:"2026-06-11T20:00:00-05:00", venue:"SoFi Stadium, Los Angeles" },
  { id: 2,  group:"A", home:"USA",         away:"Bolivia",     date:"2026-06-12T17:00:00-05:00", venue:"MetLife Stadium, New York" },
  { id: 3,  group:"A", home:"Ecuador",     away:"Bolivia",     date:"2026-06-16T14:00:00-05:00", venue:"Levi's Stadium, San Francisco" },
  { id: 4,  group:"A", home:"USA",         away:"Mexico",      date:"2026-06-16T20:00:00-05:00", venue:"AT&T Stadium, Dallas" },
  { id: 5,  group:"A", home:"Bolivia",     away:"USA",         date:"2026-06-20T20:00:00-05:00", venue:"Rose Bowl, Los Angeles" },
  { id: 6,  group:"A", home:"Ecuador",     away:"Mexico",      date:"2026-06-20T20:00:00-05:00", venue:"Arrowhead Stadium, Kansas City" },
  { id: 7,  group:"B", home:"Argentina",   away:"Morocco",     date:"2026-06-13T17:00:00-05:00", venue:"MetLife Stadium, New York" },
  { id: 8,  group:"B", home:"Ukraine",     away:"Iraq",        date:"2026-06-13T20:00:00-05:00", venue:"AT&T Stadium, Dallas" },
  { id: 9,  group:"B", home:"Morocco",     away:"Iraq",        date:"2026-06-17T14:00:00-05:00", venue:"Arrowhead Stadium, Kansas City" },
  { id: 10, group:"B", home:"Argentina",   away:"Ukraine",     date:"2026-06-17T20:00:00-05:00", venue:"Rose Bowl, Los Angeles" },
  { id: 11, group:"B", home:"Iraq",        away:"Argentina",   date:"2026-06-21T16:00:00-05:00", venue:"SoFi Stadium, Los Angeles" },
  { id: 12, group:"B", home:"Ukraine",     away:"Morocco",     date:"2026-06-21T16:00:00-05:00", venue:"Levi's Stadium, San Francisco" },
  { id: 13, group:"C", home:"France",      away:"Saudi Arabia",date:"2026-06-13T14:00:00-05:00", venue:"BC Place, Vancouver" },
  { id: 14, group:"C", home:"Japan",       away:"New Zealand", date:"2026-06-14T17:00:00-05:00", venue:"Estadio Akron, Guadalajara" },
  { id: 15, group:"C", home:"Saudi Arabia",away:"New Zealand", date:"2026-06-18T14:00:00-05:00", venue:"BC Place, Vancouver" },
  { id: 16, group:"C", home:"France",      away:"Japan",       date:"2026-06-18T20:00:00-05:00", venue:"AT&T Stadium, Dallas" },
  { id: 17, group:"C", home:"New Zealand", away:"France",      date:"2026-06-22T16:00:00-05:00", venue:"Estadio Akron, Guadalajara" },
  { id: 18, group:"C", home:"Saudi Arabia",away:"Japan",       date:"2026-06-22T16:00:00-05:00", venue:"MetLife Stadium, New York" },
  { id: 19, group:"D", home:"Spain",       away:"South Korea", date:"2026-06-14T14:00:00-05:00", venue:"Rose Bowl, Los Angeles" },
  { id: 20, group:"D", home:"Germany",     away:"Nigeria",     date:"2026-06-14T20:00:00-05:00", venue:"AT&T Stadium, Dallas" },
  { id: 21, group:"D", home:"South Korea", away:"Nigeria",     date:"2026-06-18T17:00:00-05:00", venue:"SoFi Stadium, Los Angeles" },
  { id: 22, group:"D", home:"Spain",       away:"Germany",     date:"2026-06-19T20:00:00-05:00", venue:"MetLife Stadium, New York" },
  { id: 23, group:"D", home:"Nigeria",     away:"Spain",       date:"2026-06-23T16:00:00-05:00", venue:"Arrowhead Stadium, Kansas City" },
  { id: 24, group:"D", home:"South Korea", away:"Germany",     date:"2026-06-23T16:00:00-05:00", venue:"Levi's Stadium, San Francisco" },
  { id: 25, group:"E", home:"Brazil",      away:"Serbia",      date:"2026-06-15T17:00:00-05:00", venue:"Estadio Azteca, Mexico City" },
  { id: 26, group:"E", home:"England",     away:"Australia",   date:"2026-06-15T20:00:00-05:00", venue:"AT&T Stadium, Dallas" },
  { id: 27, group:"E", home:"Serbia",      away:"Australia",   date:"2026-06-19T14:00:00-05:00", venue:"Rose Bowl, Los Angeles" },
  { id: 28, group:"E", home:"Brazil",      away:"England",     date:"2026-06-19T17:00:00-05:00", venue:"SoFi Stadium, Los Angeles" },
  { id: 29, group:"E", home:"Australia",   away:"Brazil",      date:"2026-06-23T20:00:00-05:00", venue:"MetLife Stadium, New York" },
  { id: 30, group:"E", home:"England",     away:"Serbia",      date:"2026-06-23T20:00:00-05:00", venue:"BC Place, Vancouver" },
  { id: 31, group:"F", home:"Portugal",    away:"Cameroon",    date:"2026-06-15T14:00:00-05:00", venue:"BC Place, Vancouver" },
  { id: 32, group:"F", home:"Belgium",     away:"Venezuela",   date:"2026-06-16T17:00:00-05:00", venue:"Estadio Akron, Guadalajara" },
  { id: 33, group:"F", home:"Cameroon",    away:"Venezuela",   date:"2026-06-20T14:00:00-05:00", venue:"Estadio Azteca, Mexico City" },
  { id: 34, group:"F", home:"Portugal",    away:"Belgium",     date:"2026-06-20T17:00:00-05:00", venue:"Rose Bowl, Los Angeles" },
  { id: 35, group:"F", home:"Venezuela",   away:"Portugal",    date:"2026-06-24T16:00:00-05:00", venue:"SoFi Stadium, Los Angeles" },
  { id: 36, group:"F", home:"Cameroon",    away:"Belgium",     date:"2026-06-24T16:00:00-05:00", venue:"AT&T Stadium, Dallas" },
  { id: 37, group:"G", home:"Netherlands", away:"Uruguay",     date:"2026-06-16T14:00:00-05:00", venue:"Estadio Azteca, Mexico City" },
  { id: 38, group:"G", home:"Colombia",    away:"Senegal",     date:"2026-06-17T17:00:00-05:00", venue:"BC Place, Vancouver" },
  { id: 39, group:"G", home:"Uruguay",     away:"Senegal",     date:"2026-06-21T14:00:00-05:00", venue:"Estadio Akron, Guadalajara" },
  { id: 40, group:"G", home:"Netherlands", away:"Colombia",    date:"2026-06-21T20:00:00-05:00", venue:"MetLife Stadium, New York" },
  { id: 41, group:"G", home:"Senegal",     away:"Netherlands", date:"2026-06-25T16:00:00-05:00", venue:"Rose Bowl, Los Angeles" },
  { id: 42, group:"G", home:"Uruguay",     away:"Colombia",    date:"2026-06-25T16:00:00-05:00", venue:"Estadio Azteca, Mexico City" },
  { id: 43, group:"H", home:"Italy",       away:"Ecuador",     date:"2026-06-17T14:00:00-05:00", venue:"AT&T Stadium, Dallas" },
  { id: 44, group:"H", home:"Croatia",     away:"Iran",        date:"2026-06-17T20:00:00-05:00", venue:"SoFi Stadium, Los Angeles" },
  { id: 45, group:"H", home:"Ecuador",     away:"Iran",        date:"2026-06-21T17:00:00-05:00", venue:"MetLife Stadium, New York" },
  { id: 46, group:"H", home:"Italy",       away:"Croatia",     date:"2026-06-22T20:00:00-05:00", venue:"BC Place, Vancouver" },
  { id: 47, group:"H", home:"Iran",        away:"Italy",       date:"2026-06-26T16:00:00-05:00", venue:"Estadio Akron, Guadalajara" },
  { id: 48, group:"H", home:"Croatia",     away:"Ecuador",     date:"2026-06-26T16:00:00-05:00", venue:"Arrowhead Stadium, Kansas City" },
];
const ADMIN_CODE = "PREDIZONE_ADMIN_2026";
const STORAGE_KEYS = { users:"pz_users", predictions:"pz_predictions", results:"pz_results", session:"pz_session", knockout:"pz_knockout" };
const ROUNDS = ["Round of 32","Round of 16","Quarterfinal","Semifinal","Third Place","Final"];
// ─── STORAGE ──────────────────────────────────────────────────────────────────
async function load(key) {
  try { const r = await window.storage.get(key); return r ? JSON.parse(r.value) : null; } catch { return null; }
}
async function save(key, val) {
  try { await window.storage.set(key, JSON.stringify(val)); } catch(e) { console.error(e); }
}
// ─── FLAGS ────────────────────────────────────────────────────────────────────
const FLAGS = {
  "Mexico":"🇲🇽","Ecuador":"🇪🇨","USA":"🇺🇸","Bolivia":"🇧🇴","Argentina":"🇦🇷","Morocco":"🇲🇦",
  "Ukraine":"🇺🇦","Iraq":"🇮🇶","France":"🇫🇷","Saudi Arabia":"🇸🇦","Japan":"🇯🇵","New Zealand":"🇳🇿",
  "Spain":"🇪🇸","South Korea":"🇰🇷","Germany":"🇩🇪","Nigeria":"🇳🇬","Brazil":"🇧🇷","Serbia":"🇷🇸",
  "England":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","Australia":"🇦🇺","Portugal":"🇵🇹","Cameroon":"🇨🇲","Belgium":"🇧🇪",
  "Venezuela":"🇻🇪","Netherlands":"🇳🇱","Uruguay":"🇺🇾","Colombia":"🇨🇴","Senegal":"🇸🇳",
  "Italy":"🇮🇹","Croatia":"🇭🇷","Iran":"🇮🇷","Draw":"🤝"
};
const fl = t => FLAGS[t] || " ";
// ─── UNIQUE ID: normalise name + dept so typos/spacing don't create duplicates ─
function makeUserId(name, dept) {
  const n = name.trim().toLowerCase().replace(/\s+/g," ").replace(/[^a-z0-9 ]/g,"");
  const d = dept.trim().toLowerCase().replace(/\s+/g,"").replace(/[^a-z0-9]/g,"");
  return `${n}__${d}`;
}
// Normalise display name: trim + collapse spaces + title-case
function normaliseName(name) {
  return name.trim().replace(/\s+/g," ").replace(/\b\w/g, c => c.toUpperCase());
}
function normaliseDept(dept) {
  return dept.trim().replace(/\s+/g," ");
}
// ─── TIME HELPERS ─────────────────────────────────────────────────────────────
function isSameLocalDay(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getFullYear()===now.getFullYear() && d.getMonth()===now.getMonth() && d.getDate()===now.getDate();
}
function isLocked(fixture) {
  const lock = new Date(new Date(fixture.date).getTime() - 1800000);
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
  return d.toLocaleDateString("en-IN",{weekday:"short",month:"short",day:"numeric"}) +
    " • " + d.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",timeZoneName:"short"});
}
function todayLabel() {
  return new Date().toLocaleDateString("en-IN",{weekday:"long",month:"long",day:"numeric",year:"numeric"});
}
// ─── POINTS ───────────────────────────────────────────────────────────────────
function calcPoints(pred, res) {
  if (!pred || !res) return 0;
  let p = 0;
  if (pred.winner === res.winner) p += 3;
  if (parseInt(pred.goals) === parseInt(res.goals)) p += 2;
  return p;
}
function buildLeaderboard(users, predictions, results, knockoutFixtures) {
  const allFixtures = [...FIXTURES, ...knockoutFixtures];
  return Object.values(users).map(u => {
    let pts = 0;
    allFixtures.forEach(fix => {
      const pred = predictions[`${u.id}_${fix.id}`];
      const res = results[fix.id];
      if (pred && res) pts += calcPoints(pred, res);
    });
    return { ...u, points: pts };
  }).sort((a,b) => b.points - a.points);
}
// ─── RIPPLE HELPER ────────────────────────────────────────────────────────────
// Creates a DOM ripple effect at the click position inside any button
function addRipple(e) {
  const btn = e.currentTarget;
  const dot = document.createElement("span");
  const rect = btn.getBoundingClientRect();
  dot.className = "ripple-dot";
  dot.style.top  = (e.clientY - rect.top)  + "px";
  dot.style.left = (e.clientX - rect.left) + "px";
  btn.appendChild(dot);
  setTimeout(() => dot.remove(), 650);
}
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("splash");
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState({});
  const [predictions, setPredictions] = useState({});
  const [results, setResults] = useState({});
  const [knockoutFixtures, setKnockoutFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [adminTab, setAdminTab] = useState("results");
  const [adminGroup, setAdminGroup] = useState("A");
  // login
  const [loginName, setLoginName] = useState("");
  const [loginDept, setLoginDept] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [loginMode, setLoginMode] = useState("user");
  // prediction modal
  const [predFixture, setPredFixture] = useState(null);
  const [predWinner, setPredWinner] = useState("");
  const [predGoals, setPredGoals] = useState("");
  // admin result modal
  const [selFixture, setSelFixture] = useState(null);
  const [resWinner, setResWinner] = useState("");
  const [resGoals, setResGoals] = useState("");
  // add match modal
  const [showAddMatch, setShowAddMatch] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null); // null = new, obj = editing
  const [newRound, setNewRound] = useState("Round of 32");
  const [newHome, setNewHome] = useState("");
  const [newAway, setNewAway] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newVenue, setNewVenue] = useState("");
  useEffect(() => {
    (async () => {
      const [u,p,r,s,k] = await Promise.all([
        load(STORAGE_KEYS.users), load(STORAGE_KEYS.predictions),
        load(STORAGE_KEYS.results), load(STORAGE_KEYS.session),
        load(STORAGE_KEYS.knockout)
      ]);
      if (u) setUsers(u);
      if (p) setPredictions(p);
      if (r) setResults(r);
      if (k) setKnockoutFixtures(k);
      if (s) { setCurrentUser(s.user); setIsAdmin(s.isAdmin||false); setPage(s.isAdmin?"admin":"home"); }
      setLoading(false);
    })();
  }, []);
  const showToast = (msg, type="success") => {
    setToast({msg,type});
    setTimeout(() => setToast(null), 3200);
  };
  // ── LOGIN ──
  const handleLogin = async () => {
    if (loginMode === "admin") {
      if (adminCode.trim() !== ADMIN_CODE) { showToast("Invalid admin code!","error"); return; }
      const au = {id:"admin",name:"Admin",dept:"Admin",isAdmin:true};
      setCurrentUser(au); setIsAdmin(true);
      await save(STORAGE_KEYS.session,{user:au,isAdmin:true});
      setPage("admin"); showToast("Welcome, Admin! "); return;
    }
    const rawName = loginName.trim();
    const rawDept = loginDept.trim();
    if (rawName.length < 3) { showToast("Enter your full name (min 3 characters)!","error"); return; }
    if (!/^[a-zA-Z\s]+$/.test(rawName)) { showToast("Name should only contain letters!","error"); return; }
    if (rawDept.length < 2) { showToast("Enter your department name!","error"); return; }
    const name = normaliseName(rawName);
    const dept = normaliseDept(rawDept);
    const id   = makeUserId(rawName, rawDept);
    const newUsers = { ...users };
    if (!newUsers[id]) {
      newUsers[id] = { id, name, dept, joinedAt: new Date().toISOString() };
      setUsers(newUsers);
      await save(STORAGE_KEYS.users, newUsers);
    }
    const user = newUsers[id];
    setCurrentUser(user); setIsAdmin(false);
    await save(STORAGE_KEYS.session, {user, isAdmin:false});
    setPage("home");
    showToast(`Welcome, ${user.name}! `);
  };
  const handleLogout = async () => {
    setCurrentUser(null); setIsAdmin(false);
    await save(STORAGE_KEYS.session, null);
    setLoginName(""); setLoginDept(""); setAdminCode("");
    setPage("splash");
  };
  // ── SAVE PREDICTION ──
  const handleSavePrediction = async () => {
    if (!predWinner) { showToast("Select a winner!","error"); return; }
    if (predGoals==="" || isNaN(predGoals) || parseInt(predGoals)<0) { showToast("Enter valid total goals (0 or more)!","error"); return; }
    if (isLocked(predFixture)) { showToast("Predictions are LOCKED for this match!","error"); return; }
    const key = `${currentUser.id}_${predFixture.id}`;
    // Block re-prediction if already submitted
    if (predictions[key]) { showToast("You already predicted this match!","error"); return; }
    const newPreds = { ...predictions, [key]: { winner:predWinner, goals:parseInt(predGoals), submittedAt:new Date().toISOString() }};
    setPredictions(newPreds);
    await save(STORAGE_KEYS.predictions, newPreds);
    setPredFixture(null); setPredWinner(""); setPredGoals("");
    showToast("Prediction locked! ");
  };
  // ── ADMIN RESULT ──
  const handleSaveResult = async () => {
    if (!resWinner) { showToast("Select winner!","error"); return; }
    if (resGoals==="" || isNaN(resGoals)) { showToast("Enter total goals!","error"); return; }
    const newResults = { ...results, [selFixture.id]: { winner:resWinner, goals:parseInt(resGoals), enteredAt:new Date().toISOString() }};
    setResults(newResults);
    await save(STORAGE_KEYS.results, newResults);
    setSelFixture(null); setResWinner(""); setResGoals("");
    showToast("Result saved! Points updated. ");
  };
  // ── ADMIN ADD / EDIT KNOCKOUT MATCH ──
  const openAddMatch = (match=null) => {
    if (match) {
      // editing existing
      setEditingMatch(match);
      setNewRound(match.round);
      setNewHome(match.home);
      setNewAway(match.away);
      const d = new Date(match.date);
      setNewDate(d.toISOString().slice(0,10));
      setNewTime(d.toTimeString().slice(0,5));
      setNewVenue(match.venue);
    } else {
      setEditingMatch(null);
      setNewRound("Round of 32"); setNewHome(""); setNewAway("");
      setNewDate(""); setNewTime(""); setNewVenue("");
    }
    setShowAddMatch(true);
  };
  const handleSaveMatch = async () => {
    if (!newHome.trim()) { showToast("Enter home team name!","error"); return; }
    if (!newAway.trim()) { showToast("Enter away team name!","error"); return; }
    if (!newDate)        { showToast("Pick a match date!","error"); return; }
    if (!newTime)        { showToast("Pick a match time!","error"); return; }
    const dateStr = `${newDate}T${newTime}:00`;
    let updated;
    if (editingMatch) {
      updated = knockoutFixtures.map(f => f.id===editingMatch.id
        ? { ...f, round:newRound, home:newHome.trim(), away:newAway.trim(), date:dateStr, venue:newVenue.trim()||"TBD" }
        : f
      );
      showToast("Match updated! ");
    } else {
      const newId = `ko_${Date.now()}`;
      const newMatch = { id:newId, round:newRound, group:newRound, home:newHome.trim(), away:newAway.trim(), date:dateStr, venue:newVenue.trim()||"TBD", isKnockout:true };
      updated = [...knockoutFixtures, newMatch];
      showToast("Match added! ");
    }
    setKnockoutFixtures(updated);
    await save(STORAGE_KEYS.knockout, updated);
    setShowAddMatch(false);
  };
  const handleDeleteMatch = async (matchId) => {
    const updated = knockoutFixtures.filter(f => f.id !== matchId);
    setKnockoutFixtures(updated);
    await save(STORAGE_KEYS.knockout, updated);
    showToast("Match deleted.");
  };
  const leaderboard = buildLeaderboard(users, predictions, results, knockoutFixtures);
  const allFixtures = [...FIXTURES, ...knockoutFixtures];
  const todayFixtures = allFixtures.filter(f => isSameLocalDay(f.date));
  const groups = ["A","B","C","D","E","F","G","H"];
  if (loading) return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100vh",background:"#0a1f0a",color:"#4ade80",fontFamily:"serif",gap:16}}>
      <span style={{fontSize:52,animation:"spin 1s linear infinite",display:"inline-block"}}>
      <span style={{fontFamily:"'Source Sans 3',sans-serif",fontSize:16,letterSpacing:3,color:"#4ade80",animation:"pulseGlow 1.5s ease-in-out infinite"}}>LOADING PREDIZONE…</span>
    </div>
  );
  return (
    <div style={{fontFamily:"Georgia,serif",background:"#0d1f0d",minHeight:"100vh",color:"#f0faf0"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Source+Sans+3:wght@300;400;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#0d1f0d;}
        ::-webkit-scrollbar{width:6px;}
        ::-webkit-scrollbar-track{background:#0d1f0d;}
        ::-webkit-scrollbar-thumb{background:#2d7a2d;border-radius:3px;}
        /* 
── KEYFRAMES ── */
        @keyframes fadeUp   { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
        @keyframes slideDown{ from{opacity:0;transform:translateY(-18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp  { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideRight{from{opacity:0;transform:translateX(60px)} to{opacity:1;transform:translateX(0)} }
        @keyframes scaleIn  { from{opacity:0;transform:scale(.88)} to{opacity:1;transform:scale(1)} }
        @keyframes bounceBall{
          0%,100%{transform:translateY(0) rotate(0deg);}
          30%    {transform:translateY(-28px) rotate(120deg);}
          55%    {transform:translateY(-10px) rotate(200deg);}
          75%    {transform:translateY(-18px) rotate(300deg);}
        }
        @keyframes pulseGlow{
          0%,100%{text-shadow:0 0 18px rgba(74,222,128,.45);}
          50%    {text-shadow:0 0 40px rgba(74,222,128,.9),0 0 80px rgba(74,222,128,.3);}
        }
        @keyframes shimmer{
          0%  {background-position:-400px 0}
          100%{background-position:400px 0}
        }
        @keyframes toastIn {from{opacity:0;transform:translateX(60px)} to{opacity:1;transform:translateX(0)} }
        @keyframes toastOut{from{opacity:1;transform:translateX(0)} to{opacity:0;transform:translateX(60px)} }
        @keyframes ripple  { from{transform:scale(0);opacity:.5} to{transform:scale(4);opacity:0} }
        @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes countUp { from{opacity:0;transform:scale(.5)} to{opacity:1;transform:scale(1)} }
        @keyframes borderPulse{
          0%,100%{border-color:#1c3c1c}
          50%    {border-color:#2d6a2d}
        }
        @keyframes statusBlink{
          0%,100%{opacity:1} 50%{opacity:.5}
        }
        /* 
── PAGE WRAPPERS ── */
        .page-enter      { animation: fadeUp .45s cubic-bezier(.22,.68,0,1.2) both; }
        .login-enter     { animation: scaleIn .4s cubic-bezier(.22,.68,0,1.2) both; }
        .modal-enter     { animation: slideUp .35s cubic-bezier(.22,.68,0,1.2) both; }
        .overlay-enter   { animation: fadeIn .25s ease both; }
        /* 
── STAGGERED CARDS (set --i on element) ── */
        .stagger { animation: fadeUp .4s cubic-bezier(.22,.68,0,1.2) both; animation-delay: calc(var(--i,0) * 70ms); }
        /* 
── BALL ── */
        .ball-anim { animation: bounceBall 2.6s ease-in-out infinite; display:inline-block; }
        /* 
── TITLE GLOW ── */
        .glow { animation: pulseGlow 3s ease-in-out infinite; }
        /* 
── BUTTONS ── */
        .btn-g {
          background:linear-gradient(135deg,#1a7a1a,#2ea82e);
          color:#fff; border:none; padding:12px 28px; border-radius:8px;
          font-size:15px; font-family:'Source Sans 3',sans-serif;
          cursor:pointer; font-weight:600; letter-spacing:.5px;
          transition: transform .15s cubic-bezier(.34,1.56,.64,1), box-shadow .2s, background .2s;
          position:relative; overflow:hidden;
        }
        .btn-g:hover  { background:linear-gradient(135deg,#228822,#38c838); transform:translateY(-2px) scale(1.02); box-shadow:0 6px 24px rgba(46,168,46,.45); }
        .btn-g:active { transform:scale(.95); box-shadow:none; }
        .btn-o {
          background:transparent; color:#4ade80; border:1.5px solid #4ade80;
          padding:10px 22px; border-radius:8px; font-size:14px; cursor:pointer;
          font-family:'Source Sans 3',sans-serif; font-weight:600;
          transition: transform .15s cubic-bezier(.34,1.56,.64,1), background .2s, box-shadow .2s;
          position:relative; overflow:hidden;
        }
        .btn-o:hover  { background:#4ade8018; transform:translateY(-1px); box-shadow:0 4px 16px rgba(74,222,128,.2); }
        .btn-o:active { transform:scale(.95); }
        /* ripple child */
        .ripple-dot {
          position:absolute; border-radius:50%;
          background:rgba(255,255,255,.35);
          width:10px; height:10px; margin-top:-5px; margin-left:-5px;
          animation: ripple .6s linear forwards;
          pointer-events:none;
        }
        /* 
── CARD ── */
        .card { background:linear-gradient(145deg,#0f2a0f,#142814); border:1px solid #1e4a1e; border-radius:16px; }
        /* 
── INPUT ── */
        .inp {
          background:#0a1a0a; border:1.5px solid #2a5a2a; color:#e0ffe0;
          padding:12px 16px; border-radius:8px; font-size:15px;
          font-family:'Source Sans 3',sans-serif; outline:none; width:100%;
          transition: border-color .25s, box-shadow .25s, transform .2s;
        }
        .inp:focus { border-color:#4ade80; box-shadow:0 0 0 3px rgba(74,222,128,.12); transform:translateY(-1px); }
        .inp::placeholder{ color:#3a6a3a; }
        /* 
── TAG ── */
        .tag { display:inline-block; padding:3px 10px; border-radius:20px; font-size:12px; font-weight:600; font-family:'Source Sans 3',sans-serif; }
        /* 
── TABS ── */
        .tab { padding:8px 18px; border-radius:8px; cursor:pointer; font-size:14px; font-family:'Source Sans 3',sans-serif; font-weight:600; border:none; transition: background .2s, color .2s, transform .15s; }
        .tab:active { transform: scale(.94); }
        .tab-a { background:#1a5c1a; color:#a3ffaa; }
        .tab-i { background:transparent; color:#6b9b6b; }
        .tab-i:hover { background:#1a2e1a; color:#9be09b; }
        /* 
── FIXTURE CARDS ── */
        .fcard {
          background:#0f230f; border:1px solid #1c3c1c; border-radius:12px;
          padding:16px; margin-bottom:10px;
          transition: border-color .25s, background .25s, transform .2s, box-shadow .2s;
          animation: borderPulse 4s ease-in-out infinite;
        }
        .fcard:hover { border-color:#2a5a2a; background:#121e12; transform:translateY(-2px); box-shadow:0 6px 24px rgba(0,0,0,.4); animation:none; }
        /* 
── MODAL / OVERLAY ── */
        .overlay { position:fixed; inset:0; background:rgba(0,0,0,.82); z-index:100; display:flex; align-items:center; justify-content:center; padding:16px; backdrop-filter:blur(6px); }
        .modal   { background:#0f2a0f; border:1px solid #2a5a2a; border-radius:20px; padding:28px; width:100%; max-width:480px; max-height:90vh; overflow-y:auto; }
        /* 
── NAV ── */
        .nav-btn { background:none; border:none; color:#6b9b6b; cursor:pointer; padding:8px 14px; font-size:13px; font-family:'Source Sans 3',sans-serif; font-weight:600; border-radius:8px; transition: color .2s, background .2s, transform .15s; }
        .nav-btn:hover,.nav-btn.active { color:#a3ffaa; background:#1a2e1a; }
        .nav-btn:active { transform:scale(.9); }
        /* 
── LEADERBOARD ROWS ── */
        .lb-row { transition: transform .2s, box-shadow .2s; }
        .lb-row:hover { transform:translateX(4px); box-shadow: -3px 0 0 #4ade80; }
        /* 
── STATUS INDICATOR ── */
        .status-open { animation: statusBlink 2.5s ease-in-out infinite; }
        /* 
── WINNER BTN ── */
        .winner-btn { transition: border-color .2s, background .2s, transform .18s cubic-bezier(.34,1.56,.64,1), box-shadow .2s !important; }
        .winner-btn:hover { transform:translateY(-2px) scale(1.04) !important; }
        .winner-btn:active{ transform:scale(.93) !important; }
        .winner-btn.selected { box-shadow: 0 0 16px rgba(74,222,128,.35); }
        label{display:block;color:#86efac;font-size:13px;font-family:'Source Sans 3',sans-serif;font-weight:600;margin-bottom:8px;}
      `}</style>
      {/* TOAST */}
      {toast && (
        <div style={{position:"fixed",top:20,right:20,zIndex:1000,background:toast.type==="error"?"#7f1d1d":"#14532d",border:`1px solid ${toast.type==="error"?"#ef4444":"#22c55e"}`,color:toast.type==="error"?"#fca5a5":"#86efac",padding:"12px 20px",borderRadius:12,fontFamily:"'Source Sans 3',sans-serif",fontSize:14,fontWeight:600,boxShadow:"0 8px 32px rgba(0,0,0,.5)",maxWidth:340,animation:"toastIn .35s cubic-bezier(.22,.68,0,1.2) both",display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:18}}>{toast.type==="error"?"🚨":"✅"}</span>
          {toast.msg}
        </div>
      )}
      {/* 
── SPLASH ── */}
      {page==="splash" && (
        <div className="page-enter" style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,background:"radial-gradient(ellipse at 50% 0%,#1a4a1a 0%,#0d1f0d 60%)"}}>
          <div className="ball-anim" style={{fontSize:72,marginBottom:12}}>⚽</div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(38px,8vw,74px)",fontWeight:900,color:"#4ade80",letterSpacing:"-1px",textAlign:"center",lineHeight:1.05,animation:"fadeUp .5s .1s both"}} className="glow">PREDIZONE</div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(18px,4vw,28px)",color:"#86efac",letterSpacing:"8px",marginTop:4,textAlign:"center",animation:"fadeUp .5s .2s both"}}>2 0 2 6</div>
          <div style={{color:"#6b9b6b",fontFamily:"'Source Sans 3',sans-serif",fontSize:15,marginTop:16,textAlign:"center",maxWidth:400,lineHeight:1.7,animation:"fadeUp .5s .3s both"}}>
            FIFA World Cup 2026 Prediction Contest.<br/>Predict today's matches. Climb the leaderboard.
          </div>
          <div style={{display:"flex",gap:14,marginTop:36,flexWrap:"wrap",justifyContent:"center",animation:"fadeUp .5s .4s both"}}>
            <button className="btn-g" style={{fontSize:16,padding:"14px 36px"}} onClick={e=>{addRipple(e);setPage("login");}}>Get Started</button>
            <button className="btn-o" onClick={e=>{addRipple(e);setPage("leaderboard");}}>Leaderboard</button>
          </div>
          <div style={{display:"flex",gap:32,marginTop:48,flexWrap:"wrap",justifyContent:"center"}}>
            {[["🏆","Predict Winner","+3 pts"],["⚽","Exact Goals","+2 pts"],["⏱️","Locks 30 min before","match kick-off"],["📈","Leaderboard","Live Standings"]].map((x,i) => (
              <div key={i} className="stagger" style={{"--i":i+5,textAlign:"center"}}>
                <div style={{fontSize:22,color:"#4ade80",fontFamily:"'Playfair Display',serif"}}>{x[0]}</div>
                <div style={{fontSize:12,color:"#5a8a5a",fontFamily:"'Source Sans 3',sans-serif",marginTop:4}}>{x[1]}</div>
                <div style={{fontSize:11,color:"#4ade80",fontFamily:"'Source Sans 3',sans-serif"}}>{x[2]}</div>
              </div>
            ))}
          </div>
          <button style={{marginTop:52,background:"none",border:"none",color:"#4a6a4a",cursor:"pointer",fontSize:12,fontFamily:"'Source Sans 3',sans-serif",animation:"fadeIn 1s .8s both",transition:"color .2s"}} onMouseEnter={e=>e.target.style.color="#6a9a6a"} onMouseLeave={e=>e.target.style.color="#4a6a4a"} onClick={()=>{setLoginMode("admin");setPage("login");}}>
            Admin Access →
          </button>
        </div>
      )}
      {/* 
── LOGIN ── */}
      {page==="login" && (
        <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:24,background:"radial-gradient(ellipse at 50% 0%,#1a4a1a 0%,#0d1f0d 60%)",animation:"fadeIn .3s both"}}>
          <div className="card login-enter" style={{padding:36,width:"100%",maxWidth:420}}>
            <div style={{textAlign:"center",marginBottom:28}}>
              <div className="ball-anim" style={{fontSize:40,marginBottom:8,display:"inline-block"}}>⚽</div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:900,color:"#4ade80",animation:"fadeUp .4s .1s both"}}>PREDIZONE 2026</div>
              <div style={{color:"#6b9b6b",fontSize:14,fontFamily:"'Source Sans 3',sans-serif",marginTop:6,animation:"fadeUp .4s .18s both"}}>
                {loginMode==="admin"?"Admin Login":"Join the Contest"}
              </div>
            </div>
            {/* mode toggle */}
            <div style={{display:"flex",gap:8,marginBottom:24,background:"#0a1a0a",padding:4,borderRadius:10,animation:"fadeUp .4s .22s both"}}>
              {["user","admin"].map(m=>(
                <button key={m} onClick={()=>setLoginMode(m)} style={{flex:1,padding:"8px",border:"none",borderRadius:8,cursor:"pointer",fontFamily:"'Source Sans 3',sans-serif",fontSize:13,fontWeight:600,transition:"background .25s, color .25s, transform .15s",background:loginMode===m?"#1a5c1a":"transparent",color:loginMode===m?"#a3ffaa":"#5a8a5a",transform:loginMode===m?"scale(1.03)":"scale(1)"}}>
                  {m==="user"?" Participant":" Admin"}
                </button>
              ))}
            </div>
            {loginMode==="user" ? (
              <>
                <div style={{marginBottom:16,animation:"fadeUp .4s .28s both"}}>
                  <label>FULL NAME</label>
                  <input className="inp" placeholder="e.g. Rahul Sharma" value={loginName} onChange={e=>setLoginName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} />
                  <div style={{fontSize:11,color:"#4a6a4a",fontFamily:"'Source Sans 3',sans-serif",marginTop:6}}>Letters only — must match exactly every time you log in</div>
                </div>
                <div style={{marginBottom:24,animation:"fadeUp .4s .34s both"}}>
                  <label>DEPARTMENT</label>
                  <input className="inp" placeholder="e.g. Computer Science" value={loginDept} onChange={e=>setLoginDept(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} />
                  <div style={{fontSize:11,color:"#4a6a4a",fontFamily:"'Source Sans 3',sans-serif",marginTop:6}}>Type your department exactly — used to verify your identity</div>
                </div>
                <div style={{background:"#051205",border:"1px solid #1a3a1a",borderRadius:8,padding:12,marginBottom:20,fontSize:12,color:"#5a8a5a",fontFamily:"'Source Sans 3',sans-serif",lineHeight:1.7,animation:"fadeUp .4s .38s both"}}>
 <strong style={{color:"#4ade80"}}>Your identity</strong> is locked to your Name + Department combination. Each unique pair can only register once — use the same details every time you return.
                </div>
              </>
            ) : (
              <div style={{marginBottom:24,animation:"fadeUp .4s .28s both"}}>
                <label>ADMIN CODE</label>
                <input className="inp" type="password" placeholder="Enter admin code" value={adminCode} onChange={e=>setAdminCode(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} />
              </div>
            )}
            <div style={{animation:"fadeUp .4s .42s both"}}>
              <button className="btn-g" style={{width:"100%",fontSize:16,padding:"14px"}} onClick={e=>{addRipple(e);handleLogin();}}>
                {loginMode==="admin"?" Admin Login":" Enter Contest"}
              </button>
              <button className="btn-o" style={{width:"100%",marginTop:12}} onClick={e=>{addRipple(e);setPage("splash");}}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {/* 
── MAIN APP ── */}
      {(page==="home"||page==="leaderboard"||page==="admin") && currentUser && (
        <div style={{maxWidth:760,margin:"0 auto",paddingBottom:80}}>
          {/* NAV */}
          <div style={{background:"linear-gradient(180deg,#0f2a0f,#0d1f0d)",borderBottom:"1px solid #1c3c1c",padding:"12px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:50}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:900,color:"#4ade80"}}>PREDIZONE</div>
            <div style={{display:"flex",gap:4,alignItems:"center"}}>
              {!isAdmin && <>
                <button className={`nav-btn${page==="home"?" active":""}`} onClick={()=>setPage("home")}>Today</button>
                <button className={`nav-btn${page==="leaderboard"?" active":""}`} onClick={()=>setPage("leaderboard")}>Board</button>
              </>}
              {isAdmin && <button className={`nav-btn${page==="admin"?" active":""}`} onClick={()=>setPage("admin")}>Admin</button>}
              <button className="nav-btn" onClick={handleLogout} style={{color:"#ef4444"}}>Logout</button>
            </div>
          </div>
          {/* USER BAR */}
          {!isAdmin && (
            <div style={{background:"#0a1a0a",padding:"10px 20px",borderBottom:"1px solid #1a3a1a",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{fontFamily:"'Source Sans 3',sans-serif",fontSize:14}}>
                <span style={{color:"#4ade80",fontWeight:700}}>{currentUser.name}</span>
                <span style={{color:"#4a7a4a",marginLeft:8,fontSize:12}}>{currentUser.dept}</span>
              </div>
              <div style={{fontFamily:"'Source Sans 3',sans-serif",fontSize:14,color:"#fbbf24",fontWeight:700}}>
                {leaderboard.find(l=>l.id===currentUser.id)?.points||0} pts
              </div>
            </div>
          )}
          {/* 
── TODAY'S MATCHES ── */}
          {page==="home" && (
            <div style={{padding:"20px 16px"}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:900,color:"#e0ffe0",marginBottom:2}}>Today's Matches</div>
              <div style={{color:"#5a8a5a",fontSize:13,fontFamily:"'Source Sans 3',sans-serif",marginBottom:20}}>{todayLabel()}</div>
              {todayFixtures.length === 0 ? (
                <div style={{textAlign:"center",padding:"60px 20px"}}>
                  <div style={{fontSize:48,marginBottom:16}}>📅</div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:"#4a7a4a",marginBottom:8}}>No Matches Today</div>
                  <div style={{fontFamily:"'Source Sans 3',sans-serif",fontSize:14,color:"#3a5a3a",lineHeight:1.7}}>
                    There are no FIFA World Cup 2026 fixtures scheduled for today.<br/>Check back on a match day!
                  </div>
                  <button className="btn-o" style={{marginTop:24}} onClick={()=>setPage("leaderboard")}>View Leaderboard</button>
                </div>
              ) : (
                todayFixtures.map(fix => {
                  const status = getStatus(fix);
                  const key = `${currentUser.id}_${fix.id}`;
                  const myPred = predictions[key];
                  const res = results[fix.id];
                  const pts = myPred && res ? calcPoints(myPred, res) : null;
                  const alreadyPredicted = !!myPred;
                  return (
                    <div key={fix.id} className="fcard">
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                        <div style={{fontSize:11,color:"#5a8a5a",fontFamily:"'Source Sans 3',sans-serif"}}>
                          {fix.isKnockout ? ` ${fix.round}` : ` Group ${fix.group}`} &nbsp;•&nbsp; 
                        </div>
                        <span className="tag" style={{background:status==="open"?"#14532d":status==="locked"?"#431407":"#1e1b4b",color:status==="open"?"#4ade80":status==="locked"?"#fb923c":"#818cf8",fontSize:11}}>
                          {status==="open"?" OPEN":status==="locked"?" LOCKED":" PLAYED"}
                        </span>
                      </div>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                        <div style={{textAlign:"center",flex:1}}>
                          <div style={{fontSize:30}}>{fl(fix.home)}</div>
                          <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:"#e0ffe0",marginTop:4}}>{fix.home}</div>
                        </div>
                        <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,color:"#4a7a4a",fontWeight:900,padding:"0 16px"}}>VS</div>
                        <div style={{textAlign:"center",flex:1}}>
                          <div style={{fontSize:30}}>{fl(fix.away)}</div>
                          <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:"#e0ffe0",marginTop:4}}>{fix.away}</div>
                        </div>
                      </div>
                      <div style={{fontSize:11,color:"#4a7a4a",fontFamily:"'Source Sans 3',sans-serif",marginBottom:10}}>{formatDate(fix.date)} &nbsp;•&nbsp; {fix.venue}</div>
                      {res && (
                        <div style={{background:"#0a1a0a",borderRadius:8,padding:"8px 12px",marginBottom:10,fontFamily:"'Source Sans 3',sans-serif",fontSize:13,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <div><span style={{color:"#6b9b6b"}}>Result: </span><span style={{color:"#4ade80",fontWeight:700}}>{fl(res.winner)} {res.winner}</span><span style={{color:"#5a8a5a"}}> • {res.goals} goals</span></div>
                          {pts!==null && <span className="tag" style={{background:pts>0?"#14532d":"#1c1c1c",color:pts>0?"#4ade80":"#5a7a5a"}}>{pts>0?`+${pts} pts`:"0 pts"}</span>}
                        </div>
                      )}
                      {myPred && (
                        <div style={{background:"#0a2a0a",border:"1px solid #1a4a1a",borderRadius:8,padding:"8px 12px",marginBottom:10,fontFamily:"'Source Sans 3',sans-serif",fontSize:13}}>
                          <span style={{color:"#4ade80",fontWeight:700}}>Your Prediction: </span>
                          <span>{fl(myPred.winner)} {myPred.winner}</span>
                          <span style={{color:"#5a8a5a"}}> • {myPred.goals} total goals</span>
                          <span style={{marginLeft:8,color:"#2a5a2a",fontSize:11}}> Locked</span>
                        </div>
                      )}
                      {status==="open" && !alreadyPredicted && (
                        <button className="btn-g" style={{width:"100%",padding:"10px",fontSize:14}} onClick={()=>{setPredFixture(fix);setPredWinner("");setPredGoals("");}}>
 Make Prediction
                        </button>
                      )}
                      {status==="open" && alreadyPredicted && (
                        <div style={{textAlign:"center",padding:"8px",fontFamily:"'Source Sans 3',sans-serif",fontSize:13,color:"#2a6a2a",background:"#051205",borderRadius:8}}>
 Prediction submitted — cannot be changed
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
          {/* 
── LEADERBOARD ── */}
          {page==="leaderboard" && (
            <div style={{padding:"20px 16px"}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:900,color:"#4ade80",marginBottom:4}} className="glow">LEADERBOARD</div>
              <div style={{color:"#5a8a5a",fontSize:13,fontFamily:"'Source Sans 3',sans-serif",marginBottom:24}}>{leaderboard.length} participants • live standings</div>
              {leaderboard.length===0 ? (
                <div style={{textAlign:"center",padding:"60px 20px",color:"#4a7a4a",fontFamily:"'Source Sans 3',sans-serif"}}>No predictions yet. Be the first!</div>
              ) : leaderboard.map((u,i) => {
                const isMe = currentUser && u.id===currentUser.id;
                return (
                  <div key={u.id} style={{background:isMe?"#0a2a0a":"#0f230f",border:`1px solid ${isMe?"#2a6a2a":"#1c3c1c"}`,borderRadius:12,padding:"14px 18px",marginBottom:8,display:"flex",alignItems:"center",gap:14}}>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:900,color:i===0?"#fbbf24":i===1?"#9ca3af":i===2?"#cd7f32":"#4a7a4a",minWidth:40,textAlign:"center"}}>
                      {i===0?"🥇":i===1?"🥈":i===2?"🥉":`#${i+1}`}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,color:isMe?"#4ade80":"#e0ffe0"}}>
                        {u.name} {isMe&&<span style={{fontSize:12,color:"#4ade80"}}>(you)</span>}
                      </div>
                      <div style={{fontFamily:"'Source Sans 3',sans-serif",fontSize:12,color:"#5a8a5a",marginTop:2}}>{u.dept}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:900,color:"#4ade80"}}>{u.points}</div>
                      <div style={{fontFamily:"'Source Sans 3',sans-serif",fontSize:11,color:"#5a8a5a"}}>pts</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {/* 
── ADMIN ── */}
          {page==="admin" && isAdmin && (
            <div style={{padding:"20px 16px"}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:900,color:"#fbbf24",marginBottom:20}}>ADMIN PORTAL</div>
              <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
                {["results","matches","leaderboard","participants"].map(t=>(
                  <button key={t} className={`tab ${adminTab===t?"tab-a":"tab-i"}`} onClick={()=>setAdminTab(t)}>
                    {t==="results"?"📝 Results":t==="matches"?"📅 Matches":t==="leaderboard"?"📊 Leaderboard":"👥 Participants"}
                  </button>
                ))}
              </div>
              {/* 
── RESULTS TAB ── */}
              {adminTab==="results" && (
                <div>
                  <div style={{color:"#86efac",fontFamily:"'Source Sans 3',sans-serif",fontSize:14,marginBottom:16}}>Enter actual results to award points automatically.</div>
                  {/* Group stage */}
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:"#6b9b6b",marginBottom:10}}>Group Stage</div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
                    {groups.map(g=>(
                      <button key={g} className={`tab ${adminGroup===g?"tab-a":"tab-i"}`} onClick={()=>setAdminGroup(g)}>Group {g}</button>
                    ))}
                  </div>
                  {FIXTURES.filter(f=>f.group===adminGroup).map(fix=>{
                    const res=results[fix.id];
                    return (
                      <div key={fix.id} className="fcard" style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
                        <div style={{flex:1}}>
                          <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:700,color:"#e0ffe0"}}>{fl(fix.home)} {fix.home} vs {fix.away} {fl(fix.away)}</div>
                          <div style={{fontFamily:"'Source Sans 3',sans-serif",fontSize:11,color:"#4a7a4a",marginTop:4}}>{formatDate(fix.date)}</div>
                          {res && <div style={{fontFamily:"'Source Sans 3',sans-serif",fontSize:12,color:"#4ade80",marginTop:6}}>
                        </div>
                        <button className="btn-o" style={{fontSize:12,padding:"8px 14px",whiteSpace:"nowrap"}} onClick={()=>{setSelFixture(fix);setResWinner(res?.winner||"");setResGoals(res?.goals!==undefined?String(res.goals):"");}}>
                          {res?"Edit":"Enter Result"}
                        </button>
                      </div>
                    );
                  })}
                  {/* Knockout stage */}
                  {knockoutFixtures.length > 0 && (
                    <>
                      <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:"#fbbf24",margin:"20px 0 10px"}}>Knockout Stage</div>
                      {ROUNDS.map(round => {
                        const roundFixes = knockoutFixtures.filter(f=>f.round===round);
                        if (!roundFixes.length) return null;
                        return (
                          <div key={round}>
                            <div style={{fontFamily:"'Source Sans 3',sans-serif",fontSize:12,color:"#6b9b6b",fontWeight:700,letterSpacing:1,marginBottom:8,marginTop:12}}>{round.toUpperCase()}</div>
                            {roundFixes.map(fix=>{
                              const res=results[fix.id];
                              return (
                                <div key={fix.id} className="fcard" style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,borderColor:"#2a3a1a"}}>
                                  <div style={{flex:1}}>
                                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:700,color:"#e0ffe0"}}>{fl(fix.home)} {fix.home} vs {fix.away} {fl(fix.away)}</div>
                                    <div style={{fontFamily:"'Source Sans 3',sans-serif",fontSize:11,color:"#4a7a4a",marginTop:4}}>{formatDate(fix.date)} • {fix.venue}</div>
                                    {res && <div style={{fontFamily:"'Source Sans 3',sans-serif",fontSize:12,color:"#4ade80",marginTop:6}}>
                                  </div>
                                  <button className="btn-o" style={{fontSize:12,padding:"8px 14px",whiteSpace:"nowrap",borderColor:"#fbbf2466",color:"#fbbf24"}} onClick={()=>{setSelFixture(fix);setResWinner(res?.winner||"");setResGoals(res?.goals!==undefined?String(res.goals):"");}}>
                                    {res?"Edit":"Enter Result"}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              )}
              {/* 
── MATCHES TAB ── */}
              {adminTab==="matches" && (
                <div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                    <div style={{color:"#86efac",fontFamily:"'Source Sans 3',sans-serif",fontSize:14}}>
                      Add knockout matches once teams are known.
                    </div>
                    <button className="btn-g" style={{padding:"10px 18px",fontSize:13}} onClick={e=>{addRipple(e);openAddMatch();}}>
                      + Add Match
                    </button>
                  </div>
                  {knockoutFixtures.length === 0 ? (
                    <div style={{textAlign:"center",padding:"50px 20px",border:"2px dashed #1c3c1c",borderRadius:16}}>
                      <div style={{fontSize:40,marginBottom:12}}> </div>
                      <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:"#4a7a4a",marginBottom:8}}>No Knockout Matches Yet</div>
                      <div style={{fontFamily:"'Source Sans 3',sans-serif",fontSize:13,color:"#3a5a3a",lineHeight:1.7}}>
                        Once the group stage is done, tap<br/><strong style={{color:"#4ade80"}}>+ Add Match</strong> to create knockout fixtures.
                      </div>
                    </div>
                  ) : (
                    ROUNDS.map(round => {
                      const roundFixes = knockoutFixtures.filter(f=>f.round===round);
                      if (!roundFixes.length) return null;
                      const roundColors = {
                        "Round of 32":"#1a3a2a","Round of 16":"#1a2a3a",
                        "Quarterfinal":"#2a1a3a","Semifinal":"#3a2a1a",
                        "Third Place":"#1a3a3a","Final":"#3a2a0a"
                      };
                      return (
                        <div key={round} style={{marginBottom:20}}>
                          <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:900,color:"#fbbf24",letterSpacing:1,marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
                            <span style={{background:roundColors[round]||"#1a2a1a",padding:"4px 12px",borderRadius:20,fontSize:12}}>{round.toUpperCase()}</span>
                            <span style={{color:"#4a6a4a",fontSize:12,fontFamily:"'Source Sans 3',sans-serif"}}>{roundFixes.length} match{roundFixes.length>1?"es":""}</span>
                          </div>
                          {roundFixes.map(fix=>(
                            <div key={fix.id} className="fcard" style={{display:"flex",alignItems:"center",gap:12,borderColor:"#2a3a1a"}}>
                              <div style={{flex:1}}>
                                <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:"#e0ffe0"}}>
                                  {fl(fix.home)} {fix.home} <span style={{color:"#4a7a4a"}}>vs</span> {fix.away} {fl(fix.away)}
                                </div>
                                <div style={{fontFamily:"'Source Sans 3',sans-serif",fontSize:11,color:"#4a7a4a",marginTop:5}}>
 {formatDate(fix.date)} &nbsp;•&nbsp;  {fix.venue}
                                </div>
                              </div>
                              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                                <button onClick={e=>{addRipple(e);openAddMatch(fix);}} style={{background:"#1a3a1a",border:"1px solid #2a5a2a",color:"#4ade80",padding:"6px 12px",borderRadius:7,fontSize:12,cursor:"pointer",fontFamily:"'Source Sans 3',sans-serif",fontWeight:600,transition:"all .2s"}}>
 Edit
                                </button>
                                <button onClick={()=>handleDeleteMatch(fix.id)} style={{background:"#3a0a0a",border:"1px solid #7f1d1d",color:"#fca5a5",padding:"6px 12px",borderRadius:7,fontSize:12,cursor:"pointer",fontFamily:"'Source Sans 3',sans-serif",fontWeight:600,transition:"all .2s"}}>
 Del
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
              {adminTab==="leaderboard" && (
                <div>
                  {leaderboard.map((u,i)=>(
                    <div key={u.id} style={{background:"#0f230f",border:"1px solid #1c3c1c",borderRadius:10,padding:"12px 16px",marginBottom:8,display:"flex",alignItems:"center",gap:12}}>
                      <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:900,color:i===0?"#fbbf24":i===1?"#9ca3af":i===2?"#cd7f32":"#4a7a4a",minWidth:36,textAlign:"center"}}>#{i+1}</div>
                      <div style={{flex:1}}>
                        <div style={{fontFamily:"'Source Sans 3',sans-serif",fontSize:15,fontWeight:700,color:"#e0ffe0"}}>{u.name}</div>
                        <div style={{fontFamily:"'Source Sans 3',sans-serif",fontSize:12,color:"#5a8a5a"}}>{u.dept}</div>
                      </div>
                      <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:900,color:"#4ade80"}}>{u.points} <span style={{fontSize:12,color:"#5a8a5a"}}>pts</span></div>
                    </div>
                  ))}
                  {leaderboard.length===0 && <div style={{color:"#4a7a4a",fontFamily:"'Source Sans 3',sans-serif",textAlign:"center",padding:40}}>No participants yet.</div>}
                </div>
              )}
              {adminTab==="participants" && (
                <div>
                  <div style={{color:"#86efac",fontFamily:"'Source Sans 3',sans-serif",fontSize:14,marginBottom:16}}>{Object.keys(users).length} registered participants</div>
                  {Object.values(users).map(u=>{
                    const totalFix = FIXTURES.length + knockoutFixtures.length;
                    const predCount = allFixtures.filter(f=>predictions[`${u.id}_${f.id}`]).length;
                    return (
                      <div key={u.id} style={{background:"#0f230f",border:"1px solid #1c3c1c",borderRadius:10,padding:"12px 16px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div>
                          <div style={{fontFamily:"'Source Sans 3',sans-serif",fontSize:15,fontWeight:700,color:"#e0ffe0"}}>{u.name}</div>
                          <div style={{fontFamily:"'Source Sans 3',sans-serif",fontSize:12,color:"#5a8a5a"}}>{u.dept}</div>
                        </div>
                        <div style={{textAlign:"right"}}>
                          <div style={{fontFamily:"'Source Sans 3',sans-serif",fontSize:13,color:"#4ade80"}}>{predCount}/{totalFix} predictions</div>
                          <div style={{fontFamily:"'Source Sans 3',sans-serif",fontSize:11,color:"#5a8a5a"}}>{leaderboard.find(l=>l.id===u.id)?.points||0} pts</div>
                        </div>
                      </div>
                    );
                  })}
                  {Object.keys(users).length===0 && <div style={{color:"#4a7a4a",fontFamily:"'Source Sans 3',sans-serif",textAlign:"center",padding:40}}>No participants yet.</div>}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {/* Leaderboard for logged-out visitors */}
      {page==="leaderboard" && !currentUser && (
        <div style={{maxWidth:760,margin:"0 auto",padding:"20px 16px 80px"}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:900,color:"#4ade80",marginBottom:4}}>LEADERBOARD</div>
          <div style={{color:"#5a8a5a",fontSize:13,fontFamily:"'Source Sans 3',sans-serif",marginBottom:24}}>PREDIZONE 2026 standings</div>
          {leaderboard.map((u,i)=>(
            <div key={u.id} style={{background:"#0f230f",border:"1px solid #1c3c1c",borderRadius:12,padding:"14px 18px",marginBottom:8,display:"flex",alignItems:"center",gap:14}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:900,color:i===0?"#fbbf24":i===1?"#9ca3af":i===2?"#cd7f32":"#4a7a4a",minWidth:36,textAlign:"center"}}>
                {i===0?"🥇":i===1?"🥈":i===2?"🥉":`#${i+1}`}
              </div>
              <div style={{flex:1}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:"#e0ffe0"}}>{u.name}</div>
                <div style={{fontFamily:"'Source Sans 3',sans-serif",fontSize:12,color:"#5a8a5a"}}>{u.dept}</div>
              </div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:900,color:"#4ade80"}}>{u.points} pts</div>
            </div>
          ))}
          {leaderboard.length===0 && <div style={{color:"#4a7a4a",fontFamily:"'Source Sans 3',sans-serif",textAlign:"center",padding:60}}>No predictions yet.</div>}
          <button className="btn-g" style={{width:"100%",marginTop:20}} onClick={()=>setPage("login")}>Login to Predict</button>
          <button className="btn-o" style={{width:"100%",marginTop:10}} onClick={()=>setPage("splash")}>Back to Home</button>
        </div>
      )}
      {/* 
── PREDICTION MODAL ── */}
      {predFixture && (
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&setPredFixture(null)}>
          <div className="modal">
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:900,color:"#4ade80",marginBottom:4}}>Make Your Prediction</div>
            <div style={{fontFamily:"'Source Sans 3',sans-serif",fontSize:13,color:"#5a8a5a",marginBottom:20}}>
 {predFixture.venue}<br/> {formatDate(predFixture.date)}
            </div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-around",marginBottom:20,background:"#0a1a0a",borderRadius:12,padding:"16px 12px"}}>
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:36}}>{fl(predFixture.home)}</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:"#e0ffe0",marginTop:6}}>{predFixture.home}</div>
              </div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,color:"#4a7a4a",fontWeight:900}}>VS</div>
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:36}}>{fl(predFixture.away)}</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:"#e0ffe0",marginTop:6}}>{predFixture.away}</div>
              </div>
            </div>
            <div style={{marginBottom:20}}>
              <div style={{color:"#86efac",fontSize:13,fontFamily:"'Source Sans 3',sans-serif",fontWeight:700,marginBottom:10}}>WINNER</div>
              <div style={{display:"flex",gap:8}}>
                {[predFixture.home,"Draw",predFixture.away].map(opt=>(
                  <button key={opt} onClick={()=>setPredWinner(opt)} style={{flex:1,padding:"12px 6px",borderRadius:10,border:`2px solid ${predWinner===opt?"#4ade80":"#2a5a2a"}`,background:predWinner===opt?"#14532d":"#0a1a0a",color:predWinner===opt?"#4ade80":"#6b9b6b",cursor:"pointer",fontFamily:"'Source Sans 3',sans-serif",fontSize:12,fontWeight:700,transition:"all .2s",textAlign:"center"}}>
                    <div style={{fontSize:20,marginBottom:4}}>{fl(opt)}</div>{opt}
                  </button>
                ))}
              </div>
            </div>
            <div style={{marginBottom:24}}>
              <div style={{color:"#86efac",fontSize:13,fontFamily:"'Source Sans 3',sans-serif",fontWeight:700,marginBottom:10}}>TOTAL GOALS</div>
              <input className="inp" type="number" min="0" max="20" placeholder="e.g. 3" value={predGoals} onChange={e=>setPredGoals(e.target.value)} style={{fontSize:18,textAlign:"center",padding:"12px"}} />
              <div style={{fontSize:11,color:"#4a7a4a",fontFamily:"'Source Sans 3',sans-serif",marginTop:6}}>Combined total goals scored by both teams</div>
            </div>
            <div style={{background:"#051205",border:"1px solid #1a3a1a",borderRadius:8,padding:10,marginBottom:16,fontSize:12,color:"#5a8a5a",fontFamily:"'Source Sans 3',sans-serif"}}>
              Once submitted, your prediction <strong style={{color:"#4ade80"}}>cannot be changed</strong>.
            </div>
            <div style={{display:"flex",gap:10}}>
              <button className="btn-g" style={{flex:1,padding:"12px"}} onClick={handleSavePrediction}>Submit Prediction</button>
              <button className="btn-o" style={{padding:"12px 16px"}} onClick={()=>setPredFixture(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {/* 
── ADMIN RESULT MODAL ── */}
      {selFixture && isAdmin && (
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&setSelFixture(null)}>
          <div className="modal">
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:900,color:"#fbbf24",marginBottom:16}}>Enter Match Result</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,color:"#e0ffe0",marginBottom:20}}>{fl(selFixture.home)} {selFixture.home} vs {selFixture.away} {fl(selFixture.away)}</div>
            <div style={{marginBottom:18}}>
              <div style={{color:"#86efac",fontSize:13,fontFamily:"'Source Sans 3',sans-serif",fontWeight:700,marginBottom:10}}>WINNER</div>
              <div style={{display:"flex",gap:8}}>
                {[selFixture.home,"Draw",selFixture.away].map(opt=>(
                  <button key={opt} onClick={()=>setResWinner(opt)} style={{flex:1,padding:"10px 6px",borderRadius:10,border:`2px solid ${resWinner===opt?"#fbbf24":"#2a5a2a"}`,background:resWinner===opt?"#451a03":"#0a1a0a",color:resWinner===opt?"#fbbf24":"#6b9b6b",cursor:"pointer",fontFamily:"'Source Sans 3',sans-serif",fontSize:12,fontWeight:700,transition:"all .2s",textAlign:"center"}}>
                    <div style={{fontSize:18,marginBottom:3}}>{fl(opt)}</div>{opt}
                  </button>
                ))}
              </div>
            </div>
            <div style={{marginBottom:24}}>
              <div style={{color:"#86efac",fontSize:13,fontFamily:"'Source Sans 3',sans-serif",fontWeight:700,marginBottom:10}}>TOTAL GOALS</div>
              <input className="inp" type="number" min="0" placeholder="e.g. 2" value={resGoals} onChange={e=>setResGoals(e.target.value)} style={{fontSize:18,textAlign:"center"}} />
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={handleSaveResult} style={{flex:1,background:"linear-gradient(135deg,#78350f,#a16207)",color:"#fef3c7",border:"none",padding:"12px",borderRadius:10,fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"'Source Sans 3',sans-serif"}}>Save Result</button>
              <button className="btn-o" style={{padding:"12px 16px"}} onClick={()=>setSelFixture(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {/* 
── ADD / EDIT MATCH MODAL ── */}
      {showAddMatch && isAdmin && (
        <div className="overlay overlay-enter" onClick={e=>e.target===e.currentTarget&&setShowAddMatch(false)}>
          <div className="modal modal-enter" style={{maxWidth:500}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:900,color:"#fbbf24",marginBottom:4}}>
              {editingMatch ? " Edit Match" : " Add Knockout Match"}
            </div>
         <div style={{fontFamily:"'Source Sans 3',sans-serif",fontSize:13,color:"#5a8a5a",marginBottom:22}}>
              This match will appear for participants on the scheduled day.
            </div>
            {/* Round */}
            <div style={{marginBottom:16}}>
              <label style={{color:"#fbbf24"}}>ROUND</label>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {ROUNDS.map(r=>(
                  <button key={r} onClick={()=>setNewRound(r)} style={{padding:"7px 12px",borderRadius:8,border:`1.5px solid ${newRound===r?"#fbbf24":"#2a3a1a"}`,background:newRound===r?"#451a03":"#0a1a0a",color:newRound===r?"#fbbf24":"#6b9b6b",cursor:"pointer",fontFamily:"'Source Sans 3',sans-serif",fontSize:12,fontWeight:600,transition:"all .2s"}}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
            {/* Teams */}
            <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:10,alignItems:"center",marginBottom:16}}>
              <div>
                <label style={{color:"#fbbf24"}}>HOME TEAM</label>
                <input className="inp" placeholder="e.g. Argentina" value={newHome} onChange={e=>setNewHome(e.target.value)} />
              </div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,color:"#4a7a4a",fontWeight:900,textAlign:"center",marginTop:20}}>VS</div>
              <div>
                <label style={{color:"#fbbf24"}}>AWAY TEAM</label>
                <input className="inp" placeholder="e.g. France" value={newAway} onChange={e=>setNewAway(e.target.value)} />
              </div>
            </div>
            {/* Date & Time */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
              <div>
                <label style={{color:"#fbbf24"}}>MATCH DATE</label>
                <input className="inp" type="date" value={newDate} onChange={e=>setNewDate(e.target.value)} />
              </div>
              <div>
                <label style={{color:"#fbbf24"}}>KICK-OFF TIME</label>
                <input className="inp" type="time" value={newTime} onChange={e=>setNewTime(e.target.value)} />
              </div>
            </div>
            {/* Venue */}
            <div style={{marginBottom:24}}>
              <label style={{color:"#fbbf24"}}>VENUE <span style={{color:"#4a6a4a",fontSize:11,fontWeight:400}}>(optional)</span></label>
              <input className="inp" placeholder="e.g. MetLife Stadium, New York" value={newVenue} onChange={e=>setNewVenue(e.target.value)} />
            </div>
            <div style={{background:"#051205",border:"1px solid #1a3a1a",borderRadius:8,padding:10,marginBottom:18,fontSize:12,color:"#5a8a5a",fontFamily:"'Source Sans 3',sans-serif",lineHeight:1.7}}>
 Predictions will auto-lock <strong style={{color:"#4ade80"}}>30 minutes before kick-off</strong>.
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={e=>{addRipple(e);handleSaveMatch();}} style={{flex:1,background:"linear-gradient(135deg,#78350f,#a16207)",color:"#fef3c7",border:"none",padding:"13px",borderRadius:10,fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"'Source Sans 3',sans-serif",transition:"all .2s"}}>
                {editingMatch ? " Update Match" : " Save Match"}
              </button>
              <button className="btn-o" style={{padding:"13px 18px"}} onClick={()=>setShowAddMatch(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}