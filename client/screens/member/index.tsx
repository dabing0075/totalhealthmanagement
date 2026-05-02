import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { Screen } from '@/components/Screen';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

// 获取屏幕宽度用于适配
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 根据屏幕宽度计算合适的图标大小
const getAdaptiveIconSize = (baseSize: number) => {
  if (SCREEN_WIDTH < 375) {
    return Math.round(baseSize * 0.85);
  } else if (SCREEN_WIDTH < 414) {
    return baseSize;
  } else {
    return Math.round(baseSize * 1.1);
  }
};

// 根据屏幕宽度计算合适的容器大小
const getAdaptiveContainerSize = (baseSize: number) => {
  if (SCREEN_WIDTH < 375) {
    return Math.round(baseSize * 0.85);
  } else if (SCREEN_WIDTH < 414) {
    return baseSize;
  } else {
    return Math.round(baseSize * 1.1);
  }
};

// 预计算适配后的尺寸
const ADAPTED = {
  // 会员入口图标
  memberEntryIconSize: getAdaptiveIconSize(48),
  memberEntryIcon: getAdaptiveIconSize(20),
  // 积分图标
  pointsIconSize: getAdaptiveIconSize(28),
  // 任务图标
  taskIconSize: getAdaptiveIconSize(14),
  taskIconContainerSize: getAdaptiveContainerSize(36),
  // 徽章图标
  badgeIconSize: getAdaptiveIconSize(20),
  badgeIconContainerSize: getAdaptiveContainerSize(44),
  // 菜单图标
  menuIconSize: getAdaptiveIconSize(16),
  menuIconContainerSize: getAdaptiveContainerSize(32),
  // 内容图标
  contentIconSize: getAdaptiveIconSize(18),
  contentIconContainerSize: getAdaptiveContainerSize(36),
  // VIP图标
  vipBadgeIconSize: getAdaptiveIconSize(10),
};

const POINT_TASKS = [
  { id: '1', name: '今日打卡', points: '+10', icon: 'check', completed: false },
  { id: '2', name: '分享动态', points: '+5', icon: 'share', completed: true },
  { id: '3', name: '完成运动', points: '+20', icon: 'dumbbell', completed: false },
  { id: '4', name: '阅读知识', points: '+5', icon: 'book', completed: false },
];

const BADGES = [
  { id: '1', name: '连续打卡30天', icon: 'fire', color: '#FF6B6B' },
  { id: '2', name: '减重达人', icon: 'weight', color: '#26A69A' },
  { id: '3', name: '运动新星', icon: 'star', color: '#FFD700' },
  { id: '4', name: '早起鸟', icon: 'sunrise', color: '#FF9800' },
  { id: '5', name: '健康达人', icon: 'heart', color: '#E91E63' },
  { id: '6', name: '知识王', icon: 'book', color: '#2196F3' },
];

