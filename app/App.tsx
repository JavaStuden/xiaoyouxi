import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { AppProvider, useApp } from './src/context/AppContext';
import { AppHeader } from './src/components/AppHeader';
import { BottomTabBar } from './src/components/BottomTabBar';
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { RegisterScreen } from './src/screens/auth/RegisterScreen';
import { ForgotPasswordScreen } from './src/screens/auth/ForgotPasswordScreen';
import { OnboardingProfileScreen } from './src/screens/auth/OnboardingProfileScreen';
import { GardenScreen } from './src/screens/garden/GardenScreen';
import { EncounterScreen } from './src/screens/encounter/EncounterScreen';
import { MessagesScreen } from './src/screens/messages/MessagesScreen';
import { ProfileScreen } from './src/screens/profile/ProfileScreen';
import { MerchantScreen } from './src/screens/merchant/MerchantScreen';
import { Colors } from './src/constants/theme';

const MainNavigation: React.FC = () => {
  const { user, activeTab, role } = useApp();
  const [authScreen, setAuthScreen] = useState<'LOGIN' | 'REGISTER' | 'FORGOT' | 'ONBOARDING'>('LOGIN');

  // 未登录或注册流
  if (!user) {
    if (authScreen === 'REGISTER') {
      return (
        <RegisterScreen
          onBackToLogin={() => setAuthScreen('LOGIN')}
          onRegisterSuccess={() => setAuthScreen('ONBOARDING')}
        />
      );
    }
    if (authScreen === 'FORGOT') {
      return <ForgotPasswordScreen onBackToLogin={() => setAuthScreen('LOGIN')} />;
    }
    if (authScreen === 'ONBOARDING') {
      return <OnboardingProfileScreen onFinish={() => setAuthScreen('LOGIN')} />;
    }
    return (
      <LoginScreen
        onGoToRegister={() => setAuthScreen('REGISTER')}
        onGoToForgot={() => setAuthScreen('FORGOT')}
        onLoginSuccess={() => {}}
      />
    );
  }

  // 标题映射
  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'garden':
        return '捡果 · 鲜花庄园';
      case 'encounter':
        return '邂逅广场';
      case 'messages':
        return '消息通讯';
      case 'profile':
        return '个人中心';
      case 'merchant':
        return '商户私域工作台 2.0';
      default:
        return '捡果 App';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <AppHeader title={getHeaderTitle()} />

      <View style={styles.body}>
        {activeTab === 'garden' && <GardenScreen />}
        {activeTab === 'encounter' && <EncounterScreen />}
        {activeTab === 'messages' && <MessagesScreen />}
        {activeTab === 'profile' && <ProfileScreen />}
        {activeTab === 'merchant' && <MerchantScreen />}
      </View>

      <BottomTabBar />
    </View>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainNavigation />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  body: {
    flex: 1,
  },
});
