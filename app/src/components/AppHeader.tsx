import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Colors, Typography } from '../constants/theme';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: {
    text?: string;
    icon?: string;
    onPress: () => void;
  };
  darkTheme?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  showBack,
  onBack,
  rightAction,
  darkTheme = false,
}) => {
  return (
    <SafeAreaView style={[styles.safeArea, darkTheme && styles.safeAreaDark]}>
      <StatusBar barStyle={darkTheme ? 'light-content' : 'dark-content'} />
      <View style={[styles.header, darkTheme && styles.headerDark]}>
        <View style={styles.leftContainer}>
          {showBack && (
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Text style={[styles.backArrow, darkTheme && styles.textWhite]}>‹</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.titleContainer}>
          <Text style={[styles.title, darkTheme && styles.textWhite]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.subtitle, darkTheme && styles.subtitleDark]}>
              {subtitle}
            </Text>
          )}
        </View>

        <View style={styles.rightContainer}>
          {rightAction && (
            <TouchableOpacity onPress={rightAction.onPress} style={styles.rightBtn}>
              <Text style={[styles.rightText, darkTheme && styles.textWhite]}>
                {rightAction.icon || rightAction.text}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.white,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  safeAreaDark: {
    backgroundColor: Colors.darkBg,
  },
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  headerDark: {
    backgroundColor: Colors.darkBg,
    borderBottomColor: '#252536',
  },
  leftContainer: {
    width: 60,
    alignItems: 'flex-start',
  },
  backButton: {
    padding: 4,
  },
  backArrow: {
    fontSize: 28,
    color: Colors.textPrimary,
    lineHeight: 28,
    fontWeight: '300',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  subtitleDark: {
    color: '#8A8A9E',
  },
  rightContainer: {
    width: 60,
    alignItems: 'flex-end',
  },
  rightBtn: {
    padding: 6,
  },
  rightText: {
    fontSize: Typography.fontSize.base,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  textWhite: {
    color: Colors.white,
  },
});
