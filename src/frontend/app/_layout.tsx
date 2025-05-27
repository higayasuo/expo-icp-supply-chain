import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useMemo } from 'react';
import 'react-native-reanimated';
import { useIIIntegration, IIIntegrationProvider } from 'expo-ii-integration';
import { buildAppConnectionURL } from 'expo-icp-app-connect-helpers';
import { getDeepLinkType } from 'expo-icp-frontend-helpers';
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
import { secureStorage, regularStorage, roleStorage } from '@/storage';
import { cryptoModule } from '@/crypto';
export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'login',
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
  const iiIntegrationUrl = buildAppConnectionURL({
    dfxNetwork: DFX_NETWORK,
    localIPAddress: LOCAL_IP_ADDRESS,
    targetCanisterId: CANISTER_ID_II_INTEGRATION,
  });
  const deepLinkType = getDeepLinkType({
    deepLink,
    frontendCanisterId: CANISTER_ID_FRONTEND,
    easDeepLinkType: process.env.EXPO_PUBLIC_EAS_DEEP_LINK_TYPE,
  });
  const iiIntegration = useIIIntegration({
    iiIntegrationUrl,
    deepLinkType,
    secureStorage,
    regularStorage,
    cryptoModule,
  });

  const router = useRouter();

  const { authError, isAuthReady, isAuthenticated } = iiIntegration;
  const { showError } = useError();

  useEffect(() => {
    if (authError) {
      showError(authError);
    }
  }, [authError, showError]);

  useEffect(() => {
    if (isAuthReady) {
      if (isAuthenticated) {
        const moveTo = async () => {
          const role = await roleStorage.find();
          if (role === 'upstream') {
            router.replace('/upstream');
          } else if (role === 'middlestream') {
            router.replace('/middlestream');
          } else if (role === 'downstream') {
            router.replace('/downstream');
          } else if (role === 'admin') {
            router.replace('/admin');
          } else {
            router.replace('/login');
          }
        };
        moveTo();
      } else {
        router.replace('/login');
      }
    }
  }, [isAuthReady, router, isAuthenticated]);

  // Memoize the main content view to prevent recreation on each render
  const mainContentView = useMemo(
    () => (
      <IIIntegrationProvider value={iiIntegration}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName="login"
        >
          <Stack.Screen name="login" />
          <Stack.Screen name="upstream/index" />
          <Stack.Screen name="middlestream/index" />
          <Stack.Screen name="downstream/index" />
          <Stack.Screen name="admin/index" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </IIIntegrationProvider>
    ),
    [iiIntegration],
  );

  if (!isAuthReady) {
    return <LoadingView />;
  }

  return mainContentView;
}

const LoadingView = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
};
