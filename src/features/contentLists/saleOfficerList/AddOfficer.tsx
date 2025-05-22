import React, { useState } from "react";
import { View, Text, StyleSheet, Button, ScrollView } from "react-native";
import CustomInput from "@components/ui/CustomInput"; // Adjust the path if necessary
import { Colors, Fonts } from "@utils/Constants";
import Toast from "react-native-toast-message";
import useAddOfficerMutation from "./hooks/useAddOfficerMutation";

const AddOfficer: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    target: 0,
    phone: "",
    email: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
    password: "",
    assignedRegion: "", // New field
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    if (field.includes("address.")) {
      const [addressField, subField] = field.split(".");
      setFormData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          [subField]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [field]: value,
      }));
    }
  };

  const validateForm = () => {
    const { name, phone, email, target, password, address, assignedRegion } = formData;
    const { street, city, state, zipCode } = address;

    if (!name || !phone || !email || !target || !password || !street || !city || !state || !zipCode || !assignedRegion) {
      Toast.show({
        type: "error",
        text1: "All fields are required!",
        visibilityTime: 3000,
      });
      return false;
    }

    // Validate that target is a valid number
    if (isNaN(target) || target <= 0) {
      Toast.show({
        type: "error",
        text1: "Target should be a valid positive number!",
        visibilityTime: 3000,
      });
      return false;
    }

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(email)) {
      Toast.show({
        type: "error",
        text1: "Invalid email address!",
        visibilityTime: 3000,
      });
      return false;
    }

    return true;
  };

  const successHandler = () => {
    setLoading(false);
    Toast.show({
      type: "success",
      text1: "Officer Added Successfully!",
      visibilityTime: 3000,
    });
    setFormData({
      name: "",
      target: 0,
      phone: "",
      email: "",
      address: { street: "", city: "", state: "", zipCode: "" },
      password: "",
      assignedRegion: "", // Reset new field
    });
  };

  const errorHandler = (error: any) => {
    Toast.show({
      type: "error",
      text1: "Failed to Add Officer",
      text2: error?.message || "Something went wrong. Try again.",
      visibilityTime: 3000,
    });
    setLoading(false);
  };

  const addOfficerMutation = useAddOfficerMutation(successHandler, errorHandler);

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const officerData = {
      ...formData,
      target: parseFloat(formData.target.toString()), // Ensure target is a valid number
    };

    // Call the mutation
    addOfficerMutation.reset();
    try {
      await addOfficerMutation.mutateAsync(officerData);
    } catch (error) {
      console.error("Error adding officer:", error);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Add New Officer</Text>

      {/* Name */}
      <CustomInput
        left={<Text style={styles.label}>Name:</Text>}
        placeholder="Enter officer's name"
        value={formData.name}
        onChangeText={(value) => handleInputChange("name", value)}
        onClear={() => handleInputChange("name", "")}
      />

      {/* Phone */}
      <CustomInput
        left={<Text style={styles.label}>Phone:</Text>}
        placeholder="Enter phone number"
        keyboardType="phone-pad"
        value={formData.phone}
        onChangeText={(value) => handleInputChange("phone", value)}
        onClear={() => handleInputChange("phone", "")}
      />

      {/* Email */}
      <CustomInput
        left={<Text style={styles.label}>Email:</Text>}
        placeholder="Enter email"
        keyboardType="email-address"
        value={formData.email}
        onChangeText={(value) => handleInputChange("email", value)}
        onClear={() => handleInputChange("email", "")}
      />

      {/* Password */}
      <CustomInput
        left={<Text style={styles.label}>Password:</Text>}
        placeholder="Enter password"
        value={formData.password}
        onChangeText={(value) => handleInputChange("password", value)}
        onClear={() => handleInputChange("password", "")}
      />

      {/* Target */}
      <CustomInput
        left={<Text style={styles.label}>Target:</Text>}
        placeholder="Enter target amount"
        keyboardType="numeric"
        value={formData.target.toString()} // Display target as string in the input field
        onChangeText={(value) => handleInputChange("target", parseFloat(value) || 0)} // Ensure conversion
        onClear={() => handleInputChange("target", 0)}
      />

      {/* Address Fields */}
      <CustomInput
        left={<Text style={styles.label}>Street:</Text>}
        placeholder="Enter street address"
        value={formData.address.street}
        onChangeText={(value) => handleInputChange("address.street", value)}
        onClear={() => handleInputChange("address.street", "")}
      />

      <CustomInput
        left={<Text style={styles.label}>City:</Text>}
        placeholder="Enter city"
        value={formData.address.city}
        onChangeText={(value) => handleInputChange("address.city", value)}
        onClear={() => handleInputChange("address.city", "")}
      />

      <CustomInput
        left={<Text style={styles.label}>State:</Text>}
        placeholder="Enter state"
        value={formData.address.state}
        onChangeText={(value) => handleInputChange("address.state", value)}
        onClear={() => handleInputChange("address.state", "")}
      />

      <CustomInput
        left={<Text style={styles.label}>Zip Code:</Text>}
        placeholder="Enter zip code"
        value={formData.address.zipCode}
        onChangeText={(value) => handleInputChange("address.zipCode", value)}
        onClear={() => handleInputChange("address.zipCode", "")}
      />

      {/* Assigned Region */}
      <CustomInput
        left={<Text style={styles.label}>Assigned Region:</Text>}
        placeholder="Enter assigned region"
        value={formData.assignedRegion}
        onChangeText={(value) => handleInputChange("assignedRegion", value)}
        onClear={() => handleInputChange("assignedRegion", "")}
      />

      {/* Submit Button */}
      <View style={styles.buttonContainer}>
        <Button title={loading ? "Adding Officer..." : "Add Officer"} onPress={handleSubmit} color={Colors.primary} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.Bold,
    marginBottom: 20,
    color: Colors.text,
  },
  label: {
    fontSize: 16,
    fontFamily: Fonts.Medium,
    color: Colors.text,
    marginRight: 10,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
});

export default AddOfficer;
