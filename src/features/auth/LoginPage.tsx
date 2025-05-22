import {
  Alert,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { FC, useEffect, useRef, useState } from "react";
import { Colors, Fonts } from "../../utils/Constants";
import CustomSafeAreaView from "../../components/global/CustomSafeAreaView";
import CustomText from "../../components/ui/Customtext";
import CustomInput from "../../components/ui/CustomInput";
import Icon from "react-native-vector-icons/Ionicons";
import { RFValue } from "react-native-responsive-fontsize";
import CustomButton from "../../components/ui/CustomButton";
import RadioButton from "../../components/ui/RadioButton";
import useKeyboardOffsetHeight from "../../components/ui/useKeyboardOffsetHeight";
import ProductSlider from "../../components/login/ProductsSlider";
import { navigate, resetAndNavigate } from "../../utils/NavigationUtils";
import { Login } from "../../service/authService";
import { useAuthStore } from "../../state/authStore";
import useLoginMutation from "./hooks/useLoginMutation";
import Toast from "react-native-toast-message";

const LoginPage: FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const { authUser } = useAuthStore();
  console.log("Auth User", authUser);

  const keyboardOffsetHeight = useKeyboardOffsetHeight();
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (keyboardOffsetHeight === 0) {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animatedValue, {
        toValue: -keyboardOffsetHeight * 0.01,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [keyboardOffsetHeight]);

  const options = ["ADMIN", "SALEOFFICER"];

  const successHandler = (user: any) => {
    setLoading(false);
    Toast.show({
      type: "success",
      text1: "Login Successful!",
      text2: "Welcome",
      visibilityTime: 3000,
    });
    if (authUser?.role === "ADMIN") {
      resetAndNavigate("MainTabs");
    } else {
      resetAndNavigate("MainTabs");
    }
  };

  const errorHandler = (error: any) => {
    // Show error toast
    Toast.show({
      type: "error", // Change type to 'error' for failure messages
      text1: "Login Failed!", // Title for the error message
      text2: error?.message || "Something went wrong. Please try again.", // Display the error message if available
      visibilityTime: 3000, // Show the toast for 3 seconds
    });

    setLoading(false);
  };

  const loginMutation = useLoginMutation(successHandler, errorHandler);
  const handleAuth = async () => {
    let data = {
      email,
      password,
      role,
    };
    Keyboard.dismiss();
    setLoading(true);
    loginMutation.reset();
    loginMutation.mutateAsync(data);
  };
  return (
    <CustomSafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* <ProductSlider /> */}
        <Animated.ScrollView
          bounces={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.SubContainer}
          style={{ transform: [{ translateY: animatedValue }] }}
        >
          <View style={styles.centeredContent}>
            <CustomText
              variant="h1"
              fontFamily={Fonts.Bold}
              style={styles.welcomeText}
            >
              Welcome
            </CustomText>
            <View style={styles.radioButtonContainer}>
              {options.map((option, index) => (
                <RadioButton
                  key={option}
                  label={option}
                  selected={role === option}
                  onPress={() => setRole(option)}
                />
              ))}
            </View>
            <CustomInput
              onChangeText={setEmail}
              value={email}
              left={
                <Icon
                  name="mail"
                  color="#F8890E"
                  style={{ marginLeft: 10 }}
                  size={RFValue(18)}
                />
              }
              placeholder="Email"
              inputMode="email"
              right={false}
            />
            <CustomInput
              onChangeText={setPassword}
              value={password}
              left={
                <Icon
                  name="key-sharp"
                  color="#F8890E"
                  style={{ marginLeft: 10 }}
                  size={RFValue(18)}
                />
              }
              placeholder="Password"
              secureTextEntry
              right={false}
            />
            <CustomButton
              disabled={email.length === 0 || password.length < 8}
              title="Login"
              onPress={handleAuth}
              loading={loading}
            />
          </View>
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </CustomSafeAreaView>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  welcomeText: {
    color: "#F8890E", // Color for the Welcome text
    backgroundColor: "white",
  },
  centeredContent: {
    alignItems: "center",
    justifyContent: "center",
    width: "90%", // Adjust the width as needed
    backgroundColor: "white",
    borderRadius: 50,
    margin: 10,
    padding: 10,
  },
  radioButtonContainer: {
    flexDirection: "row", // Horizontal alignment for radio buttons
    marginVertical: 10,
    gap: 20,
    backgroundColor: "white",
  },
  text: {
    marginTop: 2,
    marginBottom: 25,
    opacity: 0.8,
  },
  SubContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 20,
  },
  phoneText: {
    marginLeft: 10,
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  logo: {
    height: 50,
    width: 50,
    borderRadius: 20,
    marginVertical: 10,
  },
  footer: {
    borderTopWidth: 0.8,
    borderColor: Colors.border,
    paddingBottom: 10,
    zIndex: 22,
    position: "absolute",
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f8f9fc",
    width: "100%",
  },
  gradient: {
    paddingTop: 60,
    width: "100%",
  },
});

