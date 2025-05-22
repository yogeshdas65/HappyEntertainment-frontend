import AddButton from "@components/addedCompnents/AddButton";
import CustomSafeAreaView from "@components/global/CustomSafeAreaView";
import StickSearchBar from "@components/someComponents/StickSearchBar";
import CustomText from "@components/ui/Customtext";
import Footer from "@components/ui/Footer";
import {
  CollapsibleContainer,
  CollapsibleHeaderContainer,
  CollapsibleScrollView,
  useCollapsibleContext,
  withCollapsibleContext,
} from "@r0b0t3d/react-native-collapsible";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Fonts } from "@utils/Constants";
import { navigate } from "@utils/NavigationUtils";
import { NoticeHeight, screenHeight } from "@utils/Scaling";
import React, { FC, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Animated as RNAnimated,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { RFValue } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/Ionicons";
import Customer from "../customerList/Customer";
import OrdersInCustomer from "../customerList/OrdersInCustomer";
import useCustomerListBySaleOfficer from "./hooks/useCustomerListBySaleOfficer";
import useOrderListBySaleOfficer from "./hooks/useOrderListBySaleOfficer";
import AssignButton from "@components/addedCompnents/AssignButton";
import { useAuthStore } from "@state/authStore";

const NOTICE_HEIGHT = -(NoticeHeight + 12);

interface RouteParams {
  Officer: {
    _id: string; // Replace with the actual properties of Officer
    [key: string]: any; // If Officer can have dynamic keys
  };
}

const OptionViewForSingleOfficer: FC = () => {
  const { authUser, setAuthState, authstate } = useAuthStore();
  const { scrollY, expand } = useCollapsibleContext();
  type OptionViewRouteProp = RouteProp<
    { OptionViewForSingleOfficer: RouteParams },
    "OptionViewForSingleOfficer"
  >;
  const route = useRoute<OptionViewRouteProp>();
  const { Officer } = route.params;
  const previousScroll = useRef<number>(0);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const limit = 10; // Number of products per page
  const skip = (currentPage - 1) * limit; // Skip calculation for pagination

  const [isEnabled, setIsEnabled] = useState(true); // Toggle state

  // Hook selection logic
  const {
    data: customerData,
    isLoading,
    isError,
    refetch,
  } = useCustomerListBySaleOfficer(
    Officer?._id,
    search,
    currentPage,
    limit,
    { enabled: !isEnabled } // Disable hook if `isEnabled` is true
  );

  const {
    data: orderData,
    isLoading: isOrderLoading,
    isError: isOrderError,
    refetch: refetchOrderData,
  } = useOrderListBySaleOfficer(
    Officer?._id,
    search,
    currentPage,
    limit,
    { enabled: isEnabled } // Disable hook if `isEnabled` is false
  );

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  useEffect(() => {
    if (isEnabled) {
      refetchOrderData();
    }
  }, [isEnabled, refetchOrderData]);

  const backToTopStyle = useAnimatedStyle(() => {
    const isScrollingUp =
      scrollY.value < previousScroll.current && scrollY.value > 180;
    const opacity = withTiming(isScrollingUp ? 1 : 0, { duration: 300 });
    const translateY = withTiming(isScrollingUp ? 0 : 10, { duration: 300 });

    previousScroll.current = scrollY.value;

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const noticePosition = useRef(new RNAnimated.Value(NOTICE_HEIGHT)).current;
  const slideUp = () => {
    RNAnimated.timing(noticePosition, {
      toValue: NOTICE_HEIGHT,
      duration: 1200,
      useNativeDriver: false,
    }).start();
  };

  const slideDown = () => {
    RNAnimated.timing(noticePosition, {
      toValue: 0,
      duration: 1200,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    slideDown();
    const timeoutId = setTimeout(() => {
      slideUp();
    }, 3500);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleEditOfficer = () => {
    navigate("EditOfficerDetail", { Officer });
  };

  // Handle page change
  const handleNextPage = () => {
    if (currentPage < customerData?.pagination.totalPages) {
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

  const handleAssignOfficer = () => {
    navigate("AssignCustomerSaleOfficer", { Officer });
  };

  return (
    <>
      <Animated.View style={[styles.backToTopButton, backToTopStyle]}>
        <TouchableOpacity
          onPress={() => {
            scrollY.value = 0;
            expand();
          }}
          style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
        >
          <Icon
            name="arrow-up-circle-outline"
            color="white"
            size={RFValue(12)}
          />
          <CustomText
            variant="h9"
            style={{ color: "white" }}
            fontFamily={Fonts.SemiBold}
          >
            Back to top
          </CustomText>
        </TouchableOpacity>
      </Animated.View>

      <CollapsibleContainer style={styles.panelContainer}>
        {/* <CollapsibleHeaderContainer containerStyle={styles.transparent}>
          <StickSearchBar search={search} onSearchChange={handleSearchChange} />
        </CollapsibleHeaderContainer> */}

        <CollapsibleScrollView
          nestedScrollEnabled
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          style={[styles.contentContainer, { flex: 1, paddingBottom: 20 }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.toggleContainer}>
            <Text
              style={[styles.toggleLabel, !isEnabled && styles.activeLabel]}
            >
              Customer List
            </Text>
            <Switch
              trackColor={{ false: "#ddd", true: "#4caf50" }}
              thumbColor={isEnabled ? "#ffffff" : "#ffffff"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
            <Text style={[styles.toggleLabel, isEnabled && styles.activeLabel]}>
              Orders List
            </Text>
          </View>
          {!isEnabled && (
            <CustomSafeAreaView>
              {isLoading ? (
                <ActivityIndicator size="large" color="#00ff00" />
              ) : isError ? (
                <Text>No Customer Assigned</Text>
              ) : (
                <>
                  <Customer data={customerData?.customers || []} />{" "}
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
                      Page {currentPage} of{" "}
                      {customerData?.pagination.totalPages}
                    </Text>
                    <TouchableOpacity
                      style={styles.paginationButton}
                      onPress={handleNextPage}
                      disabled={
                        currentPage === customerData?.pagination.totalPages
                      }
                    >
                      <Text style={styles.paginationText}>Next</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
              <Footer />
            </CustomSafeAreaView>
          )}
          {isEnabled && (
            <CustomSafeAreaView>
              {isOrderLoading ? (
                <ActivityIndicator size="large" color="#00ff00" />
              ) : isOrderError ? (
                <Text>No Orders</Text>
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
                      Page {currentPage} of{" "}
                      {customerData?.pagination.totalPages}
                    </Text>
                    <TouchableOpacity
                      style={styles.paginationButton}
                      onPress={handleNextPage}
                      disabled={
                        currentPage === customerData?.pagination.totalPages
                      }
                    >
                      <Text style={styles.paginationText}>Next</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
              <Footer />
            </CustomSafeAreaView>
          )}
        </CollapsibleScrollView>
        {authUser?.role === "ADMIN" && (
          <>
            <AssignButton onPress={handleAssignOfficer} />
            <AddButton onPress={handleEditOfficer} edit={true} />
          </>
        )}
      </CollapsibleContainer>
    </>
  );
};

const styles = StyleSheet.create({
  panelContainer: {
    flex: 1,
    // paddingRight: 10,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginVertical: 1,
    marginBottom: 8,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleLabel: {
    fontSize: 16,
    fontFamily: Fonts.Regular,
    color: "#555",
  },
  activeLabel: {
    color: "#4caf50", // Highlight the active option
    fontFamily: Fonts.SemiBold,
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
  contentContainer: {
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  transparent: {
    backgroundColor: "transparent",
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
});

export default withCollapsibleContext(OptionViewForSingleOfficer);
function useParams() {
  throw new Error("Function not implemented.");
}
