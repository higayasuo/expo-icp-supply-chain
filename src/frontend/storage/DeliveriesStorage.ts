import { Delivery, DeliveryStatus } from '@/types';
import { JsonValueStorageWrapper, Storage } from 'expo-storage-universal';

export class DeliveriesStorage extends JsonValueStorageWrapper<Delivery[]> {
  constructor(storage: Storage, key: string) {
    super(storage, key);
  }

  async addDelivery(delivery: Delivery) {
    const deliveries = (await this.find()) ?? [];
    deliveries.push(delivery);
    await this.save(deliveries);
  }

  async updateDelivery(delivery: Delivery) {
    const deliveries = (await this.find()) ?? [];
    const index = deliveries.findIndex((d) => d.id === delivery.id);
    if (index !== -1) {
      deliveries[index] = delivery;
    } else {
      throw new Error('Delivery not found');
    }
    await this.save(deliveries);
  }

  async getDeliveriesByStatus(status: DeliveryStatus) {
    const deliveries = (await this.find()) ?? [];
    return deliveries.filter((delivery) => delivery.status === status);
  }
}
