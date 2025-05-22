import CustomSafeAreaView from "@components/global/CustomSafeAreaView";
import Header from "@components/ui/Header";
import { useRoute } from "@react-navigation/native";
import { useAuthStore } from "@state/authStore";
import React, { FC } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Linking,
  TouchableOpacity,
  Platform,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Toast from "react-native-toast-message";
import Ionicons from "react-native-vector-icons/Ionicons";

const openGoogleMaps = (latitude: number, longitude: number) => {
  const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  Linking.openURL(url).catch((err) =>
    console.error("Error opening Google Maps", err)
  );
  openGoogleMapsApp(latitude, longitude);
};
const openGoogleMapsApp = (latitude: number, longitude: number) => {
  const url = Platform.select({
    ios: `maps://app?saddr=${latitude},${longitude}`,
    android: `geo:${latitude},${longitude}?q=${latitude},${longitude}`,
  });

  if (url) {
    Linking.openURL(url).catch((err) =>
      console.error("Error opening Google Maps", err)
    );
  }
};

interface Product {
  product: any;
  _id: string;
  name: string;
  brand: string;
  price: number;
  photo: string;
  quantity: number;
}

interface Order {
  location: any;
  orderId: any;
  _id: string;
  saleOfficer: {
    _id: string;
    name: string;
    saleOfficerId: number;
  };
  address: {
    state: string;
    city: string;
  };
  customer: {
    name: string;
  };
  products: Product[];
  totalAmount: number;
}

interface RouteParams {
  singleOrder: Order;
}

const CustomerOrdersDetails: FC = () => {
  const { authUser, setAuthUser } = useAuthStore();
  const route = useRoute();
  const { singleOrder } = route.params as { singleOrder: Order };
  console.log("singleOrder", singleOrder);
  if (!singleOrder) {
    return (
      <CustomSafeAreaView>
        <Header title="Order Details" />
        <Text style={styles.errorText}>Order details not available.</Text>
      </CustomSafeAreaView>
    );
  }

  const renderProductRow = ({ item }: { item: Product }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, styles.cellText]}>{item?.product?.name}</Text>
      <Text style={[styles.cell, styles.cellText]}>{item.quantity}</Text>
      <Text style={[styles.cell, styles.cellText]}>₹{item.price}</Text>
    </View>
  );

  return (
    <>
      <Header title={`Order ID: ${singleOrder.orderId}`} />
      <CustomSafeAreaView style={styles.container}>
        <ScrollView>
          <Text style={styles.sectionHeader}>Order Details</Text>
          <View style={styles.detailsCard}>
            <Text style={styles.detailItem}>
              <Text style={styles.detailLabel}>Customer: </Text>
              {singleOrder.customer.name}
            </Text>
            <Text style={styles.detailItem}>
              <Text style={styles.detailLabel}>Sale Officer: </Text>
              {singleOrder.saleOfficer?.name || "created by admin"}
            </Text>
            <Text style={styles.detailItem}>
              <Text style={styles.detailLabel}>Sale Officer ID: </Text>
              {singleOrder.saleOfficer?.saleOfficerId || "created by admin"}
            </Text>
            <Text style={styles.detailItem}>
              <Text style={styles.detailLabel}>State: </Text>
              {singleOrder.address.state}
            </Text>
            <Text style={styles.detailItem}>
              <Text style={styles.detailLabel}>City: </Text>
              {singleOrder.address.city}
            </Text>
            {authUser && authUser.role === "ADMIN" && (
              <TouchableOpacity
                onPress={() => {
                  if (
                    singleOrder?.location &&
                    typeof singleOrder.location.latitude === "number" &&
                    typeof singleOrder.location.longitude === "number"
                  ) {
                    openGoogleMaps(
                      singleOrder.location.latitude,
                      singleOrder.location.longitude
                    );
                  } else {
                    console.warn("No location data");
                    Toast.show({
                      type: "error",
                      text1: `No location of SaleOfficer`,
                      visibilityTime: 10000,
                    });
                  }
                }}
              >
                <LinearGradient
                  colors={["#4c669f", "#3b5998", "#192f6a"]}
                  style={styles.button}
                >
                  <Ionicons
                    name="location-outline"
                    size={22}
                    color="white"
                    style={styles.icon}
                  />
                  <Text style={styles.buttonText}>Get Location</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.table}>
            <View style={[styles.row, styles.headerRow]}>
              <Text style={[styles.cell, styles.headerCell]}>Product Name</Text>
              <Text style={[styles.cell, styles.headerCell]}>Quantity</Text>
              <Text style={[styles.cell, styles.headerCell]}>Price</Text>
            </View>
            <FlatList
              data={singleOrder.products}
              renderItem={renderProductRow}
              keyExtractor={(item) => item._id}
            />
          </View>
          <Text style={styles.total}>Total: ₹{singleOrder.totalAmount}</Text>
        </ScrollView>
      </CustomSafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    backgroundColor: "#f9f9f9",
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 16,
    color: "#333",
  },
  detailsCard: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 16,
  },
  detailItem: {
    fontSize: 16,
    marginBottom: 8,
    color: "#444",
  },
  detailLabel: {
    fontWeight: "bold",
    color: "#000",
  },
  table: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerRow: {
    backgroundColor: "#f1f1f1",
  },
  cell: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  headerCell: {
    fontWeight: "bold",
    fontSize: 16,
  },
  cellText: {
    fontSize: 14,
    textAlign: "center",
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    color: "green",
    textAlign: "center",
    marginTop: 16,
  },
  errorText: {
    textAlign: "center",
    fontSize: 16,
    color: "red",
    marginTop: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 25,
    marginVertical: 10,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  icon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default CustomerOrdersDetails;
