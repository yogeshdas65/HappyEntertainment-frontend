import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import React, { FC } from "react";
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
import OrdersInCustomer from "../customerList/OrdersInCustomer";

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

const IndividualOfficerCustomers: FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, "CustomerDetail">>();

  const { officer } = route.params || {};

  if (!officer) {
    return (
      <CustomSafeAreaView>
        <Text>Customer details not available.</Text>
      </CustomSafeAreaView>
    );
  }

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
  } = officer;

  const handleAddOfficer = () => {};

  return (
    <CollapsibleContainer style={styles.panelContainer}>
      <CollapsibleHeaderContainer containerStyle={styles.transparent}>
        <Header title={name} />
        <StickSearchBar />
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
              <OrdersInCustomer data={officer || []} />
              <View style={styles.stickyContainer}>
                <TouchableOpacity style={styles.fab} onPress={handleAddOfficer}>
                  <Icon name="add" size={RFValue(28)} color="white" />
                </TouchableOpacity>
              </View>
              {/* <View style={{ backgroundColor: "#F8F8F8", padding: 20 }}>
              <CustomText
                fontSize={RFValue(32)}
                fontFamily={Fonts.Bold}
                style={{ opacity: 0.2 }}
              >
                Sales App
              </CustomText>
              <CustomText
                fontFamily={Fonts.Bold}
                style={{ marginTop: 10, paddingBottom: 100, opacity: 0.2 }}
              >
                Developed By ❤️ BeeSpokeBytes
              </CustomText>
            </View> */}
            </CustomSafeAreaView>
          </View>

          {/* <TouchableOpacity
            style={styles.button}
            onPress={() => {
              // Handle button press
            }}
          >
            <Text style={styles.buttonText}>Edit Details</Text>
          </TouchableOpacity> */}
        </CustomSafeAreaView>
      </CollapsibleScrollView>
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

export default withCollapsibleContext(IndividualOfficerCustomers);
