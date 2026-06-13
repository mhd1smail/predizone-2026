import { supabase } from "./supabase";

export async function createUserProfile(uid, data) {
  const { data: profile, error } = await supabase
    .from("profiles")
    .insert({
      id: uid,
      name: data.name,
      dept: data.dept,
      year: data.year,
      email: data.email || "",
      photo_url: data.photoURL || "",
      is_admin: false,
    })
    .select()
    .single();
  if (error) throw error;
  return profile;
}

export async function getUserProfile(uid) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", uid)
    .single();
  if (error && error.code !== "PGRST116") throw error;
  if (!data) return null;
  return mapProfile(data);
}

export async function getProfileByEmail(email) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", email)
    .maybeSingle();
  if (error) throw error;
  return data ? mapProfile(data) : null;
}

export async function updateUserProfileId(oldId, newId) {
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ id: newId })
    .eq("id", oldId);
  if (profileError) throw profileError;
  const { error: predError } = await supabase
    .from("predictions")
    .update({ user_id: newId })
    .eq("user_id", oldId);
  if (predError) throw predError;
}

export async function updateUserProfile(uid, updates) {
  const mapped = {};
  if (updates.favoriteTeam !== undefined) mapped.favorite_team = updates.favoriteTeam;
  if (updates.name !== undefined) mapped.name = updates.name;
  if (updates.dept !== undefined) mapped.dept = updates.dept;
  if (updates.year !== undefined) mapped.year = updates.year;
  if (updates.photoURL !== undefined) mapped.photo_url = updates.photoURL;
  const { data, error } = await supabase
    .from("profiles")
    .update(mapped)
    .eq("id", uid)
    .select()
    .single();
  if (error) throw error;
  return mapProfile(data);
}

export function onUserProfile(uid, callback) {
  const subscription = supabase
    .channel(`profile:${uid}`)
    .on("postgres_changes",
      { event: "*", schema: "public", table: "profiles", filter: `id=eq.${uid}` },
      (payload) => callback(mapProfile(payload.new))
    )
    .subscribe();
  return () => supabase.removeChannel(subscription);
}

export function onAllUsers(callback) {
  supabase.from("profiles").select("*").limit(1000000).then(({ data }) => {
    const users = {};
    (data || []).forEach((u) => { users[u.id] = mapProfile(u); });
    callback(users);
  });
  const channel = supabase
    .channel("all-users")
    .on("postgres_changes",
      { event: "*", schema: "public", table: "profiles" },
      () => {
        supabase.from("profiles").select("*").limit(1000000).then(({ data }) => {
          const users = {};
          (data || []).forEach((u) => { users[u.id] = mapProfile(u); });
          callback(users);
        });
      }
    )
    .subscribe();
  return () => supabase.removeChannel(channel);
}

