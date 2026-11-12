import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, SafeAreaView, Alert } from 'react-native';
import { Colors, Typography, Layout } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { GiftDrawer } from '../../components/GiftDrawer';

interface ChatDetailScreenProps {
  contactName: string;
  contactAvatar: string;
  contactRole?: string;
  onBack: () => void;
}

export const ChatDetailScreen: React.FC<ChatDetailScreenProps> = ({
  contactName,
  contactAvatar,
  contactRole = 'MERCHANT',
  onBack,
}) => {
  const { user, sendMessage } = useApp();
  const [inputText, setInputText] = useState('');
  const [giftDrawerVisible, setGiftDrawerVisible] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const [messageList, setMessageList] = useState([
    {
      id: 1,
      sender: 'them',
      type: 'TEXT',
      content: '您好！欢迎光临花之恋旗舰店，您的专属果园地块已为您准备好！',
      time: '18:10',
    },
    {
      id: 2,
      sender: 'me',
      type: 'TEXT',
      content: '太棒了，请问采摘后的花束可以直接去店里打包吗？',
      time: '18:12',
    },
    {
      id: 3,
      sender: 'them',
      type: 'VOICE',
      voiceDuration: 8,
      content: '语音留言 8"',
      time: '18:15',
    },
    {
      id: 4,
      sender: 'me',
      type: 'GIFT',
      giftName: '初恋红玫瑰',
      giftIcon: '🌹',
      content: '赠送了 [初恋红玫瑰] x1',
      time: '18:20',
    },
  ]);

  const handleSendText = () => {
    if (!inputText.trim()) return;
    setMessageList((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: 'me',
        type: 'TEXT',
        content: inputText,
        time: '刚刚',
      },
    ]);
    sendMessage(2, inputText, 'TEXT');
    setInputText('');
  };

  const handleSimulateVoice = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordingSeconds(1);
      const interval = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 15) {
            clearInterval(interval);
            return 15;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setIsRecording(false);
      setMessageList((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: 'me',
          type: 'VOICE',
          voiceDuration: Math.max(2, recordingSeconds),
          content: `语音留言 ${Math.max(2, recordingSeconds)}"`,
          time: '刚刚',
        },
      ]);
      setRecordingSeconds(0);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 顶部联系人导航栏 */}
        <View style={styles.navBar}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backText}>‹ 消息</Text>
          </TouchableOpacity>

          <View style={styles.navCenter}>
            <Text style={styles.navTitle}>{contactName}</Text>
            <Text style={styles.onlineStatus}>🟢 在线 | 鲜花合作商户</Text>
          </View>

          <TouchableOpacity
            style={styles.storeCardBtn}
            onPress={() =>
              Alert.alert(
                '商户门店档案',
                '【花之恋花艺淮海路旗舰店】\n📍 地址: 黄浦区淮海中路999号环贸广场L2\n💐 招牌: 厄瓜多尔七彩玫瑰、法式鲜花礼盒\n📞 电话: 021-88889999'
              )
            }
          >
            <Text style={styles.storeCardText}>🏪 门店</Text>
          </TouchableOpacity>
        </View>

        {/* 聊天气泡列表 */}
        <ScrollView contentContainerStyle={styles.messageScroll} showsVerticalScrollIndicator={false}>
          {messageList.map((msg) => {
            const isMe = msg.sender === 'me';
            return (
              <View
                key={msg.id}
                style={[styles.msgRow, isMe ? styles.msgRowMe : styles.msgRowThem]}
              >
                {!isMe && <Image source={{ uri: contactAvatar }} style={styles.bubbleAvatar} />}

                <View style={styles.bubbleContainer}>
                  {msg.type === 'TEXT' && (
                    <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
                      <Text style={[styles.bubbleText, isMe && styles.bubbleTextMe]}>
                        {msg.content}
                      </Text>
                    </View>
                  )}

                  {msg.type === 'VOICE' && (
                    <TouchableOpacity
                      style={[styles.bubble, styles.voiceBubble, isMe ? styles.bubbleMe : styles.bubbleThem]}
                      onPress={() => Alert.alert('播放语音', `正在播放 ${msg.voiceDuration}秒 语音消息... 🔊`)}
                    >
                      <Text style={[styles.voiceWave, isMe && styles.bubbleTextMe]}>
                        {isMe ? '••••• 🎙️' : '🎙️ •••••'} {msg.voiceDuration}"
                      </Text>
                    </TouchableOpacity>
                  )}

                  {msg.type === 'GIFT' && (
                    <View style={[styles.bubble, styles.giftBubble]}>
                      <Text style={styles.giftEmoji}>{msg.giftIcon || '🎁'}</Text>
                      <View style={styles.giftTextInfo}>
                        <Text style={styles.giftTitle}>{msg.content}</Text>
                        <Text style={styles.giftSub}>心意已传达至对方礼物墙</Text>
                      </View>
                    </View>
                  )}

                  <Text style={[styles.msgTime, isMe ? styles.timeMe : styles.timeThem]}>
                    {msg.time}
                  </Text>
                </View>

                {isMe && <Image source={{ uri: user?.avatarUrl }} style={styles.bubbleAvatar} />}
              </View>
            );
          })}
        </ScrollView>

        {/* 底部输入与操作条 */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[styles.audioToggleBtn, isRecording && styles.recordingBtn]}
            onPress={handleSimulateVoice}
          >
            <Text style={styles.audioToggleIcon}>{isRecording ? '⏹️ 松开发送' : '🎙️'}</Text>
          </TouchableOpacity>

          {!isRecording ? (
            <TextInput
              style={styles.textInput}
              placeholder="发消息..."
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSendText}
            />
          ) : (
            <View style={styles.recordingIndicator}>
              <Text style={styles.recordingText}>🔴 正在录制语音... {recordingSeconds}s</Text>
            </View>
          )}

          <TouchableOpacity style={styles.giftBtn} onPress={() => setGiftDrawerVisible(true)}>
            <Text style={styles.giftBtnIcon}>🎁</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sendBtn} onPress={handleSendText}>
            <Text style={styles.sendBtnText}>发送</Text>
          </TouchableOpacity>
        </View>

        {/* 礼物弹窗 */}
        <GiftDrawer
          visible={giftDrawerVisible}
          onClose={() => setGiftDrawerVisible(false)}
          onSendGift={(gift) => {
            setMessageList((prev) => [
              ...prev,
              {
                id: Date.now(),
                sender: 'me',
                type: 'GIFT',
                giftName: gift.name,
                giftIcon: gift.icon,
                content: `赠送了 [${gift.name}] x${gift.count}`,
                time: '刚刚',
              },
            ]);
            sendMessage(2, `赠送了 [${gift.name}]`, 'GIFT', gift.name, gift.cost);
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F6F8',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    padding: 6,
  },
  backText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  navCenter: {
    alignItems: 'center',
  },
  navTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  onlineStatus: {
    fontSize: 10,
    color: Colors.primaryDark,
    marginTop: 2,
  },
  storeCardBtn: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Layout.radius.full,
  },
  storeCardText: {
    fontSize: 12,
    color: Colors.primaryDark,
    fontWeight: '600',
  },
  messageScroll: {
    padding: 16,
    paddingBottom: 20,
  },
  msgRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  msgRowThem: {
    justifyContent: 'flex-start',
  },
  msgRowMe: {
    justifyContent: 'flex-end',
  },
  bubbleAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginHorizontal: 8,
  },
  bubbleContainer: {
    maxWidth: '72%',
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Layout.radius.lg,
  },
  bubbleThem: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 2,
  },
  bubbleMe: {
    backgroundColor: Colors.primary,
    borderTopRightRadius: 2,
  },
  bubbleText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  bubbleTextMe: {
    color: Colors.white,
  },
  voiceBubble: {
    minWidth: 100,
  },
  voiceWave: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primaryDark,
  },
  giftBubble: {
    backgroundColor: '#FFF0F2',
    borderWidth: 1,
    borderColor: '#FFCCC7',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  giftEmoji: {
    fontSize: 28,
    marginRight: 8,
  },
  giftTextInfo: {
    flex: 1,
  },
  giftTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.rose,
  },
  giftSub: {
    fontSize: 10,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  msgTime: {
    fontSize: 10,
    color: Colors.textTertiary,
    marginTop: 4,
  },
  timeMe: {
    textAlign: 'right',
  },
  timeThem: {
    textAlign: 'left',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.white,
    borderTopWidth: 0.5,
    borderTopColor: Colors.border,
  },
  audioToggleBtn: {
    padding: 8,
    marginRight: 6,
  },
  audioToggleIcon: {
    fontSize: 18,
  },
  recordingBtn: {
    backgroundColor: '#FFF1F0',
    borderRadius: Layout.radius.full,
  },
  textInput: {
    flex: 1,
    height: 40,
    backgroundColor: Colors.background,
    borderRadius: Layout.radius.full,
    paddingHorizontal: 14,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  recordingIndicator: {
    flex: 1,
    height: 40,
    backgroundColor: '#FFF1F0',
    borderRadius: Layout.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingText: {
    color: Colors.danger,
    fontSize: 13,
    fontWeight: 'bold',
  },
  giftBtn: {
    padding: 8,
    marginHorizontal: 4,
  },
  giftBtnIcon: {
    fontSize: 22,
  },
  sendBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Layout.radius.full,
  },
  sendBtnText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: 'bold',
  },
});
