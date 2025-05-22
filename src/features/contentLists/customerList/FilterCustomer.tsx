import { useAuthStore } from "@state/authStore";
import React, { FC, useState } from "react";
import { Text, TextInput, View, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface FilterProps {
  sendHandleFilter: (filters: object) => void;
  onFilter: () => void;
}

const FilterCustomer: FC<FilterProps> = ({ sendHandleFilter, onFilter }) => {
  const [filters, setFilters] = useState({
    state: "",
    city: "",
    street: "",
    saleOfficerId: "",
    zipCode:""
  });
   const { authUser , logout } = useAuthStore();

  const handleInputChange = (key: string, value: string) => {
    setFilters((prevFilters) => ({ ...prevFilters, [key]: value }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.closeButton}>
        <TouchableOpacity style={styles.close} onPress={onFilter}>
          <Icon name="close-outline" size={35} />
        </TouchableOpacity>
      </View>

      <Text style={styles.header}>Customer's Filter</Text>

      {/* Sale Officer ID */}
      {authUser?.role === "ADMIN" && (
        <><Text style={styles.label}>Sale Officer ID</Text><TextInput
          style={styles.input}
          placeholder="Enter Sale Officer ID"
          value={filters.saleOfficerId}
          onChangeText={(value) => handleInputChange("saleOfficerId", value)} /></>
      ) }
      

       {/* Sale Officer ID */}
      <Text style={styles.label}>Zipcode</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Zipcode"
        value={filters.zipCode}
        onChangeText={(value) => handleInputChange("zipCode", value)}
      />

      {/* State */}
      <Text style={styles.label}>State</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter state"
        value={filters.state}
        onChangeText={(value) => handleInputChange("state", value)}
      />

      {/* City */}
      <Text style={styles.label}>City</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter city"
        value={filters.city}
        onChangeText={(value) => handleInputChange("city", value)}
      />

      {/* Street */}
      <Text style={styles.label}>Street</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter street"
        value={filters.street}
        onChangeText={(value) => handleInputChange("street", value)}
      />

     
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => sendHandleFilter(filters)}>
          <Text style={styles.buttonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#FF6600",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    margin: 10,
  },
  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  close: {
    position: "absolute",
    alignItems: "center",
    top: 5,
    right: 5,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#FF6600",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 5,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    fontSize: 12,
    fontWeight: "600",
    backgroundColor: "#f9f9f9",
  },
  buttonContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#6EC207",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default FilterCustomer;
