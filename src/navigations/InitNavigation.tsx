import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeNavigation from './HomeNavigation';
import CustomHeader from '../components/base/customHeader';
import { CustomHeaderProvider } from '../lib/contexts/CustomHeaderContext';

export type InitNavigation = {
  HomeScreen: undefined;
};

const Stack = createStackNavigator<InitNavigation>();

function InitNavigation() {
  return (
    <CustomHeaderProvider>
      <Stack.Navigator
        mode="modal"
        initialRouteName="HomeScreen"
        screenOptions={{ headerTitleAlign: 'center' }}>
        <Stack.Screen
          name="HomeScreen"
          component={HomeNavigation}
          options={{ header: () => <CustomHeader /> }}
        />
      </Stack.Navigator>
    </CustomHeaderProvider>
  );
}

export default InitNavigation;