export default function MemberScreen() {
  const router = useRouter();

  // 用户数据
  const user = {
    name: '健康达人',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    signature: '追求健康生活，享受美好人生',
    followers: 128,
    following: 56,
    notes: 23,
    likes: 456,
    age: 28,
    bmi: 22.5,
    weight: 68.5,
    bodyFat: 18.5,
    balance: 288.50,
    points: 1280,
    coupons: 3,
    devices: 2,
    medals: 6,
    userPoints: 1280,
    userLevel: 12,
    userTitle: '健康达人',
    expProgress: 65,
  };

  // 身体数据
  const bodyMetrics = [
    { id: '1', label: 'BMI', value: user.bmi.toString(), unit: '', color: '#26A69A' },
    { id: '2', label: '体重', value: user.weight.toString(), unit: 'kg', color: '#FF9800' },
    { id: '3', label: '体脂率', value: user.bodyFat.toString(), unit: '%', color: '#FF6B6B' },
  ];

  // 账户菜单
  const accountMenu = [
    { id: '1', name: '账户余额', icon: 'wallet', value: `¥${user.balance}`, color: '#26A69A' },
    { id: '2', name: '优惠券', icon: 'ticket', value: `${user.coupons}张`, color: '#FF9800' },
    { id: '3', name: '订单', icon: 'bag-shopping', value: '', color: '#2196F3' },
    { id: '4', name: '购物车', icon: 'cart-shopping', value: '2件', color: '#9C27B0' },
    { id: '5', name: '积分', icon: 'coins', value: `${user.points}`, color: '#FFD700' },
    { id: '6', name: '设备绑定', icon: 'bluetooth', value: `${user.devices}台`, color: '#4ECDC4' },
    { id: '7', name: '勋章', icon: 'medal', value: `${user.medals}个`, color: '#FF6B6B' },
  ];

  // 内容菜单
  const contentMenu = [
    { id: '1', name: '我的笔记', icon: 'note-sticky', count: user.notes, color: '#26A69A' },
    { id: '2', name: '我的收藏', icon: 'star', count: 45, color: '#FF9800' },
    { id: '3', name: '我的赞赏', icon: 'heart', count: user.likes, color: '#FF6B6B' },
  ];

  return (
    <Screen>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.contentContainer, { paddingTop: 20, paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* 个人信息卡片 */}
        <TouchableOpacity style={styles.profileCard} onPress={() => router.push('/profile')}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <View style={styles.userInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{user.name}</Text>
              <View style={styles.vipBadge}>
                <FontAwesome6 name="crown" size={ADAPTED.vipBadgeIconSize} color="#FFD700" />
                <Text style={styles.vipText}>月度会员</Text>
              </View>
            </View>
            <Text style={styles.signature}>{user.signature}</Text>
            <View style={styles.statsRow}>
              <TouchableOpacity style={styles.statItem}>
                <Text style={styles.statValue}>{user.notes}</Text>
                <Text style={styles.statLabel}>笔记</Text>
              </TouchableOpacity>
              <View style={styles.statDivider} />
              <TouchableOpacity style={styles.statItem}>
                <Text style={styles.statValue}>{user.following}</Text>
                <Text style={styles.statLabel}>关注</Text>
              </TouchableOpacity>
              <View style={styles.statDivider} />
              <TouchableOpacity style={styles.statItem}>
                <Text style={styles.statValue}>{user.followers}</Text>
                <Text style={styles.statLabel}>粉丝</Text>
              </TouchableOpacity>
              <View style={styles.statDivider} />
              <TouchableOpacity style={styles.statItem}>
                <Text style={styles.statValue}>{user.age}</Text>
                <Text style={styles.statLabel}>年龄</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={getAdaptiveIconSize(20)} color="#9CA3AF" />
        </TouchableOpacity>

        {/* 身体数据卡片 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>身体数据</Text>
            <TouchableOpacity onPress={() => router.push('/body-data')}>
              <Text style={styles.moreText}>详情</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.bodyDataCard} onPress={() => router.push('/body-data')}>
            {bodyMetrics.map((metric, index) => (
              <View key={metric.id} style={[styles.bodyMetricItem, index < bodyMetrics.length - 1 && styles.bodyMetricBorder]}>
                <Text style={styles.bodyMetricLabel}>{metric.label}</Text>
                <View style={styles.bodyMetricValueRow}>
                  <Text style={[styles.bodyMetricValue, { color: metric.color }]}>{metric.value}</Text>
                  <Text style={styles.bodyMetricUnit}>{metric.unit}</Text>
                </View>
              </View>
            ))}
          </TouchableOpacity>
        </View>

        {/* 会员入口 */}
        <TouchableOpacity style={styles.memberEntryCard} onPress={() => router.push('/vip')}>
          <View style={styles.memberEntryLeft}>
            <View style={[styles.memberEntryIcon, {
              width: ADAPTED.memberEntryIconSize,
              height: ADAPTED.memberEntryIconSize,
              borderRadius: ADAPTED.memberEntryIconSize / 2,
            }]}>
              <FontAwesome6 name="crown" size={ADAPTED.memberEntryIcon} color="#FF9800" />
            </View>
            <View style={styles.memberEntryInfo}>
              <Text style={styles.memberEntryTitle}>会员中心</Text>
              <Text style={styles.memberEntryDesc}>开通会员，享受更多特权</Text>
            </View>
          </View>
          <View style={styles.memberEntryRight}>
            <Text style={styles.memberEntryStatus}>月度会员</Text>
            <Ionicons name="chevron-forward" size={getAdaptiveIconSize(20)} color="#9CA3AF" />
          </View>
        </TouchableOpacity>

        {/* 积分卡片 */}
        <View style={styles.pointsCard}>
          <View style={styles.pointsHeader}>
            <Text style={styles.cardTitle}>积分</Text>
            <TouchableOpacity>
              <Text style={styles.pointsMore}>积分商城</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.pointsDisplay}>
            <View style={styles.pointsIcon}>
              <FontAwesome6 name="coins" size={ADAPTED.pointsIconSize} color="#FFD700" />
            </View>
            <View style={styles.pointsInfo}>
              <Text style={styles.pointsValue}>{user.userPoints}</Text>
              <Text style={styles.pointsLabel}>可用积分</Text>
            </View>
            <TouchableOpacity style={styles.pointsExchangeBtn}>
              <Text style={styles.pointsExchangeText}>兑换</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 积分任务 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>积分任务</Text>
            <TouchableOpacity style={styles.moreBtn}>
              <Text style={styles.moreBtnText}>全部</Text>
              <Ionicons name="chevron-forward" size={12} color="#26A69A" />
            </TouchableOpacity>
          </View>
          <View style={styles.tasksCard}>
            {POINT_TASKS.map((task) => (
              <View key={task.id} style={[styles.taskItem, task.completed && styles.taskCompleted]}>
                <View style={[styles.taskIcon, task.completed && styles.taskIconCompleted, {
                  width: ADAPTED.taskIconContainerSize,
                  height: ADAPTED.taskIconContainerSize,
                  borderRadius: ADAPTED.taskIconContainerSize / 2,
                }]}>
                  {task.completed ? (
                    <FontAwesome6 name="check" size={ADAPTED.taskIconSize} color="#FFFFFF" />
                  ) : (
                    <FontAwesome6 name={task.icon as any} size={ADAPTED.taskIconSize} color="#26A69A" />
                  )}
                </View>
                <View style={styles.taskInfo}>
                  <Text style={[styles.taskName, task.completed && styles.taskNameCompleted]}>{task.name}</Text>
                  <Text style={styles.taskPoints}>{task.points}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 健康习惯得分 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>健康习惯得分</Text>
          <View style={styles.levelCard}>
            <View style={styles.levelHeader}>
              <View style={[styles.levelBadge, { backgroundColor: '#26A69A' }]}>
                <FontAwesome6 name="seedling" size={16} color="#FFFFFF" />
                <Text style={styles.levelBadgeText}>优秀</Text>
              </View>
              <View style={styles.levelInfo}>
                <Text style={styles.levelTitle}>530 分 · 优秀</Text>
                <View style={styles.levelProgressWrap}>
                  <View style={styles.levelProgress}>
                    <View style={[styles.levelProgressFill, { width: '30%', backgroundColor: '#26A69A' }]} />
                  </View>
                  <Text style={styles.levelProgressText}>还需 270 分升至卓越</Text>
                </View>
              </View>
            </View>
            {/* 积分等级进度 */}
            <View style={styles.pointsLevelRow}>
              {[
                { name: '启程', range: '0-350', active: true, completed: true },
                { name: '进阶', range: '351-500', active: true, completed: true },
                { name: '优秀', range: '501-700', active: true, completed: false },
                { name: '卓越', range: '701-800', active: false, completed: false },
                { name: '顶尖', range: '800+', active: false, completed: false },
              ].map((level, index) => (
                <View key={level.name} style={styles.pointsLevelItem}>
                  <View style={[styles.pointsLevelDot, {
                    backgroundColor: level.completed ? '#26A69A' : level.active ? '#FFD700' : '#E5E7EB',
                    borderColor: level.completed ? '#26A69A' : level.active ? '#FFD700' : '#D1D5DB',
                  }]}>
                    {level.completed && <Ionicons name="checkmark" size={10} color="#FFFFFF" />}
                  </View>
                  <Text style={[styles.pointsLevelName, level.active && !level.completed && { color: '#26A69A' }]}>{level.name}</Text>
                  <Text style={styles.pointsLevelRange}>{level.range}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* 科学瘦身计算器入口 */}
        <TouchableOpacity style={styles.calculatorBanner} onPress={() => router.push('/diet-calculator')}>
          <LinearGradient
            colors={['#FF9800', '#FFB74D']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.calculatorGradient}
          >
            <View style={styles.calculatorContent}>
              <View style={styles.calculatorIcon}>
                <FontAwesome6 name="calculator" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.calculatorText}>
                <Text style={styles.calculatorTitle}>科学体重管理方案</Text>
                <Text style={styles.calculatorSubtitle}>输入数据，获取个性化减脂方案</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* 徽章墙 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>我的徽章</Text>
            <TouchableOpacity>
              <Text style={styles.moreText}>查看全部</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.badgesCard}>
            {BADGES.map((badge) => (
              <View key={badge.id} style={styles.badgeItem}>
                <View style={[styles.badgeIcon, { 
                  backgroundColor: badge.color + '20',
                  width: ADAPTED.badgeIconContainerSize,
                  height: ADAPTED.badgeIconContainerSize,
                  borderRadius: ADAPTED.badgeIconContainerSize / 2,
                }]}>
                  <FontAwesome6 name={badge.icon as any} size={ADAPTED.badgeIconSize} color={badge.color} />
                </View>
                <Text style={styles.badgeName}>{badge.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 我的账户 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>我的账户</Text>
          <View style={styles.menuCard}>
            {accountMenu.map((item, index) => (
              <TouchableOpacity key={item.id} style={[styles.menuItem, index < accountMenu.length - 1 && styles.menuItemBorder]}>
                <View style={styles.menuItemLeft}>
                  <View style={[styles.menuIcon, { 
                    backgroundColor: item.color + '20',
                    width: ADAPTED.menuIconContainerSize,
                    height: ADAPTED.menuIconContainerSize,
                    borderRadius: ADAPTED.menuIconContainerSize / 2,
                  }]}>
                    <FontAwesome6 name={item.icon as any} size={ADAPTED.menuIconSize} color={item.color} />
                  </View>
                  <Text style={styles.menuName}>{item.name}</Text>
                </View>
                <View style={styles.menuItemRight}>
                  {item.value && <Text style={styles.menuValue}>{item.value}</Text>}
                  <Ionicons name="chevron-forward" size={getAdaptiveIconSize(16)} color="#D1D5DB" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 我的内容 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>我的内容</Text>
          <View style={styles.contentCard}>
            {contentMenu.map((item, index) => (
              <TouchableOpacity key={item.id} style={[styles.contentItem, index < contentMenu.length - 1 && styles.contentItemBorder]}>
                <View style={styles.contentItemLeft}>
                  <View style={[styles.contentIcon, { 
                    backgroundColor: item.color + '20',
                    width: ADAPTED.contentIconContainerSize,
                    height: ADAPTED.contentIconContainerSize,
                    borderRadius: ADAPTED.contentIconContainerSize / 2,
                  }]}>
                    <FontAwesome6 name={item.icon as any} size={ADAPTED.contentIconSize} color={item.color} />
                  </View>
                  <Text style={styles.contentName}>{item.name}</Text>
                </View>
                <View style={styles.contentItemRight}>
                  <Text style={styles.contentCount}>{item.count}</Text>
                  <Ionicons name="chevron-forward" size={getAdaptiveIconSize(16)} color="#D1D5DB" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 其他菜单 */}
        <View style={styles.section}>
          <View style={styles.menuCard}>
            {[
              { id: '1', name: '设置', icon: 'gear' },
              { id: '2', name: '帮助与反馈', icon: 'circle-question' },
              { id: '3', name: '关于', icon: 'info-circle' },
            ].map((item, index) => (
              <TouchableOpacity key={item.id} style={[styles.menuItem, index < 2 && styles.menuItemBorder]}>
                <View style={styles.menuItemLeft}>
                  <View style={[styles.menuIcon, { 
                    backgroundColor: '#F3F4F6',
                    width: ADAPTED.menuIconContainerSize,
                    height: ADAPTED.menuIconContainerSize,
                    borderRadius: ADAPTED.menuIconContainerSize / 2,
                  }]}>
                    <FontAwesome6 name={item.icon as any} size={ADAPTED.menuIconSize} color="#9CA3AF" />
                  </View>
                  <Text style={styles.menuName}>{item.name}</Text>
                </View>
                <Ionicons name="chevron-forward" size={getAdaptiveIconSize(16)} color="#D1D5DB" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 底部 */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>靓健生活 v1.0.0</Text>
        </View>
      </ScrollView>

    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  userName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  vipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 3,
  },
  vipText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#FF9800',
  },
  signature: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 6,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  statLabel: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  statDivider: {
    width: 1,
    height: 12,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  moreText: {
    fontSize: 13,
    color: '#26A69A',
  },
  bodyDataCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  bodyMetricItem: {
    flex: 1,
    alignItems: 'center',
  },
  bodyMetricBorder: {
    borderRightWidth: 1,
    borderRightColor: '#F3F4F6',
  },
  bodyMetricLabel: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  bodyMetricValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  bodyMetricValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  bodyMetricUnit: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 2,
  },
  memberEntryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  memberEntryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  memberEntryIcon: {
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  memberEntryInfo: {
    flex: 1,
  },
  memberEntryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 2,
  },
  memberEntryDesc: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  memberEntryRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  memberEntryStatus: {
    fontSize: 12,
    color: '#FF9800',
    fontWeight: '600',
  },
  pointsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  pointsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  pointsMore: {
    fontSize: 13,
    color: '#26A69A',
  },
  pointsDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF8E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  pointsInfo: {
    flex: 1,
  },
  pointsValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a2e',
  },
  pointsLabel: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  pointsExchangeBtn: {
    backgroundColor: '#26A69A',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  pointsExchangeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  moreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  moreBtnText: {
    fontSize: 13,
    color: '#26A69A',
  },
  tasksCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  taskCompleted: {
    opacity: 0.6,
  },
  taskIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#E0F2F1',
  },
  taskIconCompleted: {
    backgroundColor: '#26A69A',
  },
  taskInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskName: {
    fontSize: 15,
    color: '#1a1a2e',
  },
  taskNameCompleted: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  taskPoints: {
    fontSize: 14,
    fontWeight: '600',
    color: '#26A69A',
  },
  levelCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelBadge: {
    backgroundColor: '#26A69A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 12,
  },
  levelBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  levelInfo: {
    flex: 1,
  },
  levelTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  levelProgressWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  levelProgress: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  levelProgressFill: {
    height: '100%',
    backgroundColor: '#26A69A',
    borderRadius: 4,
  },
  levelProgressText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  levelDesc: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 16,
  },
  levelBenefits: {
    flexDirection: 'row',
    gap: 16,
  },
  levelBenefit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  levelBenefitText: {
    fontSize: 12,
    color: '#6B7280',
  },
  pointsLevelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  pointsLevelItem: {
    alignItems: 'center',
    flex: 1,
  },
  pointsLevelDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointsLevelName: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '600',
  },
  pointsLevelRange: {
    fontSize: 9,
    color: '#9CA3AF',
    marginTop: 2,
  },
  calculatorBanner: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#FF9800',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  calculatorGradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  calculatorContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calculatorIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  calculatorText: {
    flex: 1,
  },
  calculatorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  calculatorSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
  badgesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  badgeItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 16,
  },
  badgeIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuName: {
    fontSize: 15,
    color: '#1a1a2e',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuValue: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  contentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  contentItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  contentItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentName: {
    fontSize: 15,
    color: '#1a1a2e',
  },
  contentItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contentCount: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
