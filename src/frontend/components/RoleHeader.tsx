import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LogOut } from './LogOut';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type RoleHeaderProps = {
  title: string;
  iconName: React.ComponentProps<typeof FontAwesome>['name'];
  centerTitle?: boolean;
  onBack?: () => void;
};

export const RoleHeader = ({
  title,
  iconName,
  centerTitle = false,
  onBack,
}: RoleHeaderProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={24} color="#007AFF" />
        </TouchableOpacity>
      ) : (
        <FontAwesome
          name={iconName}
          size={32}
          color="#007AFF"
          style={styles.icon}
        />
      )}
      <View
        style={[
          styles.titleContainer,
          centerTitle && styles.titleContainerCentered,
        ]}
      >
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.logoutContainer}>
        <LogOut />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F8F8',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    marginRight: 12,
  },
  icon: {
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  titleContainerCentered: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  logoutContainer: {
    marginLeft: 'auto',
  },
});
