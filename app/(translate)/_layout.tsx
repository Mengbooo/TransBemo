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
    marginBottom: 20,
    overflow: 'hidden' ,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10, 
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.55)'
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
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
            ...styles.tabBar
          },
          default: {
            ...styles.tabBar
          }
        }),
        // 设置为 false 以隐藏标签栏文字
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
