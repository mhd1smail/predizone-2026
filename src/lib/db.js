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
      (payload) => {
        if (payload.new && payload.new.user_id && payload.new.fixture_id) {
          const key = `${uid}_${payload.new.fixture_id}`;
          const predObj = {};
          predObj[key] = mapPrediction(payload.new);
          callback(predObj);
        }
      }
    )
    .subscribe();
  return () => supabase.removeChannel(channel);
}

export function onAllPredictions(callback) {
  const channel = supabase
    .channel("all-predictions")
    .on("postgres_changes",
      { event: "*", schema: "public", table: "predictions" },
      (payload) => {
        if (payload.new && payload.new.user_id && payload.new.fixture_id) {
          const key = `${payload.new.user_id}_${payload.new.fixture_id}`;
          const predObj = {};
          predObj[key] = mapPrediction(payload.new);
          callback(predObj);
        }
      }
    )
    .subscribe();

  const broadcastChannel = supabase
    .channel("prediction-sync")
    .on("broadcast", { event: "prediction-changed" }, ({ payload }) => {
      if (payload && payload.uid && payload.fixtureId) {
        const key = `${payload.uid}_${payload.fixtureId}`;
        const predObj = {};
        predObj[key] = {
          uid: payload.uid,
          fixtureId: String(payload.fixtureId),
          winner: payload.winner || null,
          homeGoals: payload.homeGoals !== undefined ? payload.homeGoals : null,
          awayGoals: payload.awayGoals !== undefined ? payload.awayGoals : null,
          submittedAt: payload.submittedAt || null,
        };
        callback(predObj);
      }
    })
    .subscribe();

  (async () => {
    let allData = [];
    let from = 0;
    const pageSize = 1000;
    while (true) {
      const { data } = await supabase.from("predictions").select("*").range(from, from + pageSize - 1);
      if (!data || data.length === 0) break;
      allData = allData.concat(data);
      if (data.length < pageSize) break;
      from += pageSize;
    }
    const preds = {};
    allData.forEach((p) => {
      const key = `${p.user_id}_${p.fixture_id}`;
      preds[key] = mapPrediction(p);
    });
    callback(preds);
  })();

  return () => {
    supabase.removeChannel(channel);
    supabase.removeChannel(broadcastChannel);
  };
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
    callback((data || []).map(mapKnockoutMatch));
  });
  const channel = supabase
    .channel("knockout-matches")
    .on("postgres_changes",
      { event: "*", schema: "public", table: "knockout_matches" },
      () => {
        supabase.from("knockout_matches").select("*").limit(1000000).then(({ data }) => {
          callback((data || []).map(mapKnockoutMatch));
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
  return data?.overrides || null;
}

export async function saveStreamLinks(links) {
  const { error } = await supabase
    .from("settings")
    .upsert({ id: "stream_links", overrides: links, updated_at: new Date().toISOString() });
  if (error) throw error;
}

export function onStreamLinks(callback) {
  const channel = supabase
    .channel("stream-links")
    .on("postgres_changes",
      { event: "*", schema: "public", table: "settings", filter: "id=eq.stream_links" },
      (payload) => callback(payload.new?.overrides || null)
    )
    .subscribe();
  const initialFetch = async () => {
    const { data } = await supabase.from("settings").select("*").eq("id", "stream_links").maybeSingle();
    callback(data?.overrides || null);
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

export async function addChatReport(reportedUserId, reportedUserName, reportedUserEmail, reporterUserId, commentText) {
  const { error } = await supabase
    .from("chat_reports")
    .insert({
      reported_user_id: reportedUserId,
      reported_user_name: reportedUserName,
      reported_user_email: reportedUserEmail,
      reporter_user_id: reporterUserId,
      comment_text: commentText,
    });
  if (error) throw error;
}

export function sendPredictionBroadcast(prediction) {
  const channel = supabase.channel("prediction-sync");
  channel.subscribe((status) => {
    if (status === "SUBSCRIBED") {
      channel.send({
        type: "broadcast",
        event: "prediction-changed",
        payload: prediction,
      });
      setTimeout(() => supabase.removeChannel(channel), 1000);
    }
  });
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

function mapKnockoutMatch(data) {
  return {
    id: data.id,
    round: data.round,
    home: data.home,
    away: data.away,
    date: data.date,
    venue: data.venue,
    isKnockout: true,
  };
}

// ── Chat ────────────────────────────────────────────────────────────

export async function sendChatMessage(uid, name, message, isAdmin) {
  const { data, error } = await supabase
    .from("chat_messages")
    .insert({ user_id: uid, user_name: name, message, is_admin: isAdmin })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export function onChatMessages(callback) {
  supabase
    .from("chat_messages")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(50)
    .then(({ data }) => callback(data || []));

  const channel = supabase
    .channel("chat-messages")
    .on("postgres_changes",
      { event: "*", schema: "public", table: "chat_messages" },
      () => {
        supabase
          .from("chat_messages")
          .select("*")
          .order("created_at", { ascending: true })
          .limit(50)
          .then(({ data }) => callback(data || []));
      }
    )
    .subscribe();
  return () => supabase.removeChannel(channel);
}

// ── Message Reports ─────────────────────────────────────────────────

export function onMessageReportCounts(callback) {
  const fetchCounts = () => {
    supabase.from("chat_message_reports").select("*").limit(5000).then(({ data }) => {
      const counts = {};
      (data || []).forEach(r => {
        counts[r.message_id] = (counts[r.message_id] || 0) + 1;
      });
      callback(counts);
    });
  };
  fetchCounts();

  const channel = supabase
    .channel("msg-report-counts")
    .on("postgres_changes",
      { event: "*", schema: "public", table: "chat_message_reports" },
      fetchCounts
    )
    .subscribe();
  return () => supabase.removeChannel(channel);
}

export async function hasReportedMessage(messageId, reporterUserId) {
  const { data } = await supabase
    .from("chat_message_reports")
    .select("id")
    .eq("message_id", messageId)
    .eq("reporter_user_id", reporterUserId)
    .maybeSingle();
  return !!data;
}

export async function reportMessage(messageId, reportedUserId, reporterUserId) {
  const { error } = await supabase.from("chat_message_reports").insert({
    message_id: messageId,
    reported_user_id: reportedUserId,
    reporter_user_id: reporterUserId,
  });
  if (error) throw error;

  // 5 reports → soft-delete message
  const { count: msgReportCount } = await supabase
    .from("chat_message_reports")
    .select("id", { count: "exact", head: true })
    .eq("message_id", messageId);
  if (msgReportCount >= 5) {
    await supabase.from("chat_messages").update({ is_deleted: true }).eq("id", messageId);
  }

  // 15 reports in 24h → block user
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count: userReportCount } = await supabase
    .from("chat_message_reports")
    .select("id", { count: "exact", head: true })
    .eq("reported_user_id", reportedUserId)
    .gte("created_at", since);
  if (userReportCount >= 15) {
    await supabase.from("chat_blocks").upsert({
      user_id: reportedUserId,
      reason: "Exceeded 15 reports in 24 hours",
    }, { onConflict: "user_id" });
  }
}

// ── Verification ────────────────────────────────────────────────────

export async function submitVerification(userId, registerNumber, department) {
  const { data, error } = await supabase
    .from("chat_verifications")
    .upsert({ user_id: userId, register_number: registerNumber, department, status: "pending" }, { onConflict: "user_id" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export function onVerifications(callback) {
  supabase
    .from("chat_verifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1000)
    .then(({ data }) => callback(data || []));

  const channel = supabase
    .channel("chat-verifications")
    .on("postgres_changes",
      { event: "*", schema: "public", table: "chat_verifications" },
      () => {
        supabase
          .from("chat_verifications")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1000)
          .then(({ data }) => callback(data || []));
      }
    )
    .subscribe();
  return () => supabase.removeChannel(channel);
}

export async function approveVerification(userId, adminId) {
  const { error } = await supabase
    .from("chat_verifications")
    .update({ status: "approved", reviewed_at: new Date().toISOString(), reviewed_by: adminId })
    .eq("user_id", userId);
  if (error) throw error;
}

export async function rejectVerification(userId, adminId) {
  const { error } = await supabase
    .from("chat_verifications")
    .update({ status: "rejected", reviewed_at: new Date().toISOString(), reviewed_by: adminId })
    .eq("user_id", userId);
  if (error) throw error;
}

export async function getUserVerification(userId) {
  const { data, error } = await supabase
    .from("chat_verifications")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error && error.code !== "PGRST116") throw error;
  return data || null;
}

// ── Blocked Users ───────────────────────────────────────────────────

export async function getChatBlockedUsers() {
  const { data, error } = await supabase
    .from("chat_blocks")
    .select("*")
    .order("blocked_at", { ascending: false })
    .limit(1000);
  if (error) throw error;
  return data || [];
}

export async function unblockChatUser(userId) {
  const { error } = await supabase.from("chat_blocks").delete().eq("user_id", userId);
  if (error) throw error;
}

export function onChatBlockedUsers(callback) {
  getChatBlockedUsers().then(callback);
  const channel = supabase
    .channel("chat-blocks")
    .on("postgres_changes",
      { event: "*", schema: "public", table: "chat_blocks" },
      async () => {
        const blocked = await getChatBlockedUsers();
        callback(blocked);
      }
    )
    .subscribe();
  return () => supabase.removeChannel(channel);
}

