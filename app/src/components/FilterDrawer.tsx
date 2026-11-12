import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ModalContainer } from './ModalContainer';
import { Colors, Typography, Layout } from '../constants/theme';

interface FilterDrawerProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: { gender: string; distance: string; verifiedOnly: boolean; onlineOnly: boolean }) => void;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({ visible, onClose, onApply }) => {
  const [gender, setGender] = useState('ALL'); // ALL, MALE, FEMALE
  const [distance, setDistance] = useState('10km');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [onlineOnly, setOnlineOnly] = useState(true);

  const handleApply = () => {
    onApply({ gender, distance, verifiedOnly, onlineOnly });
    onClose();
  };

  const handleReset = () => {
    setGender('ALL');
    setDistance('10km');
    setVerifiedOnly(false);
    setOnlineOnly(false);
  };

  return (
    <ModalContainer visible={visible} onClose={onClose} title="邂逅条件筛选" height={420}>
      <View style={styles.container}>
        {/* 性别选择 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>性别筛选</Text>
          <View style={styles.optionsRow}>
            {[
              { id: 'ALL', label: '全部' },
              { id: 'MALE', label: '只看男生 ♂' },
              { id: 'FEMALE', label: '只看女生 ♀' },
            ].map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => setGender(item.id)}
                style={[styles.pill, gender === item.id && styles.pillActive]}
              >
                <Text style={[styles.pillText, gender === item.id && styles.pillTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 距离范围 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>距离范围</Text>
          <View style={styles.optionsRow}>
            {['5km 内', '10km 内', '同城优先', '不限'].map((dist) => (
              <TouchableOpacity
                key={dist}
                onPress={() => setDistance(dist)}
                style={[styles.pill, distance === dist && styles.pillActive]}
              >
                <Text style={[styles.pillText, distance === dist && styles.pillTextActive]}>
                  {dist}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 高级特权过滤 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>精准定位</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.checkBtn, verifiedOnly && styles.checkBtnActive]}
              onPress={() => setVerifiedOnly(!verifiedOnly)}
            >
              <Text style={styles.checkIcon}>{verifiedOnly ? '☑' : '☐'}</Text>
              <Text style={styles.checkText}>已通过真人核身认证 (蓝V)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.checkBtn, onlineOnly && styles.checkBtnActive]}
              onPress={() => setOnlineOnly(!onlineOnly)}
            >
              <Text style={styles.checkIcon}>{onlineOnly ? '☑' : '☐'}</Text>
              <Text style={styles.checkText}>当前在线优先展示</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 底部按钮 */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
            <Text style={styles.resetText}>重置</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
            <Text style={styles.applyText}>确定筛选</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ModalContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Layout.radius.full,
    backgroundColor: Colors.background,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  pillActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  pillText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  pillTextActive: {
    color: Colors.primaryDark,
    fontWeight: 'bold',
  },
  toggleRow: {
    marginTop: 4,
  },
  checkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  checkBtnActive: {},
  checkIcon: {
    fontSize: 18,
    color: Colors.primary,
    marginRight: 8,
  },
  checkText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textPrimary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 0.5,
    borderTopColor: Colors.divider,
  },
  resetBtn: {
    width: '32%',
    height: 44,
    borderRadius: Layout.radius.full,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetText: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
  },
  applyBtn: {
    width: '64%',
    height: 44,
    borderRadius: Layout.radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: {
    color: Colors.white,
    fontSize: Typography.fontSize.base,
    fontWeight: 'bold',
  },
});
