import { FlatList, View, Text, StyleSheet, Dimensions } from "react-native";
import React, { FC } from "react";
import { Colors } from "@utils/Constants";
import OfficerItem from "./OfficerItem";

const { height } = Dimensions.get("window");

const Officer: FC<{ data: any[] }> = ({ data }) => {
  const renderItem = ({ item, index }: any) => (
    <OfficerItem item={item} index={index} />
  );

  return (
    <View style={styles.container}>
      {data.length === 0 && (
        <Text style={styles.emptyText}>No officer found</Text>
      )}
      <FlatList
        data={data}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderItem}
        numColumns={1}
        contentContainerStyle={[
          styles.content,
          data.length === 0 && styles.centerContent, // Center if empty
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
    padding: 10,
  },
  content: {
    paddingBottom: 20,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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

export default Officer;
