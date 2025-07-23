// src/screens/HomeScreen.tsx
import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, Button } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getBohLogs } from "../api/database";
import { BohLog } from "../types";
import BohLogItem from "../components/BohLogItem";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
// import AvatarDisplay from '../components/AvatarDisplay';

// AppNavigator.tsxで定義する型
type RootStackParamList = {
  Home: undefined;
  LogCreation: undefined;
};
type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const [logs, setLogs] = useState<BohLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchLogs = async () => {
        setIsLoading(true);
        const fetchedLogs = await getBohLogs();
        // 日付の降順でソート
        fetchedLogs.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setLogs(fetchedLogs);
        setIsLoading(false);
      };
      fetchLogs();
    }, [])
  );

  return (
    <View style={styles.container}>
      {/* <AvatarDisplay state={...} /> */}
      <Text style={styles.header}>最近のBOH-LOG</Text>

      <Button
        title="ぼーっとした時間を記録する"
        onPress={() => navigation.navigate("LogCreation")}
      />

      {isLoading ? (
        <Text>読み込み中...</Text>
      ) : (
        <FlatList
          data={logs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <BohLogItem log={item} />}
          style={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 16,
  },
  list: {
    marginTop: 16,
  },
});
