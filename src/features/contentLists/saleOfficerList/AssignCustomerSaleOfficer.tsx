import CustomInput from "@components/ui/CustomInput";
import { RouteProp, useRoute } from "@react-navigation/native";
import { FC, useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { RFValue } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/Ionicons";
import useCustomerList from "../customerList/hooks/useCustomerList";
import Toast from "react-native-toast-message";
import useAssignRemoveOfficerMutation from "./hooks/useAssignRemoveOfficerMutation";

type OfficerType = {
  saleOfficerId: number | string;
  name: string;
};

// Define route params type
type RouteParams = {
  AssignCustomerSaleOfficer: {
    Officer: OfficerType;
  };
};

const AssignCustomerSaleOfficer: FC = () => {
  const route = useRoute<RouteProp<RouteParams, "AssignCustomerSaleOfficer">>();
  const { Officer } = route.params;
  const [cusSearch, setCusSearch] = useState("");
  const [customerSelected, setCustomerSelected] = useState({});
  const [loading, setLoading] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const { data: customerData, isLoading, isFetching } = useCustomerList(
    cusSearch
  );

  const successHandler = () => {
    setLoading(false);
    Toast.show({
      type: "success",
      text1: "Assigned Customer Successfully!",
      visibilityTime: 3000,
    });
  };

  const errorHandler = (error: any) => {
    Toast.show({
      type: "error",
      text1: "Failed to Assigned Customer",
      text2: error?.message || "Something went wrong. Try again.",
      visibilityTime: 3000,
    });
    setLoading(false);
  };

  const addOfficerMutation = useAssignRemoveOfficerMutation(
    successHandler,
    errorHandler
  );

  const handleAdd = () => {
    if (!customerSelected?.customerId) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please select a customer before adding.",
        visibilityTime: 3000,
      });
      return;
    }

    let data = {
      saleOfficerId: Officer.saleOfficerId,
      customerId: customerSelected?.customerId,
      action: "add",
    };

    setLoading(true); // Show loading indicator
    addOfficerMutation.reset();
    addOfficerMutation.mutateAsync(data).catch(() => setLoading(false)); // Ensure loading stops on error
  };

  const handleRemove = () => {
    if (!customerSelected?.customerId) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please select a customer before removing.",
        visibilityTime: 3000,
      });
      return;
    }

    let data = {
      saleOfficerId: Officer.saleOfficerId,
      customerId: customerSelected?.customerId,
      action: "remove",
    };

    setLoading(true); // Show loading indicator
    addOfficerMutation.reset();
    addOfficerMutation.mutateAsync(data).catch(() => setLoading(false)); // Ensure loading stops on error
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assign Customer To Sale Officer</Text>
      <View>
        <Text style={styles.label}>SaleOfficer ID</Text>
        <CustomInput
          left={
            <Icon
              name="person-circle-outline"
              size={RFValue(30)}
              color="#131010"
            />
          }
          value={Officer.saleOfficerId.toString()}
          editable={false} // Fixed value, not editable
        />
        <Text style={styles.label}>SaleOfficer Name:- {Officer?.name}</Text>

        <View style={styles.search}>
          <Dropdown
            style={styles.dropdown}
            data={customerData?.customers || []} // Use the data from `useCustomerList`
            labelField="name"
            valueField="customerId"
            placeholder="Search or select Customer"
            search
            searchPlaceholder="Search Customers..."
            value={customerSelected?.customerId}
            onChange={(item) => {
              setCustomerSelected(item);
              setCustomerId(item.customerId.toString());
            }}
            onChangeText={(text) => setCusSearch(text)} // Update search state when user types
            renderLeftIcon={() =>
              (isLoading || isFetching) && (
                <ActivityIndicator size="small" color="#0000ff" />
              )
            }
            searchQuery={(query) => {
              return customerData?.customers.filter(
                (item: {
                  name: string;
                  customerId: { toString: () => string | string[] };
                }) =>
                  item.name.toLowerCase().includes(query.toLowerCase()) ||
                  item.customerId.toString().includes(query)
              );
            }}
          />
        </View>
        <Text style={styles.label}>Customer ID : {customerId}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#059212" }]}
          onPress={handleAdd}
        >
          <Text style={styles.buttonText}>{"Add"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#FF2929" }]}
          onPress={handleRemove}
        >
          <Text style={styles.buttonText}>{"Remove"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  disabledInput: {
    backgroundColor: "#e0e0e0",
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
  search: {
    // flex: 1,
    alignItems: "center",
    justifyContent: "center", // Align items to the center of the screen
    paddingTop: 10,
  },
  dropdown: {
    width: "90%",
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
  },
});

export default AssignCustomerSaleOfficer;
