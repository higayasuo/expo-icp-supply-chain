import { Delivery, DeliveryStatus } from '@/types';
import {
  JsonValuesStorageWrapper,
  Storage,
  CompareItem,
  FilterItem,
} from 'expo-storage-universal';

export const compareDeliveriesById: CompareItem<Delivery> = (
  a: Delivery,
  b: Delivery,
): number => {
  return a.id.localeCompare(b.id);
};

export const filterDeliveriesByStatus =
  (status: DeliveryStatus): FilterItem<Delivery> =>
  (item: Delivery): boolean => {
    return item.status === status;
  };

export class DeliveriesStorage extends JsonValuesStorageWrapper<Delivery> {
  constructor(storage: Storage, key: string) {
    super(storage, key);
  }
}
