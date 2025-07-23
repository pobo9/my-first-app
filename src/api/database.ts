// src/api/database.ts
// データベース処理

import AsyncStorage from "@react-native-async-storage/async-storage";
import { BohLog, Tag, TagType, FocusSession, User } from "../types";
import "react-native-get-random-values"; // crypto.randomUUIDのため
import { v4 as uuidv4 } from "uuid";

const BOH_LOGS_KEY = "BOH_LOGS";
const TAGS_KEY = "TAGS";
const USER_KEY = "USER_DATA";
const FOCUS_SESSIONS_KEY = "FOCUS_SESSIONS";

// --- 初期データ ---
const initialTags: Tag[] = [
  { id: "1", name: "#PC作業中", type: TagType.SITUATION },
  { id: "2", name: "#会議中", type: TagType.SITUATION },
  { id: "3", name: "#勉強中", type: TagType.SITUATION },
  { id: "4", name: "#疲労", type: TagType.REASON },
  { id: "5", name: "#集中切れ", type: TagType.REASON },
  { id: "6", name: "#ただ眠い", type: TagType.REASON },
];

// --- 初期データ ---
const initialUser: User = {
  id: "default-user",
  name: "User",
  achievements: [],
  avatar: { state: "FOCUSED" },
  // --- 追加 ---
  settings: {
    focusDurationMinutes: 25,
    breakDurationMinutes: 5,
  },
  // --- ここまで ---
};

export const initializeDatabase = async () => {
  const existingTags = await AsyncStorage.getItem(TAGS_KEY);
  if (!existingTags) {
    await AsyncStorage.setItem(TAGS_KEY, JSON.stringify(initialTags));
  }
  const existingUser = await AsyncStorage.getItem(USER_KEY);
  if (!existingUser) {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(initialUser));
  }
};

// --- ユーザー関連 (追加) ---
export const getUser = async (): Promise<User> => {
  const jsonValue = await AsyncStorage.getItem(USER_KEY);
  return jsonValue != null ? JSON.parse(jsonValue) : initialUser;
};

export const updateUser = async (user: User): Promise<void> => {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
};

// --- 集中セッション関連 (追加) ---
export const getFocusSessions = async (): Promise<FocusSession[]> => {
  const jsonValue = await AsyncStorage.getItem(FOCUS_SESSIONS_KEY);
  return jsonValue != null ? JSON.parse(jsonValue) : [];
};

export const addFocusSession = async (
  sessionData: Omit<FocusSession, "id" | "startTime">
): Promise<FocusSession> => {
  const sessions = await getFocusSessions();
  const newSession: FocusSession = {
    id: uuidv4(),
    startTime: new Date(),
    ...sessionData,
  };
  const updatedSessions = [...sessions, newSession];
  await AsyncStorage.setItem(
    FOCUS_SESSIONS_KEY,
    JSON.stringify(updatedSessions)
  );
  return newSession;
};

// --- ログ関連 ---
export const getBohLogs = async (): Promise<BohLog[]> => {
  const jsonValue = await AsyncStorage.getItem(BOH_LOGS_KEY);
  return jsonValue != null ? JSON.parse(jsonValue) : [];
};

export const addBohLog = async (
  logData: Omit<BohLog, "id" | "timestamp">
): Promise<BohLog> => {
  const logs = await getBohLogs();
  const newLog: BohLog = {
    id: uuidv4(),
    timestamp: new Date(),
    ...logData,
  };
  const updatedLogs = [...logs, newLog];
  await AsyncStorage.setItem(BOH_LOGS_KEY, JSON.stringify(updatedLogs));
  return newLog;
};

// --- タグ関連 ---
export const getTags = async (): Promise<Tag[]> => {
  const jsonValue = await AsyncStorage.getItem(TAGS_KEY);
  return jsonValue != null ? JSON.parse(jsonValue) : [];
};
