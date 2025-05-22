import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { FC } from "react";
import useCartStore from "../../../state/cartStore";
import { Colors, Fonts } from "../../../utils/Constants";
import CustomText from "../../../components/ui/Customtext";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { RFValue } from "react-native-responsive-fontsize";
import { navigate } from "../../../utils/NavigationUtils";

const ProductEdit: FC<{ item: any; customBorderColor?: string }> = ({
  item,
  customBorderColor,
}) => {
  const editHandler = (item: any) => {
    navigate("EditProductDetail", { item });
    // navigation.navigate('IndividualDetail', { item: yourProductData });
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: "#fff" },
        { borderColor: customBorderColor || "#ffffff" },
      ]}
    >
      <Pressable onPress={() => editHandler(item)} style={styles.add}>
        <CustomText
          variant="h9"
          fontFamily={Fonts.SemiBold}
          style={[styles.addText , ]}
        >
          Edit
        </CustomText>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    // borderColor: Colors.secondary,
    width: 65,
    borderRadius: 8,
  },
  add: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    paddingVertical: 6,
  },
  addText: {
    color: Colors.secondary,
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 4,
    paddingVertical: 6,
    justifyContent: "space-between",
  },
  text: {
    color: "#fff",
  },
});

export default ProductEdit;
