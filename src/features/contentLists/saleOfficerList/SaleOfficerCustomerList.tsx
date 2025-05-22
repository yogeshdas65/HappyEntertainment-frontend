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
import { useRoute } from "@react-navigation/native";
import { Fonts } from "@utils/Constants";
import { navigate } from "@utils/NavigationUtils";
import { NoticeHeight, screenHeight } from "@utils/Scaling";
import React, { FC, useEffect, useRef, useState } from "react";
import {
  Platform,
  Animated as RNAnimated,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { RFValue } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/Ionicons";

const NOTICE_HEIGHT = -(NoticeHeight + 12);

const SaleOfficerCustomerList: FC = () => {
  const { scrollY, expand } = useCollapsibleContext();
  const previousScroll = useRef<number>(0);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const limit = 10; // Number of products per page
  const skip = (currentPage - 1) * limit; // Skip calculation for pagination
  // const {
  //   data: customerData,
  //   isLoading,
  //   isError,
  //   refetch,
  //   isFetching,
  // } = useCustomerList(search, currentPage, limit);
  // console.log("customerData", customerData);
  const route = useRoute();
  const { Officer } = route.params || {};

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

  const handleAddOrder = () => {
    console.log("Navigate to Add Product Page");
    navigate("AddOfficer");
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
          <StickSearchBar
            search={""}
            onSearchChange={function (text: string): void {
              throw new Error("Function not implemented.");
            }}
          />
        </CollapsibleHeaderContainer>

        <CollapsibleScrollView
          nestedScrollEnabled
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          style={[styles.contentContainer, { flex: 1, paddingBottom: 20 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* <Content /> */}
          <CustomSafeAreaView>
            {Officer ? (
              <Customer data={Officer.customers || []} />
            ) : (
              <Customer data={customerData.customers || []} />
            )}
            {/* <View>
            Not Assigned Customers</View> */}
            <Footer />
          </CustomSafeAreaView>
        </CollapsibleScrollView>
        <AddButton onPress={handleAddOrder} />
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

export default withCollapsibleContext(SaleOfficerCustomerList);
