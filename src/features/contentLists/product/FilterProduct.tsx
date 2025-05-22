import RadioButton from "../../../components/ui/RadioButton";
import React, { FC, useState } from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface filter {
  sendHandleFilter: (brand: string, pack: string, name: string) => void;
  onFilter: () => void;
}

const FilterProduct: FC<filter> = ({ sendHandleFilter, onFilter }) => {
  const packageType = ["Box", "Bag", "Pouch"];
  const [pack, setPack] = useState("");
  const [brand, setBrand] = useState("");
  const [name, setName] = useState("");

  const handleBrandChange = (text: React.SetStateAction<string>) => {
    setBrand(text);
  };

  const handleNameChange = (text: React.SetStateAction<string>) => {
    setName(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.closeButton}>
        <TouchableOpacity style={styles.close} onPress={() => onFilter()}>
          <Icon name="close-outline" size={35} />
        </TouchableOpacity>
      </View>

      <Text style={styles.header}>Product Filter</Text>
      <Text style={styles.label}>Brand</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter brand name"
        value={brand}
        onChangeText={handleBrandChange}
      />
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter name"
        value={name}
        onChangeText={handleNameChange}
      />
      <Text style={styles.label}>Packaging Type</Text>
      <View style={styles.radioGroup}>
        {packageType.map((type, index) => (
          <RadioButton
            key={index}
            label={type}
            selected={pack === type}
            onPress={() => setPack(type)}
            style={{
              borderColor: pack === type ? "#007BFF" : "#ccc",
              backgroundColor: pack === type ? "#EAF4FF" : "#fff",
            }}
          />
        ))}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => sendHandleFilter(brand, pack, name)}
          >
            <Text style={styles.buttonText}>Apply</Text>
          </TouchableOpacity>
        </View>
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
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    fontSize: 14,
    backgroundColor: "#f9f9f9",
  },
  radioGroup: {
    flexDirection: "row",
    marginBottom: 1,
  },
  buttonContainer: {
    position: "absolute",
    alignItems: "center",
    right: 5,
    bottom: 10,
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

export default FilterProduct;
