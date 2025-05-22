import CustomText from "@components/ui/Customtext";
import UniversalAdd from "@components/ui/UniversalAdd";
import { Colors, Fonts } from "@utils/Constants";
import { navigate } from "@utils/NavigationUtils";
import { screenHeight } from "@utils/Scaling";
import React, { FC } from "react";
import {
  StyleSheet,
  TouchableHighlight,
  View
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";



const ProductItemCreateOrder: FC<{ item: any; index: number }> = ({
  index,
  item,
}) => {
  // Corrected way to dynamically fetch the image based on the item.photo
 

  return (
    <TouchableHighlight
      onPress={() => navigate("IndividualProductDetail", { item })}
      activeOpacity={0.6}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      underlayColor="white"
    >
      <View style={[styles.container]}>
        <View style={styles.priceContainer}>
          <CustomText
            fontFamily={Fonts.Medium}
            variant="h8"
            numberOfLines={2}
            style={styles.productName}
          >
            {item.name}
          </CustomText>

          <View style={styles.flexRow}>
            <CustomText
              variant="h8"
              fontFamily={Fonts.Medium}
              style={styles.priceText}
            >
              ₹{item?.price}
            </CustomText>
            {item.discountPrice && (
              <CustomText
                fontFamily={Fonts.Medium}
                variant="h8"
                style={styles.discountPriceText}
              >
                ₹{item?.discountPrice}
              </CustomText>
            )}
          </View>

          <UniversalAdd item={item} />
        </View>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    height: screenHeight * 0.07, // increased height for better space
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 15,
    overflow: "hidden",
    padding: 10,
    alignItems: "center", // vertical alignment of content
  },

  flexRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    fontSize: RFValue(12),
    fontWeight: "bold",
    marginVertical: 2,
    color: Colors.Dark,
  },

  productName: {
    fontSize: RFValue(12),
    fontWeight: "bold",
    marginVertical: 2,
    color: Colors.Dark,
  },
  priceContainer: {
    flex: 1, // Allow flexible space to ensure it spans correctly
    flexDirection: "row", // Place items in a row
    justifyContent: "space-between", // Space items evenly
    alignItems: "center", // Align vertically to center
  },
  priceText: {
    fontSize: RFValue(14),
    color: Colors.primary,
  },
  discountPriceText: {
    fontSize: RFValue(12),
    color: Colors.grey,
    textDecorationLine: "line-through",
    marginLeft: 10, // Spacing between price and discount price
  },
  additionalInfo: {
    marginTop: 10,
  },
  infoText: {
    color: Colors.darkGrey,
    marginBottom: 4,
  },
});

export default ProductItemCreateOrder;
