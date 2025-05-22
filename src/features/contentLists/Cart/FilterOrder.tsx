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

const Filter: FC<FilterProps> = ({ sendHandleFilter, onFilter }) => {
  const [filters, setFilters] = useState({
    saleOfficerName: "",
    customerName: "",
    state: "",
    city: "",
    street: "",
    productBrand: "",
    productName: "",
    productPrice: "",
    productLength: "",
    productGrossWeight: "",
    productCoreWeight: "",
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

      <Text style={styles.header}>Order's Filter</Text>

      {Object.keys(filters).map((key) => (
        <View key={key}>
          <Text style={styles.label}>{key.replace(/([A-Z])/g, ' $1').trim()}</Text>
          <TextInput
            style={styles.input}
            placeholder={`Enter ${key}`}
            value={filters[key as keyof typeof filters]}
            onChangeText={(value) => handleInputChange(key, value)}
          />
        </View>
      ))}

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
    marginBottom: 1,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 1,
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

export default Filter;
