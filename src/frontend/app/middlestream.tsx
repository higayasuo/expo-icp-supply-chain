import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RoleHeader } from '@/components/RoleHeader';

export default function MiddlestreamScreen() {
  return (
    <View style={styles.container}>
      <RoleHeader title="Middlestream Operations" iconName="truck" />
      <View style={styles.content}>
        <Text style={styles.description}>
          Manage your logistics and distribution processes
        </Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Transportation Management</Text>
          <Text style={styles.cardDescription}>
            Track and manage shipments, routes, and delivery schedules
          </Text>
        </View>
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
