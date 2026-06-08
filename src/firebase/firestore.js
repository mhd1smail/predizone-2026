import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";

const USERS = "users";
const PREDICTIONS = "predictions";
const RESULTS = "results";
const KNOCKOUT = "knockout";
const SETTINGS = "settings";

function predDocId(uid, fixtureId) {
  return `${uid}_${fixtureId}`;
}

export async function createUserProfile(uid, data) {
  const ref = doc(db, USERS, uid);
  await setDoc(ref, {
    ...data,
    uid,
    createdAt: serverTimestamp(),
    isAdmin: false,
  });
  return getDoc(ref);
}

export async function getUserProfile(uid) {
  const ref = doc(db, USERS, uid);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function updateUserProfile(uid, data) {
  const ref = doc(db, USERS, uid);
  await updateDoc(ref, data);
  return getDoc(ref);
}

export function onUserProfile(uid, callback) {
  const ref = doc(db, USERS, uid);
  return onSnapshot(ref, (snap) => {
    callback(snap.exists() ? { id: snap.id, ...snap.data() } : null);
  });
}

export function onAllUsers(callback) {
  const q = query(collection(db, USERS));
  return onSnapshot(q, (snap) => {
    const users = {};
    snap.forEach((doc) => {
      users[doc.id] = { id: doc.id, ...doc.data() };
    });
    callback(users);
  });
}

export async function savePrediction(uid, fixtureId, prediction) {
  const id = predDocId(uid, fixtureId);
  const ref = doc(db, PREDICTIONS, id);
  await setDoc(ref, {
    uid,
    fixtureId,
    ...prediction,
    submittedAt: serverTimestamp(),
  });
  return getDoc(ref);
}

export async function getUserPredictions(uid) {
  const q = query(collection(db, PREDICTIONS), where("uid", "==", uid));
  const snap = await getDocs(q);
  const preds = {};
  snap.forEach((doc) => {
    preds[doc.id] = { id: doc.id, ...doc.data() };
  });
  return preds;
}

export function onUserPredictions(uid, callback) {
  const q = query(collection(db, PREDICTIONS), where("uid", "==", uid));
  return onSnapshot(q, (snap) => {
    const preds = {};
    snap.forEach((doc) => {
      preds[doc.id] = { id: doc.id, ...doc.data() };
    });
    callback(preds);
  });
}

export function onAllPredictions(callback) {
  const q = query(collection(db, PREDICTIONS));
  return onSnapshot(q, (snap) => {
    const preds = {};
    snap.forEach((doc) => {
      preds[doc.id] = { id: doc.id, ...doc.data() };
    });
    callback(preds);
  });
}

export async function saveResult(fixtureId, result) {
  const ref = doc(db, RESULTS, String(fixtureId));
  await setDoc(ref, {
    fixtureId: String(fixtureId),
    ...result,
    enteredAt: serverTimestamp(),
  });
  return getDoc(ref);
}

export function onAllResults(callback) {
  const q = query(collection(db, RESULTS));
  return onSnapshot(q, (snap) => {
    const results = {};
    snap.forEach((doc) => {
      results[doc.id] = { id: doc.id, ...doc.data() };
    });
    callback(results);
  });
}

export async function saveKnockoutMatch(match) {
  const id = match.id ? String(match.id) : String(Date.now());
  const ref = doc(db, KNOCKOUT, id);
  await setDoc(ref, {
    id,
    ...match,
    isKnockout: true,
  });
  return getDoc(ref);
}

export async function deleteKnockoutMatch(matchId) {
  const ref = doc(db, KNOCKOUT, String(matchId));
  await deleteDoc(ref);
}

export function onKnockoutMatches(callback) {
  const q = query(collection(db, KNOCKOUT));
  return onSnapshot(q, (snap) => {
    const matches = [];
    snap.forEach((doc) => {
      matches.push({ id: doc.id, ...doc.data() });
    });
    callback(matches);
  });
}

export function onArenaSettings(callback) {
  const ref = doc(db, SETTINGS, "arena");
  return onSnapshot(ref, (snap) => {
    callback(snap.exists() ? { id: snap.id, ...snap.data() } : { arenaLocked: false, lockedBy: null });
  });
}

export async function updateArenaSettings(data) {
  const ref = doc(db, SETTINGS, "arena");
  await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

export async function getAllDataOnce() {
  const [usersSnap, predsSnap, resultsSnap, knockoutSnap] = await Promise.all([
    getDocs(collection(db, USERS)),
    getDocs(collection(db, PREDICTIONS)),
    getDocs(collection(db, RESULTS)),
    getDocs(collection(db, KNOCKOUT)),
  ]);

  const users = {};
  usersSnap.forEach((doc) => (users[doc.id] = { id: doc.id, ...doc.data() }));

  const predictions = {};
  predsSnap.forEach((doc) => (predictions[doc.id] = { id: doc.id, ...doc.data() }));

  const results = {};
  resultsSnap.forEach((doc) => (results[doc.id] = { id: doc.id, ...doc.data() }));

  const knockout = [];
  knockoutSnap.forEach((doc) => knockout.push({ id: doc.id, ...doc.data() }));

  return { users, predictions, results, knockout };
}