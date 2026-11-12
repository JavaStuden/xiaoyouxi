import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { Colors, Typography, Layout } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { ModalContainer } from '../../components/ModalContainer';
import { CustomerDetail, GiftWallRecord } from '../../types';

export const MerchantScreen: React.FC = () => {
  const { switchRole } = useApp();

  // 商户客户列表
  const [customers, setCustomers] = useState<CustomerDetail[]>([
    {
      relationId: 1,
      customerId: 1,
      phone: '13800138000',
      nickname: '林小果',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      customRemark: '高频互动·林小姐',
      tags: ['高净值', '爱玫瑰', '到店常客'],
      intimacyScore: 380,
      status: 'ACCEPTED',
      lastInteractAt: '10分钟前',
    },
    {
      relationId: 2,
      customerId: 3,
      phone: '13700137000',
      nickname: '苏夏 (同城花仙子)',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
      customRemark: '苏小姐 (插花讲师)',
      tags: ['插花名师', '大单采购'],
      intimacyScore: 520,
      status: 'ACCEPTED',
      lastInteractAt: '1小时前',
    },
    {
      relationId: 3,
      customerId: 4,
      phone: '13600136000',
      nickname: '晨曦微风',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
      customRemark: '新客户-周先生',
      tags: ['新客户', '郁金香爱好者'],
      intimacyScore: 80,
      status: 'INVITED',
      lastInteractAt: '昨天',
    },
  ]);

  // 礼物墙记录
  const [giftWall, setGiftWall] = useState<GiftWallRecord[]>([
    {
      id: 1,
      merchantId: 2,
      customerId: 1,
      customerName: '林小果',
      customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      giftName: '初恋红玫瑰',
      giftIcon: '🌹',
      giftCount: 9,
      amount: 90,
      direction: 'CUSTOMER_TO_MERCHANT',
      createdAt: '2026-11-12 18:20',
    },
    {
      id: 2,
      merchantId: 2,
      customerId: 1,
      customerName: '林小果',
      customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      giftName: '璀璨玫瑰皇冠',
      giftIcon: '👑',
      giftCount: 1,
      amount: 298,
      direction: 'CUSTOMER_TO_MERCHANT',
      createdAt: '2026-11-11 14:10',
    },
  ]);

  // 弹窗状态
  const [remarkModalVisible, setRemarkModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDetail | null>(null);
  const [editRemark, setEditRemark] = useState('');
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [invitePhone, setInvitePhone] = useState('');
  const [publishModalVisible, setPublishModalVisible] = useState(false);
  const [dynamicTitle, setDynamicTitle] = useState('');
  const [dynamicContent, setDynamicContent] = useState('');
  const [giftWallVisible, setGiftWallVisible] = useState(false);
  const [rankModalVisible, setRankModalVisible] = useState(false);

  const handleOpenRemark = (customer: CustomerDetail) => {
    setSelectedCustomer(customer);
    setEditRemark(customer.customRemark);
    setRemarkModalVisible(true);
  };

  const handleSaveRemark = () => {
    if (!selectedCustomer) return;
    setCustomers((prev) =>
      prev.map((c) =>
        c.customerId === selectedCustomer.customerId ? { ...c, customRemark: editRemark } : c
      )
    );
    setRemarkModalVisible(false);
    Alert.alert('成功', '客户专属备注与标签已更新');
  };

  const handleSendInvite = () => {
    if (invitePhone.length < 11) {
      Alert.alert('提示', '请输入合法的11位手机号码');
      return;
    }
    const newCust: CustomerDetail = {
      relationId: Date.now(),
      customerId: Date.now(),
      phone: invitePhone,
      nickname: '受邀新花友' + invitePhone.slice(-4),
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      customRemark: '待开通客户',
      tags: ['待开通', '受邀用户'],
      intimacyScore: 20,
      status: 'INVITED',
      lastInteractAt: '刚刚',
    };
    setCustomers((prev) => [newCust, ...prev]);
    setInvitePhone('');
    setInviteModalVisible(false);
    Alert.alert('邀请已发送', '商户果园开通邀请函已发出，待客户在App中确认开通');
  };

  const handleMerchantReward = (customer: CustomerDetail) => {
    Alert.alert(
      '商户互动赠礼',
      `确定为客户 [${customer.customRemark}] 发放商户好感度礼券与鲜花吗？`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确认送礼',
          onPress: () => {
            setCustomers((prev) =>
              prev.map((c) =>
                c.customerId === customer.customerId
                  ? { ...c, intimacyScore: c.intimacyScore + 50 }
                  : c
              )
            );
            Alert.alert('点赞赠礼成功', '已为该客户送出商户鲜花礼包，好感度 +50！');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* 顶部商户工作台 Header */}
      <View style={styles.merchantHeader}>
        <View style={styles.storeInfoRow}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=200',
            }}
            style={styles.storeLogo}
          />
          <View style={styles.storeInfo}>
            <View style={styles.storeTitleRow}>
              <Text style={styles.storeName}>花之恋花艺旗舰店</Text>
              <View style={styles.authBadge}>
                <Text style={styles.authText}>官方签约商户</Text>
              </View>
            </View>
            <Text style={styles.storeSub}>门店专属果园代码: JG-SH-8809 | 淮海中路店</Text>
          </View>
        </View>

        {/* 关键数据指标 */}
        <View style={styles.metricsRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricVal}>{customers.length}</Text>
            <Text style={styles.metricLabel}>关联果园客户</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricVal}>920</Text>
            <Text style={styles.metricLabel}>累计好感度</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricVal}>128</Text>
            <Text style={styles.metricLabel}>已兑换鲜花礼盒</Text>
          </View>
        </View>
      </View>

      {/* 商户快捷操作功能区 */}
      <View style={styles.actionGrid}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => setInviteModalVisible(true)}>
          <Text style={styles.actionIcon}>💌</Text>
          <Text style={styles.actionLabel}>邀请客户开通</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => setPublishModalVisible(true)}>
          <Text style={styles.actionIcon}>📸</Text>
          <Text style={styles.actionLabel}>发布新品动态</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => setGiftWallVisible(true)}>
          <Text style={styles.actionIcon}>🏆</Text>
          <Text style={styles.actionLabel}>门店礼物墙</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => setRankModalVisible(true)}>
          <Text style={styles.actionIcon}>📊</Text>
          <Text style={styles.actionLabel}>好感度榜单</Text>
        </TouchableOpacity>
      </View>

      {/* 客户关系管理列表 */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.listHeaderRow}>
          <Text style={styles.listTitle}>客户果园与互动档案 ({customers.length})</Text>
          <TouchableOpacity onPress={() => setInviteModalVisible(true)}>
            <Text style={styles.inviteLink}>+ 邀请新客户</Text>
          </TouchableOpacity>
        </View>

        {customers.map((c) => (
          <View key={c.relationId} style={styles.customerCard}>
            <View style={styles.customerTop}>
              <Image source={{ uri: c.avatarUrl }} style={styles.customerAvatar} />
              <View style={styles.customerInfo}>
                <View style={styles.customerNameRow}>
                  <Text style={styles.customRemarkText}>{c.customRemark}</Text>
                  <Text style={styles.origNick}>({c.nickname})</Text>
                  <View
                    style={[
                      styles.statusTag,
                      c.status === 'INVITED' ? styles.statusInvited : styles.statusAccepted,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusTagText,
                        c.status === 'INVITED' ? styles.statusInvitedText : styles.statusAcceptedText,
                      ]}
                    >
                      {c.status === 'INVITED' ? '待客户同意' : '果园生长中'}
                    </Text>
                  </View>
                </View>

                {/* 标签栏 */}
                <View style={styles.tagsRow}>
                  {c.tags.map((tag, idx) => (
                    <View key={idx} style={styles.tagBadge}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>

                <Text style={styles.intimacyText}>
                  💖 好感度积分: <Text style={styles.intimacyVal}>{c.intimacyScore}</Text> | 最近互动: {c.lastInteractAt}
                </Text>
              </View>
            </View>

            {/* 卡片底部操作栏 */}
            <View style={styles.cardActions}>
              <TouchableOpacity
                style={styles.remarkEditBtn}
                onPress={() => handleOpenRemark(c)}
              >
                <Text style={styles.remarkEditText}>✏️ 修改备注与标签</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.rewardActionBtn}
                onPress={() => handleMerchantReward(c)}
              >
                <Text style={styles.rewardActionText}>🎁 点赞并送礼</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.returnClientBtn} onPress={switchRole}>
          <Text style={styles.returnClientText}>← 返回客户端果园主界面</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 修改备注弹窗 */}
      <ModalContainer
        visible={remarkModalVisible}
        onClose={() => setRemarkModalVisible(false)}
        title="编辑客户专属备注与喜好"
        height={340}
      >
        <Text style={styles.modalSubLabel}>客户专属备注名</Text>
        <TextInput
          style={styles.modalInput}
          value={editRemark}
          onChangeText={setEditRemark}
          placeholder="例如: 淮海路常客-林小姐"
        />

        <TouchableOpacity style={styles.modalConfirmBtn} onPress={handleSaveRemark}>
          <Text style={styles.modalConfirmText}>保存修改</Text>
        </TouchableOpacity>
      </ModalContainer>

      {/* 邀请客户开通果园弹窗 */}
      <ModalContainer
        visible={inviteModalVisible}
        onClose={() => setInviteModalVisible(false)}
        title="邀请客户开通专属果园"
        height={340}
      >
        <Text style={styles.modalSubLabel}>输入客户注册手机号码</Text>
        <TextInput
          style={styles.modalInput}
          value={invitePhone}
          onChangeText={setInvitePhone}
          placeholder="请输入11位手机号码"
          keyboardType="phone-pad"
        />

        <TouchableOpacity style={styles.modalConfirmBtn} onPress={handleSendInvite}>
          <Text style={styles.modalConfirmText}>发送开通邀请函</Text>
        </TouchableOpacity>
      </ModalContainer>

      {/* 发布新品动态弹窗 */}
      <ModalContainer
        visible={publishModalVisible}
        onClose={() => setPublishModalVisible(false)}
        title="发布门店鲜花动态"
        height={450}
      >
        <TextInput
          style={styles.modalInput}
          value={dynamicTitle}
          onChangeText={setDynamicTitle}
          placeholder="动态标题 (如: 今日新到厄瓜多尔玫瑰到店)"
        />
        <TextInput
          style={[styles.modalInput, styles.multiInput]}
          value={dynamicContent}
          onChangeText={setDynamicContent}
          placeholder="动态正文描述，展示给附近所有果园主..."
          multiline
        />
        <TouchableOpacity
          style={styles.modalConfirmBtn}
          onPress={() => {
            Alert.alert('发布成功', '门店新品动态已发布至邂逅广场');
            setPublishModalVisible(false);
          }}
        >
          <Text style={styles.modalConfirmText}>立即发布</Text>
        </TouchableOpacity>
      </ModalContainer>

      {/* 礼物墙弹窗 */}
      <ModalContainer
        visible={giftWallVisible}
        onClose={() => setGiftWallVisible(false)}
        title="门店荣誉礼物墙"
        height={450}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {giftWall.map((gift) => (
            <View key={gift.id} style={styles.giftWallItem}>
              <Text style={styles.giftWallIcon}>{gift.giftIcon}</Text>
              <View style={styles.giftWallCenter}>
                <Text style={styles.giftWallTitle}>
                  {gift.customerName} 赠送了 {gift.giftName} x{gift.giftCount}
                </Text>
                <Text style={styles.giftWallTime}>{gift.createdAt}</Text>
              </View>
              <Text style={styles.giftWallAmount}>🪙 +{gift.amount}</Text>
            </View>
          ))}
        </ScrollView>
      </ModalContainer>

      {/* 好感度榜单 */}
      <ModalContainer
        visible={rankModalVisible}
        onClose={() => setRankModalVisible(false)}
        title="客户果园好感度排行榜"
        height={440}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {customers
            .slice()
            .sort((a, b) => b.intimacyScore - a.intimacyScore)
            .map((item, idx) => (
              <View key={item.relationId} style={styles.rankRow}>
                <Text style={styles.rankNum}>{idx + 1}</Text>
                <Image source={{ uri: item.avatarUrl }} style={styles.rankAvatar} />
                <View style={styles.rankInfo}>
                  <Text style={styles.rankName}>{item.customRemark}</Text>
                  <Text style={styles.rankSub}>累计互动积分: {item.intimacyScore}</Text>
                </View>
                <Text style={styles.rankMedal}>
                  {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                </Text>
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
  merchantHeader: {
    backgroundColor: '#1E1E2D',
    padding: 16,
    borderBottomLeftRadius: Layout.radius.lg,
    borderBottomRightRadius: Layout.radius.lg,
  },
  storeInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  storeLogo: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#E5BF77',
  },
  storeInfo: {
    flex: 1,
    marginLeft: 12,
  },
  storeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: Colors.white,
  },
  authBadge: {
    backgroundColor: '#35354A',
    borderRadius: Layout.radius.full,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 8,
    borderWidth: 0.5,
    borderColor: '#E5BF77',
  },
  authText: {
    fontSize: 10,
    color: '#E5BF77',
    fontWeight: 'bold',
  },
  storeSub: {
    fontSize: 11,
    color: '#AEAECA',
    marginTop: 3,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 0.5,
    borderTopColor: '#35354A',
    paddingTop: 12,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F7D678',
  },
  metricLabel: {
    fontSize: 11,
    color: '#AEAECA',
    marginTop: 2,
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.white,
    paddingVertical: 12,
    marginHorizontal: 12,
    marginTop: 10,
    borderRadius: Layout.radius.lg,
    ...Layout.shadow.card,
  },
  actionBtn: {
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  actionLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 6,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  inviteLink: {
    fontSize: 13,
    color: Colors.primaryDark,
    fontWeight: 'bold',
  },
  customerCard: {
    backgroundColor: Colors.white,
    borderRadius: Layout.radius.lg,
    padding: 14,
    marginBottom: 10,
    ...Layout.shadow.card,
  },
  customerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  customerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  customerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  customerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  customRemarkText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  origNick: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginLeft: 4,
  },
  statusTag: {
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 8,
  },
  statusInvited: {
    backgroundColor: '#FFF7E6',
  },
  statusAccepted: {
    backgroundColor: '#E8F5E9',
  },
  statusTagText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusInvitedText: {
    color: '#D48806',
  },
  statusAcceptedText: {
    color: Colors.primaryDark,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 4,
  },
  tagBadge: {
    backgroundColor: Colors.background,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  intimacyText: {
    fontSize: 11,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  intimacyVal: {
    color: Colors.rose,
    fontWeight: 'bold',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 0.5,
    borderTopColor: Colors.divider,
    marginTop: 10,
    paddingTop: 8,
  },
  remarkEditBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.background,
    borderRadius: Layout.radius.full,
    marginRight: 8,
  },
  remarkEditText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  rewardActionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: Colors.rose,
    borderRadius: Layout.radius.full,
  },
  rewardActionText: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: 'bold',
  },
  returnClientBtn: {
    backgroundColor: Colors.white,
    borderRadius: Layout.radius.full,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  returnClientText: {
    color: Colors.primaryDark,
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalSubLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  modalInput: {
    height: 46,
    backgroundColor: Colors.background,
    borderRadius: Layout.radius.md,
    paddingHorizontal: 14,
    marginBottom: 16,
    fontSize: 14,
  },
  multiInput: {
    height: 90,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  modalConfirmBtn: {
    height: 48,
    backgroundColor: Colors.primary,
    borderRadius: Layout.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalConfirmText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: 'bold',
  },
  giftWallItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.divider,
  },
  giftWallIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  giftWallCenter: {
    flex: 1,
  },
  giftWallTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  giftWallTime: {
    fontSize: 11,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  giftWallAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D48806',
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.divider,
  },
  rankNum: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 28,
    color: Colors.textTertiary,
  },
  rankAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  rankInfo: {
    flex: 1,
  },
  rankName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  rankSub: {
    fontSize: 11,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  rankMedal: {
    fontSize: 20,
  },
});
