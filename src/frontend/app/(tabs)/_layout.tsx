import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { LogIn } from '@/components/LogIn';
import { LogOut } from '@/components/LogOut';
import { Platform } from 'react-native';
import { useIIIntegrationContext } from 'expo-ii-integration';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const { isAuthenticated } = useIIIntegrationContext();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        headerRight: () => (isAuthenticated ? <LogOut /> : <LogIn />),
        headerStyle: {
          height: Platform.OS === 'web' ? 60 : 110,
        },
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 24,
          fontWeight: '700',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="issue"
        options={{
          title: 'Issue',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="certificate" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="vcs"
        options={{
          title: 'VCs',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="id-card" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: 'Services',
          tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />,
        }}
      />
    </Tabs>
  );
}
