import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LogIn } from './LogIn';

export const LoginModal = () => {
  return (
    <>
      <View style={styles.overlay} />
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
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9998,
  },
  container: {
    position: 'absolute',
    top: '30%',
    left: 20,
    right: 20,
    zIndex: 9999,
  },
  content: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
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
