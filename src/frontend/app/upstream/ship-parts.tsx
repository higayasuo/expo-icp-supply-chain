import React, { useEffect, useState, useRef } from 'react';
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
import { Delivery, Material } from '@/types';
import { upToMiddleDeliveriesStorage } from '@/storage';

export default function DeliveriesScreen() {
  const [currentPartNumber, setCurrentPartNumber] = useState('');
  const [currentQuantity, setCurrentQuantity] = useState('');
  const [currentMaterialName, setCurrentMaterialName] = useState('');
  const [currentMaterialQuantity, setCurrentMaterialQuantity] = useState('');
  const [currentMaterialUnit, setCurrentMaterialUnit] = useState('g');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const materialNameInputRef = useRef<TextInput>(null);
  const partNumberInputRef = useRef<TextInput>(null);

  useEffect(() => {
    const fetchDeliveries = async () => {
      const deliveries = await upToMiddleDeliveriesStorage.find();
      if (deliveries) {
        setDeliveries(deliveries);
      }
    };
    fetchDeliveries();
  }, []);

  const handleAddMaterial = () => {
    if (!currentMaterialName || !currentMaterialQuantity) return;

    const newMaterial: Material = {
      name: currentMaterialName,
      quantity: parseFloat(currentMaterialQuantity),
      unit: currentMaterialUnit,
    };

    setMaterials([...materials, newMaterial]);
    setCurrentMaterialName('');
    setCurrentMaterialQuantity('');
    materialNameInputRef.current?.focus();
  };

  const handleRemoveMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const handleCreateDelivery = async () => {
    if (!currentPartNumber || !currentQuantity || materials.length === 0)
      return;

    const newDelivery: Delivery = {
      id: Date.now().toString(),
      part: {
        partNumber: currentPartNumber,
        quantity: parseInt(currentQuantity),
      },
      materials: materials,
      status: 'in-transit',
      from: 'upstream',
      to: 'middlestream',
      timestamp: new Date().toISOString(),
    };

    await upToMiddleDeliveriesStorage.addItem(newDelivery);
    setDeliveries([newDelivery, ...deliveries]);
    setCurrentPartNumber('');
    setCurrentQuantity('');
    setMaterials([]);
    partNumberInputRef.current?.focus();
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
        title="Ship Parts"
        iconName="truck"
        onBack={() => router.replace('/upstream')}
        centerTitle
      />
      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ship Parts</Text>
          <View style={styles.form}>
            <View style={styles.inputRow}>
              <TextInput
                ref={partNumberInputRef}
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

            <View style={styles.materialsSection}>
              <Text style={styles.materialsTitle}>Materials</Text>
              <View style={styles.inputRow}>
                <TextInput
                  ref={materialNameInputRef}
                  style={[styles.input, styles.inputMaterialName]}
                  placeholder="Material Name"
                  placeholderTextColor="#999"
                  value={currentMaterialName}
                  onChangeText={setCurrentMaterialName}
                />
                <TextInput
                  style={[styles.input, styles.inputMaterialQuantity]}
                  placeholder="Quantity"
                  placeholderTextColor="#999"
                  value={currentMaterialQuantity}
                  onChangeText={setCurrentMaterialQuantity}
                  keyboardType="numeric"
                />
                <TextInput
                  style={[styles.input, styles.inputMaterialUnit]}
                  placeholder="Unit"
                  placeholderTextColor="#999"
                  value={currentMaterialUnit}
                  onChangeText={setCurrentMaterialUnit}
                />
              </View>
              <TouchableOpacity
                style={[
                  styles.button,
                  (!currentMaterialName || !currentMaterialQuantity) &&
                    styles.buttonDisabled,
                ]}
                onPress={handleAddMaterial}
                disabled={!currentMaterialName || !currentMaterialQuantity}
              >
                <Text style={styles.buttonText}>Add Material</Text>
              </TouchableOpacity>

              {materials.length > 0 && (
                <View style={styles.materialsList}>
                  {materials.map((material, index) => (
                    <View key={index} style={styles.materialItem}>
                      <Text style={styles.materialText}>
                        {material.name} - {material.quantity} {material.unit}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleRemoveMaterial(index)}
                        style={styles.removeButton}
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
                (!currentPartNumber ||
                  !currentQuantity ||
                  materials.length === 0) &&
                  styles.buttonDisabled,
              ]}
              onPress={handleCreateDelivery}
              disabled={
                !currentPartNumber || !currentQuantity || materials.length === 0
              }
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
                {delivery.materials && (
                  <View style={styles.materialsList}>
                    {delivery.materials.map((material, index) => (
                      <View key={index} style={styles.materialItem}>
                        <Text style={styles.materialText}>
                          {material.name} - {material.quantity} {material.unit}
                        </Text>
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
  inputMaterialName: {
    flex: 2,
  },
  inputMaterialQuantity: {
    flex: 1,
  },
  inputMaterialUnit: {
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
  materialsSection: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
  },
  materialsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  materialsList: {
    marginTop: 12,
    gap: 8,
  },
  materialItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  materialText: {
    fontSize: 14,
    color: '#333',
  },
  removeButton: {
    padding: 4,
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
});
