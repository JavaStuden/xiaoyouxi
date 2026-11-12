import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Colors, Typography, Layout } from '../../constants/theme';
import { useApp } from '../../context/AppContext';

interface RegisterScreenProps {
  onBackToLogin: () => void;
  onRegisterSuccess: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onBackToLogin, onRegisterSuccess }) => {
  const { register } = useApp();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'CONSUMER' | 'MERCHANT'>('CONSUMER');
  const [countdown, setCountdown] = useState(0);

  const startCountdown = () => {
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

  const handleNextStep1 = () => {
    if (phone.length < 11) {
      Alert.alert('提示', '请输入正确的11位手机号码');
      return;
    }
    startCountdown();
    setStep(2);
  };

  const handleNextStep2 = () => {
    if (code.length < 4) {
      Alert.alert('提示', '请输入收到的验证码');
      return;
    }
    setStep(3);
  };

  const handleCompleteRegister = async () => {
    if (password.length < 6) {
      Alert.alert('提示', '请设置至少6位密码');
      return;
    }
    await register(phone, password, role);
    Alert.alert('注册成功', '欢迎加入捡果！请完善您的个人资料', [
      { text: '确定', onPress: onRegisterSuccess }
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 顶部返回与步骤条 */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onBackToLogin} style={styles.backBtn}>
            <Text style={styles.backText}>‹ 返回登录</Text>
          </TouchableOpacity>
          <Text style={styles.stepIndicator}>步骤 {step}/3</Text>
        </View>

        <View style={styles.content}>
          {step === 1 && (
            <View>
              <Text style={styles.stepTitle}>请输入您的手机号码</Text>
              <Text style={styles.stepDesc}>我们将发送短信验证码核验您的手机身份</Text>

              <View style={styles.inputBox}>
                <Text style={styles.prefix}>+86</Text>
                <TextInput
                  style={styles.input}
                  placeholder="请输入手机号"
                  keyboardType="phone-pad"
                  maxLength={11}
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>

              <TouchableOpacity
                style={[styles.actionBtn, phone.length < 11 && styles.actionBtnDisabled]}
                disabled={phone.length < 11}
                onPress={handleNextStep1}
              >
                <Text style={styles.actionBtnText}>获取短信验证码</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 2 && (
            <View>
              <Text style={styles.stepTitle}>输入验证码</Text>
              <Text style={styles.stepDesc}>已发送至 +86 {phone}</Text>

              <View style={styles.codeRow}>
                <TextInput
                  style={styles.codeInput}
                  placeholder="请输入6位验证码 (演示填: 888888)"
                  keyboardType="number-pad"
                  maxLength={6}
                  value={code}
                  onChangeText={setCode}
                />
              </View>

              <TouchableOpacity
                style={styles.resendBtn}
                disabled={countdown > 0}
                onPress={startCountdown}
              >
                <Text style={styles.resendText}>
                  {countdown > 0 ? `${countdown}秒后可重新发送` : '重新发送验证码'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, code.length < 4 && styles.actionBtnDisabled]}
                disabled={code.length < 4}
                onPress={handleNextStep2}
              >
                <Text style={styles.actionBtnText}>下一步</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 3 && (
            <View>
              <Text style={styles.stepTitle}>设置账号密码与身份</Text>
              <Text style={styles.stepDesc}>请选择您的角色定位并设置安全的密码</Text>

              <View style={styles.roleSelector}>
                <TouchableOpacity
                  style={[styles.roleCard, role === 'CONSUMER' && styles.roleCardActive]}
                  onPress={() => setRole('CONSUMER')}
                >
                  <Text style={styles.roleEmoji}>🌷</Text>
                  <Text style={[styles.roleName, role === 'CONSUMER' && styles.roleTextActive]}>
                    普通果园主
                  </Text>
                  <Text style={styles.roleSub}>种植鲜花·邂逅交友</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.roleCard, role === 'MERCHANT' && styles.roleCardActive]}
                  onPress={() => setRole('MERCHANT')}
                >
                  <Text style={styles.roleEmoji}>🏪</Text>
                  <Text style={[styles.roleName, role === 'MERCHANT' && styles.roleTextActive]}>
                    鲜花合作商户
                  </Text>
                  <Text style={styles.roleSub}>客源维系·礼盒兑换</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputBox}>
                <TextInput
                  style={styles.input}
                  placeholder="请设置登录密码 (6-16位)"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              <TouchableOpacity
                style={[styles.actionBtn, password.length < 6 && styles.actionBtnDisabled]}
                disabled={password.length < 6}
                onPress={handleCompleteRegister}
              >
                <Text style={styles.actionBtnText}>完成注册并开启体验</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  backBtn: {
    padding: 6,
  },
  backText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  stepIndicator: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  stepTitle: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  stepDesc: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textTertiary,
    marginTop: 6,
    marginBottom: 24,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    backgroundColor: Colors.background,
    borderRadius: Layout.radius.full,
    paddingHorizontal: 16,
    marginBottom: 20,
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
  codeRow: {
    marginBottom: 16,
  },
  codeInput: {
    height: 52,
    backgroundColor: Colors.background,
    borderRadius: Layout.radius.full,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  resendBtn: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resendText: {
    fontSize: 13,
    color: Colors.primary,
  },
  roleSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  roleCard: {
    width: '48%',
    backgroundColor: Colors.background,
    borderRadius: Layout.radius.lg,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  roleCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  roleEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  roleName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  roleTextActive: {
    color: Colors.primaryDark,
  },
  roleSub: {
    fontSize: 10,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  actionBtn: {
    height: 50,
    backgroundColor: Colors.primary,
    borderRadius: Layout.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    ...Layout.shadow.card,
  },
  actionBtnDisabled: {
    backgroundColor: '#B7EB8F',
  },
  actionBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
