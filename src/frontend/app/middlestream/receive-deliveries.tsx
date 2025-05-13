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
import { upToMiddleDeliveriesStorage } from '@/storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { compareDeliveriesById } from '@/storage/DeliveriesStorage';

export default function ReceiveDeliveriesScreen() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  //const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchDeliveries = async () => {
      const deliveries = await upToMiddleDeliveriesStorage.find();
      if (deliveries) {
        setDeliveries(deliveries);
      }
    };
    fetchDeliveries();
  }, []);

  const handleReceiveDelivery = async (delivery: Delivery) => {
    const updatedDelivery = {
      ...delivery,
      status: 'received' as const,
    };
    await upToMiddleDeliveriesStorage.updateItem(
      updatedDelivery,
      compareDeliveriesById,
    );
    setDeliveries(
      deliveries.map((d) => (d.id === delivery.id ? updatedDelivery : d)),
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

  const getOriginalDeliveryInfo = (delivery: Delivery) => {
    if (!delivery.originalDeliveryId) return null;
    return (
      <View style={styles.originalDeliveryInfo}>
        <Text style={styles.originalDeliveryLabel}>Original Delivery:</Text>
        <Text style={styles.originalDeliveryText}>
          #{delivery.originalDeliveryId}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <RoleHeader
        title="Receive Deliveries"
        iconName="truck"
        onBack={() => router.replace('/middlestream')}
        centerTitle
      />
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Incoming Deliveries</Text>
          {deliveries.length === 0 ? (
            <Text style={styles.emptyText}>No deliveries yet</Text>
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
                {getOriginalDeliveryInfo(delivery)}
                <Text style={styles.deliveryInfo}>
                  Created: {new Date(delivery.timestamp).toLocaleString()}
                </Text>
                {delivery.status === 'in-transit' && (
                  <TouchableOpacity
                    style={styles.receiveButton}
                    onPress={() => handleReceiveDelivery(delivery)}
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
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
    marginBottom: 12,
  },
  partText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  deliveryInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  emptyText: {
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 0,
    backgroundColor: '#F8F8F8',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    marginRight: 12,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  logoutContainer: {
    marginLeft: 'auto',
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
  originalDeliveryInfo: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
  },
  originalDeliveryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  originalDeliveryText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  originalPartText: {
    fontSize: 14,
    color: '#666',
  },
});
