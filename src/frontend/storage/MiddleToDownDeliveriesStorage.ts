import { DeliveriesStorage } from './DeliveriesStorage';
import { Storage } from 'expo-storage-universal';

const key = 'middle-to-down-deliveries';

export class MiddleToDownDeliveriesStorage extends DeliveriesStorage {
  constructor(storage: Storage) {
    super(storage, key);
  }
}
