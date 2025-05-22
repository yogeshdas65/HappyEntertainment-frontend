import AddButton from "@components/addedCompnents/AddButton";
import CustomSafeAreaView from "@components/global/CustomSafeAreaView";
import CustomText from "@components/ui/Customtext";
import Footer from "@components/ui/Footer";
import StickSearchBar from "@components/someComponents/StickSearchBar";
import {
  CollapsibleContainer,
  CollapsibleHeaderContainer,
  CollapsibleScrollView,
  useCollapsibleContext,
  withCollapsibleContext,
} from "@r0b0t3d/react-native-collapsible";
import { Fonts } from "@utils/Constants";
import { navigate } from "@utils/NavigationUtils";
import { NoticeHeight, screenHeight } from "@utils/Scaling";
import React, { FC, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Platform,
  Animated as RNAnimated,
  StyleSheet,
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
import useSaleOfficerList from "./saleOfficerList/hooks/useSaleOfficerList";
import Officer from "./saleOfficerList/Officer";
import AssignButton from "@components/addedCompnents/AssignButton";
import FilterSaleOfficer from "./saleOfficerList/FilterSaleOfficer";
import { useAuthStore } from "@state/authStore";

const NOTICE_HEIGHT = -(NoticeHeight + 12);

const SalesOfficerList: FC = () => {
  const { authUser, setAuthState, authstate } = useAuthStore();
  const { scrollY, expand } = useCollapsibleContext();
  const previousScroll = useRef<number>(0);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [assignedRegion, setAssignedRegion] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const skip = (currentPage - 1) * limit;
  const {
    data: saleOfficerData,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useSaleOfficerList(
    search,
    currentPage,
    limit,
    name,
    email,
    assignedRegion,
    city,
    zipCode
  );

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

  const handleAddOfficer = () => {
    navigate("AddOfficer");
  };

  // Handle page change
  const handleNextPage = () => {
    if (currentPage < saleOfficerData?.pagination.totalPages) {
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
    console.log("SaleOfficerhandleFilter", data);
    setSearch("");
    setName(data.name);
    setEmail(data.email);
    setAssignedRegion(data.assignedRegion);
    setCity(data.city);
    setZipCode(data.zipCode);
    refetch();
    Keyboard.dismiss();
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
        <CollapsibleHeaderContainer containerStyle={styles.transparent}>
          {filter ? (
            <FilterSaleOfficer
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
          {/* <Content /> */}
          <CustomSafeAreaView>
            {isFetching && isLoading ? (
              <ActivityIndicator size="large" color="#00ff00" />
            ) : isError ? (
              <Text>No SaleOfficer</Text>
            ) : (
              <>
                <Officer data={saleOfficerData?.saleOfficers || []} />
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
                    {saleOfficerData?.pagination.totalPages}
                  </Text>
                  <TouchableOpacity
                    style={styles.paginationButton}
                    onPress={handleNextPage}
                    disabled={
                      currentPage === saleOfficerData?.pagination.totalPages
                    }
                  >
                    <Text style={styles.paginationText}>Next</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
            <Footer />
          </CustomSafeAreaView>
        </CollapsibleScrollView>

        {authUser?.role === "ADMIN" && <AddButton onPress={handleAddOfficer} />}
      </CollapsibleContainer>
    </>
  );
};

const styles = StyleSheet.create({
  panelContainer: {
    flex: 1,
    // paddingRight: 10,
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

export default withCollapsibleContext(SalesOfficerList);
