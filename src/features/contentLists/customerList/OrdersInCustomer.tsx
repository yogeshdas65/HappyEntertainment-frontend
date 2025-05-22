import { Colors } from "@utils/Constants";
import { navigate } from "@utils/NavigationUtils";
import React, { FC } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const { height } = Dimensions.get("window");

const OrdersInCustomer: FC<{ data: any }> = ({ data }) => {
  const renderItem = ({ item, index }: any) => {
    return (
      <>
        <TouchableHighlight
          onPress={() =>
            navigate("CustomerOrdersDetails", { singleOrder: item })
          }
          activeOpacity={0.8}
          underlayColor="#f5f5f5"
        >
          <View style={styles.container}>
            {/* Name Section */}
            <View style={styles.container2}>
              <View style={styles.nameContainer}>
                <Text style={styles.seriesNumber}>{index + 1}.</Text>
                <Text>Order No:-</Text>
                <Text style={styles.name}> {item.orderId}</Text>
                {/* <Text>Total: ₹</Text> */}
                <Text style={styles.total}>₹{item.totalAmount}</Text>
              </View>
            </View>
          </View>
        </TouchableHighlight>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderItem}
        numColumns={1}
        contentContainerStyle={styles.content}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    // marginTop: 5 ,

    // justifyContent: "center",
    // alignItems: "center",
    // backgroundColor: "#f5f5f5",
  },
  container2: {
    flex: 1,
    flexDirection: "row",
    // backgroundColor: "#fff",
    justifyContent: "space-between",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    backgroundColor: Colors.backgroundSecondary,
  },
  content: {
    // paddingHorizontal: 10,
    paddingBottom: 20,
    // backgroundColor: Colors.backgroundSecondary,
  },
  nameContainer: {
    flex: 1,
    flexDirection: "row", // Align series number and name horizontally
    alignItems: "center",
    // justifyContent: "space-between"
    // backgroundColor: Colors.backgroundSecondary
  },
  seriesNumber: {
    fontSize: RFValue(14),
    fontWeight: "400",
    marginRight: 5,
    color: Colors.darkGrey,
  },
  name: {
    fontSize: RFValue(15),
    fontWeight: "300",
    color: Colors.blue,
  },
  // Edit Section Styles
  editContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  total: {
    fontSize: RFValue(13),
    fontWeight: "500",
    color: "#399918",
    marginBottom: 0,
    marginLeft: 25,
  },
});

export default OrdersInCustomer;
