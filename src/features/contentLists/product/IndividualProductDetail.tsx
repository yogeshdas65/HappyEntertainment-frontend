import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React, { FC } from "react";
import CustomSafeAreaView from "../../../components/global/CustomSafeAreaView";
import Header from "../../../components/ui/Header";
import { useRoute, RouteProp } from "@react-navigation/native";
import UniversalAdd from "../../../components/ui/UniversalAdd";
import ProductEdit from "./ProductEdit";
import { useAuthStore } from "../../../state/authStore";

interface Product {
  _id: number;
  brand: string;
  name: string;
  coreWeight: string;
  grossWeight: string;
  length: string;
  packagingType: string;
  photo: string;
  price: number;
  productId: number;
}

// Define the route parameters type (RouteProp)
type RootStackParamList = {
  IndividualDetail: { item: Product };
};

const IndividualProductDetail: FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, "IndividualDetail">>();
  const { authUser } = useAuthStore();
  const { item } = route.params || {};

  if (!item) {
    return (
      <CustomSafeAreaView>
        <Text>Product details not available.</Text>
      </CustomSafeAreaView>
    );
  }

  const {
    brand,
    name,
    coreWeight,
    grossWeight,
    length,
    packagingType,
    photo,
    price,
    productId,
  } = item;

  const imageSource = { uri: photo };

  return (
    <CustomSafeAreaView>
      <Header title={name} />
      <View style={styles.container}>
        {/* Product Image */}
        <Image source={imageSource} style={styles.image} />

        {/* Product Details */}
        <View style={styles.cardContainer}>
          <Text style={styles.title}>Brand: {brand}</Text>
          <Text style={styles.subTitle}>Price: ₹{price}</Text>
          <Text style={styles.subTitle}>Product ID: {productId}</Text>

          <View style={styles.detailItem}>
            <Text style={styles.label}>Core Weight:</Text>
            <Text style={styles.text}>{coreWeight}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}>Gross Weight(Kg):</Text>
            <Text style={styles.text}>{grossWeight}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}>Length(Cm):</Text>
            <Text style={styles.text}>{length}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}>Packaging Type:</Text>
            <Text style={styles.text}>{packagingType}</Text>
          </View>
        </View>

        {/* 2-column layout for ProductEdit and UniversalAdd */}
        <View style={styles.actionsContainer}>
          {authUser?.role === "ADMIN" && (
            <TouchableOpacity style={styles.button}>
              <ProductEdit item={item} />
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.button}>
            <UniversalAdd item={item} />
          </TouchableOpacity>
        </View>
      </View>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    flex: 1,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 16,
    borderRadius: 10,
    alignSelf: "center",
  },
  cardContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 2,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "500",
    color: "#555",
    marginBottom: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#777",
    marginBottom: 2,
  },
  text: {
    fontSize: 16,
    color: "#333",
    marginBottom: 2,
    fontWeight: "400",
  },
  detailItem: {
    marginBottom: 2,
  },
  button: {
    backgroundColor: "#fff", // White background
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginRight: 8, // Add space between buttons
    borderWidth: 1, // Green border width
    borderColor: "#4CAF50", // Green border
  },
  buttonText: {
    fontSize: 18,
    color: "#4CAF50", // Green text color
    fontWeight: "500",
  },
  actionsContainer: {
    flexDirection: "row", // Align ProductEdit and UniversalAdd side by side
    justifyContent: "space-between",
    marginTop: 20,
  },
});

export default IndividualProductDetail;
