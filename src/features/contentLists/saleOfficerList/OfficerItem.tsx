import React, { FC } from "react";
import { View, Text, StyleSheet, TouchableHighlight } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { Colors } from "@utils/Constants"; // Adjust import path based on project structure
import { navigate } from "@utils/NavigationUtils";
import ProductEdit from "../product/ProductEdit";
import OfficerEdit from "./OfficerEdit";

const OfficerItem: FC<{ item: any; index: number }> = ({ item }) => {
  return (
    <TouchableHighlight
      onPress={() => navigate("OptionViewForSingleOfficer", { Officer: item })}
      activeOpacity={0.8}
      underlayColor="#f5f5f5"
    >
      <View style={styles.container}>
        {/* Name Section */}
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.city}>{item.address.city}</Text>
        </View>

        {/* Target Section */}
        <View style={styles.targetContainer}>
          <Text style={styles.targetLabel}>Target</Text>
          <Text style={styles.targetValue}>
            {(item.achieved * 100 / item.target).toFixed()}%
          </Text>
        </View>

        {/* Edit Section */}
        {/* <View style={styles.editContainer}>
          <OfficerEdit item={item}  customBorderColor="#8acc50"/>
        </View> */}
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    elevation: 3, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    gap: 20, // Spacing between child components
  },

  // Name Section Styles
  nameContainer: {
    width: "70%",
  },
  name: {
    fontSize: RFValue(15),
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 10,
  },
  city:{
    fontSize: RFValue(10),
    fontWeight: "bold",
    color: "#89A8B2",
    marginBottom: 10,
  },
  // Target Section Styles
  targetContainer: {
    flexDirection: "column",
    backgroundColor: "#f1f8e9", // Light green background
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#8acc50", // Green border
    borderWidth: 1,
  },
  targetLabel: {
    fontSize: RFValue(8),
    color: "#4caf50", // A deeper green color
    textTransform: "uppercase",
    fontWeight: "bold",
    marginBottom: 4,
    letterSpacing: 1.2,
  },
  targetValue: {
    fontSize: RFValue(10),
    fontWeight: "700",
    color: "#2e7d32", // Darker green for emphasis
    textShadowColor: "rgba(0, 0, 0, 0.1)", // Slight text shadow
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  // Edit Section Styles
  editContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});


export default OfficerItem;
