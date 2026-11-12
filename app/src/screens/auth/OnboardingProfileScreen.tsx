import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Image, ScrollView, Alert } from 'react-native';
import { Colors, Typography, Layout } from '../../constants/theme';
import { useApp } from '../../context/AppContext';

interface OnboardingProfileScreenProps {
  onFinish: () => void;
}

export const OnboardingProfileScreen: React.FC<OnboardingProfileScreenProps> = ({ onFinish }) => {
  const { user } = useApp();
  const [nickname, setNickname] = useState(user?.nickname || '捡果新萌友');
  const [gender, setGender] = useState<1 | 2>(2); // 1:男, 2:女
  const [birthday, setBirthday] = useState('2000-10-15');
  const [zodiac, setZodiac] = useState('天秤座');
  const [bio, setBio] = useState('热爱鲜花与生活，静候花开~ 🌸');
  const [avatarIndex, setAvatarIndex] = useState(0);

  const AVATARS = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  ];

  const handleSelectGender = (val: 1 | 2) => {
    setGender(val);
  };

  const handleComplete = () => {
    if (!nickname.trim()) {
      Alert.alert('提示', '请为自己取一个好听的昵称');
      return;
    }
    onFinish();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>完善您的个人信息</Text>
        <Text style={styles.desc}>让同城花友更好地了解并关注您</Text>

        {/* 头像选择 */}
        <View style={styles.avatarSection}>
          <Image source={{ uri: AVATARS[avatarIndex] }} style={styles.currentAvatar} />
          <Text style={styles.avatarHint}>点击下方选择心仪头像</Text>
          <View style={styles.avatarRow}>
            {AVATARS.map((url, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => setAvatarIndex(idx)}
                style={[styles.avatarChoice, avatarIndex === idx && styles.avatarChoiceActive]}
              >
                <Image source={{ uri: url }} style={styles.miniAvatar} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 昵称输入 */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>昵称</Text>
          <TextInput
            style={styles.input}
            value={nickname}
            onChangeText={setNickname}
            placeholder="请输入个性昵称"
          />
        </View>

        {/* 性别单选 */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>性别</Text>
          <View style={styles.genderRow}>
            <TouchableOpacity
              style={[styles.genderBtn, gender === 1 && styles.genderBtnActive]}
              onPress={() => handleSelectGender(1)}
            >
              <Text style={styles.genderIcon}>♂ 男生</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.genderBtn, gender === 2 && styles.genderBtnActive]}
              onPress={() => handleSelectGender(2)}
            >
              <Text style={styles.genderIcon}>♀ 女生</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 生日与星座计算 */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>生日与星座</Text>
          <View style={styles.birthdayBox}>
            <TextInput
              style={styles.birthdayInput}
              value={birthday}
              onChangeText={setBirthday}
              placeholder="YYYY-MM-DD"
            />
            <View style={styles.zodiacBadge}>
              <Text style={styles.zodiacText}>⭐ {zodiac}</Text>
            </View>
          </View>
        </View>

        {/* 个性签名 */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>个性签名</Text>
          <TextInput
            style={[styles.input, styles.bioInput]}
            value={bio}
            onChangeText={setBio}
            placeholder="写一句喜欢的鲜花花语吧"
            multiline
          />
        </View>

        {/* 提交开启 */}
        <TouchableOpacity style={styles.submitBtn} onPress={handleComplete}>
          <Text style={styles.submitText}>开启捡果之旅</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  title: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  desc: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textTertiary,
    marginTop: 4,
    marginBottom: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  currentAvatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  avatarHint: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 8,
    marginBottom: 10,
  },
  avatarRow: {
    flexDirection: 'row',
  },
  avatarChoice: {
    marginHorizontal: 6,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarChoiceActive: {
    borderColor: Colors.primary,
  },
  miniAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  input: {
    height: 48,
    backgroundColor: Colors.background,
    borderRadius: Layout.radius.md,
    paddingHorizontal: 14,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  bioInput: {
    height: 70,
    paddingTop: 10,
    textAlignVertical: 'top',
  },
  genderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderBtn: {
    width: '48%',
    height: 44,
    backgroundColor: Colors.background,
    borderRadius: Layout.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  genderBtnActive: {
    borderColor: Colors.rose,
    backgroundColor: Colors.roseLight,
  },
  genderIcon: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  birthdayBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: Layout.radius.md,
    paddingHorizontal: 14,
    height: 48,
    justifyContent: 'space-between',
  },
  birthdayInput: {
    fontSize: 14,
    color: Colors.textPrimary,
    flex: 1,
  },
  zodiacBadge: {
    backgroundColor: '#FFF7E6',
    borderWidth: 1,
    borderColor: '#FFD591',
    borderRadius: Layout.radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  zodiacText: {
    color: '#D48806',
    fontSize: 12,
    fontWeight: 'bold',
  },
  submitBtn: {
    height: 50,
    backgroundColor: Colors.primary,
    borderRadius: Layout.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 40,
    ...Layout.shadow.card,
  },
  submitText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
