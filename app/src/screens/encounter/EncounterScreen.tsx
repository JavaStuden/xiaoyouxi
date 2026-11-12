import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { Colors, Typography, Layout } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { FilterDrawer } from '../../components/FilterDrawer';
import { VoiceRoomModal } from '../../components/VoiceRoomModal';
import { ModalContainer } from '../../components/ModalContainer';
import { Moment, VoiceRoom } from '../../types';

export const EncounterScreen: React.FC = () => {
  const { moments, likeMoment, activeVoiceRoom, setActiveVoiceRoom } = useApp();
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [postModalVisible, setPostModalVisible] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [selectedMoment, setSelectedMoment] = useState<Moment | null>(null);

  // 默认模拟语音房数据
  const defaultRoom: VoiceRoom = {
    roomId: 101,
    title: '🎵 心动电台与花园慢聊房 (8麦畅聊)',
    hostId: 1,
    hostName: '林小果',
    hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    onlineCount: 86,
    announcement: '欢迎来到捡果官方语音房！今晚分享大家的花园收成与浪漫日常，上麦请戴耳机。',
    activeSeatsJson: '[]',
  };

  const handleApplyFilter = (filters: any) => {
    Alert.alert('筛选已应用', `已筛选: ${filters.gender}, 距离: ${filters.distance}`);
  };

  const handlePostMoment = () => {
    if (!postContent.trim()) {
      Alert.alert('提示', '请填写动态文字内容');
      return;
    }
    Alert.alert('发布成功', '您的鲜花生活动态已同步至邂逅广场！');
    setPostContent('');
    setPostModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* 顶部搜索与筛选栏 */}
      <View style={styles.topBar}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="搜索附近花友、动态话题..."
            placeholderTextColor={Colors.textTertiary}
          />
        </View>

        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => setFilterDrawerVisible(true)}
        >
          <Text style={styles.filterIcon}>⚙️ 筛选</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.postBtn}
          onPress={() => setPostModalVisible(true)}
        >
          <Text style={styles.postIcon}>✏️ 发布</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* 顶部多人暗色语音房入口横幅 */}
        <TouchableOpacity
          style={styles.voiceRoomBanner}
          activeOpacity={0.9}
          onPress={() => setActiveVoiceRoom(defaultRoom)}
        >
          <View style={styles.voiceLeft}>
            <View style={styles.liveTag}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>8麦派对 LIVE</Text>
            </View>
            <Text style={styles.voiceTitle}>{defaultRoom.title}</Text>
            <Text style={styles.voiceSub}>🔥 86人正在同频听歌连麦，点击即刻上麦</Text>
          </View>
          <View style={styles.voiceRight}>
            <Text style={styles.voiceEnterEmoji}>🎙️</Text>
          </View>
        </TouchableOpacity>

        {/* 邂逅动态瀑布流 */}
        <View style={styles.feedList}>
          {moments.map((item) => {
            let images: string[] = [];
            try {
              images = JSON.parse(item.mediaUrls);
            } catch (e) {
              images = [];
            }

            return (
              <View key={item.momentId} style={styles.momentCard}>
                {/* 发帖人信息 */}
                <View style={styles.cardHeader}>
                  <Image source={{ uri: item.authorAvatar }} style={styles.authorAvatar} />
                  <View style={styles.authorInfo}>
                    <View style={styles.nameBadgeRow}>
                      <Text style={styles.authorName}>{item.authorName}</Text>
                      {item.authorRealVerified && (
                        <View style={styles.verifiedBadge}>
                          <Text style={styles.verifiedText}>✓ 真人认证</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.momentTime}>{item.createdAt} · {item.locationName}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.moreActionBtn}
                    onPress={() =>
                      Alert.alert('更多操作', '请选择', [
                        { text: '分享至微信朋友圈' },
                        { text: '举报或拉黑' },
                        { text: '取消', style: 'cancel' },
                      ])
                    }
                  >
                    <Text style={styles.moreActionText}>•••</Text>
                  </TouchableOpacity>
                </View>

                {/* 动态正文 */}
                <Text style={styles.momentText}>{item.content}</Text>

                {/* 图片九宫格/多图 */}
                {images.length > 0 && (
                  <View style={styles.imageGrid}>
                    {images.map((imgUrl, idx) => (
                      <Image key={idx} source={{ uri: imgUrl }} style={styles.momentImage} />
                    ))}
                  </View>
                )}

                {/* 底部交互栏 (点赞、评论、打赏) */}
                <View style={styles.cardFooter}>
                  <TouchableOpacity
                    style={styles.footerAction}
                    onPress={() => likeMoment(item.momentId)}
                  >
                    <Text style={styles.actionEmoji}>❤️</Text>
                    <Text style={styles.actionNum}>{item.likeCount}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.footerAction}
                    onPress={() => setSelectedMoment(item)}
                  >
                    <Text style={styles.actionEmoji}>💬</Text>
                    <Text style={styles.actionNum}>{item.commentCount}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.footerAction, styles.tipAction]}
                    onPress={() => Alert.alert('心动赠礼', '已向该花友投喂 1 朵浪漫红玫瑰 🌹')}
                  >
                    <Text style={styles.actionEmoji}>🌹</Text>
                    <Text style={styles.tipText}>投喂鲜花</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* 动态评论弹窗 */}
      {selectedMoment && (
        <ModalContainer
          visible={!!selectedMoment}
          onClose={() => setSelectedMoment(null)}
          title="动态详情与评论"
          height={450}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.detailContent}>{selectedMoment.content}</Text>
            <View style={styles.divider} />
            <Text style={styles.commentSectionTitle}>热门评论 ({selectedMoment.commentCount})</Text>

            <View style={styles.commentItem}>
              <Text style={styles.commentUser}>花之恋花艺旗舰店: </Text>
              <Text style={styles.commentBody}>
                花色饱满纯正，欢迎来我们淮海路门店兑换精美定制花瓶！
              </Text>
            </View>

            <View style={styles.commentItem}>
              <Text style={styles.commentUser}>江畔晨星: </Text>
              <Text style={styles.commentBody}>太好看了吧，怎么种出的5级粉玫瑰呀？</Text>
            </View>
          </ScrollView>
        </ModalContainer>
      )}

      {/* 发布动态弹窗 */}
      <ModalContainer
        visible={postModalVisible}
        onClose={() => setPostModalVisible(false)}
        title="发布鲜花生活动态"
        height={400}
      >
        <TextInput
          style={styles.postInput}
          placeholder="分享你的鲜花果园动态、同城心情..."
          multiline
          value={postContent}
          onChangeText={setPostContent}
        />
        <View style={styles.locationTagRow}>
          <Text style={styles.locationTagIcon}>📍</Text>
          <Text style={styles.locationTagText}>当前定位: 静安大悦城·空中花园</Text>
        </View>
        <TouchableOpacity style={styles.submitPostBtn} onPress={handlePostMoment}>
          <Text style={styles.submitPostText}>立即公开发布</Text>
        </TouchableOpacity>
      </ModalContainer>

      {/* 筛选抽屉 */}
      <FilterDrawer
        visible={filterDrawerVisible}
        onClose={() => setFilterDrawerVisible(false)}
        onApply={handleApplyFilter}
      />

      {/* 多人暗色语音聊天室 */}
      <VoiceRoomModal
        visible={!!activeVoiceRoom}
        room={activeVoiceRoom}
        onClose={() => setActiveVoiceRoom(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  searchBox: {
    flex: 1,
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
  filterBtn: {
    marginLeft: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: Layout.radius.full,
    backgroundColor: Colors.background,
  },
  filterIcon: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  postBtn: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Layout.radius.full,
    backgroundColor: Colors.primary,
  },
  postIcon: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingVertical: 10,
  },
  voiceRoomBanner: {
    flexDirection: 'row',
    backgroundColor: '#1E1E2D',
    borderRadius: Layout.radius.lg,
    padding: 14,
    marginHorizontal: 12,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#3D3D58',
    ...Layout.shadow.card,
  },
  voiceLeft: {
    flex: 1,
  },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.rose,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Layout.radius.full,
    marginBottom: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.white,
    marginRight: 4,
  },
  liveText: {
    fontSize: 9,
    color: Colors.white,
    fontWeight: 'bold',
  },
  voiceTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.white,
  },
  voiceSub: {
    fontSize: 11,
    color: '#AEAECA',
    marginTop: 4,
  },
  voiceRight: {
    marginLeft: 10,
  },
  voiceEnterEmoji: {
    fontSize: 32,
  },
  feedList: {
    paddingHorizontal: 12,
  },
  momentCard: {
    backgroundColor: Colors.white,
    borderRadius: Layout.radius.lg,
    padding: 14,
    marginBottom: 12,
    ...Layout.shadow.card,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  authorAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  authorInfo: {
    flex: 1,
    marginLeft: 10,
  },
  nameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  verifiedBadge: {
    backgroundColor: '#E6F7FF',
    borderRadius: Layout.radius.full,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 6,
    borderWidth: 0.5,
    borderColor: '#91D5FF',
  },
  verifiedText: {
    color: '#1890FF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  momentTime: {
    fontSize: 11,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  moreActionBtn: {
    padding: 6,
  },
  moreActionText: {
    fontSize: 16,
    color: Colors.textTertiary,
  },
  momentText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
    marginBottom: 10,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  momentImage: {
    width: '48%',
    height: 120,
    borderRadius: Layout.radius.md,
    marginRight: 6,
    marginBottom: 6,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 0.5,
    borderTopColor: Colors.divider,
    paddingTop: 10,
  },
  footerAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  actionNum: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  tipAction: {
    backgroundColor: Colors.roseLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Layout.radius.full,
  },
  tipText: {
    fontSize: 11,
    color: Colors.rose,
    fontWeight: 'bold',
  },
  detailContent: {
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 22,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: 10,
  },
  commentSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  commentItem: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.divider,
  },
  commentUser: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.primaryDark,
  },
  commentBody: {
    fontSize: 13,
    color: Colors.textPrimary,
    flex: 1,
  },
  postInput: {
    height: 120,
    backgroundColor: Colors.background,
    borderRadius: Layout.radius.md,
    padding: 12,
    fontSize: 14,
    textAlignVertical: 'top',
    color: Colors.textPrimary,
  },
  locationTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  locationTagIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  locationTagText: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  submitPostBtn: {
    height: 48,
    backgroundColor: Colors.primary,
    borderRadius: Layout.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitPostText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: 'bold',
  },
});
