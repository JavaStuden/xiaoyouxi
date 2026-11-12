/**
 * 捡果 App 原型视觉规范与设计系统 (Design System Tokens)
 * 严格对齐 MasterGo 客户端 2.0 & 商户端 2.0 规格
 */

export const Colors = {
  // 品牌核心主色
  primary: '#52C41A',          // 生态绿 (主按钮、花园主题、土地活力、植物进度)
  primaryDark: '#2E7D32',      // 深度浓郁林绿
  primaryLight: '#E8F5E9',     // 极淡绿背景底色
  
  // 社交与赠礼浪漫色
  rose: '#FF4D6A',             // 浪漫玫瑰红 (送礼、心动、玫瑰资产、点赞高亮)
  roseDark: '#FF2D55',
  roseLight: '#FFF0F2',

  // 功能与警示状态色
  warning: '#FAAD14',          // 水源流失/不足警示金黄
  danger: '#FF4D4F',           // 害虫侵袭/紧急红色闪烁
  info: '#1890FF',             // 真人认证徽章蓝
  
  // 语音聊天室专属暗色
  darkBg: '#12121A',           // 语聊房基底黑
  darkCard: '#1E1E2D',         // 语聊房卡片底色
  darkMicSeat: '#2A2A3E',      // 麦位底色
  accentPurple: '#722ED1',     // 霓虹紫

  // 中性色阶
  textPrimary: '#1F1F1F',      // 主文本
  textSecondary: '#666666',    // 次级文本说明
  textTertiary: '#999999',     // 辅助说明与占位符
  border: '#EEEEEE',           // 细描边
  divider: '#F0F0F0',          // 分割线
  background: '#F7F8FA',       // 移动端背景底灰
  white: '#FFFFFF',

  // VIP 会员体系质感渐变色
  vip: {
    goldStart: '#F7D678',
    goldEnd: '#E4A93E',
    svipStart: '#8A58E8',
    svipEnd: '#6130B8',
    blackGoldStart: '#2A2935',
    blackGoldEnd: '#1A1822',
    blackGoldAccent: '#E5BF77',
  }
};

export const Typography = {
  fontFamily: 'System',
  fontSize: {
    xs: 11,
    sm: 13,
    base: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    stat: 28,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  }
};

export const Layout = {
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 999,
  },
  shadow: {
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    hover: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 4,
    }
  }
};

export const PlantStages = [
  { stage: 1, name: '幼苗期', emoji: '🌱', percent: 20 },
  { stage: 2, name: '抽枝期', emoji: '🌿', percent: 40 },
  { stage: 3, name: '孕蕾期', emoji: '🎋', percent: 65 },
  { stage: 4, name: '开花期', emoji: '🌸', percent: 85 },
  { stage: 5, name: '成熟采摘', emoji: '🌹', percent: 100 },
];
