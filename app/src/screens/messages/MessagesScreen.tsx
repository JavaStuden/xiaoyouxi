import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { Colors, Typography, Layout } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { ChatDetailScreen } from './ChatDetailScreen';
import { ChatConversation } from '../../types';

export const MessagesScreen: React.FC = () => {
  const { conversations } = useApp();
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');

  if (selectedConversation) {
    return (
      <ChatDetailScreen
        contactName={selectedConversation.contactName}
        contactAvatar={selectedConversation.contactAvatar}
        contactRole={selectedConversation.role}
        onBack={() => setSelectedConversation(null)}
      />
    );
  }

  const filtered = conversations.filter(
    (c) =>
      c.contactName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* 搜索栏 */}
      <View style={styles.searchHeader}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="搜索联系人、聊天记录..."
            value={searchKeyword}
            onChangeText={setSearchKeyword}
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* 系统固定置顶通知卡片 */}
        <TouchableOpacity style={styles.systemNoticeCard} activeOpacity={0.8}>
          <View style={styles.systemIconCircle}>
            <Text style={styles.systemEmoji}>🔔</Text>
          </View>
          <View style={styles.systemTextInfo}>
            <View style={styles.systemTitleRow}>
              <Text style={styles.systemTitle}>系统通知 & 活动提醒</Text>
              <Text style={styles.systemTime}>10:00</Text>
            </View>
            <Text style={styles.systemBrief} numberOfLines={1}>
              恭喜您的果园生态评级达到 Lv.8，已解锁更多稀有花种与商户礼盒兑换资格！
            </Text>
          </View>
        </TouchableOpacity>

        {/* 互动消息快捷栏 */}
        <View style={styles.interactionRow}>
          <TouchableOpacity style={styles.interactionBtn}>
            <View style={[styles.interactionIconBox, { backgroundColor: '#FFF0F2' }]}>
              <Text style={styles.interactionEmoji}>❤️</Text>
            </View>
            <Text style={styles.interactionLabel}>赞和收藏</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.interactionBtn}>
            <View style={[styles.interactionIconBox, { backgroundColor: '#E6F7FF' }]}>
              <Text style={styles.interactionEmoji}>💬</Text>
            </View>
            <Text style={styles.interactionLabel}>评论@我</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.interactionBtn}>
            <View style={[styles.interactionIconBox, { backgroundColor: '#F6FFED' }]}>
              <Text style={styles.interactionEmoji}>👥</Text>
            </View>
            <Text style={styles.interactionLabel}>新增关注</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.interactionBtn}>
            <View style={[styles.interactionIconBox, { backgroundColor: '#FFF7E6' }]}>
              <Text style={styles.interactionEmoji}>🎁</Text>
            </View>
            <Text style={styles.interactionLabel}>收到礼物</Text>
          </TouchableOpacity>
        </View>

        {/* 会话列表 */}
        <View style={styles.conversationList}>
          <Text style={styles.listSectionTitle}>全部私信会话</Text>
          {filtered.map((conv) => (
            <TouchableOpacity
              key={conv.contactUserId}
              style={styles.convItem}
              activeOpacity={0.7}
              onPress={() => setSelectedConversation(conv)}
            >
              <Image source={{ uri: conv.contactAvatar }} style={styles.convAvatar} />
              <View style={styles.convCenter}>
                <View style={styles.convTitleRow}>
                  <Text style={styles.convName}>{conv.contactName}</Text>
                  {conv.role === 'MERCHANT' && (
                    <View style={styles.merchantTag}>
                      <Text style={styles.merchantTagText}>商户</Text>
                    </View>
                  )}
                  <Text style={styles.convTime}>{conv.lastMessageTime}</Text>
                </View>
                <Text style={styles.convLastMsg} numberOfLines={1}>
                  {conv.lastMessage}
                </Text>
              </View>

              {conv.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{conv.unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  searchHeader: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: Layout.radius.full,
    paddingHorizontal: 12,
    height: 38,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  scrollContent: {
    paddingVertical: 10,
  },
  systemNoticeCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    padding: 12,
    marginHorizontal: 12,
    marginBottom: 10,
    borderRadius: Layout.radius.lg,
    alignItems: 'center',
    ...Layout.shadow.card,
  },
  systemIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF7E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  systemEmoji: {
    fontSize: 22,
  },
  systemTextInfo: {
    flex: 1,
    marginLeft: 10,
  },
  systemTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  systemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  systemTime: {
    fontSize: 10,
    color: Colors.textTertiary,
  },
  systemBrief: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  interactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.white,
    paddingVertical: 14,
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: Layout.radius.lg,
    ...Layout.shadow.card,
  },
  interactionBtn: {
    alignItems: 'center',
  },
  interactionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  interactionEmoji: {
    fontSize: 20,
  },
  interactionLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  conversationList: {
    backgroundColor: Colors.white,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginHorizontal: 12,
    borderRadius: Layout.radius.lg,
    ...Layout.shadow.card,
  },
  listSectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.textTertiary,
    marginBottom: 10,
  },
  convItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.divider,
  },
  convAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  convCenter: {
    flex: 1,
    marginLeft: 12,
  },
  convTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  convName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  merchantTag: {
    backgroundColor: '#E8F5E9',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginLeft: 6,
  },
  merchantTagText: {
    fontSize: 9,
    color: Colors.primaryDark,
    fontWeight: 'bold',
  },
  convTime: {
    fontSize: 10,
    color: Colors.textTertiary,
    marginLeft: 'auto',
  },
  convLastMsg: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  unreadBadge: {
    backgroundColor: Colors.rose,
    borderRadius: Layout.radius.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 18,
    alignItems: 'center',
    marginLeft: 6,
  },
  unreadText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
});
