import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ModalContainer } from './ModalContainer';
import { Colors, Typography, Layout } from '../constants/theme';
import { useApp } from '../context/AppContext';

interface GiftDrawerProps {
  visible: boolean;
  onClose: () => void;
  onSendGift: (gift: { name: string; icon: string; cost: number; count: number }) => void;
}

const GIFTS = [
  { id: 1, name: '初恋红玫瑰', icon: '🌹', cost: 10, desc: '好感度 +10' },
  { id: 2, name: '心动气球', icon: '🎈', cost: 30, desc: '好感度 +35' },
  { id: 3, name: '极速超跑', icon: '🏎️', cost: 98, desc: '全服横幅广播' },
  { id: 4, name: '璀璨皇冠', icon: '👑', cost: 298, desc: '尊贵入场座驾' },
  { id: 5, name: '梦幻仙境城堡', icon: '🏰', cost: 648, desc: '专属全屏梦幻特效' },
];

export const GiftDrawer: React.FC<GiftDrawerProps> = ({ visible, onClose, onSendGift }) => {
  const { user, setActiveTab } = useApp();
  const [selectedGiftId, setSelectedGiftId] = useState(1);
  const [giftCount, setGiftCount] = useState(1);

  const selectedGift = GIFTS.find((g) => g.id === selectedGiftId) || GIFTS[0];
  const totalCost = selectedGift.cost * giftCount;

  const handleSend = () => {
    onSendGift({
      name: selectedGift.name,
      icon: selectedGift.icon,
      cost: totalCost,
      count: giftCount,
    });
    onClose();
  };

  return (
    <ModalContainer visible={visible} onClose={onClose} title="赠送心意礼物" height={440}>
      <View style={styles.container}>
        {/* 顶部余额与充值 */}
        <View style={styles.balanceRow}>
          <Text style={styles.balanceText}>
            当前金币余额: <Text style={styles.coinHighlight}>🪙 {user?.coinBalance.toFixed(2) || '0.00'}</Text>
          </Text>
          <TouchableOpacity
            style={styles.rechargeBtn}
            onPress={() => {
              onClose();
              setActiveTab('profile');
            }}
          >
            <Text style={styles.rechargeText}>+ 充值</Text>
          </TouchableOpacity>
        </View>

        {/* 礼物网格 */}
        <ScrollView contentContainerStyle={styles.giftGrid} showsVerticalScrollIndicator={false}>
          {GIFTS.map((gift) => {
            const isSelected = selectedGiftId === gift.id;
            return (
              <TouchableOpacity
                key={gift.id}
                onPress={() => setSelectedGiftId(gift.id)}
                style={[styles.giftCard, isSelected && styles.giftCardSelected]}
                activeOpacity={0.8}
              >
                <Text style={styles.giftIcon}>{gift.icon}</Text>
                <Text style={styles.giftName}>{gift.name}</Text>
                <Text style={styles.giftCost}>🪙 {gift.cost}</Text>
                <Text style={styles.giftDesc}>{gift.desc}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* 底部数量加减器与赠送按钮 */}
        <View style={styles.footerRow}>
          <View style={styles.countSelector}>
            {[1, 10, 66, 99].map((count) => (
              <TouchableOpacity
                key={count}
                onPress={() => setGiftCount(count)}
                style={[styles.countPill, giftCount === count && styles.countPillActive]}
              >
                <Text style={[styles.countPillText, giftCount === count && styles.countPillTextActive]}>
                  x{count}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendButtonText}>
              赠送 (🪙 {totalCost})
            </Text>
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
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.divider,
    marginBottom: 8,
  },
  balanceText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  coinHighlight: {
    fontWeight: 'bold',
    color: '#D48806',
  },
  rechargeBtn: {
    backgroundColor: '#FFF7E6',
    borderWidth: 1,
    borderColor: '#FFD591',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Layout.radius.full,
  },
  rechargeText: {
    color: '#D48806',
    fontSize: 12,
    fontWeight: 'bold',
  },
  giftGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  giftCard: {
    width: '31%',
    backgroundColor: Colors.background,
    borderRadius: Layout.radius.md,
    padding: 8,
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  giftCardSelected: {
    borderColor: Colors.rose,
    backgroundColor: Colors.roseLight,
  },
  giftIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  giftName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  giftCost: {
    fontSize: 11,
    color: Colors.rose,
    fontWeight: 'bold',
    marginTop: 2,
  },
  giftDesc: {
    fontSize: 9,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: Colors.divider,
  },
  countSelector: {
    flexDirection: 'row',
  },
  countPill: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: Layout.radius.full,
    backgroundColor: Colors.background,
    marginRight: 6,
  },
  countPillActive: {
    backgroundColor: Colors.roseLight,
    borderWidth: 1,
    borderColor: Colors.rose,
  },
  countPillText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  countPillTextActive: {
    color: Colors.rose,
    fontWeight: 'bold',
  },
  sendButton: {
    backgroundColor: Colors.rose,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: Layout.radius.full,
  },
  sendButtonText: {
    color: Colors.white,
    fontSize: Typography.fontSize.sm,
    fontWeight: 'bold',
  },
});
