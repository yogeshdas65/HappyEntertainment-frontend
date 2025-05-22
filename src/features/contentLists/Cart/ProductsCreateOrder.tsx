import { Colors } from "@utils/Constants";
import React, { FC } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  View
} from "react-native";
import ProductItemCreateOrder from "./ProductItemCreateOrder";

const { height } = Dimensions.get("window");

const ProductsCreateOrder: FC<{ data: any }> = ({ data }) => {
  
  const renderItem = ({ item, index }: any) => {
    return (
      <>
        <ProductItemCreateOrder item={item} index={index} />
      </>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderItem}
        numColumns={1}
        contentContainerStyle={styles.content}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
    // justifyContent: "center",
    // alignItems: "center",
    // backgroundColor: "#f5f5f5",
  },
  content: {
    // paddingHorizontal: 10,
    paddingBottom: 20,
  },
  button: {
    backgroundColor: "#6200ea",
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  slidingView: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: height / 2,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    padding: 20,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 18,
    color: "#000",
  },
  contentText: {
    marginTop: 40,
    fontSize: 16,
    textAlign: "center",
    color: "#333",
  },
});

export default ProductsCreateOrder;
