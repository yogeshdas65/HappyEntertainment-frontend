import { View, Text, StyleSheet, Image, TouchableHighlight } from "react-native";
import React, { FC } from "react";
import { screenHeight } from "../../../utils/Scaling";
import { Colors, Fonts } from "../../../utils/Constants";
import CustomText from "../../../components/ui/Customtext";
import { RFValue } from "react-native-responsive-fontsize";
import UniversalAdd from "../../../components/ui/UniversalAdd";
import { navigate } from "../../../utils/NavigationUtils";

const ProductItem: FC<{ item: any; index: number }> = ({ index, item }) => {
  // Corrected way to dynamically fetch the image based on the item.photo
  const imageSource = { uri: item.photo };

  return (
    <TouchableHighlight
      onPress={() => navigate("IndividualProductDetail", { item })}
      activeOpacity={0.6}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      underlayColor="white"
    >
      <View style={[styles.container]}>
        <View style={styles.imageContainer}>
          <Image source={imageSource} style={styles.image} />
        </View>
        <View style={styles.content}>
          <View style={styles.flexRow}>
            <CustomText
              fontSize={RFValue(6)}
              fontFamily={Fonts.Medium}
              style={styles.packagingText}
            >
              {item.packagingType}
            </CustomText>
          </View>
          <CustomText
            fontFamily={Fonts.Medium}
            variant="h8"
            numberOfLines={2}
            style={styles.productName}
          >
            {item.name}
          </CustomText>
          <CustomText
            fontFamily={Fonts.Medium}
            fontSize={RFValue(8)}
            style={styles.infoText}
          >
            Product ID: {item.productId}
          </CustomText>
          <View style={styles.priceContainer}>
            <View>
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
          <View style={styles.additionalInfo}>
            <CustomText
              fontFamily={Fonts.Medium}
              fontSize={RFValue(8)}
              style={styles.infoText}
            >
              Brand: {item.brand}
            </CustomText>
            <CustomText
              fontFamily={Fonts.Medium}
              fontSize={RFValue(8)}
              style={styles.infoText}
            >
              Weight(Kg): {item.coreWeight} / {item.grossWeight}
            </CustomText>
            <CustomText
              fontFamily={Fonts.Medium}
              fontSize={RFValue(8)}
              style={styles.infoText}
            >
              Length(Cm): {item.length}
            </CustomText>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    height: screenHeight * 0.2, // increased height for better space
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 15,
    overflow: "hidden",
    padding: 10,
    alignItems: "center", // vertical alignment of content
  },
  imageContainer: {
    width: "30%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: "100%",
    width: "100%",
    resizeMode: "contain",
    borderRadius: 10, // optional: add border radius to image for a rounded effect
  },
  content: {
    flex: 1,
    marginLeft: 10,
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  packagingText: {
    color: Colors.primary, // added color for packaging type
    marginBottom: 2,
  },
  productName: {
    fontSize: RFValue(12),
    fontWeight: "bold",
    marginVertical: 2,
    color: Colors.Dark,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 0,
  },
  priceText: {
    fontSize: RFValue(14),
    color: Colors.primary,
  },
  discountPriceText: {
    fontSize: RFValue(12),
    color: Colors.grey,
    textDecorationLine: "line-through",
    marginTop: 4,
  },
  additionalInfo: {
    marginTop: 10,
  },
  infoText: {
    color: Colors.darkGrey,
    marginBottom: 4,
  },
});

export default ProductItem;
