import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { RoleHeader } from '@/components/RoleHeader';
import {
  upToMiddleDeliveriesStorage,
  middleToDownDeliveriesStorage,
} from '@/storage';

export default function AdminPage() {
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleInitialize = async () => {
    setBusy(true);
    setFeedback(null);
    try {
      await upToMiddleDeliveriesStorage.remove();
      await middleToDownDeliveriesStorage.remove();
      setFeedback('System initialized successfully');
    } catch (error) {
      console.error('Failed to initialize:', error);
      setFeedback('Failed to initialize system');
    } finally {
      setBusy(false);
      // Clear feedback after 3 seconds
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  return (
    <View style={styles.container}>
      <RoleHeader title="Admin" iconName="user" centerTitle />
      <View style={styles.content}>
        <Text style={styles.description}>
          Manage and initialize the supply chain system.
        </Text>
        <Pressable
          style={[styles.card, busy && styles.disabled]}
          onPress={handleInitialize}
          disabled={busy}
        >
          <View style={styles.cardHeader}>
            <FontAwesome name="refresh" size={24} color="#007AFF" />
            <Text style={styles.cardTitle}>
              {busy ? 'Initializing...' : 'Initialize System'}
            </Text>
          </View>
          <Text style={styles.cardDescription}>
            Reset and initialize the supply chain system with default settings
          </Text>
        </Pressable>
        {feedback && (
          <View
            style={[
              styles.feedback,
              feedback.includes('Failed')
                ? styles.errorFeedback
                : styles.successFeedback,
            ]}
          >
            <FontAwesome
              name={
                feedback.includes('Failed')
                  ? 'exclamation-circle'
                  : 'check-circle'
              }
              size={16}
              color="#fff"
              style={styles.feedbackIcon}
            />
            <Text style={styles.feedbackText}>{feedback}</Text>
          </View>
        )}
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
  disabled: {
    opacity: 0.5,
  },
  feedback: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  successFeedback: {
    backgroundColor: '#4CAF50',
  },
  errorFeedback: {
    backgroundColor: '#F44336',
  },
  feedbackIcon: {
    marginRight: 8,
  },
  feedbackText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});
