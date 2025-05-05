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
import { Delivery, Part, ChildPart } from '@/types';
import { upToMiddleDeliveriesStorage } from '@/storage';

export default function ShipPartsScreen() {
  const [currentPartNumber, setCurrentPartNumber] = useState('');
  const [currentQuantity, setCurrentQuantity] = useState('');
  const [childParts, setChildParts] = useState<ChildPart[]>([]);
  const [currentChildPartNumber, setCurrentChildPartNumber] = useState('');
  const [currentChildQuantity, setCurrentChildQuantity] = useState('');
  const [receivedDeliveries, setReceivedDeliveries] = useState<Delivery[]>([]);
  const [selectedProofOfDelivery, setSelectedProofOfDelivery] =
    useState<Delivery | null>(null);

  useEffect(() => {
    const fetchDeliveries = async () => {
      const deliveries = await upToMiddleDeliveriesStorage.find();
      if (deliveries) {
        const received = deliveries.filter((d) => d.status === 'received');
        setReceivedDeliveries(received);
      }
    };
    fetchDeliveries();
  }, []);

  const handleAddChildPart = () => {
    if (
      !currentChildPartNumber ||
      !currentChildQuantity ||
      !selectedProofOfDelivery
    )
      return;

    const newChildPart: ChildPart = {
      partNumber: currentChildPartNumber,
      quantity: parseInt(currentChildQuantity),
      proofOfDeliveryId: selectedProofOfDelivery.id,
    };

    setChildParts([...childParts, newChildPart]);
    setCurrentChildPartNumber('');
    setCurrentChildQuantity('');
    setSelectedProofOfDelivery(null);
  };

  const handleRemoveChildPart = (index: number) => {
    setChildParts(childParts.filter((_, i) => i !== index));
  };

  const handleCreateDelivery = async () => {
    if (!currentPartNumber || !currentQuantity) return;

    const newDelivery: Delivery = {
      id: Date.now().toString(),
      part: {
        partNumber: currentPartNumber,
        quantity: parseInt(currentQuantity),
        childParts: childParts.length > 0 ? childParts : undefined,
      },
      status: 'in-transit',
      from: 'middlestream',
      to: 'downstream',
      timestamp: new Date().toISOString(),
    };

    await upToMiddleDeliveriesStorage.addDelivery(newDelivery);
    setCurrentPartNumber('');
    setCurrentQuantity('');
    setChildParts([]);
  };

  const getRemainingQuantity = (delivery: Delivery) => {
    const usedQuantity = childParts
      .filter((part) => part.proofOfDeliveryId === delivery.id)
      .reduce((sum, part) => sum + part.quantity, 0);
    return delivery.part.quantity - usedQuantity;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace('/middlestream')}
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
          <Text style={styles.sectionTitle}>Create New Delivery</Text>
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

            <View style={styles.childPartsSection}>
              <Text style={styles.sectionSubtitle}>Child Parts</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.input, styles.inputPartNumber]}
                  placeholder="Child Part Number"
                  placeholderTextColor="#999"
                  value={currentChildPartNumber}
                  onChangeText={setCurrentChildPartNumber}
                />
                <TextInput
                  style={[styles.input, styles.inputQuantity]}
                  placeholder="Quantity"
                  placeholderTextColor="#999"
                  value={currentChildQuantity}
                  onChangeText={setCurrentChildQuantity}
                  keyboardType="numeric"
                />
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.addButton,
                    (!currentChildPartNumber ||
                      !currentChildQuantity ||
                      !selectedProofOfDelivery) &&
                      styles.buttonDisabled,
                  ]}
                  onPress={handleAddChildPart}
                  disabled={
                    !currentChildPartNumber ||
                    !currentChildQuantity ||
                    !selectedProofOfDelivery
                  }
                >
                  <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.proofOfDeliverySection}>
                <Text style={styles.proofOfDeliveryLabel}>
                  Select Proof of Delivery
                </Text>
                {receivedDeliveries.length === 0 ? (
                  <Text style={styles.emptyText}>
                    No received deliveries available
                  </Text>
                ) : (
                  receivedDeliveries.map((delivery) => {
                    const remaining = getRemainingQuantity(delivery);
                    return (
                      <TouchableOpacity
                        key={delivery.id}
                        style={[
                          styles.proofOfDeliveryCard,
                          selectedProofOfDelivery?.id === delivery.id &&
                            styles.selectedCard,
                        ]}
                        onPress={() => setSelectedProofOfDelivery(delivery)}
                        disabled={remaining <= 0}
                      >
                        <Text style={styles.proofOfDeliveryTitle}>
                          Delivery #{delivery.id}
                        </Text>
                        <Text style={styles.proofOfDeliveryText}>
                          {delivery.part.partNumber} x {delivery.part.quantity}
                        </Text>
                        <Text style={styles.remainingText}>
                          Remaining: {remaining}
                        </Text>
                      </TouchableOpacity>
                    );
                  })
                )}
              </View>

              {childParts.length > 0 && (
                <View style={styles.childPartsList}>
                  {childParts.map((part, index) => (
                    <View key={index} style={styles.childPartItem}>
                      <View style={styles.childPartInfo}>
                        <Text style={styles.childPartText}>
                          {part.partNumber} x {part.quantity}
                        </Text>
                        <Text style={styles.proofOfDeliveryText}>
                          From Delivery #{part.proofOfDeliveryId}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleRemoveChildPart(index)}
                      >
                        <FontAwesome
                          name="times-circle"
                          size={20}
                          color="#FF3B30"
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
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
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
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
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 60,
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#E5E5E5',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  childPartsSection: {
    marginTop: 16,
  },
  childPartsList: {
    marginTop: 8,
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
  proofOfDeliverySection: {
    marginTop: 16,
  },
  proofOfDeliveryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  proofOfDeliveryCard: {
    backgroundColor: '#F8F8F8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  selectedCard: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F7FF',
  },
  proofOfDeliveryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  proofOfDeliveryText: {
    fontSize: 14,
    color: '#666',
  },
  remainingText: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 4,
  },
  emptyText: {
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
});
