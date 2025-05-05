import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RoleHeader } from '@/components/RoleHeader';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function DownstreamScreen() {
  return (
    <View style={styles.container}>
      <RoleHeader title="Downstream" iconName="shopping-cart" centerTitle />
      <View style={styles.content}>
        <Text style={styles.description}>
          Manage your retail and distribution operations
        </Text>
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/downstream/receive-deliveries')}
        >
          <View style={styles.cardHeader}>
            <FontAwesome name="truck" size={24} color="#007AFF" />
            <Text style={styles.cardTitle}>Receive Deliveries</Text>
          </View>
          <Text style={styles.cardDescription}>
            View and manage incoming deliveries from middlestream
          </Text>
        </TouchableOpacity>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Inventory Management</Text>
          <Text style={styles.cardDescription}>
            Track stock levels and manage product availability
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sales Analytics</Text>
          <Text style={styles.cardDescription}>
            Monitor sales performance and customer trends
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Customer Service</Text>
          <Text style={styles.cardDescription}>
            Manage customer inquiries and support requests
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
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    lineHeight: 20,
  },
});
