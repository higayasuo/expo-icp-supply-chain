import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DeliveriesStorage } from '../DeliveriesStorage';
import { Delivery, DeliveryStatus } from '@/types';
import { Storage } from 'expo-storage-universal';

describe('UpstreamToMiddleDeliveries', () => {
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

  it('should add a new delivery', async () => {
    vi.mocked(storage.find).mockResolvedValueOnce(undefined);
    await deliveries.addDelivery(mockDelivery);
    expect(storage.save).toHaveBeenCalledWith(
      'deliveries',
      JSON.stringify([mockDelivery]),
    );
  });

  it('should update an existing delivery', async () => {
    const existingDeliveries = [mockDelivery];
    vi.mocked(storage.find).mockResolvedValueOnce(
      JSON.stringify(existingDeliveries),
    );

    const updatedDelivery = {
      ...mockDelivery,
      status: 'received' as DeliveryStatus,
    };

    await deliveries.updateDelivery(updatedDelivery);
    expect(storage.save).toHaveBeenCalledWith(
      'deliveries',
      JSON.stringify([updatedDelivery]),
    );
  });

  it('should throw an error when updating a non-existent delivery', async () => {
    const existingDeliveries = [mockDelivery];
    vi.mocked(storage.find).mockResolvedValueOnce(
      JSON.stringify(existingDeliveries),
    );

    const nonExistentDelivery = {
      ...mockDelivery,
      id: '2',
    };

    await expect(
      deliveries.updateDelivery(nonExistentDelivery),
    ).rejects.toThrow('Delivery not found');
  });

  it('should get deliveries by status', async () => {
    const testDeliveries = [
      mockDelivery,
      {
        ...mockDelivery,
        id: '2',
        status: 'received' as DeliveryStatus,
      },
    ];
    vi.mocked(storage.find).mockResolvedValueOnce(
      JSON.stringify(testDeliveries),
    );

    const inTransitDeliveries = await deliveries.getDeliveriesByStatus(
      'in-transit',
    );
    expect(inTransitDeliveries).toHaveLength(1);
    expect(inTransitDeliveries[0].status).toBe('in-transit');

    // Mock the storage.find call again for the second status check
    vi.mocked(storage.find).mockResolvedValueOnce(
      JSON.stringify(testDeliveries),
    );
    const receivedDeliveries = await deliveries.getDeliveriesByStatus(
      'received',
    );
    expect(receivedDeliveries).toHaveLength(1);
    expect(receivedDeliveries[0].status).toBe('received');
  });

  it('should return empty array when no deliveries exist', async () => {
    vi.mocked(storage.find).mockResolvedValueOnce(undefined);
    const result = await deliveries.getDeliveriesByStatus('in-transit');
    expect(result).toEqual([]);
  });
});
