import React, { FC } from "react";
import { View, Text, StyleSheet, TouchableHighlight } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { Colors } from "@utils/Constants"; // Adjust import path based on project structure
import { navigate } from "@utils/NavigationUtils";
import ProductEdit from "../product/ProductEdit";
import CustomerEdit from "./CustomerEdit";
import { useAuthStore } from "@state/authStore";

const CustomerItem: FC<{ item: any; index: number }> = ({ item, index }) => {
   const { authUser, setAuthState, authstate } = useAuthStore();
  return (
    <TouchableHighlight
      onPress={() => navigate("IndividualCustomerDetail", { customer: item })}
      activeOpacity={0.8}
      underlayColor="#f5f5f5"
    >
      <View style={styles.container}>
        {/* Name Section */}
        <View style={styles.nameContainer}>
          <Text style={styles.seriesNumber}>{index + 1}.</Text>
          <Text style={styles.name}>{item.name}</Text>
        </View>

        {/* Edit Section */}
        {authUser?.role === "ADMIN" && <View style={styles.editContainer}>
          <CustomerEdit item={item} customBorderColor="#8acc50" />
        </View>}
        
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
    justifyContent: "space-between",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },

  // Name Section Styles
  nameContainer: {
    flex: 1,
    flexDirection: "row", // Align series number and name horizontally
    alignItems: "center",
  },
  seriesNumber: {
    fontSize: RFValue(14),
    fontWeight: "400",
    marginRight: 5,
    color: Colors.darkGrey,
  },
  name: {
    fontSize: RFValue(15),
    fontWeight: "300",
    color: Colors.blue,
  },
  // Edit Section Styles
  editContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
});

export default CustomerItem;
