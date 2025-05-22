import Logo from '../../assets/images/splash_logo.png';
import CustomText from '../../components/ui/Customtext';
import {refetchUser, refresh_tokens} from '../../service/authService';
import {useAuthStore} from '../../state/authStore';
import {tokenKV, tokenStorage} from '../../state/storage';
import {Fonts} from '../../utils/Constants';
import {screenHeight, screenWidth} from '../../utils/Scaling';
import React, {FC, useEffect, useState} from 'react';
import {
  Alert,
  Animated,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {jwtDecode} from 'jwt-decode';
import {useNavigation} from '@react-navigation/native'; // Added navigation hook
import {resetAndNavigate} from '../../utils/NavigationUtils';

interface DecodedToken {
  exp: number;
}

const SplashScreen: FC = () => {
  const navigation = useNavigation(); // Use navigation hook
  const {authUser, setAuthUser} = useAuthStore();
  console.log('authUser1', authUser);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  console.log('location', location);

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        const auth = await Geolocation.requestAuthorization('whenInUse');
        if (auth === 'denied') {
          Alert.alert(
            'Location Permission',
            'Please enable location services.',
          );
          return false;
        }
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission Denied', 'Location access is required.');
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error('Permission error:', error);
      return false;
    }
  };

  const getLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;

    Geolocation.getCurrentPosition(
      position => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => {
        console.log('Location Error:', error);
        Alert.alert('Error', 'Unable to fetch location. Please try again.');
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const tokenCheck = async () => {
    const accessToken = await tokenKV.getItem('accessToken');
    const refreshToken = await tokenKV.getItem('refreshToken');

    console.log('accessToken', accessToken);
    console.log('refreshToken', refreshToken);
    const authUser = useAuthStore.getState().authUser;
    console.log('authUser', authUser);

    if (!accessToken || !refreshToken) {
      console.error('accessToken & refreshToken is missing');
      resetAndNavigate('HomePage');
      return;
    }

    const currentTime = Date.now() / 1000;

    try {
      const decodedAccessToken = jwtDecode<DecodedToken>(accessToken);
      const decodedRefreshToken = jwtDecode<DecodedToken>(refreshToken);

      if (decodedRefreshToken.exp < currentTime) {
        Alert.alert('Session Expired', 'Please login again');
        resetAndNavigate('HomePage');
        return;
      }

      if (decodedAccessToken.exp < currentTime) {
        await refresh_tokens();
      }

      await refetchUser(setAuthUser);

      console.log('authUser?.role', authUser);

      // resetAndNavigate(
      //   ['ADMIN', 'SALEOFFICER'].includes(authUser?.role)
      //     ? 'MainTabs'
      //     : 'HomePage',
      // );
    } catch (error) {
      console.error('Token Check Error:', error);
      Alert.alert('Error', 'An error occurred during authentication.');
      resetAndNavigate('HomePage');
    }
  };

  // useEffect(() => {
  //   const initialize = async () => {
  //     await getLocation();
  //     await tokenCheck();
  //   };

  //   initialize();
  // }, []);

  return (
    <View style={styles.container}>
      <CustomText
        variant="h1"
        fontFamily={Fonts.Bold}
        style={styles.welcomeText}>
        Welcome To 
      </CustomText>
      <CustomText
        variant="h1"
        fontFamily={Fonts.Bold}
        style={styles.welcomeText}>
         Happy Entertainment
      </CustomText>
      {/* <Animated.Image source={Logo} style={[styles.logoImage]} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FAF9F6',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    color: '#F8890E',
  },
  logoImage: {
    height: screenHeight * 0.7,
    width: screenWidth * 0.7,
    resizeMode: 'contain',
  },
});

export default SplashScreen;
