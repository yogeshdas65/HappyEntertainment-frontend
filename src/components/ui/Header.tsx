import React, { FC } from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import CustomText from "./Customtext";
import { goBack } from "../../utils/NavigationUtils";

const Colors = {
  black: "#000000",
  grey: "#808080",
  white: "#FFFFFF",
};

const Header: FC<{ title: string; date?: string }> = ({ title, date }) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.flexRowGap}>
        <TouchableOpacity onPress={goBack}>
          <Icon name="arrow-back" size={24} color={Colors.black} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <CustomText variant="h2" fontSize={19} Color={Colors.black}>
            {title}
          </CustomText>
          {/* {date && (
            <CustomText variant="h2" fontSize={11} color={Colors.grey}>
              {date}
            </CustomText>
          )} */}
        </View>
        <TouchableOpacity onPress={() => { }}>
          <Icon name="ellipsis-vertical-sharp" size={24} color={Colors.black} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 60,
    backgroundColor: Colors.white,
    justifyContent: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey,
  },
  flexRowGap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleContainer: {
    flex: 1,
    marginLeft: 16,
  },
});

export default Header;
