import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { FC } from "react";
import CustomSafeAreaView from "@components/global/CustomSafeAreaView";
import Header from "@components/ui/Header";
import { useRoute, RouteProp } from "@react-navigation/native";
import { navigate } from "@utils/NavigationUtils";
import OfficerEdit from "./OfficerEdit";

// Define the Officer interface
interface Officer {
  _id: number;
  name: string;
  target: number;
  phone: string;
  address: string;
  city: string;
  area: string;
  state: string;
  userName: string;
  password: string;
}

// Define the route parameters type (RouteProp)
type RootStackParamList = {
  OfficerDetail: { officer: Officer };
};

const OfficerDetail: FC = () => {
  // Apply RouteProp to get correct typing for `route.params`
  const route = useRoute<RouteProp<RootStackParamList, "OfficerDetail">>();

  // Check if the route params exist and log item for debugging
  const { officer } = route.params || {};

  // Fallback message if officer is not available
  if (!officer) {
    return (
      <CustomSafeAreaView>
        <Text>Officer details not available.</Text>
      </CustomSafeAreaView>
    );
  }

  // Destructure the properties of `officer`
  const {
    name,
    target,
    phone,
    address,
    city,
    area,
    state,
    userName,
    password,
  } = officer;

  return (
    <CustomSafeAreaView>
      <Header title={name} />
      <View style={styles.container}>
        {/* Officer new Details */}
        <View style={styles.cardContainer}>
          <Text style={styles.title}>Name: {name}</Text>
          <Text style={styles.subTitle}>Target: ₹{target.toLocaleString()}</Text>

          <View style={styles.detailItem}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.text}>{phone}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.text}>{address}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}>City:</Text>
            <Text style={styles.text}>{city}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}>Area:</Text>
            <Text style={styles.text}>{area}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}>State:</Text>
            <Text style={styles.text}>{state}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}>Username:</Text>
            <Text style={styles.text}>{userName}</Text>
          </View>

          {/* You can choose to hide the password for security reasons */}
          <View style={styles.detailItem}>
            <Text style={styles.label}>Password:</Text>
            <Text style={styles.text}>{password}</Text>
          </View>
        </View>

        {/* Optional Action Button (e.g., for editing or managing officer details) */}
        <TouchableOpacity style={styles.button} >
        <OfficerEdit item={officer}  customBorderColor="#8acc50"/>
        </TouchableOpacity>
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
  cardContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "500",
    color: "#555",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#777",
    marginBottom: 4,
  },
  text: {
    fontSize: 16,
    color: "#333",
    marginBottom: 12,
    fontWeight: "400",
  },
  detailItem: {
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "500",
  },
});

export default OfficerDetail;
