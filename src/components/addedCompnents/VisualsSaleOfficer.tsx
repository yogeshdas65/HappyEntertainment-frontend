import { View, Text, StyleSheet, Image } from "react-native";
import React, { FC } from "react";
import Animated, { interpolate, useAnimatedStyle } from "react-native-reanimated";
import { screenHeight, screenWidth } from "../../utils/Scaling";
import LinearGradient from "react-native-linear-gradient";
import { darkWeatherColors } from "../../utils/Constants";
import LottieView from "lottie-react-native";
import { useCollapsibleContext } from "@r0b0t3d/react-native-collapsible";

const Visuals: FC = () => {

  const { scrollY } = useCollapsibleContext();
    const blueColors = ['#ADD8E6', '#4682B4', '#3fa9f5'];

// const headerAnimatedStyle = useAnimatedStyle(() => {
//   const opacity = interpolate(scrollY.value, [0, 120], [1, 0]);
//   return { opacity };
// });
  return (
    <Animated.View style={[styles.container ]} >
      <LinearGradient colors={blueColors} style={styles.gradient} />
      <Image
        source={require("../../assets/images/cloud.png")}
        style={styles.cloud}
      />
      <LottieView
        autoPlay={true}
        enableMergePathsAndroidForKitKatAndAbove={true}
        loop={true}
        style={styles.lottie}
        source={require("../../assets/animations/salesOfficer2.json")}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
  },
  lottie: {
    width: "100%",
    height: 200,
    position: "absolute",
    transform: [{ scaleX: 1 }],
  },
  gradient: {
    width: "100%",
    height: screenHeight * 0.38,
    position: "absolute",
  },
  cloud: {
    width: screenWidth,
    resizeMode: "stretch",
    height: 100
  },
});

export default Visuals;
