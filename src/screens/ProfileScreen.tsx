// src/screens/ProfileScreen.tsx
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getUser, getBohLogs, updateUser } from "../api/database";
import { User, BohLog, AvatarState, Evaluation } from "../types";
import {
  ALL_ACHIEVEMENTS,
  AchievementDefinition,
} from "../services/achievementService";
import AvatarDisplay from "../components/AvatarDisplay";

// アバターの状態を決定するロジック
const determineAvatarState = (logs: BohLog[]): AvatarState => {
  if (logs.length < 5) return AvatarState.FOCUSED; // データが少ないうちは普通

  const total = logs.length;
  const badCount = logs.filter(
    (log) => log.evaluation === Evaluation.BAD_BOH
  ).length;
  const goodCount = logs.filter(
    (log) => log.evaluation === Evaluation.GOOD_BOH
  ).length;

  if (badCount / total > 0.6) return AvatarState.ZONED_OUT;
  if (goodCount / total > 0.6) return AvatarState.RELAXED;

  return AvatarState.FOCUSED;
};

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [avatarState, setAvatarState] = useState<AvatarState>(
    AvatarState.FOCUSED
  );
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");

  const fetchData = useCallback(async () => {
    const currentUser = await getUser();
    const allLogs = await getBohLogs();
    const newAvatarState = determineAvatarState(allLogs);

    setUser(currentUser);
    setNameInput(currentUser.name); // 編集用のstateにも名前をセット
    setAvatarState(newAvatarState);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const handleSaveName = async () => {
    if (!user || nameInput.trim() === "") {
      Alert.alert("エラー", "名前を入力してください。");
      return;
    }

    const updatedUser: User = { ...user, name: nameInput.trim() };
    await updateUser(updatedUser);
    setUser(updatedUser); // 画面上のユーザー情報を更新
    setIsEditingName(false); // 編集モードを終了
    Alert.alert("成功", "名前を更新しました。");
  };

  const renderAchievement = ({ item }: { item: AchievementDefinition }) => {
    const isUnlocked = user?.achievements.includes(item.id) ?? false;
    return (
      <View
        style={[
          styles.achievementCard,
          !isUnlocked && styles.lockedAchievement,
        ]}
      >
        <Text style={styles.achievementTitle}>
          {item.title} {isUnlocked ? "🏆" : ""}
        </Text>
        <Text style={styles.achievementDesc}>{item.description}</Text>
      </View>
    );
  };

  if (!user)
    return (
      <View>
        <Text>読み込み中...</Text>
      </View>
    );
  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.avatarSection}>
        <AvatarDisplay state={avatarState} />

        {/* --- 名前の表示部分を修正 --- */}
        {isEditingName ? (
          <View style={styles.editNameContainer}>
            <TextInput
              style={styles.nameInput}
              value={nameInput}
              onChangeText={setNameInput}
              autoFocus={true}
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveName}
            >
              <Text style={styles.saveButtonText}>保存</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={() => setIsEditingName(true)}>
            <Text style={styles.userName}>{user.name} ✏️</Text>
          </TouchableOpacity>
        )}
        {/* --- 修正ここまで --- */}
      </View>
      <Text style={styles.header}>実績一覧</Text>
      <FlatList
        data={ALL_ACHIEVEMENTS}
        renderItem={renderAchievement}
        keyExtractor={(item) => item.id}
        scrollEnabled={false} // ScrollViewの中なので無効化
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  avatarSection: { alignItems: "center", marginBottom: 24 },
  userName: { fontSize: 24, fontWeight: "bold", marginTop: 8, padding: 8 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  editNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  nameInput: {
    fontSize: 24,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    flex: 1,
  },
  saveButton: {
    marginLeft: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#007AFF",
    borderRadius: 8,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  achievementCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  lockedAchievement: { backgroundColor: "#f0f0f0", opacity: 0.7 },
  achievementTitle: { fontSize: 18, fontWeight: "600" },
  achievementDesc: { fontSize: 14, color: "#666", marginTop: 4 },
});
