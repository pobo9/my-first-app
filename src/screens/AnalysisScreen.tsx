// src/screens/AnalysisScreen.tsx
import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getBohLogs } from "../api/database";
import {
  calculateGoodBadRatio,
  findDemonTime,
  RatioData,
} from "../api/analysisService";
import { PieChart } from "react-native-chart-kit"; // 例: グラフ描画ライブラリ

export default function AnalysisScreen() {
  const [ratio, setRatio] = useState<RatioData | null>(null);
  const [demonTime, setDemonTime] = useState<string>("");

  useFocusEffect(
    useCallback(() => {
      const analyze = async () => {
        const logs = await getBohLogs();
        setRatio(calculateGoodBadRatio(logs));
        setDemonTime(findDemonTime(logs));
      };
      analyze();
    }, [])
  );

  // --- 変更点：グラフ用のデータを作成 ---
  const chartData =
    ratio && (ratio.good > 0 || ratio.bad > 0)
      ? [
          {
            name: "🔋 充電",
            population: ratio.good,
            color: "#4caf96ff", // 緑
            legendFontColor: "#7F7F7F",
            legendFontSize: 15,
          },
          {
            name: "🔥 浪費",
            population: ratio.bad,
            color: "#F44336", // 赤
            legendFontColor: "#7F7F7F",
            legendFontSize: 15,
          },
        ]
      : [];

  if (!ratio) {
    return (
      <View style={styles.container}>
        <Text>分析中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>分析レポート</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>充電 vs 浪費 (合計時間)</Text>
        {chartData.length > 0 ? (
          <PieChart
            data={chartData}
            width={Dimensions.get("window").width - 64} // カードの幅に合わせる
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            absolute // 数値をそのまま表示
          />
        ) : (
          <Text>まだ記録がありません。</Text>
        )}
        {/* --- ここまで --- */}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>👿 あなたの"魔の時間帯"</Text>
        <Text style={styles.cardContent}>{demonTime}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 48,
    backgroundColor: "#f5f5f5",
  },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
  cardContent: { fontSize: 16, color: "#333" },
});
