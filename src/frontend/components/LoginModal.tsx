import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { buttonTextStyles } from './styles';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useIIIntegrationContext } from 'expo-ii-integration';
import { roleStorage } from '@/storage';

type SupplyChainRole = 'upstream' | 'middlestream' | 'downstream';

export const LoginModal = () => {
  const [busy, setBusy] = useState(false);
  const { login } = useIIIntegrationContext();

  const handleRoleSelect = async (role: SupplyChainRole) => {
    setBusy(true);
    try {
      await roleStorage.save(role);
      await login({
        redirectPath: `/${role}`,
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Supply Chain Management Login</Text>
        <Text style={styles.message}>
          Please select your role in the supply chain to continue.
        </Text>
        <View style={styles.roleContainer}>
          <Pressable
            style={[styles.roleButton, busy && styles.disabled]}
            onPress={() => handleRoleSelect('upstream')}
            disabled={busy}
          >
            <View style={styles.roleContent}>
              <FontAwesome
                name="industry"
                size={24}
                color="#007AFF"
                style={styles.roleIcon}
              />
              <Text style={styles.roleText}>Upstream</Text>
            </View>
          </Pressable>
          <Pressable
            style={[styles.roleButton, busy && styles.disabled]}
            onPress={() => handleRoleSelect('middlestream')}
            disabled={busy}
          >
            <View style={styles.roleContent}>
              <FontAwesome
                name="truck"
                size={24}
                color="#007AFF"
                style={styles.roleIcon}
              />
              <Text style={styles.roleText}>Middlestream</Text>
            </View>
          </Pressable>
          <Pressable
            style={[styles.roleButton, busy && styles.disabled]}
            onPress={() => handleRoleSelect('downstream')}
            disabled={busy}
          >
            <View style={styles.roleContent}>
              <FontAwesome
                name="shopping-cart"
                size={24}
                color="#007AFF"
                style={styles.roleIcon}
              />
              <Text style={styles.roleText}>Downstream</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    margin: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  roleContainer: {
    width: '100%',
  },
  roleButton: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  roleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleIcon: {
    marginRight: 12,
  },
  roleText: {
    ...buttonTextStyles,
    color: '#333',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});
