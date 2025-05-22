import React, { FC, useRef, useEffect } from "react";
import {
  Animated as RNAnimated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import { navigate } from "../../utils/NavigationUtils";
import { NoticeHeight, screenHeight } from "../../utils/Scaling";
import LinearGradient from "react-native-linear-gradient";
import CustomSafeAreaView from "../../components/global/CustomSafeAreaView";
import CustomText from "../../components/ui/Customtext";
import Visuals from "../../components/addedCompnents/VisualsSaleOfficer";
import Icon from "react-native-vector-icons/Ionicons";
import NoticeAnimation from "../../components/someComponents/NoticeAnimation";
import Footer from "../../components/ui/Footer";
import { useAuthStore } from "../../state/authStore";

const buttonData = [
  {
    title: "Product List",
    route: "ProductList",
    subtitle: "Product Present",
    color1: "#3fa9f5",
    color2: "#a8d3f7",
    icon: "logo-apple-ar",
  },
  {
    title: "Customer List",
    route: "CustomerList",
    subtitle: "Customers",
    color1: "#d84361",
    color2: "#f3a8b8",
    icon: "people-sharp",
  },
  {
    title: "Order List",
    route: "OrderList",
    subtitle: "Done Orders",
    color1: "#9e58f2",
    color2: "#d7a2f7",
    icon: "reorder-four-sharp",
  },
];
const NOTICE_HEIGHT = -(NoticeHeight + 12);

const SaleOfficerHomePage: FC = () => {
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

  const { authUser , logout } = useAuthStore();

  const renderButton = ({ item }: { item: typeof buttonData[0] }) => (
    <TouchableOpacity onPress={() => navigate(item.route)} activeOpacity={0.8}>
      <LinearGradient
        colors={[item.color1, item.color2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.row}>
          <Icon
            name={item.icon}
            size={40}
            color="#ccc"
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitleText}>{item.subtitle}</Text>
            <View style={styles.statsRow}>
              <Text style={styles.stat}>2342 Popularity</Text>
              <Text style={styles.stat}>4736 Likes</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <NoticeAnimation noticePosition={noticePosition}>
      <CustomSafeAreaView style={styles.container}>
        <Visuals />
        <View style={styles.welcome}>
          <CustomText variant="h1" style={styles.welcomeText}>
            <Text style={[{ color: "#FFE6A9", fontWeight: "bold" }]}>
              Welcome 🤗 {authUser?.name}
            </Text>
          </CustomText>
          <CustomText variant="h5" style={styles.subtitle}>
            Here you go with{" "}
            <Text style={[{ color: "#D91656", fontWeight: "bold" }]}>
              {((authUser?.achieved * 100) / authUser?.target).toFixed(1)} %
            </Text>
          </CustomText>
        </View>

        <FlatList
          data={buttonData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderButton}
          contentContainerStyle={styles.cardContainer}
          ListFooterComponent={<Footer />}
        />
         <View style={styles.logoutContainer}>
                  <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                    <Icon name="log-out-outline" size={24} color="#fff" />
                    <Text style={styles.logoutText}>Logout</Text>
                  </TouchableOpacity>
                </View>
      </CustomSafeAreaView>
    </NoticeAnimation>
  );
};

export default SaleOfficerHomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  welcome: {
    marginTop: screenHeight * 0.2,
    marginBottom: 20,
    paddingHorizontal: 20,
    gap: 10,
  },
  welcomeText: {
    color: "#333",
    fontWeight: "bold",
  },
  subtitle: {
    color: "#555",
  },
  cardContainer: {
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitleText: {
    fontSize: 14,
    color: "#fff",
    marginTop: 5,
  },
  statsRow: {
    flexDirection: "row",
    marginTop: 5,
  },
  stat: {
    color: "#fff",
    fontSize: 12,
    marginRight: 10,
  },
  logoutContainer: {
    alignItems: "center",
    marginBottom: 20, // Ensure spacing at the bottom
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF6347",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 10,
  },
});
