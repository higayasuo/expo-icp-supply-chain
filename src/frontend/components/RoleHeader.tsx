import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LogOut } from './LogOut';

type RoleHeaderProps = {
  title: string;
  iconName: React.ComponentProps<typeof FontAwesome>['name'];
  centerTitle?: boolean;
};

export const RoleHeader = ({
  title,
  iconName,
  centerTitle = false,
}: RoleHeaderProps) => {
  return (
    <View style={styles.header}>
      <FontAwesome
        name={iconName}
        size={32}
        color="#007AFF"
        style={styles.icon}
      />
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
