import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Colors, Typography, Layout } from '../../constants/theme';
import { useApp } from '../../context/AppContext';

interface LoginScreenProps {
  onGoToRegister: () => void;
  onGoToForgot: () => void;
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onGoToRegister, onGoToForgot, onLoginSuccess }) => {
  const { login, switchRole, role } = useApp();
  const [phone, setPhone] = useState('13800138000');
  const [password, setPassword] = useState('123456');
  const [agreed, setAgreed] = useState(true);
  const [loginMode, setLoginMode] = useState<'PASSWORD' | 'SMS'>('PASSWORD');
  const [smsCode, setSmsCode] = useState('');
  const [countdown, setCountdown] = useState(0);

  const isFormValid = phone.length >= 11 && (loginMode === 'PASSWORD' ? password.length >= 6 : smsCode.length >= 4) && agreed;

  const handleSendSms = () => {
    if (phone.length < 11) {
      Alert.alert('提示', '请输入正确的11位手机号码');
      return;
    }
    setCountdown(60);
    setSmsCode('888888');
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

  const handleLogin = async () => {
    if (!agreed) {
      Alert.alert('提示', '请先勾选同意《用户服务协议》和《隐私保护政策》');
      return;
    }
    await login(phone, password);
    onLoginSuccess();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        {/* 顶部品牌 */}
        <View style={styles.brandContainer}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoEmoji}>🍎</Text>
          </View>
          <Text style={styles.appName}>捡果 App</Text>
          <Text style={styles.appSlogan}>用心播种浪漫，邂逅同城美好</Text>
        </View>

        {/* 登录模式切换 */}
        <View style={styles.modeTabs}>
          <TouchableOpacity
            style={[styles.modeTab, loginMode === 'PASSWORD' && styles.modeTabActive]}
            onPress={() => setLoginMode('PASSWORD')}
          >
            <Text style={[styles.modeTabText, loginMode === 'PASSWORD' && styles.modeTabTextActive]}>
              账号密码登录
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeTab, loginMode === 'SMS' && styles.modeTabActive]}
            onPress={() => setLoginMode('SMS')}
          >
            <Text style={[styles.modeTabText, loginMode === 'SMS' && styles.modeTabTextActive]}>
              验证码免密登录
            </Text>
          </TouchableOpacity>
        </View>

        {/* 表单输入区 */}
        <View style={styles.formArea}>
          <View style={styles.inputBox}>
            <Text style={styles.inputPrefix}>+86</Text>
            <TextInput
              style={styles.input}
              placeholder="请输入手机号"
              placeholderTextColor={Colors.textTertiary}
              keyboardType="phone-pad"
              maxLength={11}
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          {loginMode === 'PASSWORD' ? (
            <View style={styles.inputBox}>
              <TextInput
                style={styles.input}
                placeholder="请输入登录密码 (6-16位)"
                placeholderTextColor={Colors.textTertiary}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
          ) : (
            <View style={[styles.inputBox, styles.inputBoxWithBtn]}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="请输入6位验证码"
                placeholderTextColor={Colors.textTertiary}
                keyboardType="number-pad"
                maxLength={6}
                value={smsCode}
                onChangeText={setSmsCode}
              />
              <TouchableOpacity
                style={[styles.smsBtn, countdown > 0 && styles.smsBtnDisabled]}
                onPress={handleSendSms}
                disabled={countdown > 0}
              >
                <Text style={styles.smsBtnText}>
                  {countdown > 0 ? `${countdown}s 重发` : '获取验证码'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 找回密码链接 */}
          <View style={styles.forgotRow}>
            <TouchableOpacity onPress={onGoToForgot}>
              <Text style={styles.forgotText}>忘记密码？</Text>
            </TouchableOpacity>
          </View>

          {/* 登录按钮 */}
          <TouchableOpacity
            style={[styles.loginBtn, !isFormValid && styles.loginBtnDisabled]}
            disabled={!isFormValid}
            onPress={handleLogin}
          >
            <Text style={styles.loginBtnText}>登 录</Text>
          </TouchableOpacity>

          {/* 协议勾选 */}
          <TouchableOpacity
            style={styles.agreementRow}
            onPress={() => setAgreed(!agreed)}
            activeOpacity={0.8}
          >
            <Text style={styles.checkbox}>{agreed ? '☑' : '☐'}</Text>
            <Text style={styles.agreementText}>
              我已仔细阅读并同意
              <Text style={styles.linkText}>《用户服务协议》</Text>与
              <Text style={styles.linkText}>《隐私保护政策》</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* 底部注册与商户切换 */}
        <View style={styles.bottomFooter}>
          <View style={styles.registerPrompt}>
            <Text style={styles.registerPromptText}>还没有账号？</Text>
            <TouchableOpacity onPress={onGoToRegister}>
              <Text style={styles.registerLink}>立即免费注册</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.roleSwitchBtn} onPress={switchRole}>
            <Text style={styles.roleSwitchText}>
              🔄 切换体验身份: {role === 'CONSUMER' ? '客户端用户' : '商户专属端'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 28,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  brandContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  logoBadge: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoEmoji: {
    fontSize: 36,
  },
  appName: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  appSlogan: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textTertiary,
    marginTop: 4,
  },
  modeTabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modeTab: {
    paddingVertical: 10,
    marginHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  modeTabActive: {
    borderBottomColor: Colors.primary,
  },
  modeTabText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textTertiary,
  },
  modeTabTextActive: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  formArea: {
    width: '100%',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    backgroundColor: Colors.background,
    borderRadius: Layout.radius.full,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  inputBoxWithBtn: {
    justifyContent: 'space-between',
  },
  inputPrefix: {
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
    fontWeight: 'bold',
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: Typography.fontSize.base,
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
  forgotRow: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  forgotText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textTertiary,
  },
  loginBtn: {
    height: 50,
    backgroundColor: Colors.primary,
    borderRadius: Layout.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...Layout.shadow.card,
  },
  loginBtnDisabled: {
    backgroundColor: '#B7EB8F',
  },
  loginBtnText: {
    color: Colors.white,
    fontSize: Typography.fontSize.lg,
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  agreementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    justifyContent: 'center',
  },
  checkbox: {
    fontSize: 16,
    color: Colors.primary,
    marginRight: 6,
  },
  agreementText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textTertiary,
  },
  linkText: {
    color: Colors.primary,
  },
  bottomFooter: {
    alignItems: 'center',
    paddingBottom: 10,
  },
  registerPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  registerPromptText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  registerLink: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  roleSwitchBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.background,
    borderRadius: Layout.radius.full,
  },
  roleSwitchText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
});
