// src/services/achievementService.ts
import { BohLog, FocusSession, Evaluation } from "../types";

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  // 条件をチェックする関数
  condition: (data: { logs: BohLog[]; sessions: FocusSession[] }) => boolean;
}

// 実績の定義リスト
// ※デモのため、条件は簡単なものにしています
export const ALL_ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: "analyst_1",
    title: "自己分析の鬼",
    description: "BOH-LOGを5回以上記録する",
    condition: ({ logs }) => logs.length >= 5,
  },
  {
    id: "focus_1",
    title: "集中王",
    description: "集中タイマーを3回以上完了する",
    condition: ({ sessions }) => sessions.length >= 3,
  },
  {
    id: "balance_1",
    title: "メリハリ名人",
    description: "「充電」ログの割合が50%を超える",
    condition: ({ logs }) => {
      if (logs.length < 5) return false; // ある程度のログ数が必要
      const goodLogs = logs.filter(
        (log) => log.evaluation === Evaluation.GOOD_BOH
      );
      return goodLogs.length / logs.length > 0.5;
    },
  },
];

/**
 * 新たにアンロックされた実績がないかチェックする
 * @param data - ユーザーの全ログ、全セッション、既に持っている実績IDのリスト
 * @returns 新たにアンロックされた実績のリスト
 */
export const checkAndUnlockAchievements = (data: {
  logs: BohLog[];
  sessions: FocusSession[];
  unlockedIds: string[];
}): AchievementDefinition[] => {
  const newlyUnlocked: AchievementDefinition[] = [];

  for (const achievement of ALL_ACHIEVEMENTS) {
    // まだアンロックしておらず、かつ条件を満たしているか
    if (
      !data.unlockedIds.includes(achievement.id) &&
      achievement.condition(data)
    ) {
      newlyUnlocked.push(achievement);
    }
  }

  return newlyUnlocked;
};
