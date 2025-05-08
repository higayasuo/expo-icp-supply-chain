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
import { RoleHeader } from '@/components/RoleHeader';
import { Delivery, ChildPart } from '@/types';
import {
  upToMiddleDeliveriesStorage,
  middleToDownDeliveriesStorage,
} from '@/storage';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'in-transit':
      return '#007AFF';
    case 'received':
      return '#34C759';
    default:
      return '#666';
  }
};

export default function ShipPartsScreen() {
  const [currentPartNumber, setCurrentPartNumber] = useState('');
  const [currentQuantity, setCurrentQuantity] = useState('');
  const [childParts, setChildParts] = useState<ChildPart[]>([]);
  const [currentChildPartNumber, setCurrentChildPartNumber] = useState('');
  const [currentChildQuantity, setCurrentChildQuantity] = useState('');
  const [receivedDeliveries, setReceivedDeliveries] = useState<Delivery[]>([]);
  const [selectedProofOfDelivery, setSelectedProofOfDelivery] =
    useState<Delivery | null>(null);
  const [shippedDeliveries, setShippedDeliveries] = useState<Delivery[]>([]);

  useEffect(() => {
    const fetchDeliveries = async () => {
      const received = await upToMiddleDeliveriesStorage.getDeliveriesByStatus(
        'received',
      );
      if (received) {
        setReceivedDeliveries(received);
      }
      const shipped = await middleToDownDeliveriesStorage.find();
      if (shipped) {
        setShippedDeliveries(shipped);
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
      status: 'received',
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

    await middleToDownDeliveriesStorage.addDelivery(newDelivery);
    setCurrentPartNumber('');
    setCurrentQuantity('');
    setChildParts([]);
    setShippedDeliveries([...shippedDeliveries, newDelivery]);
  };

  const getRemainingQuantity = (delivery: Delivery) => {
    const usedQuantity = childParts
      .filter((part) => part.proofOfDeliveryId === delivery.id)
      .reduce((sum, part) => sum + part.quantity, 0);
    return delivery.part.quantity - usedQuantity;
  };

  return (
    <View style={styles.container}>
      <RoleHeader
        title="Ship Parts"
        iconName="truck"
        onBack={() => router.replace('/middlestream')}
        centerTitle
      />
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
                        onPress={() => {
                          setSelectedProofOfDelivery(delivery);
                          setCurrentChildPartNumber(delivery.part.partNumber);
                        }}
                        disabled={remaining <= 0}
                      >
                        <View style={styles.proofOfDeliveryHeader}>
                          <Text style={styles.proofOfDeliveryTitle}>
                            Delivery #{delivery.id}
                          </Text>
                          <View style={styles.headerRight}>
                            <View style={styles.verifiedContainer}>
                              <FontAwesome
                                name="certificate"
                                size={14}
                                color="#007AFF"
                                style={styles.verifiedIcon}
                              />
                              <Text style={styles.verifiedText}>Verified</Text>
                            </View>
                          </View>
                        </View>
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

              {selectedProofOfDelivery && (
                <View style={styles.childPartForm}>
                  <View style={styles.inputRow}>
                    <TextInput
                      style={[styles.input, styles.inputPartNumber]}
                      placeholder="Part Number"
                      placeholderTextColor="#999"
                      value={currentChildPartNumber}
                      onChangeText={setCurrentChildPartNumber}
                      editable={false}
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
                        (!currentChildQuantity ||
                          parseInt(currentChildQuantity) <= 0 ||
                          parseInt(currentChildQuantity) >
                            getRemainingQuantity(selectedProofOfDelivery)) &&
                          styles.buttonDisabled,
                      ]}
                      onPress={handleAddChildPart}
                      disabled={
                        !currentChildQuantity ||
                        parseInt(currentChildQuantity) <= 0 ||
                        parseInt(currentChildQuantity) >
                          getRemainingQuantity(selectedProofOfDelivery)
                      }
                    >
                      <Text style={styles.buttonText}>Add</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {childParts.length > 0 && (
                <View style={styles.childPartsList}>
                  {childParts.map((part, index) => (
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
                              <Text style={styles.verifiedText}>Verified</Text>
                            </View>
                          </View>
                        </View>
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipped Parts</Text>
          {shippedDeliveries.length === 0 ? (
            <Text style={styles.emptyText}>No shipped parts yet</Text>
          ) : (
            shippedDeliveries.map((delivery) => (
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
                <Text style={styles.deliveryInfo}>
                  From: {delivery.from} → To: {delivery.to}
                </Text>
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
  proofOfDeliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  proofOfDeliveryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
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
  childPartForm: {
    marginTop: 16,
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
  childPartsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  childPartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