export async function savePrediction(uid, fixtureId, prediction) {
  const { data, error } = await supabase
    .from("predictions")
    .upsert({
      user_id: uid,
      fixture_id: String(fixtureId),
      winner: prediction.winner,
      home_goals: prediction.homeGoals,
      away_goals: prediction.awayGoals,
    }, { onConflict: "user_id, fixture_id" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getUserPredictions(uid) {
  const { data, error } = await supabase
    .from("predictions")
    .select("*")
    .eq("user_id", uid)
    .limit(1000000);
  if (error) throw error;
  const preds = {};
  (data || []).forEach((p) => {
    const key = `${uid}_${p.fixture_id}`;
    preds[key] = mapPrediction(p);
  });
  return preds;
}

export function onUserPredictions(uid, callback) {
  supabase.from("predictions").select("*").eq("user_id", uid).limit(1000000).then(({ data }) => {
    const preds = {};
    (data || []).forEach((p) => {
      const key = `${uid}_${p.fixture_id}`;
      preds[key] = mapPrediction(p);
    });
    callback(preds);
  });
  const channel = supabase
    .channel(`user-preds-${uid}`)
    .on("postgres_changes",
      { event: "*", schema: "public", table: "predictions", filter: `user_id=eq.${uid}` },
      () => {
        supabase.from("predictions").select("*").eq("user_id", uid).limit(1000000).then(({ data }) => {
          const preds = {};
          (data || []).forEach((p) => {
            const key = `${uid}_${p.fixture_id}`;
            preds[key] = mapPrediction(p);
          });
          callback(preds);
        });
      }
    )
    .subscribe();
  return () => supabase.removeChannel(channel);
}

export function onAllPredictions(callback) {
  supabase.from("predictions").select("*").limit(1000000).then(({ data }) => {
    const preds = {};
    (data || []).forEach((p) => {
      const key = `${p.user_id}_${p.fixture_id}`;
      preds[key] = mapPrediction(p);
    });
    callback(preds);
  });
  const channel = supabase
    .channel("all-predictions")
    .on("postgres_changes",
      { event: "*", schema: "public", table: "predictions" },
      () => {
        supabase.from("predictions").select("*").limit(1000000).then(({ data }) => {
          const preds = {};
          (data || []).forEach((p) => {
            const key = `${p.user_id}_${p.fixture_id}`;
            preds[key] = mapPrediction(p);
          });
          callback(preds);
        });
      }
    )
    .subscribe();
  return () => supabase.removeChannel(channel);
}

export async function saveResult(fixtureId, result) {
  const { data, error } = await supabase
    .from("results")
    .upsert({
      fixture_id: String(fixtureId),
      winner: result.winner,
      home_goals: result.homeGoals,
      away_goals: result.awayGoals,
    }, { onConflict: "fixture_id" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export function onAllResults(callback) {
  supabase.from("results").select("*").limit(1000000).then(({ data }) => {
    const results = {};
    (data || []).forEach((r) => {
      results[r.fixture_id] = mapResult(r);
    });
    callback(results);
  });
  const channel = supabase
    .channel("all-results")
    .on("postgres_changes",
      { event: "*", schema: "public", table: "results" },
      () => {
        supabase.from("results").select("*").limit(1000000).then(({ data }) => {
          const results = {};
          (data || []).forEach((r) => {
            results[r.fixture_id] = mapResult(r);
          });
          callback(results);
        });
      }
    )
    .subscribe();
  return () => supabase.removeChannel(channel);
}

export async function saveKnockoutMatch(match) {
  const id = match.id ? String(match.id) : String(Date.now());
  const { data, error } = await supabase
    .from("knockout_matches")
    .upsert({ id, ...match, is_knockout: true }, { onConflict: "id" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteKnockoutMatch(matchId) {
  const { error } = await supabase
    .from("knockout_matches")
    .delete()
    .eq("id", String(matchId));
  if (error) throw error;
}

export function onKnockoutMatches(callback) {
  supabase.from("knockout_matches").select("*").limit(1000000).then(({ data }) => {
    callback(data || []);
  });
  const channel = supabase
    .channel("knockout-matches")
    .on("postgres_changes",
      { event: "*", schema: "public", table: "knockout_matches" },
      () => {
        supabase.from("knockout_matches").select("*").limit(1000000).then(({ data }) => {
          callback(data || []);
        });
      }
    )
    .subscribe();
  return () => supabase.removeChannel(channel);
}

export function onArenaSettings(callback) {
  const channel = supabase
    .channel("arena-settings")
    .on("postgres_changes",
      { event: "*", schema: "public", table: "settings", filter: "id=eq.arena" },
      (payload) => callback(payload.new || { arena_locked: false, locked_by: null })
    )
    .subscribe();
  const initialFetch = async () => {
    const { data } = await supabase.from("settings").select("*").eq("id", "arena").single();
    callback(data || { arena_locked: false, locked_by: null });
  };
  initialFetch();
  return () => supabase.removeChannel(channel);
}

export async function updateArenaSettings(data) {
  const { error } = await supabase
    .from("settings")
    .upsert({ id: "arena", ...data, updated_at: new Date().toISOString() });
  if (error) throw error;
}

export function onFixtureOverrides(callback) {
  const channel = supabase
    .channel("fixture-overrides")
    .on("postgres_changes",
      { event: "*", schema: "public", table: "settings", filter: "id=eq.fixture_overrides" },
      (payload) => callback(payload.new?.overrides || {})
    )
    .subscribe();
  const initialFetch = async () => {
    const { data } = await supabase.from("settings").select("*").eq("id", "fixture_overrides").single();
    callback(data?.overrides || {});
  };
  initialFetch();
  return () => supabase.removeChannel(channel);
}

export async function getStreamLinks() {
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .eq("id", "stream_links")
    .maybeSingle();
  if (error && error.code !== "PGRST116") throw error;
  return data?.links || null;
}

export async function saveStreamLinks(links) {
  const { data, error } = await supabase
    .from("settings")
    .upsert({ id: "stream_links", links, updated_at: new Date().toISOString() })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export function onStreamLinks(callback) {
  const channel = supabase
    .channel("stream-links")
    .on("postgres_changes",
      { event: "*", schema: "public", table: "settings", filter: "id=eq.stream_links" },
      (payload) => callback(payload.new?.links || null)
    )
    .subscribe();
  const initialFetch = async () => {
    const { data } = await supabase.from("settings").select("*").eq("id", "stream_links").single();
    callback(data?.links || null);
  };
  initialFetch();
  return () => supabase.removeChannel(channel);
}

export async function saveFixtureOverride(fixtureId, override) {
  const { data: existing } = await supabase
    .from("settings")
    .select("overrides")
    .eq("id", "fixture_overrides")
    .single();
  const overrides = { ...(existing?.overrides || {}), [String(fixtureId)]: { ...override, updated_at: new Date().toISOString() } };
  const { error } = await supabase
    .from("settings")
    .upsert({ id: "fixture_overrides", overrides });
  if (error) throw error;
}

export function onUndoStatus(callback) {
  const channel = supabase
    .channel("undo-settings")
    .on("postgres_changes",
      { event: "*", schema: "public", table: "settings", filter: "id=eq.undo" },
      (payload) => {
        const data = payload.new;
        if (!data || !data.timestamp) { callback(null); return; }
        const elapsed = Date.now() - new Date(data.timestamp).getTime();
        callback(elapsed < 3600000 ? { fixtureId: data.fixture_id, previous: data.previous, remainingMs: 3600000 - elapsed } : null);
      }
    )
    .subscribe();
  const initialFetch = async () => {
    const { data } = await supabase.from("settings").select("*").eq("id", "undo").single();
    if (!data || !data.timestamp) { callback(null); return; }
    const elapsed = Date.now() - new Date(data.timestamp).getTime();
    callback(elapsed < 3600000 ? { fixtureId: data.fixture_id, previous: data.previous, remainingMs: 3600000 - elapsed } : null);
  };
  initialFetch();
  return () => supabase.removeChannel(channel);
}

export async function setUndoPoint(fixtureId, previous) {
  const { error } = await supabase
    .from("settings")
    .upsert({
      id: "undo",
      fixture_id: String(fixtureId),
      previous: previous || null,
      timestamp: new Date().toISOString(),
    });
  if (error) throw error;
}

export async function undoLastFixtureEdit() {
  const { data, error: fetchError } = await supabase
    .from("settings")
    .select("*")
    .eq("id", "undo")
    .single();
  if (fetchError || !data) return null;
  const elapsed = Date.now() - new Date(data.timestamp).getTime();
  if (elapsed > 3600000) return "expired";
  const { fixture_id, previous } = data;
  if (previous === null) {
    const { data: existing } = await supabase
      .from("settings")
      .select("overrides")
      .eq("id", "fixture_overrides")
      .single();
    const overrides = { ...(existing?.overrides || {}) };
    delete overrides[fixture_id];
    await supabase.from("settings").upsert({ id: "fixture_overrides", overrides });
  } else {
    await saveFixtureOverride(fixture_id, previous);
  }
  await supabase.from("settings").delete().eq("id", "undo");
  return "undone";
}

export async function submitStreamResponse(uid, response) {
  const { error } = await supabase
    .from("stream_poll")
    .upsert({ user_id: uid, response, submitted_at: new Date().toISOString() }, { onConflict: "user_id" });
  if (error) throw error;
}

export function onStreamResponses(callback) {
  const channel = supabase
    .channel("stream-poll")
    .on("postgres_changes",
      { event: "*", schema: "public", table: "stream_poll" },
      (payload) => {
        supabase.from("stream_poll").select("*").limit(1000000).then(({ data }) => {
          const responses = {};
          (data || []).forEach((r) => { responses[r.user_id] = r; });
          callback(responses);
        });
      }
    )
    .subscribe();
  const initialFetch = async () => {
    const { data } = await supabase.from("stream_poll").select("*").limit(1000000);
    const responses = {};
    (data || []).forEach((r) => { responses[r.user_id] = r; });
    callback(responses);
  };
  initialFetch();
  return () => supabase.removeChannel(channel);
}

export async function clearStreamPoll() {
  const { error } = await supabase.from("stream_poll").delete().neq("user_id", "none");
  if (error) throw error;
}

function mapProfile(data) {
  if (!data) return null;
  return {
    id: data.id,
    name: data.name,
    email: data.email || "",
    photoURL: data.photo_url || "",
    dept: data.dept || "",
    year: data.year || "",
    isAdmin: data.is_admin || false,
    favoriteTeam: data.favorite_team,
    createdAt: data.created_at,
  };
}

function mapPrediction(data) {
  if (!data) return null;
  return {
    uid: data.user_id,
    fixtureId: data.fixture_id,
    winner: data.winner,
    homeGoals: data.home_goals,
    awayGoals: data.away_goals,
    submittedAt: data.submitted_at,
  };
}

function mapResult(data) {
  if (!data) return null;
  return {
    fixtureId: data.fixture_id,
    winner: data.winner,
    homeGoals: data.home_goals,
    awayGoals: data.away_goals,
    enteredAt: data.entered_at,
  };
}
