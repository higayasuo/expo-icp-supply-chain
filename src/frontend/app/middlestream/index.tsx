import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RoleHeader } from '@/components/RoleHeader';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function MiddlestreamScreen() {
  return (
    <View style={styles.container}>
      <RoleHeader
        title="Middlestream Operations"
        iconName="truck"
        centerTitle
      />
      <View style={styles.content}>
        <Text style={styles.description}>
          Manage your logistics and distribution processes
        </Text>
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/middlestream/receive-deliveries')}
        >
          <View style={styles.cardHeader}>
            <FontAwesome name="truck" size={24} color="#007AFF" />
            <Text style={styles.cardTitle}>Receive Deliveries</Text>
          </View>
          <Text style={styles.cardDescription}>
            View and manage incoming deliveries from upstream
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/middlestream/ship-parts')}
        >
          <View style={styles.cardHeader}>
            <FontAwesome name="shopping-cart" size={24} color="#007AFF" />
            <Text style={styles.cardTitle}>Ship Parts</Text>
          </View>
          <Text style={styles.cardDescription}>
            Create new deliveries to downstream
          </Text>
        </TouchableOpacity>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Warehouse Operations</Text>
          <Text style={styles.cardDescription}>
            Monitor inventory levels and manage warehouse activities
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Supply Chain Coordination</Text>
          <Text style={styles.cardDescription}>
            Coordinate with upstream and downstream partners
          </Text>
        </View>
      </View>
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
    padding: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
  },
});
