// src/App.tsx
// アプリのルート

import React, { useEffect } from "react";
import { StatusBar } from "react-native";
import AppNavigator from "./navigation/AppNavigator";
import { initializeDatabase } from "./api/database";

export default function App() {
  useEffect(() => {
    // アプリ起動時に一度だけ実行
    const setup = async () => {
      await initializeDatabase();
    };
    setup();
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <AppNavigator />
    </>
  );
}
