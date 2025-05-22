import { View, Text } from "react-native";
import React, { FC } from "react";
import CustomText from "./Customtext";
import { RFValue } from "react-native-responsive-fontsize";
import { Fonts } from "../../utils/Constants";

const Footer: FC = () => {
  return (
    <View style={{ backgroundColor: "#F8F8F8", padding: 20 }}>
      <CustomText
        fontSize={RFValue(32)}
        fontFamily={Fonts.Bold}
        style={{ opacity: 0.2 }}
      >
        Sales App
      </CustomText>
      <CustomText
        fontFamily={Fonts.Bold}
        style={{ marginTop: 5, paddingBottom: 10, opacity: 0.2 }}
      >
        Developed By BeespokeBytes
      </CustomText>
    </View>
  );
};

export default Footer;
