import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { RoleHeader } from '@/components/RoleHeader';
import { Delivery } from '@/types';
import { middleToDownDeliveriesStorage } from '@/storage';
import { compareDeliveriesById } from '@/storage/DeliveriesStorage';

export default function ReceiveDeliveriesScreen() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);

  useEffect(() => {
    const fetchDeliveries = async () => {
      const deliveries = await middleToDownDeliveriesStorage.find();
      if (deliveries) {
        setDeliveries(deliveries);
      }
    };
    fetchDeliveries();
  }, []);

  const handleReceiveDelivery = async (deliveryId: string) => {
    const delivery = deliveries.find((d) => d.id === deliveryId);
    if (!delivery) return;

    const updatedDelivery = {
      ...delivery,
      status: 'received' as const,
    };

    await middleToDownDeliveriesStorage.updateItem(updatedDelivery);
    setDeliveries(
      deliveries.map((d) => (d.id === deliveryId ? updatedDelivery : d)),
    );
  };

  const getStatusColor = (status: Delivery['status']) => {
    switch (status) {
      case 'in-transit':
        return '#007AFF';
      case 'received':
        return '#34C759';
      default:
        return '#666';
    }
  };

  return (
    <View style={styles.container}>
      <RoleHeader
        title="Receive Deliveries"
        iconName="truck"
        onBack={() => router.replace('/downstream')}
        centerTitle
      />
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Incoming Deliveries</Text>
          {deliveries.length === 0 ? (
            <Text style={styles.emptyText}>No deliveries available</Text>
          ) : (
            deliveries.map((delivery) => (
              <View key={delivery.id} style={styles.deliveryCard}>
                <View style={styles.deliveryHeader}>
                  <Text style={styles.deliveryTitle}>
                    Delivery #{delivery.id}
                  </Text>
                  <View style={styles.headerRight}>
                    <View style={styles.verifiedContainer}>
                      <FontAwesome
                        name="certificate"
                        size={16}
                        color="#007AFF"
                        style={styles.verifiedIcon}
                      />
                      <Text style={styles.verifiedText}>Verified</Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(delivery.status) },
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {delivery.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.partItem}>
                  <Text style={styles.partText}>
                    {delivery.part.partNumber} x {delivery.part.quantity}
                  </Text>
                </View>
                <Text style={styles.deliveryInfo}>
                  From: {delivery.from} → To: {delivery.to}
                </Text>
                {delivery.part.childParts &&
                  delivery.part.childParts.length > 0 && (
                    <View style={styles.childPartsList}>
                      <Text style={styles.childPartsTitle}>Child Parts:</Text>
                      {delivery.part.childParts.map((part, index) => (
                        <View key={index} style={styles.childPartItem}>
                          <View style={styles.childPartInfo}>
                            <View style={styles.childPartHeader}>
                              <Text style={styles.childPartText}>
                                {part.partNumber} x {part.quantity}
                              </Text>
                              <View style={styles.headerRight}>
                                <View style={styles.verifiedContainer}>
                                  <FontAwesome
                                    name="certificate"
                                    size={14}
                                    color="#007AFF"
                                    style={styles.verifiedIcon}
                                  />
                                  <Text style={styles.verifiedText}>
                                    Verified
                                  </Text>
                                </View>
                              </View>
                            </View>
                            <Text style={styles.proofOfDeliveryText}>
                              From Delivery #{part.proofOfDeliveryId}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                {delivery.status === 'in-transit' && (
                  <TouchableOpacity
                    style={styles.receiveButton}
                    onPress={() => handleReceiveDelivery(delivery.id)}
                  >
                    <Text style={styles.receiveButtonText}>
                      Mark as Received
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  deliveryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
    gap: 8,
  },
  deliveryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    minWidth: '50%',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  verifiedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    flexShrink: 1,
  },
  verifiedIcon: {
    marginRight: 4,
  },
  verifiedText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
    flexShrink: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    flexShrink: 1,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  partItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    padding: 12,
    borderRadius: 8,
  },
  partText: {
    fontSize: 16,
    color: '#333',
  },
  deliveryInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  childPartsList: {
    marginTop: 12,
  },
  childPartsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  childPartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  childPartInfo: {
    flex: 1,
  },
  childPartText: {
    fontSize: 14,
    color: '#333',
  },
  proofOfDeliveryText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  receiveButton: {
    backgroundColor: '#34C759',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  receiveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  childPartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
