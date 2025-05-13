import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  DeliveriesStorage,
  compareDeliveriesById,
  filterDeliveriesByStatus,
} from '../DeliveriesStorage';
import { Delivery, DeliveryStatus } from '@/types';
import { Storage } from 'expo-storage-universal';

describe('DeliveriesStorage', () => {
  let storage: Storage;
  let deliveries: DeliveriesStorage;
  let mockDelivery: Delivery;

  beforeEach(() => {
    storage = {
      find: vi.fn(),
      save: vi.fn(),
      remove: vi.fn(),
    } as unknown as Storage;
    deliveries = new DeliveriesStorage(storage, 'deliveries');
    mockDelivery = {
      id: '1',
      part: { partNumber: 'P001', quantity: 10 },
      status: 'in-transit',
      from: 'upstream',
      to: 'middlestream',
      timestamp: new Date().toISOString(),
    };
  });

  it('should compare deliveries by id', () => {
    const deliveryA = { ...mockDelivery, id: 'A' };
    const deliveryB = { ...mockDelivery, id: 'B' };
    expect(compareDeliveriesById(deliveryA, deliveryB)).toBe(-1);
    expect(compareDeliveriesById(deliveryB, deliveryA)).toBe(1);
    expect(compareDeliveriesById(deliveryA, deliveryA)).toBe(0);
  });

  it('should filter deliveries by status', () => {
    const filterByInTransit = filterDeliveriesByStatus('in-transit');
    expect(filterByInTransit(mockDelivery)).toBe(true);

    const receivedDelivery = {
      ...mockDelivery,
      status: 'received' as DeliveryStatus,
    };
    expect(filterByInTransit(receivedDelivery)).toBe(false);
  });

  it('should update an existing delivery', async () => {
    const existingDelivery = { ...mockDelivery, id: '1' };
    const updatedDelivery = {
      ...existingDelivery,
      status: 'received' as DeliveryStatus,
    };

    // Mock storage.find to return the existing delivery
    vi.mocked(storage.find).mockResolvedValueOnce(
      JSON.stringify([existingDelivery]),
    );

    // Update the delivery
    await deliveries.updateItem(updatedDelivery, compareDeliveriesById);

    // Verify that save was called with the updated delivery
    expect(storage.save).toHaveBeenCalledWith(
      'deliveries',
      JSON.stringify([updatedDelivery]),
    );
  });

  it('should get deliveries by status using getItemsByFilter', async () => {
    const inTransitDelivery = { ...mockDelivery, id: '1' };
    const receivedDelivery = {
      ...mockDelivery,
      id: '2',
      status: 'received' as DeliveryStatus,
    };

    // Mock storage.find to return both deliveries
    vi.mocked(storage.find).mockResolvedValueOnce(
      JSON.stringify([inTransitDelivery, receivedDelivery]),
    );

    // Get in-transit deliveries
    const inTransitDeliveries = await deliveries.getItemsByFilter(
      filterDeliveriesByStatus('in-transit'),
    );

    // Verify that only in-transit deliveries are returned
    expect(inTransitDeliveries).toEqual([inTransitDelivery]);
  });
});
