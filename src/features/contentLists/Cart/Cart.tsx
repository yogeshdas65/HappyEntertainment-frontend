import CustomSafeAreaView from "@components/global/CustomSafeAreaView";
import Header from "@components/ui/Header";
import { RouteProp, useRoute } from "@react-navigation/native";
import useCartStore from "@state/cartStore";
import React, { FC, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
  Platform,
  ScrollView,
  FlatList,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import RNFS from "react-native-fs";
import Toast from "react-native-toast-message";
import useCreateOrderMutation from "./hooks/useCreateOrderMutation";
import { appAxios } from "@service/apiInterCepters";
import generatePDF from "./hooks/makePdf";
import {
  CollapsibleContainer,
  CollapsibleScrollView,
  withCollapsibleContext,
} from "@r0b0t3d/react-native-collapsible";
import CartItem from "./CartItem";
import Geolocation from "react-native-geolocation-service";

const requestStoragePermission = async () => {
  if (Platform.OS === "android" && Platform.Version < 29) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: "Storage Permission Required",
        message:
          "This app needs access to save PDF files in your downloads folder.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};
requestStoragePermission();

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

interface Customer {
  name: string;
  customerId: number;
  address: Address;
}

type RootStackParamList = {
  Cart: { customer: Customer };
};

interface Order {
  _id: string;
  orderId: string;
}

const Cart: FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, "Cart">>();
  const { customer } = route.params;
  const { cart, getTotalPrice, clearCart } = useCartStore();
  const totalAmount = getTotalPrice();
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [seqId, setSeqId] = useState("");
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === "ios") {
        const auth = await Geolocation.requestAuthorization("whenInUse");
        if (auth === "denied") {
          Alert.alert(
            "Location Permission",
            "Please enable location services."
          );
          return false;
        }
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert("Permission Denied", "Location access is required.");
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error("Permission error:", error);
      return false;
    }
  };

  const getLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;

    Geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.log("Location Error:", error);
        Alert.alert("Error", "Unable to fetch location. Please try again.");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  useEffect(() => {
    const fetchLocation = async () => {
      await getLocation();
    };
    fetchLocation();
  }, []);

  const successHandler = (order: Order) => {
    let _orderId = order._id;
    setOrderId(_orderId);
    setSeqId(order?.orderId);
    setLoading(false);
    Toast.show({
      type: "success",
      text1: `Created Order NO:- ${order?.orderId}`,
      visibilityTime: 10000,
    });
    clearCart();
  };

  const errorHandler = (error: any) => {
    Toast.show({
      type: "error",
      text1: "Failed to Create Order",
      text2: error?.message || "Something went wrong. Try again.",
      visibilityTime: 3000,
    });
    setLoading(false);
  };

  const createOrderMutation = useCreateOrderMutation(
    successHandler,
    errorHandler
  );

  const handleCreateOrder = () => {
    if (!location || !location.latitude || !location.longitude) {
      Alert.alert(
        "Location Error",
        "Location (latitude & longitude) is required to create an order."
      );
      return;
    }

    if (cart.length === 0) {
      Alert.alert(
        "Cart Error",
        "Your cart is empty. Please add items before creating an order."
      );
      return;
    }

    const orderItems = cart.map((item) => ({
      _id: item.item._id,
      productId: item.item.productId,
      quantity: item.count,
      price: item.item.price,
    }));

    const orderData = {
      customerId: customer.customerId,
      items: orderItems,
      address: customer.address,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
    };

    setLoading(true); // Set loading to true while creating the order
    createOrderMutation.reset();
    createOrderMutation.mutateAsync(orderData);
  };

  const handleCreatePdf = async () => {
    setLoading(true);
    try {
      if (!orderId) {
        Toast.show({
          type: "error",
          text1: "Order ID not available to create PDF.",
        });
        return;
      }

      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Toast.show({ type: "error", text1: "Permission denied to save PDF." });
        return;
      }

      const url = `/orderpdf/${orderId}`;
      const response = await appAxios.get(url);

      const orderData = response.data.order;

      const filePath = await generatePDF(orderData);
      const destinationPath = `${RNFS.DownloadDirectoryPath}/order-${orderData.orderId}-summary.pdf`;

      if (Platform.OS === "android") {
        Toast.show({
          type: "success",
          text1: `PDF saved to ${destinationPath}`,
          visibilityTime: 15000,
        });
        setLoading(false);
      } else {
        Alert.alert("PDF Saved", `PDF has been saved to ${destinationPath}`);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Failed to create PDF.",
        // text2: error.message,
      });
      setLoading(false);
    }
  };

  return (
    <CustomSafeAreaView>
      <View style={styles.container}>
        <Header title={customer.name} />

        <View style={styles.customerInfoContainer}>
          <Text style={styles.customerId}>
            Customer ID: {customer.customerId}
          </Text>
          <View style={styles.addressContainer}>
            <Text style={styles.addressTitle}>Address:</Text>
            <Text style={styles.addressText}>{customer.address.street}</Text>
            <Text style={styles.addressText}>
              {customer.address.city}, {customer.address.state}
            </Text>
            <Text style={styles.addressText}>{customer.address.zipCode}</Text>
          </View>
        </View>

        <Text style={styles.title}>Cart Items</Text>

        {seqId && (
          <View style={styles.totalContainer}>
            <Text
              style={{ color: "#28a745", fontSize: 20, fontWeight: "bold" }}
            >
              Created Order NO: {seqId}
            </Text>
          </View>
        )}

        <CollapsibleContainer style={styles.panelContainer}>
          <CollapsibleScrollView
            nestedScrollEnabled
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
            style={[styles.contentContainer, { flex: 1, paddingBottom: 20 }]}
            showsVerticalScrollIndicator={false}
          >
            <CustomSafeAreaView>
              {!orderId && cart.length > 0 ? (
                <CartItem products={cart} />
              ) : (
                <Text style={styles.emptyText}>Your cart is empty.</Text>
              )}

              {orderId ? (
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    { backgroundColor: "#FF2929" },
                    loading && styles.submitButtonActive,
                  ]}
                  onPress={handleCreatePdf}
                  // disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="large" color="#00ff00" />
                  ) : (
                    <Text style={styles.submitButtonText}>Create PDF</Text>
                  )}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    loading && styles.submitButtonActive,
                  ]}
                  onPress={handleCreateOrder}
                  // disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="large" color="#00ff00" />
                  ) : (
                    <Text style={styles.submitButtonText}>Create Order</Text>
                  )}
                </TouchableOpacity>
              )}
            </CustomSafeAreaView>
          </CollapsibleScrollView>
        </CollapsibleContainer>
      </View>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  panelContainer: {
    flex: 1,
    // paddingRight: 10,
  },
  container: {
    flex: 1, // Make sure the main container takes up the full available height
    paddingHorizontal: 5,
    backgroundColor: "#fff",
  },
  contentContainer: {
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  customerInfoContainer: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  customerId: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 0,
    color: "#333",
  },
  addressContainer: {
    marginTop: 10,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
  addressText: {
    fontSize: 14,
    color: "#333",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  centeredContainer: {
    alignItems: "center",
    width: "100%",
    flex: 1, // Ensure the container takes the full height of the screen
  },
  tableContainer: {
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    padding: 18,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    minWidth: 100,
    maxHeight: 300,
    width: "100%",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  cell: {
    flex: 1,
    textAlign: "center", // Centering the text in each cell
    fontSize: 14,
    color: "#333",
  },
  headerCell: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: 16,
  },
  totalContainer: {
    marginTop: 10,
    padding: 12,
    backgroundColor: "#f9f9f9",
    width: "100%",
    alignItems: "center",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  submitButton: {
    padding: 16,
    marginHorizontal: 50,
    backgroundColor: "#28a745",
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  submitButtonActive: {
    backgroundColor: "#6c757d",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    color: "#aaa",
    marginTop: 20,
  },
});

export default withCollapsibleContext(Cart);
