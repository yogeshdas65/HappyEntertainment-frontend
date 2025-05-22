import CheckOut from "@components/addedCompnents/CheckOut";
import CustomSafeAreaView from "@components/global/CustomSafeAreaView";
import Footer from "@components/ui/Footer";
import StickSearchBar from "@components/someComponents/StickSearchBar";
import {
  CollapsibleContainer,
  CollapsibleHeaderContainer,
  CollapsibleScrollView,
  useCollapsibleContext,
  withCollapsibleContext,
} from "@r0b0t3d/react-native-collapsible";
import { navigate } from "@utils/NavigationUtils";
import { NoticeHeight, screenHeight } from "@utils/Scaling";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Animated as RNAnimated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useAnimatedStyle, withTiming } from "react-native-reanimated";
import useCustomerList from "../customerList/hooks/useCustomerList";
import ProductsCreateOrder from "./ProductsCreateOrder";
import { Fonts } from "@utils/Constants";
import useProductList from "../product/hooks/useProductList";
import Toast from "react-native-toast-message";

const NOTICE_HEIGHT = -(NoticeHeight + 12);
const SearchableDropdownElement = () => {
  const [customerSelected, setCustomerSelected] = useState(""); // Holds selected value
  const [loading, setLoading] = useState(false); // Loading indicator for API calls
  const { scrollY, expand } = useCollapsibleContext();

  const [cusSearch, setCusSearch] = useState("");
  const previousScroll = useRef<number>(0);
  const { data: customerData } = useCustomerList(cusSearch);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const limit = 10; // Number of products per page
  const skip = (currentPage - 1) * limit; // Skip calculation for pagination
  const {
    data: productsData,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useProductList(search, currentPage, limit);
  const CheckOutHandle = () => {
    if (customerSelected) {
      navigate("Cart", { customer: customerSelected });
    } else {
      Toast.show({
        type: "error",
        text1: "Please select Customer first",
        // text2: error.message,
        visibilityTime: 5000,
      });
    }
  };
  const handleSearchChange = (text: string) => {
    setSearch(text);
    setCurrentPage(1); // Reset pagination on new search
  };

  // Handle page change
  const handleNextPage = () => {
    if (currentPage < productsData?.pagination.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      
      <CollapsibleContainer style={styles.panelContainer}>
        <CollapsibleHeaderContainer containerStyle={styles.transparent}>
          <View style={styles.search}>
            <Dropdown
              style={styles.dropdown}
              data={customerData?.customers || []} // Use the data from `useCustomerList`
              labelField="name"
              valueField="customerId"
              placeholder="Search or select Customer"
              search
              searchPlaceholder="Search Customers..."
              value={customerSelected}
              onChange={(item) => setCustomerSelected(item)} // Set selected customer
              onChangeText={(text) => setCusSearch(text)} // Update search state when user types
              renderLeftIcon={() =>
                (loading || isFetching) && (
                  <ActivityIndicator size="small" color="#0000ff" />
                )
              }
              searchQuery={(query) => {
              return customerData?.customers.filter(
                (item: { name: string; customerId: { toString: () => string | string[]; }; }) =>
                  item.name.toLowerCase().includes(query.toLowerCase()) ||
                  item.customerId.toString().includes(query)
              );
            }}
            />
          </View>
          <StickSearchBar search={search} onSearchChange={handleSearchChange} />
        </CollapsibleHeaderContainer>

        <CollapsibleScrollView
          nestedScrollEnabled
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          style={[styles.contentContainer, { flex: 1, paddingBottom: 20 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* <Content /> */}
          <CustomSafeAreaView>
            <ProductsCreateOrder data={productsData?.products || []} />
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
                Page {currentPage} of {productsData?.pagination.totalPages}
              </Text>
              <TouchableOpacity
                style={styles.paginationButton}
                onPress={handleNextPage}
                disabled={currentPage === productsData?.pagination.totalPages}
              >
                <Text style={styles.paginationText}>Next</Text>
              </TouchableOpacity>
            </View>
            <Footer />
          </CustomSafeAreaView>
        </CollapsibleScrollView>
        <CheckOut onPress={CheckOutHandle} />
      </CollapsibleContainer>
    </>
  );
};

const styles = StyleSheet.create({
  panelContainer: {
    flex: 1,
    // paddingRight: 10,
  },
  contentContainer: {
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  transparent: {
    backgroundColor: "transparent",
    // flex: 1,
    // alignItems: "center",
    // justifyContent: "center", // Align items to the center of the screen
    // paddingTop: 10,
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
  selectedValueContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  backToTopButton: {
    position: "absolute",
    alignSelf: "center",
    top: Platform.OS === "ios" ? screenHeight * 0.18 : 100,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "black",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    zIndex: 999,
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
});

export default withCollapsibleContext(SearchableDropdownElement);
