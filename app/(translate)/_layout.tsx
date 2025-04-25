import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const styles = StyleSheet.create({
  tabBar: {
    marginHorizontal: 20,
    marginBottom: 15,
    marginTop: 10,
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderRadius: 10, 
    borderWidth: 1,
    borderColor: 'white',
  },
});

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            ...styles.tabBar
          },
          default: {
            ...styles.tabBar
          }
        }),
        tabBarShowLabel: false, 
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => <MaterialIcons name="translate" size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="speechTrans"
        options={{
          tabBarIcon: ({ color }) => <FontAwesome name="microphone" size={24} color={ color } />,
        }}
      />
      <Tabs.Screen
        name="imageTrans"
        options={{
          tabBarIcon: ({ color }) => <MaterialIcons name="add-a-photo" size={24} color={ color } />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarIcon: ({ color }) => <MaterialIcons name="history" size={24} color={ color } />,
        }}
      />
    </Tabs>
  );
}
