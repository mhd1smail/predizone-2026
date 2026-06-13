/**
 * One-time migration script: Firebase → Supabase
 *
 * Before running:
 *   1. Create a Supabase project and copy its URL + anon key
 *   2. Set SUPABASE_URL and SUPABASE_ANON_KEY env vars (or edit below)
 *   3. Run: node migrate.mjs
 *
 * This script will NOT delete your Firebase data — it only reads from Firebase
 * and writes to Supabase. Both databases will have the data afterward.
 */

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query } from "firebase/firestore";
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";

// ── Firestore setup ──────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyDIo_LgImbR9Yrk1AZoNVqvKO5Uw_rK4gA",
  authDomain: "predizonee.firebaseapp.com",
  projectId: "predizonee",
  storageBucket: "predizonee.firebasestorage.app",
  messagingSenderId: "142219478263",
  appId: "1:142219478263:web:61bb97de445ff61d8ffff2",
  measurementId: "G-VFJS7TNDYR",
};

const fbApp = initializeApp(firebaseConfig, "migrate");
const fbDb = getFirestore(fbApp);

// ── Supabase tables ──────────────────────────────────────────────
// IMPORTANT: Run this SQL in Supabase Dashboard SQL Editor before using chat:
/*
CREATE TABLE IF NOT EXISTS chat_reports (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  reported_user_id TEXT NOT NULL,
  reported_user_name TEXT NOT NULL,
  reported_user_email TEXT NOT NULL DEFAULT '',
  reporter_user_id TEXT NOT NULL,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
*/

// ── Supabase setup ───────────────────────────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("ERROR: Set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.");
  console.error("Example:");
  console.error('  $env:SUPABASE_URL="https://xxx.supabase.co"');
  console.error('  $env:SUPABASE_ANON_KEY="eyJ..."');
  console.error("  node migrate.mjs");
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Helpers ──────────────────────────────────────────────────────
async function getAll(collectionName) {
  const snap = await getDocs(query(collection(fbDb, collectionName)));
  const items = [];
  snap.forEach((doc) => items.push({ id: doc.id, ...doc.data() }));
  return items;
}

function mapProfile(f) {
  return {
    id: f.uid || f.id,
    name: f.name || "",
    email: f.email || "",
    photo_url: f.photoURL || f.photo_url || "",
    dept: f.dept || "",
    year: f.year || "",
    is_admin: f.isAdmin || f.is_admin || false,
    favorite_team: f.favoriteTeam || f.favorite_team || null,
    created_at: f.createdAt?.toDate?.()?.toISOString() || f.created_at || new Date().toISOString(),
  };
}

function mapPrediction(f) {
  return {
    user_id: f.uid,
    fixture_id: String(f.fixtureId),
    winner: f.winner || null,
    home_goals: f.homeGoals ?? f.home_goals ?? null,
    away_goals: f.awayGoals ?? f.away_goals ?? null,
    submitted_at: f.submittedAt?.toDate?.()?.toISOString() || f.submitted_at || new Date().toISOString(),
  };
}

function mapResult(f) {
  return {
    fixture_id: String(f.fixtureId),
    winner: f.winner || null,
    home_goals: f.homeGoals ?? f.home_goals ?? null,
    away_goals: f.awayGoals ?? f.away_goals ?? null,
    entered_at: f.enteredAt?.toDate?.()?.toISOString() || f.entered_at || new Date().toISOString(),
  };
}

function mapKnockout(f) {
  return {
    id: String(f.id),
    round: f.round || "Knockout",
    home: f.home,
    away: f.away,
    date: f.date?.toDate?.()?.toISOString() || f.date,
    venue: f.venue || "TBD",
    is_knockout: true,
  };
}

