import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Slot, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useIIIntegration, IIIntegrationProvider } from 'expo-ii-integration';
import { ErrorProvider } from '@/contexts/ErrorContext';
import { View, ActivityIndicator, Platform } from 'react-native';
import * as Linking from 'expo-linking';

import { useError } from '@/contexts/ErrorContext';
import {
  LOCAL_IP_ADDRESS,
  DFX_NETWORK,
  CANISTER_ID_II_INTEGRATION,
  CANISTER_ID_FRONTEND,
} from '@/constants';
import { secureStorage, regularStorage } from '@/storage';
import React from 'react';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return <LoadingView />;
  }

  return (
    <ErrorProvider>
      <RootLayoutNav />
    </ErrorProvider>
  );
}

function RootLayoutNav() {
  const deepLink = Linking.createURL('/');
  const router = useRouter();
  const iiIntegration = useIIIntegration({
    localIPAddress: LOCAL_IP_ADDRESS,
    dfxNetwork: DFX_NETWORK,
    easDeepLinkType: process.env.EXPO_PUBLIC_EAS_DEEP_LINK_TYPE,
    deepLink,
    frontendCanisterId: CANISTER_ID_FRONTEND,
    iiIntegrationCanisterId: CANISTER_ID_II_INTEGRATION,
    secureStorage,
    regularStorage,
  });

  const { authError, isAuthReady, isAuthenticated } = iiIntegration;
  const { showError } = useError();

  useEffect(() => {
    if (authError) {
      showError(authError);
    }
  }, [authError, showError]);

  useEffect(() => {
    if (isAuthReady && !isAuthenticated) {
      console.log('isAuthenticated', isAuthenticated);
      router.replace('/login');
    }
  }, [isAuthReady, isAuthenticated]);

  if (!isAuthReady) {
    return <LoadingView />;
  }

  return (
    <IIIntegrationProvider value={iiIntegration}>
      <Slot />
    </IIIntegrationProvider>
  );
}

const LoadingView = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
};
