import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
  Keyboard,
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

import Icon from "react-native-vector-icons/Ionicons";

import { RFValue } from "react-native-responsive-fontsize";
import OrdersInCustomer from "./customerList/OrdersInCustomer";
import CustomText from "@components/ui/Customtext";
import { Fonts } from "@utils/Constants";
import AddButton from "@components/addedCompnents/AddButton";
import Footer from "@components/ui/Footer";
import { navigate } from "@utils/NavigationUtils";
import useOrderList from "./Cart/hooks/useOrderList";
import Filter from "./Cart/FilterOrder";
import { useAuthStore } from "@state/authStore";

interface Customer {
  _id: number;
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

const OrderList: FC = () => {
  const [search, setSearch] = useState("");
  const { authUser, setAuthState, authstate } = useAuthStore();
  const [saleOfficerName, setSaleOfficerName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [productBrand, setProductBrand] = useState("");
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productLength, setProductLength] = useState("");
  const [productGrossWeight, setProductGrossWeight] = useState("");
  const [productCoreWeight, setProductCoreWeight] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;
  const skip = (currentPage - 1) * limit;
  const [filter, setFilter] = useState(false);
  const {
    data: orderData,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useOrderList(
    search,
    currentPage,
    limit,
    saleOfficerName,
    customerName,
    state,
    city,
    street,
    productBrand,
    productName,
    productPrice,
    productLength,
    productGrossWeight,
    productCoreWeight
  );

  const handleAddOrder = () => {
    navigate("CreateOrderPage");
  };

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

  const handleFilter = (data: any) => {
    console.log("orderhandleFilter", data);
    setSearch("");
    setSaleOfficerName(data.saleOfficerName || "");
    setCustomerName(data.customerName || "");
    setState(data.state || "");
    setCity(data.city || "");
    setStreet(data.street || "");
    setProductBrand(data.productBrand || "");
    setProductName(data.productName || "");
    setProductPrice(data.productPrice || "");
    setProductLength(data.productLength || "");
    setProductGrossWeight(data.productGrossWeight || "");
    setProductCoreWeight(data.productCoreWeight || "");
    refetch();
    Keyboard.dismiss();
  };

  return (
    <CollapsibleContainer style={styles.panelContainer}>
      <CollapsibleHeaderContainer containerStyle={styles.transparent}>
        {filter ? (
          <Filter
            sendHandleFilter={handleFilter}
            onFilter={() => setFilter(false)}
          />
        ) : (
          <StickSearchBar
            search={search}
            onSearchChange={handleSearchChange}
            onFilter={() => setFilter(true)}
          />
        )}
      </CollapsibleHeaderContainer>
      <CollapsibleScrollView
        nestedScrollEnabled
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        style={[styles.contentContainer, { flex: 1, paddingBottom: 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <CustomSafeAreaView>
          <View style={styles.cardContainer}>
            {/* <Text style={styles.subTitle}>GST No: {GSTNo}</Text> */}
            <CustomSafeAreaView>
              <View>
                <Text> Orders </Text>
              </View>

              {isLoading ? (
                <ActivityIndicator size="large" color="#00ff00" />
              ) : isError ? (
                <Text>Not Found</Text>
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
      {authUser?.role === "ADMIN" && <AddButton onPress={handleAddOrder} />}
    </CollapsibleContainer>
  );
};

const styles = StyleSheet.create({
  panelContainer: {
    flex: 1,
    // paddingRight: 10,
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
    // bottom: Platform.OS === "ios" ? 30 : 20,
    right: 20,
    bottom: 20,
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
    padding: 10,
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

export default withCollapsibleContext(OrderList);
