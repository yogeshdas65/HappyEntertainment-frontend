import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { FC, useState } from "react";
import CustomSafeAreaView from "@components/global/CustomSafeAreaView";
import Header from "@components/ui/Header";
import { useRoute, RouteProp } from "@react-navigation/native";
import StickSearchBar from "@components/someComponents/StickSearchBar";
import {
  CollapsibleContainer,
  CollapsibleHeaderContainer,
  CollapsibleScrollView,
  withCollapsibleContext,
} from "@r0b0t3d/react-native-collapsible";
import Customer from "./Customer";
import Icon from "react-native-vector-icons/Ionicons";
import OrdersInCustomer from "./OrdersInCustomer";
import { RFValue } from "react-native-responsive-fontsize";
import Footer from "@components/ui/Footer";
import AddButton from "@components/addedCompnents/AddButton";
import useCustomersOrderList from "./hooks/useCustomersOrderList";
import { Fonts } from "@utils/Constants";
import { navigate } from "@utils/NavigationUtils";

interface Customer {
  _id: string;
  name: string;
  GSTNo: string;
  address: string;
  phone: string;
  email: string;
  managerName: string;
  city: string;
  area: string;
  state: string;
  saleOfficerId: number;
}

type RootStackParamList = {
  CustomerDetail: { customer: Customer };
};

const IndividualCustomerDetail: FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, "CustomerDetail">>();
  const { customer } = route.params || {};

  if (!customer) {
    return (
      <CustomSafeAreaView>
        <Text>Customer details not available.</Text>
      </CustomSafeAreaView>
    );
  }

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const limit = 10; // Number of products per page
  const skip = (currentPage - 1) * limit;

  const _id = customer?._id;
  const {
    data: orderData,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useCustomersOrderList(_id, search, currentPage, limit);

  const {
    name,
    GSTNo,
    address,
    phone,
    email,
    managerName,
    city,
    area,
    state,
    saleOfficerId,
  } = customer;

  const handleAddOfficer = () => {};

  function handleAddOrder(): void {
    navigate("CreateOrderPage");
  }

  // Handle page change
  const handleNextPage = () => {
    if (currentPage < orderData?.pagination.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSearchChange = (text: string) => {
    setSearch(text);
    setCurrentPage(1); // Reset pagination on new search
  };

  return (
    <CollapsibleContainer style={styles.panelContainer}>
      <CollapsibleHeaderContainer containerStyle={styles.transparent}>
        <Header title={name} />
        <StickSearchBar search={search} onSearchChange={handleSearchChange} />
      </CollapsibleHeaderContainer>
      <CollapsibleScrollView
        nestedScrollEnabled
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        style={[styles.contentContainer, { flex: 1, paddingBottom: 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <CustomSafeAreaView>
          <View style={styles.cardContainer}>
            <CustomSafeAreaView>
              <View>
                <Text> Orders </Text>
              </View>
              {isLoading ? (
                <ActivityIndicator size="large" color="#00ff00" />
              ) : isError ? (
                <Text>No Order</Text>
              ) : (
                <>
                  <OrdersInCustomer data={orderData?.orders || []} />
                  {/* Pagination controls */}

                  <View style={styles.paginationContainer}>
                    <TouchableOpacity
                      style={styles.paginationButton}
                      onPress={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      <Text style={styles.paginationText}>Previous</Text>
                    </TouchableOpacity>
                    <Text style={styles.paginationText}>
                      Page {currentPage} of {orderData?.pagination.totalPages}
                    </Text>
                    <TouchableOpacity
                      style={styles.paginationButton}
                      onPress={handleNextPage}
                      disabled={
                        currentPage === orderData?.pagination.totalPages
                      }
                    >
                      <Text style={styles.paginationText}>Next</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
              <Footer />
            </CustomSafeAreaView>
          </View>
        </CustomSafeAreaView>
      </CollapsibleScrollView>
      <AddButton onPress={handleAddOrder} />
    </CollapsibleContainer>
  );
};

const styles = StyleSheet.create({
  panelContainer: {
    flex: 1,
    // paddingRight: 10,
    // backgroundColor: "transparent",
  },
  transparent: {
    backgroundColor: "transparent",
  },
  contentContainer: {
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  stickyContainer: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 30 : 20,
    right: 20,
    zIndex: 1000, // Ensures it stays on top
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  paginationButton: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 5,
  },
  paginationText: {
    color: "white",
    fontFamily: Fonts.SemiBold,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scrollContainer: {
    padding: 16,
    backgroundColor: "#f5f5f5",
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
    marginTop: 16,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "500",
  },
});

export default withCollapsibleContext(IndividualCustomerDetail);
