import React, { FC, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import CustomSafeAreaView from "@components/global/CustomSafeAreaView";
import Header from "@components/ui/Header";
import CustomInput from "@components/ui/CustomInput";
import Icon from "react-native-vector-icons/Ionicons";
import Toast from "react-native-toast-message";
import { goBack } from "@utils/NavigationUtils";
import useOfficerMutation from "./hooks/useUpdateOfficerMutation";

// Define the Officer interface
interface Officer {
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
  achieved: number;
  target: number;
  role: string;
  assignedRegion: string;
  createdAt: string;
  updatedAt: string;
  saleOfficerId: number;
  password: string; // Ensure password field is defined
}

type RootStackParamList = {
  EditOfficerDetail: { Officer: Officer };
};

const EditOfficerDetail: FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, "EditOfficerDetail">>();
  const { Officer } = route.params; // Extract the Officer object

  const [officerDetails, setOfficerDetails] = useState<Officer>({
    _id: Officer._id || "",
    name: Officer.name || "",
    email: Officer.email || "",
    phone: Officer.phone || "",
    address: Officer.address || {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
    achieved: Officer.achieved || 0,
    target: Officer.target || 0,
    role: Officer.role || "SALEOFFICER",
    assignedRegion: Officer.assignedRegion || "",
    createdAt: Officer.createdAt || new Date().toISOString(),
    updatedAt: Officer.updatedAt || new Date().toISOString(),
    saleOfficerId: Officer.saleOfficerId || 0,
    password: Officer.password || "", // Ensure initial state includes password
  });

  const handleChange = (field: keyof Officer, value: any) => {
    setOfficerDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const successHandler = () => {
    Toast.show({
      type: "success",
      text1: "Officer Updated Successfully!",
      visibilityTime: 3000,
    });
    goBack();
  };

  const errorHandler = (error: any) => {
    Toast.show({
      type: "error",
      text1: "Failed to Update Officer",
      text2: error?.message || "Something went wrong. Try again.",
      visibilityTime: 3000,
    });
  };

  const { mutate: updateOfficer, isLoading: isUpdating } = useOfficerMutation(
    successHandler,
    errorHandler
  );
  const { mutate: deleteOfficer, isLoading: isDeleting } = useOfficerMutation(
    successHandler,
    errorHandler,
    true
  );

  const handleSave = () => {
    if (!officerDetails.saleOfficerId) {
      Alert.alert("Error", "Sale Officer ID is missing!");
      return;
    }
    updateOfficer({
      saleOfficerId: officerDetails.saleOfficerId,
      data: officerDetails,
    });
  };

  const handleDelete = () => {
    if (!officerDetails.saleOfficerId) {
      Alert.alert("Error", "Sale Officer ID is missing!");
      return;
    }

    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this officer?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteOfficer({ saleOfficerId: officerDetails.saleOfficerId });
          },
        },
      ]
    );
  };

  return (
    <CustomSafeAreaView>
      <Header title="Edit Officer" />
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.container}>
          <Text style={styles.label}>Name</Text>
          <CustomInput
            left={<Icon name="person-outline" size={20} color="#ccc" />}
            placeholder="Name"
            value={officerDetails.name}
            onChangeText={(text) => handleChange("name", text)}
            onClear={() => handleChange("name", "")}
          />

          <Text style={styles.label}>Email</Text>
          <CustomInput
            left={<Icon name="mail-outline" size={20} color="#ccc" />}
            placeholder="Email"
            value={officerDetails.email}
            onChangeText={(text) => handleChange("email", text)}
            onClear={() => handleChange("email", "")}
          />

          <Text style={styles.label}>Phone</Text>
          <CustomInput
            left={<Icon name="call-outline" size={20} color="#ccc" />}
            placeholder="Phone"
            value={officerDetails.phone}
            onChangeText={(text) => handleChange("phone", text)}
            onClear={() => handleChange("phone", "")}
          />

          <Text style={styles.label}>Street Address</Text>
          <CustomInput
            left={<Icon name="home-outline" size={20} color="#ccc" />}
            placeholder="Street Address"
            value={officerDetails.address.street}
            onChangeText={(text) =>
              handleChange("address", {
                ...officerDetails.address,
                street: text,
              })
            }
            onClear={() =>
              handleChange("address", { ...officerDetails.address, street: "" })
            }
          />

          <Text style={styles.label}>City</Text>
          <CustomInput
            left={<Icon name="location-outline" size={20} color="#ccc" />}
            placeholder="City"
            value={officerDetails.address.city}
            onChangeText={(text) =>
              handleChange("address", { ...officerDetails.address, city: text })
            }
            onClear={() =>
              handleChange("address", { ...officerDetails.address, city: "" })
            }
          />

          <Text style={styles.label}>State</Text>
          <CustomInput
            left={<Icon name="map-outline" size={20} color="#ccc" />}
            placeholder="State"
            value={officerDetails.address.state}
            onChangeText={(text) =>
              handleChange("address", {
                ...officerDetails.address,
                state: text,
              })
            }
            onClear={() =>
              handleChange("address", { ...officerDetails.address, state: "" })
            }
          />

          <Text style={styles.label}>Zip Code</Text>
          <CustomInput
            left={<Icon name="flag-outline" size={20} color="#ccc" />}
            placeholder="Zip Code"
            value={officerDetails.address.zipCode}
            onChangeText={(text) =>
              handleChange("address", {
                ...officerDetails.address,
                zipCode: text,
              })
            }
            onClear={() =>
              handleChange("address", {
                ...officerDetails.address,
                zipCode: "",
              })
            }
          />

          <Text style={styles.label}>Assigned Region</Text>
          <CustomInput
            left={<Icon name="location-outline" size={20} color="#ccc" />}
            placeholder="Assigned Region"
            value={officerDetails.assignedRegion}
            onChangeText={(text) => handleChange("assignedRegion", text)}
            onClear={() => handleChange("assignedRegion", "")}
          />

          <Text style={styles.label}>Achieved</Text>
          <CustomInput
            left={<Icon name="cash-outline" size={20} color="#ccc" />}
            placeholder="Target"
            value={officerDetails.achieved.toString()}
            onChangeText={(text) =>
              handleChange("achieved", parseFloat(text) || 0)
            }
            keyboardType="numeric"
            onClear={() => handleChange("achieved", 0)}
          />

          <Text style={styles.label}>Target</Text>
          <CustomInput
            left={<Icon name="cash-outline" size={20} color="#ccc" />}
            placeholder="Target"
            value={officerDetails.target.toString()}
            onChangeText={(text) =>
              handleChange("target", parseFloat(text) || 0)
            }
            keyboardType="numeric"
            onClear={() => handleChange("target", 0)}
          />

          <Text style={styles.label}>Password</Text>
          <CustomInput
            left={<Icon name="lock-closed-outline" size={20} color="#ccc" />}
            placeholder="Password"
            value={officerDetails.password} // Fixed to handle password
            onChangeText={(text) => handleChange("password", text)}
            onClear={() => handleChange("password", "")}
            secureTextEntry={false}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#059212" }]}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>
                {isUpdating ? "Saving..." : "Save"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#FF2929" }]}
              onPress={handleDelete}
            >
              <Text style={styles.buttonText}>
                {isDeleting ? "Deleting..." : "Delete"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    paddingHorizontal: 15,
    paddingBottom: 2,
  },
  container: {
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
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EditOfficerDetail;
