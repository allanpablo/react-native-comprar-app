import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

import { Home } from '@/app/Home';
import { History } from '@/app/History';

const { Navigator, Screen } = createBottomTabNavigator();

export function Routes() {
  return (
    <NavigationContainer>
      <Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#2196f3',
          tabBarInactiveTintColor: '#888',
          tabBarStyle: {
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
          },
        }}
      >
        <Screen
          name="home"
          component={Home}
          options={{
            tabBarLabel: 'Lista',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="list-alt" color={color} size={size} />
            ),
          }}
        />
        <Screen
          name="history"
          component={History}
          options={{
            tabBarLabel: 'Histórico',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="history" color={color} size={size} />
            ),
          }}
        />
      </Navigator>
    </NavigationContainer>
  );
}
