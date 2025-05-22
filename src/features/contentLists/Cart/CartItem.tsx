import CustomSafeAreaView from "@components/global/CustomSafeAreaView";
import React, { FC } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
} from "react-native";

const CartItem: FC<{ products: any[] }> = ({ products }) => {
  const renderCartItem = ({ item }: any) => {
    const { item: product, count } = item;

    return (
      <TouchableHighlight
        activeOpacity={0.8}
        underlayColor="#f4f4f4"
        style={styles.itemContainer}
      >
        <View style={styles.cartItem}>
          <View style={styles.details}>
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.brand}>Brand: {product.brand}</Text>

            <View style={styles.rowBetween}>
              <Text style={styles.packaging}>Packaging: {product.packagingType}</Text>
              <Text style={styles.quantity}>Quantity: {count}</Text>
            </View>

            <Text style={styles.price}>Price: ₹{product.price}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  return (
    <CustomSafeAreaView>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id || Math.random().toString()}
        renderItem={renderCartItem}
        contentContainerStyle={styles.listContent}
      />
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  itemContainer: {
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    overflow: "hidden",
    elevation: 2, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cartItem: {
    padding: 16,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  brand: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  packaging: {
    fontSize: 14,
    color: "#555",
  },
  quantity: {
    fontSize: 14,
    fontWeight: "600",
    color: "#28a745",
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FF2929",
    marginTop: 8,
  },
});

export default CartItem;
