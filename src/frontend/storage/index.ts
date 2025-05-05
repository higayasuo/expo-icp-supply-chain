import { Platform } from 'react-native';
import {
  WebSecureStorage,
  WebRegularStorage,
} from 'expo-storage-universal-web';
import {
  NativeSecureStorage,
  NativeRegularStorage,
} from 'expo-storage-universal-native';
import { StringValueStorageWrapper } from 'expo-storage-universal';
import { UpToMiddleDeliveriesStorage } from './UpToMiddleDeliveriesStorage';

export const secureStorage =
  Platform.OS === 'web' ? new WebSecureStorage() : new NativeSecureStorage();

export const regularStorage =
  Platform.OS === 'web' ? new WebRegularStorage() : new NativeRegularStorage();

export const roleStorage = new StringValueStorageWrapper(
  regularStorage,
  'role',
);

export const upToMiddleDeliveriesStorage = new UpToMiddleDeliveriesStorage(
  regularStorage,
);
