// src/components/AvatarDisplay.tsx
import React from "react";
import { Text, StyleSheet } from "react-native";
import { AvatarState } from "../types";

interface Props {
  state: AvatarState;
  size?: "large" | "medium";
}

export default function AvatarDisplay({ state, size = "large" }: Props) {
  const avatarStyle = size === "large" ? styles.large : styles.medium;
  let emoji = "😐"; // Default

  switch (state) {
    case AvatarState.FOCUSED:
      emoji = "😎"; // キリッとして賢そうな見た目
      break;
    case AvatarState.RELAXED:
      emoji = "😌"; // リラックスして気持ちよさそうな見た目
      break;
    case AvatarState.ZONED_OUT:
      emoji = "😵"; // 魂が抜けたような見た目
      break;
  }

  return <Text style={[styles.avatar, avatarStyle]}>{emoji}</Text>;
}

const styles = StyleSheet.create({
  avatar: {
    textAlign: "center",
  },
  large: {
    fontSize: 100,
  },
  medium: {
    fontSize: 50,
  },
});
