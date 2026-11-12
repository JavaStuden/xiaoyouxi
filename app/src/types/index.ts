export interface User {
  userId: number;
  phone: string;
  role: 'CONSUMER' | 'MERCHANT' | 'ADMIN';
  nickname: string;
  avatarUrl: string;
  gender: number; // 0, 1:男, 2:女
  birthday?: string;
  zodiacSign?: string;
  bio?: string;
  realPersonVerified: boolean;
  vipLevel: number; // 0:普通, 1:VIP, 2:SVIP, 3:黑金会员
  coinBalance: number;
  flowerBalance: number;
  gardenActivated: boolean;
}

export interface GardenLand {
  landId: number;
  userId: number;
  landIndex: number; // 1 to 12
  landLevel: number; // 1:普通红土地, 2:黑土地, 3:金土地
  status: 'LOCKED' | 'EMPTY' | 'GROWING' | 'MATURE' | 'PEST_INFESTED';
  currentSeedId?: number;
  plantName?: string;
  plantedAt?: string;
  currentStage: number; // 1-5
  moistureVal: number; // 0-100
  hasPest: boolean;
  expectedMatureAt?: string;
  estimatedYield?: number;
}

export interface BackpackItem {
  id: number;
  itemId: number;
  name: string;
  itemType: 'SEED' | 'FERTILIZER' | 'PEST_SPRAY' | 'WATER_CAN' | 'BOUQUET' | 'DECORATION';
  description: string;
  price: number;
  iconUrl: string;
  quantity: number;
  matureTimeSeconds?: number;
}

export interface Moment {
  momentId: number;
  userId: number;
  authorName: string;
  authorAvatar: string;
  authorVipLevel: number;
  authorRealVerified: boolean;
  content: string;
  mediaUrls: string; // JSON array or URLs
  locationName: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
}

export interface MomentComment {
  id: number;
  momentId: number;
  userId: number;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
}

export interface ChatConversation {
  contactUserId: number;
  contactName: string;
  contactAvatar: string;
  role: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface ChatMessage {
  id: number;
  senderId: number;
  receiverId: number;
  messageType: 'TEXT' | 'VOICE' | 'IMAGE' | 'GIFT';
  content: string;
  voiceDuration?: number;
  giftName?: string;
  giftIcon?: string;
  giftCost?: number;
  isRead: boolean;
  createdAt: string;
}

export interface VoiceRoom {
  roomId: number;
  title: string;
  hostId: number;
  hostName: string;
  hostAvatar: string;
  onlineCount: number;
  announcement: string;
  activeSeatsJson: string;
}

export interface CustomerDetail {
  relationId: number;
  customerId: number;
  phone: string;
  nickname: string;
  avatarUrl: string;
  customRemark: string;
  tags: string[];
  intimacyScore: number;
  status: string;
  lastInteractAt: string;
}

export interface GiftWallRecord {
  id: number;
  merchantId: number;
  customerId: number;
  customerName: string;
  customerAvatar: string;
  giftName: string;
  giftIcon: string;
  giftCount: number;
  amount: number;
  direction: string;
  createdAt: string;
}

export interface ShippingAddress {
  id: number;
  recipientName: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detailAddress: string;
  isDefault: boolean;
}

export interface DailyTask {
  id: number;
  taskCode: string;
  title: string;
  description: string;
  rewardCoins: number;
  rewardType: string;
  isCompleted: boolean;
  isClaimed: boolean;
}
