// src/navigation/AppNavigator.tsx
// 画面遷移の設定

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/HomeScreen";
import LogCreationScreen from "../screens/LogCreationScreen";
import AnalysisScreen from "../screens/AnalysisScreen";
import TimerScreen from "../screens/TimerScreen";
import ProfileScreen from "../screens/ProfileScreen";

// Stack Navigator用の型定義
export type RootStackParamList = {
  Main: undefined; // Tab Navigator全体
  LogCreation: undefined;
};

// Tab Navigator用の型定義
export type TabParamList = {
  Home: undefined;
  Analysis: undefined;
  Timer: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LogCreation"
        component={LogCreationScreen}
        options={{ title: "BOH-LOGを記録" }}
      />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "ホーム" }}
      />
      <Tab.Screen
        name="Analysis"
        component={AnalysisScreen}
        options={{ title: "分析" }}
      />
      <Tab.Screen
        name="Timer"
        component={TimerScreen}
        options={{ title: "集中タイマー" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "プロフィール" }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <HomeStack />
    </NavigationContainer>
  );
}
