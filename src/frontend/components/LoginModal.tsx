import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LogIn } from './LogIn';

export const LoginModal = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.message}>
          This Wallet requires login to use its features.
        </Text>
        <View style={styles.buttonContainer}>
          <LogIn redirectPath="/issue" />
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
  message: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
});
