import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import CustomInput from "@components/ui/CustomInput";
import { Colors, Fonts } from "@utils/Constants";
import { launchImageLibrary, Asset } from "react-native-image-picker";
import useAddCustomerMutation from "./hooks/useAddCustomerMutation";
import Toast from "react-native-toast-message";

interface FormData {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  saleOfficer: string;
}

const AddCustomer: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    saleOfficer: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const successHandler = () => {
    setLoading(false);
    Toast.show({
      type: "success",
      text1: "Customer Added Successfully!",
      visibilityTime: 3000,
    });
    setFormData({
      name: "",
      email: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      saleOfficer: "",
    });
  };

  const errorHandler = (error: any) => {
    Toast.show({
      type: "error",
      text1: "Failed to Add Customer",
      text2: error?.message || "Something went wrong. Try again.",
      visibilityTime: 3000,
    });
    setLoading(false);
  };

  const addCustomerMutation = useAddCustomerMutation(
    successHandler,
    errorHandler
  );

  const handleSubmit = async () => {
  const {
    name,
    email,
    phone,
    street,
    city,
    state,
    zipCode,
    // saleOfficer,
  } = formData;

  if (
    !name ||
    !email ||
    !phone ||
    !street ||
    !city ||
    !state ||
    !zipCode
    // !saleOfficer
  ) {
    Toast.show({
      type: "error",
      text1: "Validation Error , All fields are required",
      // text2: error?.message || "Something went wrong. Try again.",
      visibilityTime: 3000,
    });
    return;
  }

  const customerData = {
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    address: {
      street: formData.street,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
    },
    // saleOfficer: formData.saleOfficer,
  };

  setLoading(true);
  addCustomerMutation.reset();
  addCustomerMutation.mutateAsync(customerData);
};

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Add New Customer</Text>

      <CustomInput
        left={<Text style={styles.label}>Name:</Text>}
        placeholder="Enter customer name"
        value={formData.name}
        onChangeText={(value) => handleInputChange("name", value)}
        style={styles.input}
      />
      <CustomInput
        left={<Text style={styles.label}>Email:</Text>}
        placeholder="Enter customer email"
        value={formData.email}
        onChangeText={(value) => handleInputChange("email", value)}
        style={styles.input}
      />
      <CustomInput
        left={<Text style={styles.label}>Phone:</Text>}
        placeholder="Enter customer phone"
        value={formData.phone}
        onChangeText={(value) => handleInputChange("phone", value)}
        style={styles.input}
      />
      <CustomInput
        left={<Text style={styles.label}>Street:</Text>}
        placeholder="Enter street"
        value={formData.street}
        onChangeText={(value) => handleInputChange("street", value)}
        style={styles.input}
      />
      <CustomInput
        left={<Text style={styles.label}>City:</Text>}
        placeholder="Enter city"
        value={formData.city}
        onChangeText={(value) => handleInputChange("city", value)}
        style={styles.input}
      />
      <CustomInput
        left={<Text style={styles.label}>State:</Text>}
        placeholder="Enter state"
        value={formData.state}
        onChangeText={(value) => handleInputChange("state", value)}
        style={styles.input}
      />
      <CustomInput
        left={<Text style={styles.label}>Zip Code:</Text>}
        placeholder="Enter zip code"
        value={formData.zipCode}
        onChangeText={(value) => handleInputChange("zipCode", value)}
        style={styles.input}
      />
      {/* <CustomInput
        left={<Text style={styles.label}>Sale Officer:</Text>}
        placeholder="Enter sale officer ID"
        value={formData.saleOfficer}
        onChangeText={(value) => handleInputChange("saleOfficer", value)}
        style={styles.input}
      /> */}

      <View style={styles.buttonContainer}>
        <Button
          title={loading ? "Adding Customer..." : "Add Customer"}
          onPress={handleSubmit}
          color={Colors.primary}
          disabled={loading}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 30,
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontFamily: Fonts.Bold,
    marginBottom: 20,
    color: Colors.text,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontFamily: Fonts.Medium,
    color: Colors.text,
    marginRight: 10,
  },
  input: {
    marginBottom: 15,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.secondary,
    width: "100%",
    backgroundColor: Colors.background,
  },
  imagePicker: {
    marginTop: 10,
    height: 150,
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: Colors.background,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  imageText: {
    color: Colors.primary,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "center",
    width: "100%",
  },
});

export default AddCustomer;
