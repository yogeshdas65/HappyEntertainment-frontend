import {
  FlatList,
  StatusBar,
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { FC, useState, useRef, useEffect } from "react";
import { Colors } from "../../../utils/Constants";
import ProductItem from "./ProductItem";
import { screenWidth } from "../../../utils/Scaling";
import CustomSafeAreaView from "../../../components/global/CustomSafeAreaView";

const { height } = Dimensions.get("window");

const Products: FC<{ data: any }> = ({ data }) => {
  const renderItem = ({ item, index }: any) => {
    return (
      <>
        <ProductItem item={item} index={index} />
      </>
    );
  };

  return (
    <View style={styles.container}>
      {data.length === 0 && (
        <Text style={styles.emptyText}>No Product found</Text>
      )}
      <FlatList
        data={data}
        nestedScrollEnabled
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
   emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.blue,
    textAlign: "left",
    alignSelf: "flex-start",
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "rgba(0, 0, 255, 0.1)",
    borderRadius: 8,
  },
});

export default Products;
