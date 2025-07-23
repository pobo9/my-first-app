// src/types/index.ts
// 型定義

export enum Evaluation {
  GOOD_BOH = "GOOD_BOH",
  BAD_BOH = "BAD_BOH",
}

export enum TagType {
  SITUATION = "SITUATION",
  REASON = "REASON",
}

export enum AvatarState {
  FOCUSED = "FOCUSED",
  RELAXED = "RELAXED",
  ZONED_OUT = "ZONED_OUT",
}

export interface Tag {
  id: string;
  name: string;
  type: TagType;
}

export interface BohLog {
  id: string;
  timestamp: Date;
  durationMinutes: number;
  evaluation: Evaluation;
  tags: Tag[];
}

export interface FocusSession {
  id: string;
  startTime: Date;
  durationMinutes: number;
  focusLevel: 1 | 2 | 3 | 4 | 5; // 5段階評価
}

export interface Avatar {
  state: AvatarState;
}

export interface User {
  id: string;
  name: string;
  avatar: Avatar;
  achievements: string[]; // 獲得した実績IDのリスト
  // --- 追加 ---
  settings?: {
    focusDurationMinutes: number;
    breakDurationMinutes: number;
  };
  // --- ここまで ---
}
