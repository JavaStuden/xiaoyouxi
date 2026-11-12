import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, SafeAreaView, TextInput } from 'react-native';
import { Colors, Typography, Layout } from '../constants/theme';
import { VoiceRoom } from '../types';
import { GiftDrawer } from './GiftDrawer';

interface VoiceRoomModalProps {
  visible: boolean;
  room: VoiceRoom | null;
  onClose: () => void;
}

export const VoiceRoomModal: React.FC<VoiceRoomModalProps> = ({ visible, room, onClose }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [giftDrawerVisible, setGiftDrawerVisible] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { user: '系统提醒', text: '欢迎加入捡果鲜花语音房，请文明交流，遵守社交守则。', isSys: true },
    { user: '林小果', text: '大家晚上好呀！我的玫瑰成熟了~ 🌹', isSys: false },
    { user: '花店掌柜', text: '恭喜小果！随时来门店兑换精美定制礼盒', isSys: false },
  ]);

  if (!room) return null;

  const seats = [
    { seatIndex: 1, name: '房主', avatar: '👑', isSpeaking: true },
    { seatIndex: 2, name: '林小果', avatar: '🌸', isSpeaking: false },
    { seatIndex: 3, name: '空麦位', avatar: '➕', isSpeaking: false },
    { seatIndex: 4, name: '空麦位', avatar: '➕', isSpeaking: false },
    { seatIndex: 5, name: '空麦位', avatar: '➕', isSpeaking: false },
    { seatIndex: 6, name: '空麦位', avatar: '➕', isSpeaking: false },
    { seatIndex: 7, name: '空麦位', avatar: '➕', isSpeaking: false },
    { seatIndex: 8, name: '空麦位', avatar: '➕', isSpeaking: false },
  ];

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setMessages((prev) => [...prev, { user: '我', text: chatInput, isSys: false }]);
    setChatInput('');
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* 顶部房间信息栏 */}
          <View style={styles.header}>
            <View>
              <Text style={styles.roomTitle}>{room.title}</Text>
              <Text style={styles.roomSub}>🔥 在线人数: {room.onlineCount} 人 | 房主: {room.hostName}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.exitBtn}>
              <Text style={styles.exitText}>退出房间</Text>
            </TouchableOpacity>
          </View>

          {/* 公告横幅 */}
          <View style={styles.banner}>
            <Text style={styles.bannerIcon}>📢</Text>
            <Text style={styles.bannerText} numberOfLines={1}>{room.announcement}</Text>
          </View>

          {/* 8 麦位网格 */}
          <View style={styles.micGrid}>
            {seats.map((seat) => (
              <View key={seat.seatIndex} style={styles.micSeatItem}>
                <View style={[styles.avatarCircle, seat.isSpeaking && styles.speakingHalo]}>
                  <Text style={styles.avatarEmoji}>{seat.avatar}</Text>
                  {seat.isSpeaking && (
                    <View style={styles.waveBar}>
                      <Text style={styles.waveText}>•••</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.seatName} numberOfLines={1}>
                  {seat.name}
                </Text>
              </View>
            ))}
          </View>

          {/* 实时公屏弹幕聊天 */}
          <View style={styles.chatArea}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.chatContent}>
              {messages.map((msg, idx) => (
                <View key={idx} style={[styles.msgRow, msg.isSys && styles.msgSysRow]}>
                  <Text style={[styles.msgUser, msg.isSys && styles.msgSysUser]}>{msg.user}: </Text>
                  <Text style={[styles.msgText, msg.isSys && styles.msgSysText]}>{msg.text}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* 底部控制工具栏 */}
          <View style={styles.bottomBar}>
            <TextInput
              style={styles.chatInput}
              placeholder="说点好听的..."
              placeholderTextColor="#888"
              value={chatInput}
              onChangeText={setChatInput}
              onSubmitEditing={handleSendMessage}
            />
            <TouchableOpacity onPress={handleSendMessage} style={styles.sendIconBtn}>
              <Text style={styles.sendIconText}>发送</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsMuted(!isMuted)}
              style={[styles.toolBtn, isMuted && styles.toolBtnActive]}
            >
              <Text style={styles.toolIcon}>{isMuted ? '🔇' : '🎙️'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setGiftDrawerVisible(true)}
              style={[styles.toolBtn, styles.giftToolBtn]}
            >
              <Text style={styles.toolIcon}>🎁</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 礼物弹窗 */}
        <GiftDrawer
          visible={giftDrawerVisible}
          onClose={() => setGiftDrawerVisible(false)}
          onSendGift={(gift) => {
            setMessages((prev) => [
              ...prev,
              { user: '全服广播', text: `✨ 感谢我送出 ${gift.name} ${gift.icon} x${gift.count}!`, isSys: true }
            ]);
          }}
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.darkBg,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.darkBg,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  roomTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: 'bold',
    color: Colors.white,
  },
  roomSub: {
    fontSize: Typography.fontSize.xs,
    color: '#9E9EB2',
    marginTop: 3,
  },
  exitBtn: {
    backgroundColor: '#35354A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Layout.radius.full,
  },
  exitText: {
    color: '#FF7875',
    fontSize: 12,
    fontWeight: '600',
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E2D',
    borderRadius: Layout.radius.md,
    padding: 8,
    marginVertical: 6,
  },
  bannerIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  bannerText: {
    color: '#C7C7DC',
    fontSize: 12,
    flex: 1,
  },
  micGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  micSeatItem: {
    width: '23%',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#2A2A3E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#3D3D58',
  },
  speakingHalo: {
    borderColor: '#52C41A',
    borderWidth: 2.5,
    backgroundColor: '#1B382B',
  },
  avatarEmoji: {
    fontSize: 22,
  },
  waveBar: {
    position: 'absolute',
    bottom: -4,
    backgroundColor: '#52C41A',
    borderRadius: 6,
    paddingHorizontal: 4,
  },
  waveText: {
    fontSize: 8,
    color: Colors.white,
    fontWeight: 'bold',
  },
  seatName: {
    color: '#AEAECA',
    fontSize: 11,
    marginTop: 6,
  },
  chatArea: {
    flex: 1,
    backgroundColor: 'rgba(25, 25, 38, 0.7)',
    borderRadius: Layout.radius.lg,
    padding: 10,
    marginVertical: 8,
  },
  chatContent: {
    paddingBottom: 8,
  },
  msgRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  msgSysRow: {
    backgroundColor: 'rgba(255, 77, 106, 0.1)',
    borderRadius: 4,
    padding: 4,
  },
  msgUser: {
    color: '#FF85C0',
    fontSize: 12,
    fontWeight: '600',
  },
  msgSysUser: {
    color: '#FAAD14',
  },
  msgText: {
    color: '#EEEEF5',
    fontSize: 12,
  },
  msgSysText: {
    color: '#FAAD14',
    fontWeight: 'bold',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  chatInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#252536',
    borderRadius: Layout.radius.full,
    paddingHorizontal: 14,
    color: Colors.white,
    fontSize: 13,
  },
  sendIconBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Layout.radius.full,
    marginLeft: 6,
  },
  sendIconText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  toolBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2A2A3E',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  toolBtnActive: {
    backgroundColor: '#FF4D4F',
  },
  giftToolBtn: {
    backgroundColor: Colors.rose,
  },
  toolIcon: {
    fontSize: 18,
  },
});
