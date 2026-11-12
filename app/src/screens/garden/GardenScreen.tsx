import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Colors, Typography, Layout, PlantStages } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { GardenStage } from '../../components/GardenStage';
import { PestAlertBanner } from '../../components/PestAlertBanner';
import { ModalContainer } from '../../components/ModalContainer';
import { GardenLand, BackpackItem } from '../../types';

export const GardenScreen: React.FC = () => {
  const {
    user,
    lands,
    backpack,
    plantSeed,
    waterLand,
    disinfestLand,
    harvestLand,
    upgradeLand,
    purchaseLand,
    buyShopItem,
  } = useApp();

  const [selectedLand, setSelectedLand] = useState<GardenLand | null>(null);

  // 弹窗状态
  const [backpackVisible, setBackpackVisible] = useState(false);
  const [backpackTab, setBackpackTab] = useState<'PROP' | 'BOUQUET'>('PROP');
  const [shopVisible, setShopVisible] = useState(false);
  const [tasksVisible, setTasksVisible] = useState(false);
  const [mailVisible, setMailVisible] = useState(false);
  const [friendsVisible, setFriendsVisible] = useState(false);

  // 统计遭遇害虫的地块数量
  const pestCount = lands.filter((l) => l.hasPest || l.status === 'PEST_INFESTED').length;

  const handleSelectLand = (land: GardenLand) => {
    setSelectedLand(land);
  };

  const handleSprayAllPests = async () => {
    for (const land of lands) {
      if (land.hasPest || land.status === 'PEST_INFESTED') {
        await disinfestLand(land.landIndex);
      }
    }
    Alert.alert('除虫大捷！', '已成功使用强效除虫药剂，果园害虫全数消灭！');
  };

  const handleQuickHarvest = async (land: GardenLand) => {
    const yieldCount = await harvestLand(land.landIndex);
    Alert.alert('收获喜悦 💐', `成功采摘 ${yieldCount} 朵鲜艳玫瑰花，已放入您的花束资产库！`);
    setSelectedLand(null);
  };

  return (
    <View style={styles.container}>
      {/* 顶部果园主资产栏与环境 */}
      <View style={styles.headerBar}>
        <View style={styles.userInfoRow}>
          <Image source={{ uri: user?.avatarUrl }} style={styles.avatar} />
          <View style={styles.userTextInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.nickname}>{user?.nickname}</Text>
              <View style={styles.vipBadge}>
                <Text style={styles.vipText}>
                  {user?.vipLevel === 3 ? '👑 黑金' : user?.vipLevel === 2 ? '⭐ SVIP' : 'VIP'}
                </Text>
              </View>
            </View>
            <Text style={styles.levelText}>生态庄园 Lv.8 | 阳光充沛</Text>
          </View>
        </View>

        {/* 虚拟资产胶囊 */}
        <View style={styles.assetCapsules}>
          <View style={styles.capsule}>
            <Text style={styles.capsuleIcon}>🪙</Text>
            <Text style={styles.capsuleVal}>{user?.coinBalance.toFixed(0)}</Text>
          </View>
          <View style={[styles.capsule, styles.roseCapsule]}>
            <Text style={styles.capsuleIcon}>🌹</Text>
            <Text style={styles.capsuleVal}>{user?.flowerBalance}</Text>
          </View>
        </View>
      </View>

      {/* 快捷功能悬浮入口 (商城、背包、任务、邮件、好友) */}
      <View style={styles.shortcutRow}>
        <TouchableOpacity style={styles.shortcutBtn} onPress={() => setShopVisible(true)}>
          <Text style={styles.shortcutIcon}>🏪</Text>
          <Text style={styles.shortcutLabel}>种子商城</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shortcutBtn} onPress={() => setBackpackVisible(true)}>
          <Text style={styles.shortcutIcon}>🎒</Text>
          <Text style={styles.shortcutLabel}>我的背包</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shortcutBtn} onPress={() => setTasksVisible(true)}>
          <Text style={styles.shortcutIcon}>📋</Text>
          <Text style={styles.shortcutLabel}>每日任务</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shortcutBtn} onPress={() => setMailVisible(true)}>
          <Text style={styles.shortcutIcon}>📬</Text>
          <Text style={styles.shortcutLabel}>果园信箱</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shortcutBtn} onPress={() => setFriendsVisible(true)}>
          <Text style={styles.shortcutIcon}>👥</Text>
          <Text style={styles.shortcutLabel}>好友拜访</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* 害虫警报横幅 */}
        <PestAlertBanner pestCount={pestCount} onSprayAll={handleSprayAllPests} />

        {/* 2.5D 土地主舞台 */}
        <GardenStage
          lands={lands}
          selectedLandIndex={selectedLand?.landIndex || null}
          onSelectLand={handleSelectLand}
          onHarvest={handleQuickHarvest}
          onWater={async (l) => {
            await waterLand(l.landIndex);
            Alert.alert('浇水成功', '土壤水分已补满至 100%');
          }}
          onDisinfest={async (l) => {
            await disinfestLand(l.landIndex);
            Alert.alert('驱虫成功', '害虫已被扑灭！');
          }}
        />

        {/* 底部果园动态播报 */}
        <View style={styles.newsTicker}>
          <Text style={styles.newsIcon}>📢</Text>
          <Text style={styles.newsText} numberOfLines={1}>
            商户 [花之恋旗舰店] 正在同城派发玫瑰鲜花礼盒，成熟鲜花可直接兑换！
          </Text>
        </View>
      </ScrollView>

      {/* 土地选中交互弹窗 */}
      {selectedLand && (
        <ModalContainer
          visible={!!selectedLand}
          onClose={() => setSelectedLand(null)}
          title={`地块 #${selectedLand.landIndex} 详情与操作`}
          height={380}
        >
          <View style={styles.landDetailBox}>
            {selectedLand.status === 'LOCKED' ? (
              <View style={styles.centerAction}>
                <Text style={styles.bigActionIcon}>🔒</Text>
                <Text style={styles.bigActionTitle}>该地块尚未开垦</Text>
                <Text style={styles.bigActionSub}>消耗 300 金币扩充果园面积</Text>
                <TouchableOpacity
                  style={styles.primaryActionButton}
                  onPress={async () => {
                    await purchaseLand(selectedLand.landIndex);
                    setSelectedLand(null);
                  }}
                >
                  <Text style={styles.primaryActionText}>开垦此地块 (🪙 300)</Text>
                </TouchableOpacity>
              </View>
            ) : selectedLand.status === 'EMPTY' ? (
              <View>
                <Text style={styles.subTitle}>选择背包中的花种进行播种：</Text>
                <View style={styles.seedsList}>
                  {backpack
                    .filter((b) => b.itemType === 'SEED')
                    .map((seed) => (
                      <TouchableOpacity
                        key={seed.itemId}
                        style={styles.seedPickItem}
                        onPress={async () => {
                          await plantSeed(selectedLand.landIndex, seed.itemId);
                          setSelectedLand(null);
                        }}
                      >
                        <Text style={styles.seedIcon}>{seed.iconUrl}</Text>
                        <View style={styles.seedInfo}>
                          <Text style={styles.seedName}>{seed.name}</Text>
                          <Text style={styles.seedQty}>存量: {seed.quantity} 袋 | 成熟约 30秒</Text>
                        </View>
                        <Text style={styles.plantActionText}>播种</Text>
                      </TouchableOpacity>
                    ))}
                </View>
              </View>
            ) : (
              <View>
                {/* 种植中信息卡片 */}
                <View style={styles.plantStatusCard}>
                  <Text style={styles.cardPlantTitle}>
                    {selectedLand.plantName || '鲜花'} (
                    {PlantStages.find((s) => s.stage === selectedLand.currentStage)?.name || '生长中'})
                  </Text>
                  <Text style={styles.cardPlantDetail}>
                    土地肥沃等级: {selectedLand.landLevel} 阶 | 水分值: {selectedLand.moistureVal}%
                  </Text>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${(selectedLand.currentStage / 5) * 100}%` },
                      ]}
                    />
                  </View>
                </View>

                {/* 操作按钮组 */}
                <View style={styles.actionButtonGroup}>
                  <TouchableOpacity
                    style={[styles.opBtn, styles.waterOpBtn]}
                    onPress={async () => {
                      await waterLand(selectedLand.landIndex);
                      Alert.alert('浇水成功', '水源已充盈');
                      setSelectedLand(null);
                    }}
                  >
                    <Text style={styles.opBtnText}>💧 浇水</Text>
                  </TouchableOpacity>

                  {selectedLand.hasPest && (
                    <TouchableOpacity
                      style={[styles.opBtn, styles.pestOpBtn]}
                      onPress={async () => {
                        await disinfestLand(selectedLand.landIndex);
                        Alert.alert('除虫成功', '害虫已被彻底消灭');
                        setSelectedLand(null);
                      }}
                    >
                      <Text style={styles.opBtnText}>🧴 驱虫</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={[styles.opBtn, styles.upgradeOpBtn]}
                    onPress={async () => {
                      await upgradeLand(selectedLand.landIndex);
                      Alert.alert('升级成功', '土地肥力提升');
                      setSelectedLand(null);
                    }}
                  >
                    <Text style={styles.opBtnText}>⭐ 肥力升级</Text>
                  </TouchableOpacity>

                  {selectedLand.status === 'MATURE' && (
                    <TouchableOpacity
                      style={[styles.opBtn, styles.harvestOpBtn]}
                      onPress={() => handleQuickHarvest(selectedLand)}
                    >
                      <Text style={styles.opBtnText}>✨ 立即采摘</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
          </View>
        </ModalContainer>
      )}

      {/* 背包弹窗 (道具 / 花束) */}
      <ModalContainer
        visible={backpackVisible}
        onClose={() => setBackpackVisible(false)}
        title="我的背包资产"
        height={480}
      >
        <View style={styles.backpackHeader}>
          <TouchableOpacity
            style={[styles.tabBtn, backpackTab === 'PROP' && styles.tabBtnActive]}
            onPress={() => setBackpackTab('PROP')}
          >
            <Text style={[styles.tabBtnText, backpackTab === 'PROP' && styles.tabBtnTextActive]}>
              功能道具
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, backpackTab === 'BOUQUET' && styles.tabBtnActive]}
            onPress={() => setBackpackTab('BOUQUET')}
          >
            <Text style={[styles.tabBtnText, backpackTab === 'BOUQUET' && styles.tabBtnTextActive]}>
              已收花束
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.backpackList}>
          {backpack
            .filter((item) => (backpackTab === 'PROP' ? item.itemType !== 'BOUQUET' : item.itemType === 'BOUQUET'))
            .map((item) => (
              <View key={item.id} style={styles.backpackItemRow}>
                <Text style={styles.itemEmoji}>{item.iconUrl}</Text>
                <View style={styles.itemCenter}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemDesc}>{item.description}</Text>
                </View>
                <View style={styles.itemRight}>
                  <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                </View>
              </View>
            ))}
        </ScrollView>
      </ModalContainer>

      {/* 商城弹窗 */}
      <ModalContainer
        visible={shopVisible}
        onClose={() => setShopVisible(false)}
        title="果园商城"
        height={460}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {[
            { id: 1, name: '浪漫红玫瑰种子', icon: '🌹', price: 10, desc: '30秒成熟，花朵饱满' },
            { id: 2, name: '金色郁金香种子', icon: '🌷', price: 25, desc: '60秒成熟，高雅珍品' },
            { id: 3, name: '强效除虫药剂', icon: '🧴', price: 15, desc: '瞬间消灭全场害虫' },
            { id: 4, name: '充盈补水壶', icon: '💧', price: 8, desc: '补充土地水分' },
            { id: 5, name: '高效催熟肥', icon: '⚡', price: 30, desc: '加速鲜花绽放' },
          ].map((item) => (
            <View key={item.id} style={styles.shopItemRow}>
              <Text style={styles.shopIcon}>{item.icon}</Text>
              <View style={styles.shopInfo}>
                <Text style={styles.shopName}>{item.name}</Text>
                <Text style={styles.shopDesc}>{item.desc}</Text>
                <Text style={styles.shopPrice}>🪙 {item.price} 金币</Text>
              </View>
              <TouchableOpacity
                style={styles.buyBtn}
                onPress={async () => {
                  await buyShopItem(item.id, 1);
                  Alert.alert('购买成功', `${item.name} 已放入您的背包！`);
                }}
              >
                <Text style={styles.buyText}>购买</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </ModalContainer>

      {/* 每日任务弹窗 */}
      <ModalContainer
        visible={tasksVisible}
        onClose={() => setTasksVisible(false)}
        title="每日与成长任务"
        height={440}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {[
            { title: '每日果园浇水 (1/1)', reward: 20, done: true, claimed: false },
            { title: '扑灭果园害虫 (0/1)', reward: 30, done: false, claimed: false },
            { title: '与花友私信问候 (1/1)', reward: 15, done: true, claimed: true },
            { title: '累计采摘10束鲜花 (5/10)', reward: 50, done: false, claimed: false },
          ].map((task, idx) => (
            <View key={idx} style={styles.taskRow}>
              <View style={styles.taskLeft}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.taskReward}>奖励: 🪙 {task.reward} 金币</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.taskClaimBtn,
                  !task.done && styles.taskNotDoneBtn,
                  task.claimed && styles.taskClaimedBtn,
                ]}
                disabled={!task.done || task.claimed}
                onPress={() => Alert.alert('领奖成功', `成功领取 ${task.reward} 金币奖励！`)}
              >
                <Text style={styles.taskClaimText}>
                  {task.claimed ? '已领取' : task.done ? '领取' : '去完成'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </ModalContainer>

      {/* 果园信箱弹窗 */}
      <ModalContainer
        visible={mailVisible}
        onClose={() => setMailVisible(false)}
        title="果园信箱"
        height={380}
      >
        <View style={styles.mailItem}>
          <Text style={styles.mailTitle}>🎉 欢迎来到捡果 2.0 新版！</Text>
          <Text style={styles.mailTime}>2026-11-12 18:00</Text>
          <Text style={styles.mailBody}>
            尊敬的花园主，商户与好友互动闭环已全面开放，快去给同城好友点赞送花吧！
          </Text>
        </View>
      </ModalContainer>

      {/* 好友拜访弹窗 */}
      <ModalContainer
        visible={friendsVisible}
        onClose={() => setFriendsVisible(false)}
        title="好友果园拜访"
        height={440}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {[
            { name: '苏夏 (同城花仙子)', level: 9, status: '有成熟鲜花', canWater: true },
            { name: '花之恋掌柜', level: 12, status: '繁花似锦', canWater: false },
            { name: '江畔晨星', level: 4, status: '遭遇害虫侵扰', canWater: true },
          ].map((friend, idx) => (
            <View key={idx} style={styles.friendRow}>
              <View>
                <Text style={styles.friendName}>{friend.name}</Text>
                <Text style={styles.friendSub}>庄园 Lv.{friend.level} | {friend.status}</Text>
              </View>
              <TouchableOpacity
                style={styles.visitBtn}
                onPress={() => Alert.alert('拜访成功', `已前往 ${friend.name} 的果园帮其浇水！`)}
              >
                <Text style={styles.visitText}>拜访果园</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </ModalContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  userTextInfo: {
    marginLeft: 10,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nickname: {
    fontSize: Typography.fontSize.base,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  vipBadge: {
    backgroundColor: '#FFF7E6',
    borderWidth: 1,
    borderColor: '#FFD591',
    borderRadius: Layout.radius.full,
    paddingHorizontal: 6,
    marginLeft: 6,
  },
  vipText: {
    fontSize: 10,
    color: '#D48806',
    fontWeight: 'bold',
  },
  levelText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  assetCapsules: {
    flexDirection: 'row',
  },
  capsule: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBE6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Layout.radius.full,
    marginLeft: 6,
    borderWidth: 1,
    borderColor: '#FFE58F',
  },
  roseCapsule: {
    backgroundColor: '#FFF0F2',
    borderColor: '#FFCCC7',
  },
  capsuleIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  capsuleVal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  shortcutRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.white,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  shortcutBtn: {
    alignItems: 'center',
  },
  shortcutIcon: {
    fontSize: 22,
  },
  shortcutLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  scrollContent: {
    paddingVertical: 8,
  },
  newsTicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBE6',
    borderRadius: Layout.radius.full,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 12,
    marginTop: 6,
  },
  newsIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  newsText: {
    fontSize: 12,
    color: '#D48806',
    flex: 1,
  },
  landDetailBox: {
    paddingVertical: 8,
  },
  centerAction: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  bigActionIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  bigActionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  bigActionSub: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textTertiary,
    marginTop: 4,
    marginBottom: 20,
  },
  primaryActionButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: Layout.radius.full,
  },
  primaryActionText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  seedsList: {
    maxHeight: 260,
  },
  seedPickItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: Layout.radius.md,
    padding: 10,
    marginBottom: 8,
  },
  seedIcon: {
    fontSize: 28,
    marginRight: 10,
  },
  seedInfo: {
    flex: 1,
  },
  seedName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  seedQty: {
    fontSize: 11,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  plantActionText: {
    backgroundColor: Colors.primary,
    color: Colors.white,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Layout.radius.full,
    fontSize: 12,
    fontWeight: 'bold',
  },
  plantStatusCard: {
    backgroundColor: Colors.background,
    borderRadius: Layout.radius.md,
    padding: 12,
    marginBottom: 16,
  },
  cardPlantTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  cardPlantDetail: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#DDD',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  actionButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  opBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Layout.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    minWidth: '48%',
  },
  waterOpBtn: {
    backgroundColor: '#E6F7FF',
    borderWidth: 1,
    borderColor: '#91D5FF',
  },
  pestOpBtn: {
    backgroundColor: '#FFF1F0',
    borderWidth: 1,
    borderColor: '#FFA39E',
  },
  upgradeOpBtn: {
    backgroundColor: '#FFF7E6',
    borderWidth: 1,
    borderColor: '#FFD591',
  },
  harvestOpBtn: {
    backgroundColor: Colors.rose,
    minWidth: '100%',
  },
  opBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  backpackHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    marginBottom: 10,
  },
  tabBtn: {
    paddingVertical: 8,
    marginRight: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: {
    borderBottomColor: Colors.primary,
  },
  tabBtnText: {
    fontSize: 14,
    color: Colors.textTertiary,
  },
  tabBtnTextActive: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  backpackList: {
    paddingBottom: 20,
  },
  backpackItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.divider,
  },
  itemEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  itemCenter: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  itemDesc: {
    fontSize: 11,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  itemQuantity: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.primaryDark,
  },
  shopItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.divider,
  },
  shopIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  shopInfo: {
    flex: 1,
  },
  shopName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  shopDesc: {
    fontSize: 11,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  shopPrice: {
    fontSize: 12,
    color: '#D48806',
    fontWeight: 'bold',
    marginTop: 4,
  },
  buyBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Layout.radius.full,
  },
  buyText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  taskRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.divider,
  },
  taskLeft: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  taskReward: {
    fontSize: 11,
    color: '#D48806',
    marginTop: 4,
  },
  taskClaimBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Layout.radius.full,
  },
  taskNotDoneBtn: {
    backgroundColor: Colors.background,
  },
  taskClaimedBtn: {
    backgroundColor: '#DDD',
  },
  taskClaimText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  mailItem: {
    backgroundColor: Colors.background,
    borderRadius: Layout.radius.md,
    padding: 12,
  },
  mailTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  mailTime: {
    fontSize: 11,
    color: Colors.textTertiary,
    marginTop: 2,
    marginBottom: 6,
  },
  mailBody: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  friendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.divider,
  },
  friendName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  friendSub: {
    fontSize: 11,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  visitBtn: {
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Layout.radius.full,
  },
  visitText: {
    color: Colors.primaryDark,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
