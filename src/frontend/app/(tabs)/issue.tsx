import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DFX_NETWORK, LOCAL_IP_ADDRESS, CANISTER_ID_ISSUER } from '@/constants';
import { CanisterManager } from 'canister-manager';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { useRouter } from 'expo-router';
import { useIssuer } from '@/issuer/useIssuer';

type VCType = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentProps<typeof FontAwesome>['name'];
};

const VC_TYPES: VCType[] = [
  {
    id: 'example',
    title: 'Example VC',
    description: 'A sample Verifiable Credential for demonstration purposes',
    icon: 'certificate',
  },
];

export default function IssueScreen() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const { issue } = useIssuer();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Issue Verifiable Credentials</Text>
      <Text style={styles.description}>
        Select the type of Verifiable Credential you want to issue
      </Text>

      <View style={styles.cardsContainer}>
        {VC_TYPES.map((type) => (
          <Pressable
            key={type.id}
            style={[
              styles.card,
              selectedType === type.id && styles.selectedCard,
            ]}
            onPress={() => {
              setSelectedType(type.id);
              issue();
            }}
          >
            <View style={styles.cardContent}>
              <FontAwesome
                name={type.icon}
                size={24}
                color={selectedType === type.id ? '#007AFF' : '#666'}
                style={styles.cardIcon}
              />
              <View style={styles.cardTextContainer}>
                <Text
                  style={[
                    styles.cardTitle,
                    selectedType === type.id && styles.selectedCardTitle,
                  ]}
                >
                  {type.title}
                </Text>
                <Text style={styles.cardDescription}>{type.description}</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginHorizontal: 16,
    marginBottom: 24,
  },
  cardsContainer: {
    padding: 16,
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
  selectedCard: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F7FF',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  selectedCardTitle: {
    color: '#007AFF',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
