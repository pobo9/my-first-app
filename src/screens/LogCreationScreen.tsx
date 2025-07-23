// src/screens/LogCreationScreen.tsx
// ログ作成画面

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Alert } from "react-native";
import { Evaluation, Tag, TagType } from "../types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  addBohLog,
  getTags,
  getUser,
  getBohLogs,
  getFocusSessions,
  updateUser,
} from "../api/database"; // 必要な関数をインポート
import { checkAndUnlockAchievements } from "../services/achievementService"; // サービスをインポート

// AppNavigator.tsxで定義する型
type RootStackParamList = {
  Home: undefined;
  LogCreation: undefined;
};
type Props = NativeStackScreenProps<RootStackParamList, "LogCreation">;

export default function LogCreationScreen({ navigation }: Props) {
  const [duration, setDuration] = useState<string>("15");
  const [evaluation, setEvaluation] = useState<Evaluation>(Evaluation.BAD_BOH);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      setAvailableTags(await getTags());
    };
    fetchTags();
  }, []);

  const toggleTag = (tag: Tag) => {
    setSelectedTags((prev) =>
      prev.find((t) => t.id === tag.id)
        ? prev.filter((t) => t.id !== tag.id)
        : [...prev, tag]
    );
  };

  const handleSave = async () => {
    const durationMinutes = parseInt(duration, 10);
    if (isNaN(durationMinutes) || durationMinutes <= 0) {
      Alert.alert("エラー", "有効な時間を分単位で入力してください。");
      return;
    }
    await addBohLog({
      durationMinutes: durationMinutes, // 変換した数値を渡す
      evaluation: evaluation,
      tags: selectedTags,
    });

    // --- 実績解除チェック (追加) ---
    const currentUser = await getUser();
    const allLogs = await getBohLogs();
    const allSessions = await getFocusSessions();

    const newlyUnlocked = checkAndUnlockAchievements({
      logs: allLogs,
      sessions: allSessions,
      unlockedIds: currentUser.achievements,
    });
    if (newlyUnlocked.length > 0) {
      const newAchievementIds = newlyUnlocked.map((ach) => ach.id);
      currentUser.achievements.push(...newAchievementIds);
      await updateUser(currentUser);

      // ユーザーに通知
      Alert.alert(
        "🏆 実績解除！",
        `「${newlyUnlocked[0].title}」を達成しました！`
      );
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>どのくらい？ (分)</Text>
      <TextInput
        style={styles.input}
        value={duration}
        onChangeText={setDuration}
        placeholder="例: 15"
        keyboardType="number-pad" // 数字入力キーボードを表示
        returnKeyType="done"
      />

      <Text style={styles.label}>この時間はあなたにとって？</Text>
      <View style={styles.evalContainer}>
        <TouchableOpacity
          style={[
            styles.evalButton,
            evaluation === Evaluation.GOOD_BOH && styles.selectedGood,
          ]}
          onPress={() => setEvaluation(Evaluation.GOOD_BOH)}
        >
          <Text
            style={[
              styles.evalButtonText,
              evaluation === Evaluation.GOOD_BOH && styles.selectedText,
            ]}
          >
            🔋 充電
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.evalButton,
            evaluation === Evaluation.BAD_BOH && styles.selectedBad,
          ]}
          onPress={() => setEvaluation(Evaluation.BAD_BOH)}
        >
          <Text
            style={[
              styles.evalButtonText,
              evaluation === Evaluation.BAD_BOH && styles.selectedText,
            ]}
          >
            🔥 浪費
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>タグ</Text>
      <View style={styles.tagsContainer}>
        {availableTags.map((tag) => (
          <TouchableOpacity key={tag.id} onPress={() => toggleTag(tag)}>
            <Text
              style={[
                styles.tag,
                selectedTags.find((t) => t.id === tag.id) && styles.selectedTag,
              ]}
            >
              {tag.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button title="保存する" onPress={handleSave} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: { fontSize: 18, fontWeight: "bold", marginTop: 20 },
  evalContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  tagsContainer: { flexDirection: "row", flexWrap: "wrap", marginVertical: 10 },
  tag: {
    padding: 8,
    margin: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 16,
  },
  selectedTag: {
    backgroundColor: "#007AFF",
    color: "white",
    borderColor: "#007AFF",
  },
  evalButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f0f0f0",
    marginHorizontal: 5,
    flex: 1,
    alignItems: "center",
  },
  evalButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  selectedGood: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  selectedBad: {
    backgroundColor: "#F44336",
    borderColor: "#F44336",
  },
  selectedText: {
    color: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    marginTop: 8,
    marginBottom: 20,
  },
});
