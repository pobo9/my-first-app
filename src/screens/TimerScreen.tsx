// src/screens/TimerScreen.tsx
// タイマー機能の実装

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  addBohLog,
  addFocusSession,
  getUser,
  updateUser,
} from "../api/database"; // getUser, updateUserを追加
import { Evaluation, TagType } from "../types";

//const FOCUS_MINUTES = 25 * 60;
//const BREAK_MINUTES = 5 * 60;

export default function TimerScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [focusDuration, setFocusDuration] = useState("25");
  const [breakDuration, setBreakDuration] = useState("5");
  const [time, setTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasLoggedRef = useRef(false);

  // --- 変更点：ユーザー設定の読み込み ---
  useFocusEffect(
    useCallback(() => {
      const loadUserSettings = async () => {
        const currentUser = await getUser();
        setUser(currentUser);
        const settings = currentUser.settings;
        if (settings) {
          setFocusDuration(settings.focusDurationMinutes.toString());
          setBreakDuration(settings.breakDurationMinutes.toString());
          setTime(settings.focusDurationMinutes * 60);
        }
      };
      loadUserSettings();
    }, [])
  );

  // --- 変更点：設定の保存ロジック ---
  const handleSaveSettings = async () => {
    Keyboard.dismiss();
    if (!user) return;
    const newFocus = parseInt(focusDuration, 10);
    const newBreak = parseInt(breakDuration, 10);

    if (isNaN(newFocus) || newFocus <= 0 || isNaN(newBreak) || newBreak <= 0) {
      Alert.alert("エラー", "有効な時間を入力してください");
      return;
    }

    const updatedUser: User = {
      ...user,
      settings: {
        focusDurationMinutes: newFocus,
        breakDurationMinutes: newBreak,
      },
    };

    // 🔽 ここで保存後に反映！
    if (mode === "focus") {
      setTime(newFocus * 60);
    } else {
      setTime(newBreak * 60);
    }

    await updateUser(updatedUser);
    Alert.alert("成功", "設定を保存しました。");
  };

  useEffect(() => {
    if (isActive && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      handleTimerEnd();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, time]);

  const handleTimerEnd = async () => {
    if (hasLoggedRef.current) return; // 🔒 二重保存を防ぐ
    hasLoggedRef.current = true;

    setIsActive(false);
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (mode === "focus") {
      Alert.alert("お疲れ様です！", "休憩を開始します。", [
        {
          text: "OK",
          onPress: () => {
            setMode("break");
            hasLoggedRef.current = false;
          },
        },
      ]);
    } else {
      Alert.alert("休憩終了", "集中モードに戻りますか？", [
        {
          text: "はい",
          onPress: async () => {
            await addBohLog({
              durationMinutes: parseInt(breakDuration, 10),
              evaluation: Evaluation.GOOD_BOH,
              tags: [
                { id: "auto-1", name: "#意図的な休憩", type: TagType.REASON },
              ],
            });
            setMode("focus");
            hasLoggedRef.current = false;
          },
        },
      ]);
    }
  };

  useEffect(() => {
    const durationMinutes =
      mode === "focus"
        ? parseInt(focusDuration, 10)
        : parseInt(breakDuration, 10);

    if (!isNaN(durationMinutes) && durationMinutes > 0) {
      setTime(durationMinutes * 60);
    }
  }, [mode]);

  const toggleTimer = () => setIsActive(!isActive);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      {/* --- 変更点：設定UIの追加 --- */}
      <View style={styles.settingsContainer}>
        <View style={styles.inputGroup}>
          <Text>集中 (分):</Text>
          <TextInput
            value={focusDuration}
            onChangeText={setFocusDuration}
            style={styles.input}
            keyboardType="number-pad"
            returnKeyType="done"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text>休憩 (分):</Text>
          <TextInput
            value={breakDuration}
            onChangeText={setBreakDuration}
            style={styles.input}
            keyboardType="number-pad"
            returnKeyType="done"
          />
        </View>
        <Button title="設定を保存" onPress={handleSaveSettings} />
      </View>

      <Text style={styles.modeText}>
        {mode === "focus" ? "集中モード" : "休憩モード"}
      </Text>
      <Text style={styles.timer}>{formatTime(time)}</Text>
      <Button title={isActive ? "一時停止" : "開始"} onPress={toggleTimer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  modeText: { fontSize: 32, marginBottom: 20 },
  timer: { fontSize: 72, fontWeight: "bold", marginBottom: 40 },
  settingsContainer: { padding: 20, borderBottomWidth: 1, borderColor: "#eee" },
  inputGroup: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: 60,
    marginLeft: 10,
    textAlign: "center",
  },
});
