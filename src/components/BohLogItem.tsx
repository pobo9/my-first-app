// src/components/BohLogItem.tsx
// ログ項目

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { BohLog, Evaluation } from "../types";

interface Props {
  log: BohLog;
}

export default function BohLogItem({ log }: Props) {
  const logDate = new Date(log.timestamp);
  const formattedDate = `${logDate.toLocaleDateString()} ${logDate.toLocaleTimeString(
    "ja-JP",
    { hour: "2-digit", minute: "2-digit" }
  )}`;
  const isGood = log.evaluation === Evaluation.GOOD_BOH;

  return (
    <View
      style={[
        styles.container,
        isGood ? styles.goodContainer : styles.badContainer,
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.evaluationText}>
          {isGood ? "🔋 充電" : "🔥 浪費"}
        </Text>
        <Text style={styles.duration}>{log.durationMinutes}分</Text>
      </View>
      <View style={styles.tagsContainer}>
        {log.tags.map((tag) => (
          <Text key={tag.id} style={styles.tag}>
            {tag.name}
          </Text>
        ))}
      </View>
      <Text style={styles.timestamp}>{formattedDate}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    borderLeftWidth: 5,
  },
  goodContainer: {
    backgroundColor: "#E6F4EA",
    borderColor: "#4CAF50",
  },
  badContainer: {
    backgroundColor: "#FFEBEE",
    borderColor: "#F44336",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  evaluationText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  duration: {
    fontSize: 14,
    fontWeight: "500",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  tag: {
    backgroundColor: "#E0E0E0",
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 6,
    marginBottom: 6,
    fontSize: 12,
  },
  timestamp: {
    marginTop: 8,
    fontSize: 12,
    color: "#666",
    textAlign: "right",
  },
});
