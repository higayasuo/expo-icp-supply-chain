import { DeliveriesStorage } from './DeliveriesStorage';
import { Storage } from 'expo-storage-universal';

const key = 'up-to-middle-deliveries';

export class UpToMiddleDeliveriesStorage extends DeliveriesStorage {
  constructor(storage: Storage) {
    super(storage, key);
  }
}