// ── Main ─────────────────────────────────────────────────────────
async function migrate() {
  console.log("Starting Firebase → Supabase migration...\n");

  // 1. Migrate profiles
  console.log("📦 Migrating users/profiles...");
  const fbUsers = await getAll("users");
  console.log(`   Found ${fbUsers.length} users in Firebase`);
  let profilesMigrated = 0;
  for (const u of fbUsers) {
    const mapped = mapProfile(u);
    const { error } = await sb.from("profiles").upsert(mapped, { onConflict: "id" });
    if (error) {
      console.error(`   ✗ Failed to migrate user ${u.id}: ${error.message}`);
    } else {
      profilesMigrated++;
    }
  }
  console.log(`   ✓ Migrated ${profilesMigrated}/${fbUsers.length} profiles`);

  // 2. Migrate predictions
  console.log("\n📦 Migrating predictions...");
  const fbPreds = await getAll("predictions");
  console.log(`   Found ${fbPreds.length} predictions in Firebase`);
  let predsMigrated = 0;
  // Batch in groups of 100
  const batchSize = 100;
  for (let i = 0; i < fbPreds.length; i += batchSize) {
    const batch = fbPreds.slice(i, i + batchSize).map(mapPrediction);
    const { error } = await sb.from("predictions").upsert(batch, { onConflict: "user_id, fixture_id" });
    if (error) {
      console.error(`   ✗ Failed at batch ${i}: ${error.message}`);
    } else {
      predsMigrated += batch.length;
    }
  }
  console.log(`   ✓ Migrated ${predsMigrated}/${fbPreds.length} predictions`);

  // 3. Migrate results
  console.log("\n📦 Migrating results...");
  const fbResults = await getAll("results");
  console.log(`   Found ${fbResults.length} results in Firebase`);
  let resultsMigrated = 0;
  for (let i = 0; i < fbResults.length; i += batchSize) {
    const batch = fbResults.slice(i, i + batchSize).map(mapResult);
    const { error } = await sb.from("results").upsert(batch, { onConflict: "fixture_id" });
    if (error) {
      console.error(`   ✗ Failed at batch ${i}: ${error.message}`);
    } else {
      resultsMigrated += batch.length;
    }
  }
  console.log(`   ✓ Migrated ${resultsMigrated}/${fbResults.length} results`);

  // 4. Migrate knockout matches
  console.log("\n📦 Migrating knockout matches...");
  const fbKnockout = await getAll("knockout");
  console.log(`   Found ${fbKnockout.length} knockout matches in Firebase`);
  let knockMigrated = 0;
  for (const m of fbKnockout) {
    const mapped = mapKnockout(m);
    const { error } = await sb.from("knockout_matches").upsert(mapped, { onConflict: "id" });
    if (error) {
      console.error(`   ✗ Failed to migrate knockout match ${m.id}: ${error.message}`);
    } else {
      knockMigrated++;
    }
  }
  console.log(`   ✓ Migrated ${knockMigrated}/${fbKnockout.length} knockout matches`);

  // 5. Migrate settings (arena, fixtureOverrides, undo)
  console.log("\n📦 Migrating settings...");
  const fbSettings = await getAll("settings");
  console.log(`   Found ${fbSettings.length} settings docs in Firebase`);
  let settingsMigrated = 0;
  for (const s of fbSettings) {
    const record = { id: s.id };
    if (s.arenaLocked !== undefined) record.arena_locked = s.arenaLocked;
    if (s.lockedBy) record.locked_by = s.lockedBy;
    if (s.overrides) record.overrides = s.overrides;
    if (s.fixtureId !== undefined) record.fixture_id = String(s.fixtureId);
    if (s.previous !== undefined) record.previous = s.previous;
    if (s.timestamp?.toDate) record.timestamp = s.timestamp.toDate().toISOString();
    if (s.updatedAt?.toDate) record.updated_at = s.updatedAt.toDate().toISOString();
    const { error } = await sb.from("settings").upsert(record, { onConflict: "id" });
    if (error) {
      console.error(`   ✗ Failed to migrate setting ${s.id}: ${error.message}`);
    } else {
      settingsMigrated++;
    }
  }
  console.log(`   ✓ Migrated ${settingsMigrated}/${fbSettings.length} settings`);

  console.log("\n✅ Migration complete!");
  console.log("   Your Firebase data has been copied to Supabase.");
  console.log("   Both databases still have the data — you can delete the Firebase project when ready.");
  console.log("\n📋 Next steps:");
  console.log("   1. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file");
  console.log("   2. In Supabase Dashboard → Auth → Providers → enable Google");
  console.log("   3. Set site URL in Supabase Auth settings to your app URL");
  console.log("   4. Deploy the updated app");
}

migrate().catch(console.error);
