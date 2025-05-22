import CustomSafeAreaView from "@components/global/CustomSafeAreaView";
import CustomInput from "@components/ui/CustomInput";
import Header from "@components/ui/Header";
import { RouteProp, useRoute } from "@react-navigation/native";
import { goBack } from "@utils/NavigationUtils";
import React, { FC, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/Ionicons";
import useCustomerMutation from "./hooks/useUpdateCustomerMutation";

// Define the Customer interface
interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  role: string;
  saleOfficer: string;
  createdAt: number;
  updatedAt: number;
  customerId: number;
}

type RootStackParamList = {
  CustomerDetail: { customer: Customer };
};

const EditCustomerDetail: FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, "CustomerDetail">>();
  const { customer } = route.params || {};
  const [loading, setLoading] = useState(false);

  const [customerDetails, setCustomerDetails] = useState<Customer>({
    _id: customer?._id || "",
    name: customer?.name || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
    address: customer?.address || {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
    role: customer?.role || "CUSTOMER",
    saleOfficer: customer?.saleOfficer || "",
    createdAt: customer?.createdAt || Date.now(),
    updatedAt: customer?.updatedAt || Date.now(),
    customerId: customer?.customerId || 0,
  });

  const handleChange = (field: keyof Customer, value: any) => {
    setCustomerDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const successHandler = () => {
    setLoading(false);
    Toast.show({
      type: "success",
      text1: "Customer Updated Successfully!",
      visibilityTime: 3000,
    });
    goBack()
  };

  const errorHandler = (error: any) => {
    Toast.show({
      type: "error",
      text1: "Failed to Updated Customer",
      text2: error?.message || "Something went wrong. Try again.",
      visibilityTime: 3000,
    });
    setLoading(false);
  };

 const { mutate: updateCustomer, isLoading: isUpdating } = useCustomerMutation(successHandler, errorHandler);
  const { mutate: deleteCustomer, isLoading: isDeleting } = useCustomerMutation(successHandler, errorHandler, true);


  const handleSave = () => {
    if (!customerDetails?.customerId) {
      Alert.alert("Error", "Customer ID is missing!");
      return;
    }
    updateCustomer({
      customerId: customerDetails.customerId,
      data: customerDetails,
    });
  };

  const handleDelete = () => {
    if (!customerDetails?.customerId) {
      Alert.alert("Error", "Customer ID is missing!");
      return;
    }

    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this customer?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteCustomer(customerDetails);
          },
        },
      ]
    );
  };

  return (
    <CustomSafeAreaView>
      <Header title={"Edit Customer"} />
      <View style={styles.container}>
        {/* Customer Details */}
        <Text style={styles.label}>Name</Text>
        <CustomInput
          left={<Icon name="person-outline" size={20} color="#ccc" />}
          placeholder="Name"
          value={customerDetails.name}
          onChangeText={(text) => handleChange("name", text)}
          onClear={() => handleChange("name", "")}
        />

        <Text style={styles.label}>Email</Text>
        <CustomInput
          left={<Icon name="mail-outline" size={20} color="#ccc" />}
          placeholder="Email"
          value={customerDetails.email}
          onChangeText={(text) => handleChange("email", text)}
          onClear={() => handleChange("email", "")}
        />

        <Text style={styles.label}>Phone</Text>
        <CustomInput
          left={<Icon name="call-outline" size={20} color="#ccc" />}
          placeholder="Phone"
          value={customerDetails.phone}
          onChangeText={(text) => handleChange("phone", text)}
          onClear={() => handleChange("phone", "")}
        />

        <Text style={styles.label}>Street Address</Text>
        <CustomInput
          left={<Icon name="home-outline" size={20} color="#ccc" />}
          placeholder="Street Address"
          value={customerDetails.address.street}
          onChangeText={(text) =>
            handleChange("address", {
              ...customerDetails.address,
              street: text,
            })
          }
          onClear={() =>
            handleChange("address", { ...customerDetails.address, street: "" })
          }
        />

        <Text style={styles.label}>City</Text>
        <CustomInput
          left={<Icon name="location-outline" size={20} color="#ccc" />}
          placeholder="City"
          value={customerDetails.address.city}
          onChangeText={(text) =>
            handleChange("address", { ...customerDetails.address, city: text })
          }
          onClear={() =>
            handleChange("address", { ...customerDetails.address, city: "" })
          }
        />

        <Text style={styles.label}>State</Text>
        <CustomInput
          left={<Icon name="map-outline" size={20} color="#ccc" />}
          placeholder="State"
          value={customerDetails.address.state}
          onChangeText={(text) =>
            handleChange("address", { ...customerDetails.address, state: text })
          }
          onClear={() =>
            handleChange("address", { ...customerDetails.address, state: "" })
          }
        />

        <Text style={styles.label}>Zip Code</Text>
        <CustomInput
          left={<Icon name="flag-outline" size={20} color="#ccc" />}
          placeholder="Zip Code"
          value={customerDetails.address.zipCode}
          onChangeText={(text) =>
            handleChange("address", {
              ...customerDetails.address,
              zipCode: text,
            })
          }
          onClear={() =>
            handleChange("address", { ...customerDetails.address, zipCode: "" })
          }
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#059212" }]}
            onPress={handleSave}
          >
            <Text style={styles.buttonText}>{isUpdating ? "Saving..." : "Save"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#FF2929" }]}
            onPress={handleDelete}
          >
            <Text style={styles.buttonText}>{isDeleting ? "Deleting..." : "Delete"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    alignItems: "center",
  },
  label: {
    alignSelf: "flex-start",
    marginBottom: 1,
    marginTop: 1,
    fontSize: 14,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default EditCustomerDetail;
