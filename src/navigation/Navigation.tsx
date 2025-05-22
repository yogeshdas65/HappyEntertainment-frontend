
import SplashScreen from '../features/auth/SplaceScreen';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useAuthStore} from '../state/authStore';
import {navigationRef} from '../utils/NavigationUtils';
import React, {FC, useEffect} from 'react';
import LoginPage from '../features/auth/LoginPage';


const Stack = createStackNavigator();

const Navigation: FC = () => {
  const {authUser} = useAuthStore();

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="LoginPage"
        screenOptions={{headerShown: false}}>
        
        {/* <Stack.Screen name="SplashScreen" component={SplashScreen} /> */}

        <Stack.Screen
          options={{animation: 'fade'}}
          name="LoginPage"
          component={LoginPage}
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
