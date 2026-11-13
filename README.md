# 捡果 App（JianGuo App）- 全栈项目工程

> 本项目基于 **[MasterGo 原型设计文件](https://mastergo.com/file/158027007610702?page_id=291%3A01986&shareId=158027007610702)** 1:1 像素级全量复刻。涵盖客户端 2.0、商户端 2.0 及完整的用户认证与成长体系。

---

## 一、 项目架构概览

本项目采用前后端分离的现代化架构规范：
- **后端服务端 (`backend/`)**：基于 **Java 21** 与 **Spring Boot 3.3.5** 构建，包含 RESTful API、JWT 安全认证、OpenAPI 3 (Swagger UI) 文档、JPA 实体建模及开箱即用的内存/持久化数据库。
- **移动客户端 (`app/`)**：基于 **React Native (Expo SDK 52) + TypeScript** 构建，一套代码 **同时原生支持 Android 和 iOS 双端**（并支持 Web 端浏览器即时全功能预览），严格依据 MasterGo 原型规范还原 2.5D 果园土地模拟、植物五阶段生长、水分流失/不足警示、全屏害虫闪烁除虫、多人暗色语音房、即时通讯语音与送礼、商户私域管理等全部功能。

```
d:\小游戏\
├── backend/                       # Spring Boot 3 服务端工程
│   ├── mvnw / mvnw.cmd            # 跨平台 Maven 包装器 (无需预装 Maven)
│   ├── pom.xml                    # Maven 依赖管理
│   └── src/main/java/com/jianguo/
│       ├── common/                # 通用响应 (ApiResponse)、错误码与全局异常处理
│       ├── config/                # Spring Security、JWT 鉴权拦截器、Swagger 文档配置
│       ├── controller/            # 8 大控制器 (Auth, Garden, Moments, Chat, Merchant 等)
│       ├── dto/                   # 前后端数据传输对象
│       ├── entity/                # 13 张核心数据表 JPA 实体
│       ├── repository/            # Spring Data JPA 存储库
│       └── service/               # 完整业务逻辑层
│
├── app/                           # 移动端 App 工程 (支持 Android & iOS)
│   ├── app.json                   # 应用配置 (Bundle ID, 权限, 屏幕方向等)
│   ├── package.json               # 移动端依赖包管理
│   ├── tsconfig.json              # TypeScript 编译配置
│   ├── android/                   # 原生 Android 工程配置与 Manifest 权限
│   ├── ios/                       # 原生 iOS 工程配置与 Info.plist 权限
│   └── src/
│       ├── api/                   # Axios API 客户端 (支持本地/局域网与 Bearer 鉴权)
│       ├── context/               # 全局状态管理 (用户、角色、果园、背包、聊天)
│       ├── constants/             # 依据原型定义的色彩规范、字号、圆角与阴影
│       ├── components/            # 2.5D 果园土地画布、8麦位语音房、礼物弹窗、筛选抽屉等
│       └── screens/
│           ├── auth/              # 登录、3步注册、验证码输入、密码找回、资料完善
│           ├── garden/            # 花园主舞台、土地交互、生虫药剂、背包、商城、任务
│           ├── encounter/         # 邂逅瀑布流、多维筛选抽屉、动态发布、多人语音房
│           ├── messages/          # 会话列表、搜索、1对1单聊、模拟语音录音播放、送礼
│           ├── profile/           # 个人中心、VIP/SVIP/黑金会员、金币充值、账单、地址管理
│           └── merchant/          # 商户端：客户管理、备注标签、定向送礼点赞、礼物墙、榜单
│
└── README.md
```

---

## 二、 原型模块与设计对齐清单

### 1. 认证模块 (Auth)
- **手机号登录与验证码快捷登录**：支持密码登录与短信验证码登录，带《用户协议》《隐私政策》勾选与表单实时校验。
- **分步注册流程**：
  1. 手机号输入与协议校验；
  2. 6位短信矩阵验证码倒计时；
  3. 密码设置与角色定位（普通果园主 vs 合作鲜花商户）。
- **找回密码**：核验手机号短信验证码后直接设定新密码。
- **资料完善 (Onboarding)**：头像选择、个性签名、性别单选（男/女）、生日与星座自动计算。

### 2. 客户端四大核心 Tab (Consumer App)
| Tab 导航 | 核心功能与页面还原 | 原型视觉与交互细节 |
|:---|:---|:---|
| **🌱 花园 (Garden)** | 2.5D立体农场地块、播种/浇水/除虫/采摘、背包、商城、任务、邮件、好友 | 12块地网格（红土地/黑土地/金土地），植物5阶段生长（🌱幼苗->🌿抽枝->🎋孕蕾->🌸开花->🌹成熟），水分3态（充足/流失/不足），生虫高亮闪烁动效与驱虫药剂。 |
| **✨ 邂逅 (Encounter)** | 动态瀑布流、多图九宫格、多维筛选抽屉、语音房入口 | 右滑抽屉支持性别、年龄滑块、距离（5km/10km/同城）、真人认证蓝V筛选；暗色多人语音房（8麦位、声波指示、公屏弹幕、打赏送礼）。 |
| **💬 消息 (Messages)** | 官方系统置顶通知、互动提醒（赞/评论/关注/礼物）、聊天会话列表、1对1聊天室 | 消息气泡、长按录音语音消息、声波播放动效、礼物托盘抽屉（红玫瑰、超跑、皇冠、城堡即时扣币扣费）。 |
| **👤 我的 (Profile)** | 个人资产（玫瑰花/金币）、VIP会员中心、代币充值中心、账单明细、收货地址管理 | VIP金/SVIP紫/黑金奢华黑卡三种阶梯权益；阶梯充值档位（6元、30元、98元、298元、648元）；三级地址级联录入。 |

### 3. 商户端 2.0 (Merchant Business App)
- **商户控制台**：门店认证徽章、关联客户数、累计好感度、已兑换礼盒总数。
- **邀请客户**：向客户发送果园开通邀请函，追踪“待客户同意”与“已开通”状态。
- **客户档案管理**：客户备注名与个性化标签（如“高净值”、“爱玫瑰”、“到店常客”），好感度积分追踪。
- **商户互动送礼**：商户为达成消费互动的客户定向点赞并赠送门店鲜花礼盒。
- **门店动态发布器**：支持实拍花卉多图发布至全城广场。
- **礼物墙与好感度榜单**：展示客户向门店赠出的所有礼物与客户好感度排行榜。

---

## 三、 本地快速启动与运行指南

### 1. 启动后端 Spring Boot 服务
后端已内置 Maven 包装器，可在任意机器直接运行：

```bash
# 进入后端目录
cd backend

# Windows 命令行启动
.\mvnw.cmd spring-boot:run

# 或者 macOS / Linux
chmod +x mvnw
./mvnw spring-boot:run
```

- 服务默认监听端口：`http://localhost:18080`
- **Swagger 交互式 API 文档**：`http://localhost:18080/swagger-ui/index.html`
- **H2 数据库控制台**：`http://localhost:18080/h2-console`（JDBC URL: `jdbc:h2:mem:jianguodb`，User: `sa`，Password 为空）

#### 预置测试账号：
- **客户端普通用户**：
  - 手机号：`13800138000`
  - 密码：`123456`（或短信验证码 `888888`）
  - 角色：普通果园主（林小果，已开通12块果园地块、包含生虫地块、成熟玫瑰、背包道具）
- **商户端签约商户**：
  - 手机号：`13900139000`
  - 密码：`123456`
  - 角色：签约鲜花商户（花之恋花艺旗舰店，关联客户列表与礼物墙）

---

### 2. 启动移动端 App (Android & iOS 双端)

```bash
# 进入 App 目录
cd app

# 安装依赖
npm install

# 启动跨平台开发服务器
npm start
```

启动后控制台会显示二维码：
- **iOS 运行**：
  - 手机安装并打开 **Expo Go** App（App Store 免费下载），使用 iPhone 相机扫码即可在真机直接运行查看。
  - 或在终端按 `i` 键启动 macOS 上的 iOS 模拟器。
- **Android 运行**：
  - Android 手机打开 **Expo Go** App（各大应用商店下载），扫码直接在 Android 真机运行。
  - 或在终端按 `a` 键启动 Android 模拟器。
- **Web 浏览器直接运行预览**：
  - 在终端按 `w` 键，或直接执行 `npm run web`，即可在浏览器（Chrome / Edge / Safari）中以移动端视口体验完整应用！

---

## 四、 后端 RESTful API 核心列表

| 模块 | 方法 | 接口路径 | 说明 |
|:---|:---|:---|:---|
| **认证** | `POST` | `/api/v1/auth/register` | 用户注册 (含角色选择) |
| | `POST` | `/api/v1/auth/login` | 用户密码/验证码登录 |
| | `POST` | `/api/v1/auth/send-sms-code` | 发送短信验证码 |
| | `POST` | `/api/v1/auth/reset-password` | 找回并重置密码 |
| **果园** | `GET` | `/api/v1/garden/my-lands` | 获取当前用户12块土地状态 |
| | `POST` | `/api/v1/garden/plant` | 土地播种 |
| | `POST` | `/api/v1/garden/water` | 浇水恢复水分充盈 |
| | `POST` | `/api/v1/garden/disinfest` | 使用驱虫喷雾消灭害虫 |
| | `POST` | `/api/v1/garden/harvest` | 成熟采摘鲜花入库 |
| | `POST` | `/api/v1/garden/upgrade-land` | 土地肥力升级 |
| | `POST` | `/api/v1/garden/purchase-land` | 开垦新土地 |
| **背包商城** | `GET` | `/api/v1/backpack/my-items` | 背包道具与花束资产 |
| | `POST` | `/api/v1/backpack/buy` | 商城购买种子与化肥道具 |
| **邂逅广场** | `GET` | `/api/v1/moments/feed` | 邂逅动态 (多维筛选) |
| | `POST` | `/api/v1/moments/create` | 发布鲜花生活动态 |
| | `POST` | `/api/v1/moments/{id}/like` | 动态点赞 |
| | `GET` | `/api/v1/moments/voice-rooms` | 活跃多人暗色语音房列表 |
| **消息通讯** | `GET` | `/api/v1/im/conversations` | 会话列表与未读数 |
| | `GET` | `/api/v1/im/history/{userId}` | 历史聊天记录 |
| | `POST` | `/api/v1/im/send-message` | 发送文本/语音消息 |
| | `POST` | `/api/v1/im/send-gift` | 赠送礼物 (扣除金币) |
| **商户私域** | `GET` | `/api/v1/merchant/customers` | 商户客户管理列表与标签 |
| | `PUT` | `/api/v1/merchant/customer-remark` | 更新客户备注名与个性化标签 |
| | `POST` | `/api/v1/merchant/invite-customer` | 邀请客户开通专属果园 |
| | `POST` | `/api/v1/merchant/reward-customer` | 商户点赞并给客户送礼 |
| | `GET` | `/api/v1/merchant/gift-wall` | 门店礼物墙 |
| | `GET` | `/api/v1/merchant/leaderboard/intimacy` | 客户好感度排行榜 |
| **个人中心** | `GET` | `/api/v1/user/profile` | 个人资料与资产数据 |
| | `PUT` | `/api/v1/user/profile` | 完善昵称/头像/生日/星座 |
| | `POST` | `/api/v1/user/upgrade-vip` | 开通/升级 VIP/SVIP/黑金会员 |
| | `GET` | `/api/v1/user/addresses` | 收货地址列表与新增/删除 |
| | `POST` | `/api/v1/wallet/recharge` | 阶梯金币充值 |
| | `GET` | `/api/v1/wallet/transactions` | 交易流水明细 (全部/消耗) |
