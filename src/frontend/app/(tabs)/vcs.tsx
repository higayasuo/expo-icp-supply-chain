import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function VCsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Verifiable Credentials</Text>
      <Text style={styles.description}>
        View and manage your issued Verifiable Credentials
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
  },
});
