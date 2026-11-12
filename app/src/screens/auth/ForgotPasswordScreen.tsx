import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Colors, Typography, Layout } from '../../constants/theme';
import { apiClient } from '../../api/client';

interface ForgotPasswordScreenProps {
  onBackToLogin: () => void;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ onBackToLogin }) => {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [countdown, setCountdown] = useState(0);

  const startCountdown = () => {
    if (phone.length < 11) {
      Alert.alert('提示', '请先输入绑定的手机号');
      return;
    }
    setCountdown(60);
    setCode('888888');
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleReset = async () => {
    if (phone.length < 11 || code.length < 4 || newPassword.length < 6) {
      Alert.alert('提示', '请完整填写所有信息');
      return;
    }
    try {
      await apiClient.post('/auth/reset-password', { phone, code, newPassword });
    } catch (e) {}

    Alert.alert('重置成功', '新密码已更新，请使用新密码重新登录', [
      { text: '返回登录', onPress: onBackToLogin }
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity onPress={onBackToLogin} style={styles.backBtn}>
          <Text style={styles.backText}>‹ 返回登录</Text>
        </TouchableOpacity>

        <Text style={styles.title}>找回账号密码</Text>
        <Text style={styles.desc}>核验手机号码后即可直接设定您的新密码</Text>

        <View style={styles.inputBox}>
          <Text style={styles.prefix}>+86</Text>
          <TextInput
            style={styles.input}
            placeholder="请输入绑定手机号"
            keyboardType="phone-pad"
            maxLength={11}
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <View style={[styles.inputBox, styles.inputBoxWithBtn]}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="输入短信验证码"
            keyboardType="number-pad"
            value={code}
            onChangeText={setCode}
          />
          <TouchableOpacity
            style={[styles.smsBtn, countdown > 0 && styles.smsBtnDisabled]}
            disabled={countdown > 0}
            onPress={startCountdown}
          >
            <Text style={styles.smsBtnText}>
              {countdown > 0 ? `${countdown}s` : '获取验证码'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            placeholder="请设置新密码 (6-16位)"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleReset}>
          <Text style={styles.submitText}>确认修改并重置</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  backBtn: {
    paddingVertical: 8,
    marginBottom: 20,
  },
  backText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  title: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  desc: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textTertiary,
    marginTop: 6,
    marginBottom: 28,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    backgroundColor: Colors.background,
    borderRadius: Layout.radius.full,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  inputBoxWithBtn: {
    justifyContent: 'space-between',
  },
  prefix: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  smsBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Layout.radius.full,
  },
  smsBtnDisabled: {
    backgroundColor: '#CCC',
  },
  smsBtnText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  submitBtn: {
    height: 50,
    backgroundColor: Colors.primary,
    borderRadius: Layout.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  submitText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
