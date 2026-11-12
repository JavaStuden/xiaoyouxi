import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, TextInput } from 'react-native';
import { Colors, Typography, Layout } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { ModalContainer } from '../../components/ModalContainer';
import { ShippingAddress } from '../../types';

export const ProfileScreen: React.FC = () => {
  const { user, switchRole, role, logout, rechargeCoins, upgradeVipLevel } = useApp();

  // 弹窗状态
  const [vipModalVisible, setVipModalVisible] = useState(false);
  const [rechargeModalVisible, setRechargeModalVisible] = useState(false);
  const [billingModalVisible, setBillingModalVisible] = useState(false);
  const [billingTab, setBillingTab] = useState<'ALL' | 'CONSUME'>('ALL');
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [addFriendModalVisible, setAddFriendModalVisible] = useState(false);

  // 地址列表数据
  const [addresses, setAddresses] = useState<ShippingAddress[]>([
    {
      id: 1,
      recipientName: '林小果',
      phone: '13800138000',
      province: '上海市',
      city: '上海市',
      district: '静安区',
      detailAddress: '南京西路1601号越洋广场A座18层',
      isDefault: true,
    },
    {
      id: 2,
      recipientName: '林女士',
      phone: '13800138000',
      province: '浙江省',
      city: '杭州市',
      district: '西湖区',
      detailAddress: '文三路东方通信大厦3号楼',
      isDefault: false,
    },
  ]);

  const [newRecipient, setNewRecipient] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newDetail, setNewDetail] = useState('');

  const RECHARGE_PACKAGES = [
    { id: 1, price: 6, coins: 60, bonus: 0, tag: '' },
    { id: 2, price: 30, coins: 300, bonus: 30, tag: '热卖推荐' },
    { id: 3, price: 98, coins: 980, bonus: 150, tag: '超值礼包' },
    { id: 4, price: 298, coins: 2980, bonus: 600, tag: '尊贵尊享' },
    { id: 5, price: 648, coins: 6480, bonus: 1680, tag: '黑金特惠' },
  ];

  const handleAddAddress = () => {
    if (!newRecipient || !newPhone || !newDetail) {
      Alert.alert('提示', '请完整填写收货人、电话和详细地址');
      return;
    }
    const newAddr: ShippingAddress = {
      id: Date.now(),
      recipientName: newRecipient,
      phone: newPhone,
      province: '上海市',
      city: '上海市',
      district: '浦东新区',
      detailAddress: newDetail,
      isDefault: false,
    };
    setAddresses((prev) => [...prev, newAddr]);
    setNewRecipient('');
    setNewPhone('');
    setNewDetail('');
    Alert.alert('成功', '收货地址添加成功');
  };

  const handleDeleteAddress = (id: number) => {
    Alert.alert('确认删除', '确定要删除此收货地址吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: () => setAddresses((prev) => prev.filter((a) => a.id !== id)),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* 个人信息主卡片 */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.userInfoRow}>
            <Image source={{ uri: user?.avatarUrl }} style={styles.avatar} />
            <View style={styles.nameBlock}>
              <View style={styles.nameRow}>
                <Text style={styles.nickname}>{user?.nickname}</Text>
                {user?.realPersonVerified && (
                  <View style={styles.verifiedTag}>
                    <Text style={styles.verifiedText}>✓ 真人认证</Text>
                  </View>
                )}
              </View>
              <Text style={styles.uidText}>捡果 UID: 88206912 | {user?.zodiacSign || '天秤座'}</Text>
              <Text style={styles.bioText} numberOfLines={1}>{user?.bio}</Text>
            </View>
          </View>

          {/* 社交数据计数 */}
          <View style={styles.socialStatsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statVal}>328</Text>
              <Text style={styles.statLabel}>获赞与收藏</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statVal}>64</Text>
              <Text style={styles.statLabel}>关注花友</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statVal}>189</Text>
              <Text style={styles.statLabel}>粉丝数</Text>
            </View>
          </View>
        </View>

        {/* VIP 质感会员尊享横幅 */}
        <TouchableOpacity
          style={styles.vipBanner}
          activeOpacity={0.9}
          onPress={() => setVipModalVisible(true)}
        >
          <View style={styles.vipLeft}>
            <Text style={styles.vipTitle}>
              {user?.vipLevel === 3 ? '👑 黑金尊享会员' : user?.vipLevel === 2 ? '⭐ SVIP 臻享会员' : '💎 VIP 会员'}
            </Text>
            <Text style={styles.vipSub}>
              尊享特权: 无限好友添加、果园成熟极速收成、专属座驾特效
            </Text>
          </View>
          <View style={styles.vipRightBtn}>
            <Text style={styles.vipBtnText}>特权详情 ›</Text>
          </View>
        </TouchableOpacity>

        {/* 资产卡片 (金币与玫瑰花) */}
        <View style={styles.assetCard}>
          <View style={styles.assetItem}>
            <Text style={styles.assetIcon}>🪙</Text>
            <View>
              <Text style={styles.assetLabel}>金币余额</Text>
              <Text style={styles.assetValue}>{user?.coinBalance.toFixed(2)}</Text>
            </View>
            <TouchableOpacity
              style={styles.rechargeActionBtn}
              onPress={() => setRechargeModalVisible(true)}
            >
              <Text style={styles.rechargeActionText}>充值</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.assetDivider} />

          <View style={styles.assetItem}>
            <Text style={styles.assetIcon}>💐</Text>
            <View>
              <Text style={styles.assetLabel}>已采摘鲜花</Text>
              <Text style={styles.assetValue}>{user?.flowerBalance} 朵</Text>
            </View>
            <TouchableOpacity
              style={[styles.rechargeActionBtn, styles.exchangeActionBtn]}
              onPress={() => Alert.alert('到店兑换', '可前往任何合作商户门店免费兑换实体花束伴手礼！')}
            >
              <Text style={[styles.rechargeActionText, styles.exchangeActionText]}>兑换</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 核心功能服务宫格 */}
        <View style={styles.serviceMenu}>
          <Text style={styles.serviceTitle}>我的专属服务</Text>

          <View style={styles.gridRow}>
            <TouchableOpacity
              style={styles.gridItem}
              onPress={() => setBillingModalVisible(true)}
            >
              <Text style={styles.gridIcon}>🧾</Text>
              <Text style={styles.gridLabel}>我的账单</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.gridItem}
              onPress={() => setAddressModalVisible(true)}
            >
              <Text style={styles.gridIcon}>📦</Text>
              <Text style={styles.gridLabel}>收货地址</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.gridItem}
              onPress={() => setAddFriendModalVisible(true)}
            >
              <Text style={styles.gridIcon}>👥</Text>
              <Text style={styles.gridLabel}>添加好友</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.gridItem}
              onPress={() => setVipModalVisible(true)}
            >
              <Text style={styles.gridIcon}>👑</Text>
              <Text style={styles.gridLabel}>会员中心</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 角色切换与退出 */}
        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.switchRoleBtn} onPress={switchRole}>
            <Text style={styles.switchRoleText}>
              🔄 切换至: {role === 'CONSUMER' ? '【商户专属工作台】' : '【客户端果园】'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() =>
              Alert.alert('退出登录', '确定要退出当前账号吗？', [
                { text: '取消', style: 'cancel' },
                { text: '退出', style: 'destructive', onPress: logout },
              ])
            }
          >
            <Text style={styles.logoutText}>退出登录</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 会员升级弹窗 */}
      <ModalContainer
        visible={vipModalVisible}
        onClose={() => setVipModalVisible(false)}
        title="捡果会员权益体系"
        height={500}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {[
            {
              level: 1,
              name: '黄金 VIP',
              color: '#F7D678',
              desc: '每日赠送玫瑰种子*5，浇水加速20%',
              price: '¥ 18 / 月',
            },
            {
              level: 2,
              name: '臻享 SVIP',
              color: '#8A58E8',
              desc: '专属聊天气泡、鲜花采摘双倍产量、同城优先推荐',
              price: '¥ 38 / 月',
            },
            {
              level: 3,
              name: '黑金会员',
              color: '#1A1822',
              textColor: '#E5BF77',
              desc: '无限好友上限、全屏入场特效、一键驱虫收割特权',
              price: '¥ 98 / 月',
            },
          ].map((tier) => (
            <View key={tier.level} style={[styles.vipTierCard, { backgroundColor: tier.color }]}>
              <View>
                <Text style={[styles.vipTierName, tier.textColor ? { color: tier.textColor } : {}]}>
                  {tier.name}
                </Text>
                <Text style={[styles.vipTierDesc, tier.textColor ? { color: tier.textColor } : {}]}>
                  {tier.desc}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.openVipBtn}
                onPress={async () => {
                  await upgradeVipLevel(tier.level);
                  Alert.alert('开通成功', `已成功开通/续费 ${tier.name}！`);
                  setVipModalVisible(false);
                }}
              >
                <Text style={styles.openVipText}>{tier.price}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </ModalContainer>

      {/* 充值中心弹窗 */}
      <ModalContainer
        visible={rechargeModalVisible}
        onClose={() => setRechargeModalVisible(false)}
        title="金币充值中心"
        height={450}
      >
        <View style={styles.rechargeList}>
          {RECHARGE_PACKAGES.map((pkg) => (
            <TouchableOpacity
              key={pkg.id}
              style={styles.packageCard}
              onPress={async () => {
                await rechargeCoins(pkg.price, pkg.coins + pkg.bonus);
                Alert.alert('充值成功', `成功充值 ${pkg.coins + pkg.bonus} 金币！`);
                setRechargeModalVisible(false);
              }}
            >
              {pkg.tag ? (
                <View style={styles.packageTag}>
                  <Text style={styles.packageTagText}>{pkg.tag}</Text>
                </View>
              ) : null}
              <Text style={styles.packageCoins}>🪙 {pkg.coins + pkg.bonus}</Text>
              <Text style={styles.packageBonus}>
                {pkg.bonus > 0 ? `含赠送 ${pkg.bonus} 金币` : '即时到账'}
              </Text>
              <Text style={styles.packagePrice}>¥ {pkg.price}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ModalContainer>

      {/* 我的账单弹窗 */}
      <ModalContainer
        visible={billingModalVisible}
        onClose={() => setBillingModalVisible(false)}
        title="交易账单流水"
        height={460}
      >
        <View style={styles.billingTabs}>
          <TouchableOpacity
            style={[styles.billingTab, billingTab === 'ALL' && styles.billingTabActive]}
            onPress={() => setBillingTab('ALL')}
          >
            <Text style={[styles.billingTabText, billingTab === 'ALL' && styles.billingTabTextActive]}>
              全部交易
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.billingTab, billingTab === 'CONSUME' && styles.billingTabActive]}
            onPress={() => setBillingTab('CONSUME')}
          >
            <Text style={[styles.billingTabText, billingTab === 'CONSUME' && styles.billingTabTextActive]}>
              消耗明细
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {[
            {
              title: '微信在线充值金币',
              time: '2026-11-12 16:30',
              amount: '+ 980 🪙',
              isIncome: true,
            },
            {
              title: '商城购买高效有机催熟肥',
              time: '2026-11-12 17:15',
              amount: '- 30 🪙',
              isIncome: false,
            },
            {
              title: '果园扩建开垦新地块',
              time: '2026-11-12 18:00',
              amount: '- 300 🪙',
              isIncome: false,
            },
          ]
            .filter((i) => (billingTab === 'CONSUME' ? !i.isIncome : true))
            .map((bill, idx) => (
              <View key={idx} style={styles.billRow}>
                <View>
                  <Text style={styles.billTitle}>{bill.title}</Text>
                  <Text style={styles.billTime}>{bill.time}</Text>
                </View>
                <Text
                  style={[
                    styles.billAmount,
                    bill.isIncome ? styles.billIncome : styles.billExpense,
                  ]}
                >
                  {bill.amount}
                </Text>
              </View>
            ))}
        </ScrollView>
      </ModalContainer>

      {/* 收货地址管理弹窗 */}
      <ModalContainer
        visible={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
        title="鲜花实体兑换收货地址"
        height={500}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {addresses.map((addr) => (
            <View key={addr.id} style={styles.addressCard}>
              <View style={styles.addrHeader}>
                <Text style={styles.addrName}>
                  {addr.recipientName} ({addr.phone})
                </Text>
                {addr.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultText}>默认地址</Text>
                  </View>
                )}
                <TouchableOpacity onPress={() => handleDeleteAddress(addr.id)}>
                  <Text style={styles.deleteAddrText}>删除</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.addrDetail}>
                {addr.province} {addr.city} {addr.district} {addr.detailAddress}
              </Text>
            </View>
          ))}

          <Text style={styles.addNewAddrTitle}>+ 新增收货地址</Text>
          <TextInput
            style={styles.addrInput}
            placeholder="收货人姓名"
            value={newRecipient}
            onChangeText={setNewRecipient}
          />
          <TextInput
            style={styles.addrInput}
            placeholder="联系电话"
            keyboardType="phone-pad"
            value={newPhone}
            onChangeText={setNewPhone}
          />
          <TextInput
            style={styles.addrInput}
            placeholder="详细地址 (门牌号/楼层)"
            value={newDetail}
            onChangeText={setNewDetail}
          />
          <TouchableOpacity style={styles.saveAddrBtn} onPress={handleAddAddress}>
            <Text style={styles.saveAddrText}>保存新收货地址</Text>
          </TouchableOpacity>
        </ScrollView>
      </ModalContainer>

      {/* 添加好友弹窗 */}
      <ModalContainer
        visible={addFriendModalVisible}
        onClose={() => setAddFriendModalVisible(false)}
        title="查找与添加花友"
        height={360}
      >
        <TextInput style={styles.addrInput} placeholder="输入手机号或捡果 UID 查找..." />
        <TouchableOpacity
          style={styles.saveAddrBtn}
          onPress={() => Alert.alert('已发送申请', '已向该花友发送好友申请！')}
        >
          <Text style={styles.saveAddrText}>精确查找并添加</Text>
        </TouchableOpacity>
        <View style={styles.qrRow}>
          <Text style={styles.qrIcon}>📱</Text>
          <Text style={styles.qrText}>扫一扫面对面添加果园好友</Text>
        </View>
      </ModalContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  scrollContent: {
    paddingVertical: 12,
  },
  profileHeaderCard: {
    backgroundColor: Colors.white,
    padding: 16,
    marginHorizontal: 12,
    borderRadius: Layout.radius.lg,
    ...Layout.shadow.card,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  nameBlock: {
    flex: 1,
    marginLeft: 14,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nickname: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  verifiedTag: {
    backgroundColor: '#E6F7FF',
    borderRadius: Layout.radius.full,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 8,
  },
  verifiedText: {
    color: '#1890FF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  uidText: {
    fontSize: 11,
    color: Colors.textTertiary,
    marginTop: 3,
  },
  bioText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  socialStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 0.5,
    borderTopColor: Colors.divider,
    marginTop: 14,
    paddingTop: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statVal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  vipBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2A2935',
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: Layout.radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5BF77',
    ...Layout.shadow.card,
  },
  vipLeft: {
    flex: 1,
  },
  vipTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#F7D678',
  },
  vipSub: {
    fontSize: 10,
    color: '#D4C5A9',
    marginTop: 3,
  },
  vipRightBtn: {
    marginLeft: 10,
  },
  vipBtnText: {
    fontSize: 12,
    color: '#F7D678',
    fontWeight: 'bold',
  },
  assetCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: Layout.radius.lg,
    padding: 14,
    alignItems: 'center',
    ...Layout.shadow.card,
  },
  assetItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  assetIcon: {
    fontSize: 26,
    marginRight: 8,
  },
  assetLabel: {
    fontSize: 10,
    color: Colors.textTertiary,
  },
  assetValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  assetDivider: {
    width: 1,
    height: 36,
    backgroundColor: Colors.divider,
    marginHorizontal: 10,
  },
  rechargeActionBtn: {
    backgroundColor: '#FFF7E6',
    borderWidth: 1,
    borderColor: '#FFD591',
    borderRadius: Layout.radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 'auto',
  },
  rechargeActionText: {
    fontSize: 11,
    color: '#D48806',
    fontWeight: 'bold',
  },
  exchangeActionBtn: {
    backgroundColor: Colors.roseLight,
    borderColor: '#FFCCC7',
  },
  exchangeActionText: {
    color: Colors.rose,
  },
  serviceMenu: {
    backgroundColor: Colors.white,
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: Layout.radius.lg,
    padding: 14,
    ...Layout.shadow.card,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gridItem: {
    alignItems: 'center',
    width: '24%',
  },
  gridIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  gridLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  bottomActions: {
    marginHorizontal: 12,
    marginTop: 16,
    marginBottom: 30,
  },
  switchRoleBtn: {
    height: 46,
    backgroundColor: Colors.primaryLight,
    borderRadius: Layout.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  switchRoleText: {
    fontSize: 14,
    color: Colors.primaryDark,
    fontWeight: 'bold',
  },
  logoutBtn: {
    height: 46,
    backgroundColor: Colors.white,
    borderRadius: Layout.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  logoutText: {
    fontSize: 14,
    color: Colors.danger,
    fontWeight: '600',
  },
  vipTierCard: {
    borderRadius: Layout.radius.md,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vipTierName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  vipTierDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 4,
    maxWidth: 200,
  },
  openVipBtn: {
    backgroundColor: Colors.white,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Layout.radius.full,
  },
  openVipText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  rechargeList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  packageCard: {
    width: '48%',
    backgroundColor: Colors.background,
    borderRadius: Layout.radius.md,
    padding: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  packageTag: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.rose,
    borderTopRightRadius: Layout.radius.md,
    borderBottomLeftRadius: Layout.radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  packageTagText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: 'bold',
  },
  packageCoins: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D48806',
    marginTop: 6,
  },
  packageBonus: {
    fontSize: 10,
    color: Colors.textTertiary,
    marginTop: 2,
    marginBottom: 8,
  },
  packagePrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  billingTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    marginBottom: 10,
  },
  billingTab: {
    paddingVertical: 8,
    marginRight: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  billingTabActive: {
    borderBottomColor: Colors.primary,
  },
  billingTabText: {
    fontSize: 14,
    color: Colors.textTertiary,
  },
  billingTabTextActive: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.divider,
  },
  billTitle: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  billTime: {
    fontSize: 11,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  billAmount: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  billIncome: {
    color: Colors.primaryDark,
  },
  billExpense: {
    color: Colors.danger,
  },
  addressCard: {
    backgroundColor: Colors.background,
    borderRadius: Layout.radius.md,
    padding: 12,
    marginBottom: 10,
  },
  addrHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  addrName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  defaultBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 6,
  },
  defaultText: {
    fontSize: 9,
    color: Colors.primaryDark,
    fontWeight: 'bold',
  },
  deleteAddrText: {
    fontSize: 12,
    color: Colors.danger,
    marginLeft: 'auto',
  },
  addrDetail: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  addNewAddrTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: 12,
    marginBottom: 8,
  },
  addrInput: {
    height: 44,
    backgroundColor: Colors.background,
    borderRadius: Layout.radius.md,
    paddingHorizontal: 12,
    marginBottom: 8,
    fontSize: 13,
  },
  saveAddrBtn: {
    height: 44,
    backgroundColor: Colors.primary,
    borderRadius: Layout.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  saveAddrText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  qrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  qrIcon: {
    fontSize: 22,
    marginRight: 6,
  },
  qrText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
});
