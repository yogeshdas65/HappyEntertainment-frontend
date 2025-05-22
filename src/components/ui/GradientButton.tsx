import React from "react";
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent, ViewStyle } from "react-native";
import LinearGradient from "react-native-linear-gradient";

interface GradientButtonProps {
  title?: string;
  children?: React.ReactNode;
  onPress: (event: GestureResponderEvent) => void;
  style?: ViewStyle; // Style object for custom styling
}

const GradientButton: React.FC<GradientButtonProps> = ({ title, children, onPress, style }) => (
  <TouchableOpacity onPress={onPress}>
    <LinearGradient
      colors={["#22c1c3", "#fd2db2"]}
      style={[styles.gradientButton, style]} // Merge custom styles
    >
      {children || <Text style={styles.buttonText}>{title}</Text>}
    </LinearGradient>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  gradientButton: {
    paddingVertical: 0,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center", // Ensure alignment of children
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default GradientButton;
