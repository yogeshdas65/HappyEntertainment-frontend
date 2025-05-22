import React, { FC, useState } from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface FilterProps {
  sendHandleFilter: (filters: object) => void;
  onFilter: () => void;
}

const FilterSaleOfficer: FC<FilterProps> = ({ sendHandleFilter, onFilter }) => {
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    assignedRegion: "",
    city: "",
    zipCode: "",
  });

  const handleInputChange = (key: string, value: string) => {
    setFilters((prevFilters) => ({ ...prevFilters, [key]: value }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.closeButton}>
        <TouchableOpacity style={styles.close} onPress={() => onFilter()}>
          <Icon name="close-outline" size={35} />
        </TouchableOpacity>
      </View>

      <Text style={styles.header}>Sale Officer's Filter</Text>

      {/* Name */}
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter name"
        value={filters.name}
        onChangeText={(value) => handleInputChange("name", value)}
      />

      {/* Email */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        keyboardType="email-address"
        value={filters.email}
        onChangeText={(value) => handleInputChange("email", value)}
      />

      {/* Assigned Region */}
      <Text style={styles.label}>Assigned Region</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter assigned region"
        value={filters.assignedRegion}
        onChangeText={(value) => handleInputChange("assignedRegion", value)}
      />

      {/* City */}
      <Text style={styles.label}>City</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter city"
        value={filters.city}
        onChangeText={(value) => handleInputChange("city", value)}
      />

      {/* Zip Code */}
      <Text style={styles.label}>Zip Code</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter zip code"
        keyboardType="numeric"
        value={filters.zipCode}
        onChangeText={(value) => handleInputChange("zipCode", value)}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => sendHandleFilter(filters)}
        >
          <Text style={styles.buttonText}>Apply Filter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    margin: 10,
  },
  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  close: {
    position: "absolute",
    alignItems: "center",
    top: 5,
    right: 5,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 4,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  label: {
    fontSize: 14,
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
    fontSize: 14,
    backgroundColor: "#f9f9f9",
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#007BFF",
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

export default FilterSaleOfficer;
