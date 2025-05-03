import { useEffect } from 'react';
import { useState } from 'react';
import * as Linking from 'expo-linking';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { CanisterManager } from 'canister-manager';
import { DFX_NETWORK, LOCAL_IP_ADDRESS, CANISTER_ID_ISSUER } from '@/constants';
import * as WebBrowser from 'expo-web-browser';

export const useIssuer = () => {
  const url = Linking.useURL();
  const router = useRouter();

  useEffect(() => {
    if (url) {
      console.log('IssueScreen received url', url);
      const fragment = url.split('#')[1];
      const params = new URLSearchParams(fragment);
      const userId = params.get('user-id');
      console.log('IssueScreen received userId', userId);
      if (userId) {
        if (Platform.OS === 'ios') {
          WebBrowser.dismissBrowser();
        } else if (Platform.OS === 'android') {
          router.replace('/');
          setTimeout(() => {
            router.push('/(tabs)/issue');
          }, 100);
        }
      }
    }
  }, [url]);

  const issue = async () => {
    const canisterManager = new CanisterManager({
      dfxNetwork: DFX_NETWORK,
      localIPAddress: LOCAL_IP_ADDRESS,
    });
    const issuerURL = new URL(
      canisterManager.getFrontendCanisterURL(CANISTER_ID_ISSUER),
    );
    const deepLink = Linking.createURL('/');
    console.log('deepLink', deepLink);
    issuerURL.searchParams.set('deep-link', deepLink);

    await WebBrowser.openBrowserAsync(issuerURL.toString(), {
      windowName: '_self',
    });

    // if (Platform.OS === 'web') {
    //   await Linking.openURL(issuerURL.toString());
    // } else {
    //   await WebBrowser.openBrowserAsync(issuerURL.toString(), {
    //     dismissButtonStyle: 'close',
    //   });
    // }
  };

  return { issue };
};
