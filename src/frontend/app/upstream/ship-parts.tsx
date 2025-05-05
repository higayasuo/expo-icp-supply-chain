import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LogOut } from '@/components/LogOut';
import { Delivery } from '@/types';
import { upToMiddleDeliveriesStorage } from '@/storage';

export default function DeliveriesScreen() {
  const [currentPartNumber, setCurrentPartNumber] = useState('');
  const [currentQuantity, setCurrentQuantity] = useState('');
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);

  useEffect(() => {
    const fetchDeliveries = async () => {
      const deliveries = await upToMiddleDeliveriesStorage.find();
      if (deliveries) {
        setDeliveries(deliveries);
      }
    };
    fetchDeliveries();
  }, []);

  const handleCreateDelivery = async () => {
    if (!currentPartNumber || !currentQuantity) return;

    const newDelivery: Delivery = {
      id: Date.now().toString(),
      part: {
        partNumber: currentPartNumber,
        quantity: parseInt(currentQuantity),
      },
      status: 'in-transit',
      from: 'upstream',
      to: 'middlestream',
      timestamp: new Date().toISOString(),
    };

    await upToMiddleDeliveriesStorage.addDelivery(newDelivery);
    setDeliveries([newDelivery, ...deliveries]);
    setCurrentPartNumber('');
    setCurrentQuantity('');
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
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace('/upstream')}
        >
          <FontAwesome name="arrow-left" size={24} color="#007AFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Ship Parts</Text>
        </View>
        <View style={styles.logoutContainer}>
          <LogOut />
        </View>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ship Parts</Text>
          <View style={styles.form}>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, styles.inputPartNumber]}
                placeholder="Part Number"
                placeholderTextColor="#999"
                value={currentPartNumber}
                onChangeText={setCurrentPartNumber}
              />
              <TextInput
                style={[styles.input, styles.inputQuantity]}
                placeholder="Quantity"
                placeholderTextColor="#999"
                value={currentQuantity}
                onChangeText={setCurrentQuantity}
                keyboardType="numeric"
              />
            </View>
            <TouchableOpacity
              style={[
                styles.button,
                (!currentPartNumber || !currentQuantity) &&
                  styles.buttonDisabled,
              ]}
              onPress={handleCreateDelivery}
              disabled={!currentPartNumber || !currentQuantity}
            >
              <Text style={styles.buttonText}>Ship Parts</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Shipments</Text>
          {deliveries.length === 0 ? (
            <Text style={styles.emptyText}>No deliveries yet</Text>
          ) : (
            deliveries.map((delivery) => (
              <View key={delivery.id} style={styles.deliveryCard}>
                <View style={styles.deliveryHeader}>
                  <Text style={styles.deliveryTitle}>
                    Delivery #{delivery.id}
                  </Text>
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
                <View style={styles.partItem}>
                  <Text style={styles.partText}>
                    {delivery.part.partNumber} x {delivery.part.quantity}
                  </Text>
                </View>
                <Text style={styles.deliveryInfo}>
                  Created: {new Date(delivery.timestamp).toLocaleString()}
                </Text>
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
  form: {
    gap: 12,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputPartNumber: {
    flex: 2,
  },
  inputQuantity: {
    flex: 1,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#E5E5E5',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  },
  deliveryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  logoutContainer: {
    marginLeft: 'auto',
  },
});
