import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import React, { FC } from "react";
import { NoticeHeight } from "../../utils/Scaling";
import CustomText from "../../components/ui/Customtext";
import { Fonts } from "../../utils/Constants";
import Svg, { Defs, G, Path, Use } from "react-native-svg";
import { wavyData } from "../../utils/dummyData";
import { useAuthStore } from "../../state/authStore";


const Notice: FC = () => {
  const {authUser} = useAuthStore()
  return (
    <View style={{ height: NoticeHeight }}>
      <View style={styles.container}>
        <View style={styles.noticeContainer}>
          <SafeAreaView style={{ padding: 10 }}>
            <CustomText
              style={styles.heading}
              variant="h8"
              fontFamily={Fonts.SemiBold}
            >
             Hello {authUser?.name} How Are You ?
            </CustomText>
            <CustomText variant="h9" style={styles.textCenter}>
              Here`s Your SalesApp is Ready with All Data.
            </CustomText>
          </SafeAreaView>
        </View>
      </View>

      {/* <Svg
        width="100%"
        height="35"
        fill="#CCD5E4"
        viewBox="0 0 4000 1000"
        preserveAspectRatio="none"
        style={styles.wave}
      >
        <Defs>
          <Path id="wavepath" d={wavyData} />
        </Defs>
        <G>
          <Use href="#wavepath" y="321" />
        </G>
      </Svg> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#CCD5E4",
  },
  noticeContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#CCD5E4",
  },
  textCenter: {
    textAlign: "center",
    marginBottom: 8,
  },
  heading: {
    color: "#2D3875",
    marginBottom: 8,
    textAlign: "center",
  },
  wave: {
    width: "100%",
    transform: [{ rotateX: "180deg" }],
  },
});

export default Notice;
