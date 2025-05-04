import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function MiddlestreamScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesome
          name="truck"
          size={32}
          color="#007AFF"
          style={styles.icon}
        />
        <Text style={styles.title}>Middlestream Operations</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.description}>
          Manage your logistics and distribution processes
        </Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Transportation Management</Text>
          <Text style={styles.cardDescription}>
            Track shipments, manage routes, and monitor delivery status
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Warehouse Operations</Text>
          <Text style={styles.cardDescription}>
            Manage inventory, storage, and distribution centers
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F8F8',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  icon: {
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
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
