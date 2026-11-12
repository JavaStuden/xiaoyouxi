import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Layout } from '../constants/theme';

interface PestAlertBannerProps {
  pestCount: number;
  onSprayAll: () => void;
}

export const PestAlertBanner: React.FC<PestAlertBannerProps> = ({ pestCount, onSprayAll }) => {
  const [flashing, setFlashing] = useState(false);

  useEffect(() => {
    if (pestCount > 0) {
      const timer = setInterval(() => {
        setFlashing((prev) => !prev);
      }, 700);
      return () => clearInterval(timer);
    }
  }, [pestCount]);

  if (pestCount <= 0) return null;

  return (
    <View style={[styles.banner, flashing && styles.bannerFlashing]}>
      <View style={styles.leftRow}>
        <Text style={styles.pestBugs}>🐛 🚨</Text>
        <View style={styles.textContainer}>
          <Text style={styles.alertTitle}>警报: 果园中有 {pestCount} 块地遭遇害虫入侵!</Text>
          <Text style={styles.alertSub}>植物已暂停生长，水分正加速流失</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.sprayBtn} onPress={onSprayAll}>
        <Text style={styles.sprayBtnText}>🧴 驱虫药剂</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#FFF1F0',
    borderWidth: 1.5,
    borderColor: Colors.danger,
    borderRadius: Layout.radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Layout.shadow.card,
  },
  bannerFlashing: {
    backgroundColor: '#FFCCC7',
    borderColor: '#CF1322',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pestBugs: {
    fontSize: 22,
    marginRight: 8,
  },
  textContainer: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#CF1322',
  },
  alertSub: {
    fontSize: 10,
    color: '#820014',
    marginTop: 2,
  },
  sprayBtn: {
    backgroundColor: Colors.danger,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Layout.radius.full,
  },
  sprayBtnText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: 'bold',
  },
});
