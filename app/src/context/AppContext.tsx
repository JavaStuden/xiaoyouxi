import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, GardenLand, BackpackItem, Moment, ChatConversation, ChatMessage, VoiceRoom, CustomerDetail, GiftWallRecord, ShippingAddress, DailyTask } from '../types';
import { apiClient, setAuthToken } from '../api/client';

interface AppContextType {
  user: User | null;
  role: 'CONSUMER' | 'MERCHANT';
  activeTab: string;
  setActiveTab: (tab: string) => void;
  switchRole: () => void;
  lands: GardenLand[];
  backpack: BackpackItem[];
  moments: Moment[];
  conversations: ChatConversation[];
  activeVoiceRoom: VoiceRoom | null;
  setActiveVoiceRoom: (room: VoiceRoom | null) => void;
  login: (phone: string, pass: string) => Promise<void>;
  register: (phone: string, pass: string, role: 'CONSUMER' | 'MERCHANT') => Promise<void>;
  logout: () => void;
  refreshLands: () => Promise<void>;
  plantSeed: (landIndex: number, seedId: number) => Promise<void>;
  waterLand: (landIndex: number) => Promise<void>;
  disinfestLand: (landIndex: number) => Promise<void>;
  harvestLand: (landIndex: number) => Promise<number>;
  upgradeLand: (landIndex: number) => Promise<void>;
  purchaseLand: (landIndex: number) => Promise<void>;
  refreshBackpack: () => Promise<void>;
  buyShopItem: (itemId: number, quantity?: number) => Promise<void>;
  likeMoment: (momentId: number) => Promise<void>;
  sendMessage: (receiverId: number, content: string, type?: 'TEXT' | 'VOICE' | 'GIFT', giftName?: string, giftCost?: number) => Promise<void>;
  rechargeCoins: (amount: number, coins: number) => Promise<void>;
  upgradeVipLevel: (level: number) => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    userId: 1,
    phone: '13800138000',
    role: 'CONSUMER',
    nickname: '林小果',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    gender: 2,
    birthday: '2000-10-15',
    zodiacSign: '天秤座',
    bio: '在捡果花园里，静候每一朵鲜花绽放 🌸',
    realPersonVerified: true,
    vipLevel: 2, // SVIP
    coinBalance: 3680.00,
    flowerBalance: 128,
    gardenActivated: true,
  });

  const [role, setRole] = useState<'CONSUMER' | 'MERCHANT'>('CONSUMER');
  const [activeTab, setActiveTab] = useState('garden');
  const [activeVoiceRoom, setActiveVoiceRoom] = useState<VoiceRoom | null>(null);

  // 初始化 12 块土地原型模拟数据
  const [lands, setLands] = useState<GardenLand[]>([
    { landId: 1, userId: 1, landIndex: 1, landLevel: 2, status: 'MATURE', currentSeedId: 1, plantName: '浪漫红玫瑰', currentStage: 5, moistureVal: 95, hasPest: false, estimatedYield: 8 },
    { landId: 2, userId: 1, landIndex: 2, landLevel: 2, status: 'PEST_INFESTED', currentSeedId: 2, plantName: '金色郁金香', currentStage: 4, moistureVal: 30, hasPest: true, estimatedYield: 10 },
    { landId: 3, userId: 1, landIndex: 3, landLevel: 1, status: 'GROWING', currentSeedId: 1, plantName: '香槟玫瑰', currentStage: 2, moistureVal: 55, hasPest: false, estimatedYield: 6 },
    { landId: 4, userId: 1, landIndex: 4, landLevel: 1, status: 'EMPTY', currentStage: 0, moistureVal: 85, hasPest: false },
    { landId: 5, userId: 1, landIndex: 5, landLevel: 1, status: 'EMPTY', currentStage: 0, moistureVal: 80, hasPest: false },
    { landId: 6, userId: 1, landIndex: 6, landLevel: 1, status: 'EMPTY', currentStage: 0, moistureVal: 80, hasPest: false },
    { landId: 7, userId: 1, landIndex: 7, landLevel: 1, status: 'LOCKED', currentStage: 0, moistureVal: 0, hasPest: false },
    { landId: 8, userId: 1, landIndex: 8, landLevel: 1, status: 'LOCKED', currentStage: 0, moistureVal: 0, hasPest: false },
    { landId: 9, userId: 1, landIndex: 9, landLevel: 1, status: 'LOCKED', currentStage: 0, moistureVal: 0, hasPest: false },
    { landId: 10, userId: 1, landIndex: 10, landLevel: 1, status: 'LOCKED', currentStage: 0, moistureVal: 0, hasPest: false },
    { landId: 11, userId: 1, landIndex: 11, landLevel: 1, status: 'LOCKED', currentStage: 0, moistureVal: 0, hasPest: false },
    { landId: 12, userId: 1, landIndex: 12, landLevel: 1, status: 'LOCKED', currentStage: 0, moistureVal: 0, hasPest: false },
  ]);

  const [backpack, setBackpack] = useState<BackpackItem[]>([
    { id: 1, itemId: 1, name: '浪漫红玫瑰种子', itemType: 'SEED', description: '花语是热恋与长相厮守', price: 10, iconUrl: '🌹', quantity: 15, matureTimeSeconds: 30 },
    { id: 2, itemId: 2, name: '金色郁金香种子', itemType: 'SEED', description: '荷兰进口名贵花卉，尊贵与优雅', price: 25, iconUrl: '🌷', quantity: 8, matureTimeSeconds: 60 },
    { id: 3, itemId: 3, name: '强效除虫药剂', itemType: 'PEST_SPRAY', description: '特效生物喷剂，一键灭除果园全部害虫', price: 15, iconUrl: '🧴', quantity: 5 },
    { id: 4, itemId: 4, name: '充盈补水壶', itemType: 'WATER_CAN', description: '快速为干涸土地浇水，维持水源充盈', price: 8, iconUrl: '💧', quantity: 6 },
    { id: 5, itemId: 5, name: '高效催熟肥', itemType: 'FERTILIZER', description: '缩短50%花卉绽放时间', price: 30, iconUrl: '⚡', quantity: 3 },
    { id: 6, itemId: 6, name: '盛宴99朵臻爱玫瑰花束', itemType: 'BOUQUET', description: '手工定制礼盒花束，可赠予好友或到店兑换实物', price: 199, iconUrl: '💐', quantity: 2 },
  ]);

  const [moments, setMoments] = useState<Moment[]>([
    {
      momentId: 1,
      userId: 1,
      authorName: '林小果',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      authorVipLevel: 2,
      authorRealVerified: true,
      content: '今天果园里的第一束粉色玫瑰盛放了！散发着淡淡的清香，想要送给同城有缘的小伙伴~ 🌷✨',
      mediaUrls: JSON.stringify([
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800',
        'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=800'
      ]),
      locationName: '静安大悦城·空中花园',
      likeCount: 38,
      commentCount: 6,
      createdAt: '10分钟前',
    },
    {
      momentId: 2,
      userId: 2,
      authorName: '花之恋花艺旗舰店',
      authorAvatar: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=200&auto=format&fit=crop&q=80',
      authorVipLevel: 3,
      authorRealVerified: true,
      content: '今日新到厄瓜多尔进口玫瑰！欢迎各位花园主凭成熟玫瑰积分到店免费兑换实物伴手礼花束 🎁💐',
      mediaUrls: JSON.stringify([
        'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800'
      ]),
      locationName: '花之恋旗舰店·淮海中路店',
      likeCount: 92,
      commentCount: 15,
      createdAt: '1小时前',
    }
  ]);

  const [conversations, setConversations] = useState<ChatConversation[]>([
    {
      contactUserId: 2,
      contactName: '花之恋花艺旗舰店',
      contactAvatar: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=200',
      role: 'MERCHANT',
      lastMessage: '赠送了 [红玫瑰] x1',
      lastMessageTime: '18:30',
      unreadCount: 1,
    },
    {
      contactUserId: 3,
      contactName: '苏夏 (同城鲜花达人)',
      contactAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
      role: 'CONSUMER',
      lastMessage: '明天一起浇水除虫吗？',
      lastMessageTime: '昨天',
      unreadCount: 0,
    }
  ]);

  const switchRole = () => {
    if (role === 'CONSUMER') {
      setRole('MERCHANT');
      setUser(prev => prev ? {
        ...prev,
        userId: 2,
        role: 'MERCHANT',
        nickname: '花之恋花艺旗舰店',
        avatarUrl: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=200',
        vipLevel: 3,
        coinBalance: 99999.00,
        flowerBalance: 9999,
      } : null);
      setActiveTab('merchant');
    } else {
      setRole('CONSUMER');
      setUser(prev => prev ? {
        ...prev,
        userId: 1,
        role: 'CONSUMER',
        nickname: '林小果',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        vipLevel: 2,
        coinBalance: 3680.00,
        flowerBalance: 128,
      } : null);
      setActiveTab('garden');
    }
  };

  const login = async (phone: string, pass: string) => {
    try {
      const res: any = await apiClient.post('/auth/login', { phone, password: pass });
      if (res.data) {
        setUser(res.data);
        setAuthToken(res.data.token);
      }
    } catch (e) {
      console.log('Login fallback locally:', e);
    }
  };

  const register = async (phone: string, pass: string, regRole: 'CONSUMER' | 'MERCHANT') => {
    try {
      const res: any = await apiClient.post('/auth/register', { phone, password: pass, role: regRole });
      if (res.data) {
        setUser(res.data);
        setAuthToken(res.data.token);
      }
    } catch (e) {
      console.log('Register fallback locally:', e);
    }
  };

  const logout = () => {
    setUser(null);
    setAuthToken('');
  };

  const refreshLands = async () => {
    try {
      const res: any = await apiClient.get('/garden/my-lands');
      if (res.data) setLands(res.data);
    } catch (e) {
      // 本地状态
    }
  };

  const plantSeed = async (landIndex: number, seedId: number) => {
    try {
      await apiClient.post('/garden/plant', { landIndex, seedId });
      refreshLands();
    } catch (e) {
      setLands(prev => prev.map(l => l.landIndex === landIndex ? {
        ...l,
        status: 'GROWING',
        currentSeedId: seedId,
        plantName: seedId === 1 ? '浪漫红玫瑰' : '金色郁金香',
        currentStage: 1,
        moistureVal: 90,
        hasPest: false,
        estimatedYield: 6,
      } : l));
      setBackpack(prev => prev.map(b => b.itemId === seedId ? { ...b, quantity: Math.max(0, b.quantity - 1) } : b));
    }
  };

  const waterLand = async (landIndex: number) => {
    try {
      await apiClient.post('/garden/water', { landIndex });
      refreshLands();
    } catch (e) {
      setLands(prev => prev.map(l => l.landIndex === landIndex ? { ...l, moistureVal: 100 } : l));
    }
  };

  const disinfestLand = async (landIndex: number) => {
    try {
      await apiClient.post('/garden/disinfest', { landIndex });
      refreshLands();
    } catch (e) {
      setLands(prev => prev.map(l => l.landIndex === landIndex ? { ...l, hasPest: false, status: 'GROWING' } : l));
      setBackpack(prev => prev.map(b => b.itemId === 3 ? { ...b, quantity: Math.max(0, b.quantity - 1) } : b));
    }
  };

  const harvestLand = async (landIndex: number): Promise<number> => {
    try {
      const res: any = await apiClient.post('/garden/harvest', { landIndex });
      refreshLands();
      return res.data?.harvestCount || 6;
    } catch (e) {
      const target = lands.find(l => l.landIndex === landIndex);
      const yieldCount = target?.estimatedYield || 6;
      setLands(prev => prev.map(l => l.landIndex === landIndex ? {
        ...l,
        status: 'EMPTY',
        plantName: undefined,
        currentStage: 0,
        hasPest: false,
      } : l));
      setUser(prev => prev ? { ...prev, flowerBalance: prev.flowerBalance + yieldCount } : null);
      return yieldCount;
    }
  };

  const upgradeLand = async (landIndex: number) => {
    try {
      await apiClient.post('/garden/upgrade-land', { landIndex });
      refreshLands();
    } catch (e) {
      setLands(prev => prev.map(l => l.landIndex === landIndex ? { ...l, landLevel: Math.min(3, l.landLevel + 1) } : l));
      setUser(prev => prev ? { ...prev, coinBalance: Math.max(0, prev.coinBalance - 200) } : null);
    }
  };

  const purchaseLand = async (landIndex: number) => {
    try {
      await apiClient.post('/garden/purchase-land', { landIndex });
      refreshLands();
    } catch (e) {
      setLands(prev => prev.map(l => l.landIndex === landIndex ? { ...l, status: 'EMPTY', moistureVal: 80, landLevel: 1 } : l));
      setUser(prev => prev ? { ...prev, coinBalance: Math.max(0, prev.coinBalance - 300) } : null);
    }
  };

  const refreshBackpack = async () => {
    try {
      const res: any = await apiClient.get('/backpack/my-items');
      if (res.data) setBackpack(res.data);
    } catch (e) {}
  };

  const buyShopItem = async (itemId: number, quantity: number = 1) => {
    try {
      await apiClient.post(`/backpack/buy?itemId=${itemId}&quantity=${quantity}`);
      refreshBackpack();
    } catch (e) {
      setBackpack(prev => {
        const item = prev.find(i => i.itemId === itemId);
        if (item) {
          return prev.map(i => i.itemId === itemId ? { ...i, quantity: i.quantity + quantity } : i);
        }
        return prev;
      });
      setUser(prev => prev ? { ...prev, coinBalance: Math.max(0, prev.coinBalance - 20 * quantity) } : null);
    }
  };

  const likeMoment = async (momentId: number) => {
    try {
      await apiClient.post(`/moments/${momentId}/like`);
    } catch (e) {}
    setMoments(prev => prev.map(m => m.momentId === momentId ? { ...m, likeCount: m.likeCount + 1 } : m));
  };

  const sendMessage = async (receiverId: number, content: string, type: 'TEXT' | 'VOICE' | 'GIFT' = 'TEXT', giftName?: string, giftCost?: number) => {
    try {
      await apiClient.post('/im/send-message', { receiverId, messageType: type, content, giftName, giftCost });
    } catch (e) {}
    if (type === 'GIFT' && giftCost) {
      setUser(prev => prev ? { ...prev, coinBalance: Math.max(0, prev.coinBalance - giftCost) } : null);
    }
  };

  const rechargeCoins = async (amount: number, coins: number) => {
    try {
      await apiClient.post('/wallet/recharge', { amount, coinsAwarded: coins });
    } catch (e) {}
    setUser(prev => prev ? { ...prev, coinBalance: prev.coinBalance + coins } : null);
  };

  const upgradeVipLevel = async (level: number) => {
    try {
      await apiClient.post(`/user/upgrade-vip?level=${level}`);
    } catch (e) {}
    setUser(prev => prev ? { ...prev, vipLevel: level } : null);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        role,
        activeTab,
        setActiveTab,
        switchRole,
        lands,
        backpack,
        moments,
        conversations,
        activeVoiceRoom,
        setActiveVoiceRoom,
        login,
        register,
        logout,
        refreshLands,
        plantSeed,
        waterLand,
        disinfestLand,
        harvestLand,
        upgradeLand,
        purchaseLand,
        refreshBackpack,
        buyShopItem,
        likeMoment,
        sendMessage,
        rechargeCoins,
        upgradeVipLevel,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
