// src/api/analysisService.ts
import { BohLog, Evaluation } from "../types";

export type RatioData = {
  good: number;
  bad: number;
  total: number;
};

export const calculateGoodBadRatio = (logs: BohLog[]): RatioData => {
  let good = 0;
  let bad = 0;
  logs.forEach((log) => {
    if (log.evaluation === Evaluation.GOOD_BOH) {
      good += log.durationMinutes;
    } else {
      bad += log.durationMinutes;
    }
  });
  return { good, bad, total: good + bad };
};

export const findDemonTime = (logs: BohLog[]): string => {
  const badLogs = logs.filter((log) => log.evaluation === Evaluation.BAD_BOH);
  if (badLogs.length === 0) return "なし";

  const hourCounts: { [hour: number]: number } = {};
  for (let i = 0; i < 24; i++) {
    hourCounts[i] = 0;
  }

  badLogs.forEach((log) => {
    const hour = new Date(log.timestamp).getHours();
    hourCounts[hour]++;
  });

  let maxCount = 0;
  let demonHour = -1;
  for (const hour in hourCounts) {
    if (hourCounts[hour] > maxCount) {
      maxCount = hourCounts[hour];
      demonHour = parseInt(hour, 10);
    }
  }

  return demonHour !== -1 ? `${demonHour}:00 〜 ${demonHour + 1}:00` : "なし";
};
