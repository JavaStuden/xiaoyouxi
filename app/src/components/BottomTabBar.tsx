import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Colors, Typography, Layout } from '../constants/theme';
import { useApp } from '../context/AppContext';

export const BottomTabBar: React.FC = () => {
  const { activeTab, setActiveTab, role, conversations } = useApp();

  const totalUnread = conversations.reduce((acc, cur) => acc + cur.unreadCount, 0);

  const tabs = [
    { key: 'garden', label: '花园', icon: '🌱', activeIcon: '🪴' },
    { key: 'encounter', label: '邂逅', icon: '✨', activeIcon: '💖' },
    { key: 'messages', label: '消息', icon: '💬', activeIcon: '💌', badge: totalUnread },
    { key: 'profile', label: '我的', icon: '👤', activeIcon: '🌟' },
  ];

  if (role === 'MERCHANT') {
    tabs.unshift({ key: 'merchant', label: '商户台', icon: '🏪', activeIcon: '🏬' });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabItem}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>{isActive ? tab.activeIcon : tab.icon}</Text>
                {tab.badge && tab.badge > 0 ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{tab.badge}</Text>
                  </View>
                ) : null}
              </View>
              <Text style={[styles.label, isActive && styles.labelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.white,
    borderTopWidth: 0.5,
    borderTopColor: Colors.border,
  },
  tabBar: {
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? 52 : 56,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Colors.white,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconContainer: {
    position: 'relative',
    height: 26,
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: Colors.rose,
    borderRadius: Layout.radius.full,
    paddingHorizontal: 4,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  label: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textTertiary,
    marginTop: 2,
    fontWeight: Typography.fontWeight.regular,
  },
  labelActive: {
    color: Colors.primary,
    fontWeight: Typography.fontWeight.bold,
  },
});
