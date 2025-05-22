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
import { Colors } from "@utils/Constants";
import { screenWidth } from "@utils/Scaling";
import CustomSafeAreaView from "@components/global/CustomSafeAreaView";
import OfficerItem from "./CustomerItem";
import CustomerItem from "./CustomerItem";

const { height } = Dimensions.get("window");

const Customer: FC<{ data: any }> = ({ data }) => {
  const renderItem = ({ item, index }: any) => {
    return (
      <>
        <CustomerItem item={item} index={index} />
      </>
    );
  };

  return (
    <View style={styles.container}>
      {data.length === 0 && (
        <Text style={styles.emptyText}>No Customer found</Text>
      )}
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
    flexDirection: "row",
    backgroundColor: Colors.backgroundSecondary,
    // justifyContent: "center",
    // alignItems: "center",
    // backgroundColor: "#f5f5f5",
  },
  content: {
    // paddingHorizontal: 10,
    paddingBottom: 20,
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

export default Customer;
