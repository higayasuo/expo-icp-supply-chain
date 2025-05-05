import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RoleHeader } from '@/components/RoleHeader';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function UpstreamScreen() {
  return (
    <View style={styles.container}>
      <RoleHeader title="Upstream Operations" iconName="industry" centerTitle />
      <View style={styles.content}>
        <Text style={styles.description}>
          Manage your production and manufacturing processes
        </Text>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/upstream/ship-parts')}
        >
          <View style={styles.cardHeader}>
            <FontAwesome name="truck" size={24} color="#007AFF" />
            <Text style={styles.cardTitle}>Ship Parts</Text>
          </View>
          <Text style={styles.cardDescription}>
            Create and manage parts deliveries to middlestream
          </Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Production Dashboard</Text>
          <Text style={styles.cardDescription}>
            Monitor and manage your production lines, inventory, and quality
            control
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Material Tracking</Text>
          <Text style={styles.cardDescription}>
            Track raw materials and components through your supply chain
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quality Assurance</Text>
          <Text style={styles.cardDescription}>
            Manage quality control processes and certifications
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
