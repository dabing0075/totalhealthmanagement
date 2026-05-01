import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Screen } from '@/components/Screen';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';

const MEMBERSHIP_TIERS = [
  {
    id: '1',
    name: '免费会员',
    price: '¥0',
    period: '永久',
    features: [
      '基础体重记录',
      '每日打卡功能',
      '健康数据跟踪',
      '3篇笔记发布',
      '基础知识库浏览',
    ],
    unavailable: [
      'AI饮食分析',
      '专家咨询',
      '专属教练',
      '高级徽章',
      '数据分析报告',
    ],
    color: '#9CA3AF',
    bgColor: '#F3F4F6',
    icon: 'user',
  },
  {
    id: '2',
    name: '月度会员',
    price: '¥29',
    period: '/月',
    originalPrice: '¥39',
    features: [
      '全部基础功能',
      'AI饮食拍照分析',
      '专业营养师咨询（每月3次）',
      '详细数据分析报告',
      '无限笔记发布',
      '专属头像框',
      '月度徽章',
      '优先客服支持',
    ],
    unavailable: [
      '专属教练服务',
      '年度专属活动',
    ],
    color: '#26A69A',
    bgColor: '#E0F2F1',
    icon: 'crown',
    recommended: true,
    savings: '省¥120/年',
  },
  {
    id: '3',
    name: '年度会员',
    price: '¥199',
    period: '/年',
    originalPrice: '¥349',
    features: [
      '全部月度功能',
      '专属健身教练（1对1）',
      '全年无限咨询',
      '年度健康总结报告',
      '专属年度徽章',
      'VIP身份标识',
      '优先预约专家',
      '会员专属活动',
      '生日特权礼包',
    ],
    unavailable: [],
    color: '#FF9800',
    bgColor: '#FFF3E0',
    icon: 'gem',
    discount: '5.7折',
  },
  {
    id: '4',
    name: '终身会员',
    price: '¥599',
    period: '一次性',
    features: [
      '全部年度功能',
      '终身专属服务',
      '无限次专家咨询',
      '永久VIP身份',
      '专属定制服务',
      '新品优先体验',
      '线下活动邀请',
      '健康管家服务',
    ],
    unavailable: [],
    color: '#9C27B0',
    bgColor: '#F3E5F5',
    icon: 'infinity',
    tag: '最划算',
  },
];

const MEMBERSHIP_BENEFITS = {
  vip: [
    { icon: 'wand-magic-sparkles', text: 'AI智能分析' },
    { icon: 'user-tie', text: '专属教练' },
    { icon: 'chart-line', text: '数据报告' },
    { icon: 'headset', text: '优先客服' },
  ],
  privilege: [
    { icon: 'medal', text: '专属徽章' },
    { icon: 'frame', text: '头像框' },
    { icon: 'bell', text: '活动邀请' },
    { icon: 'gift', text: '生日礼包' },
  ],
};

export default function VipScreen() {
  const [selectedTier, setSelectedTier] = useState<string>('2');

  // 续费信息
  const renewalInfo = {
    currentPlan: '月度会员',
    expireDate: '2025年2月15日',
    autoRenew: true,
    nextPayment: '¥29.00',
  };

  // 打卡积分任务
  const pointTasks = [
    { id: '1', name: '每日首次打卡', points: 10, icon: 'flag', completed: true },
    { id: '2', name: '完成运动记录', points: 15, icon: 'person-running', completed: true },
    { id: '3', name: '记录饮食', points: 10, icon: 'utensils', completed: false },
    { id: '4', name: '阅读知识文章', points: 5, icon: 'book', completed: false },
    { id: '5', name: '分享健康动态', points: 8, icon: 'share', completed: false },
    { id: '6', name: '睡眠记录', points: 10, icon: 'moon', completed: true },
  ];

  // 用户成长数据
  const userGrowth = {
    level: 12,
    title: '健康达人',
    currentExp: 1350,
    nextLevelExp: 1700,
    expProgress: 79,
    benefits: [
      { level: 5, name: '新手标识', unlocked: true },
      { level: 10, name: '专属头像框', unlocked: true },
      { level: 15, name: 'VIP标识', unlocked: false },
      { level: 20, name: '定制徽章', unlocked: false },
    ],
  };

  // 游戏化成就
  const achievements = {
    ranks: [
      { id: '1', name: '连续打卡', value: '28天', icon: 'fire', color: '#FF6B6B' },
      { id: '2', name: '累计徽章', value: '12个', icon: 'medal', color: '#FFD700' },
      { id: '3', name: '累计积分', value: '2680', icon: 'coins', color: '#26A69A' },
    ],
    badges: [
      { id: '1', name: '早起鸟', icon: 'sunrise', color: '#FF9800', unlocked: true },
      { id: '2', name: '运动达人', icon: 'dumbbell', color: '#26A69A', unlocked: true },
      { id: '3', name: '减脂先锋', icon: 'weight', color: '#2196F3', unlocked: true },
      { id: '4', name: '知识王', icon: 'book', color: '#9C27B0', unlocked: true },
      { id: '5', name: '睡眠专家', icon: 'moon', color: '#E91E63', unlocked: false },
      { id: '6', name: '健康大师', icon: 'heart', color: '#FF6B6B', unlocked: false },
    ],
  };

  return (
    <Screen>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* 会员特权概览 */}
        <View style={styles.benefitsOverview}>
          <Text style={styles.overviewTitle}>会员专属特权</Text>
          <View style={styles.benefitsGrid}>
            <View style={styles.benefitCategory}>
              <Text style={styles.benefitCategoryTitle}>VIP权益</Text>
              <View style={styles.benefitList}>
                {MEMBERSHIP_BENEFITS.vip.map((item) => (
                  <View key={item.text} style={styles.benefitItem}>
                    <View style={[styles.benefitIcon, { backgroundColor: '#E0F2F1' }]}>
                      <FontAwesome6 name={item.icon as any} size={14} color="#26A69A" />
                    </View>
                    <Text style={styles.benefitText}>{item.text}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.benefitCategory}>
              <Text style={styles.benefitCategoryTitle}>身份特权</Text>
              <View style={styles.benefitList}>
                {MEMBERSHIP_BENEFITS.privilege.map((item) => (
                  <View key={item.text} style={styles.benefitItem}>
                    <View style={[styles.benefitIcon, { backgroundColor: '#FFF3E0' }]}>
                      <FontAwesome6 name={item.icon as any} size={14} color="#FF9800" />
                    </View>
                    <Text style={styles.benefitText}>{item.text}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* 会员等级选择 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>选择会员方案</Text>
          <View style={styles.tiersContainer}>
            {MEMBERSHIP_TIERS.map((tier) => (
              <TouchableOpacity
                key={tier.id}
                style={[
                  styles.tierCard,
                  selectedTier === tier.id && styles.tierCardSelected,
                  selectedTier === tier.id && { borderColor: tier.color },
                ]}
                onPress={() => setSelectedTier(tier.id)}
              >
                {tier.tag && (
                  <View style={[styles.tierTag, { backgroundColor: tier.color }]}>
                    <Text style={styles.tierTagText}>{tier.tag}</Text>
                  </View>
                )}
                {tier.discount && (
                  <View style={[styles.tierTag, { backgroundColor: tier.color }]}>
                    <Text style={styles.tierTagText}>{tier.discount}</Text>
                  </View>
                )}
                {tier.recommended && (
                  <View style={[styles.tierTag, { backgroundColor: tier.color }]}>
                    <Text style={styles.tierTagText}>推荐</Text>
                  </View>
                )}
                
                <View style={[styles.tierHeader, { backgroundColor: tier.bgColor }]}>
                  <View style={[styles.tierIconWrap, { backgroundColor: tier.color + '20' }]}>
                    <FontAwesome6 name={tier.icon as any} size={24} color={tier.color} />
                  </View>
                  <Text style={[styles.tierName, { color: tier.color }]}>{tier.name}</Text>
                </View>
                
                <View style={styles.tierPrice}>
                  <Text style={[styles.tierPriceValue, { color: tier.color }]}>{tier.price}</Text>
                  <Text style={styles.tierPricePeriod}>{tier.period}</Text>
                </View>
                
                {tier.originalPrice && (
                  <Text style={styles.tierOriginalPrice}>{tier.originalPrice}</Text>
                )}
                
                {tier.savings && (
                  <View style={[styles.tierSavings, { backgroundColor: tier.color + '15' }]}>
                    <Text style={[styles.tierSavingsText, { color: tier.color }]}>{tier.savings}</Text>
                  </View>
                )}
                
                <View style={styles.tierFeatures}>
                  {tier.features.map((feature, index) => (
                    <View key={index} style={styles.featureItem}>
                      <Ionicons name="checkmark-circle" size={14} color="#26A69A" />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                  {tier.unavailable.length > 0 && tier.unavailable.map((feature, index) => (
                    <View key={`un-${index}`} style={styles.featureItemUnavailable}>
                      <Ionicons name="close-circle-outline" size={14} color="#D1D5DB" />
                      <Text style={styles.featureTextUnavailable}>{feature}</Text>
                    </View>
                  ))}
                </View>
                
                <TouchableOpacity 
                  style={[styles.tierButton, { backgroundColor: selectedTier === tier.id ? tier.color : '#F3F4F6' }]}
                >
                  <Text style={[styles.tierButtonText, { color: selectedTier === tier.id ? '#FFFFFF' : '#9CA3AF' }]}>
                    {selectedTier === tier.id ? '立即开通' : '选择'}
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 续费管理 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>续费管理</Text>
          <View style={styles.renewalCard}>
            <View style={styles.renewalHeader}>
              <View style={styles.renewalInfo}>
                <View style={[styles.renewalBadge, { backgroundColor: '#E0F2F1' }]}>
                  <FontAwesome6 name="crown" size={16} color="#26A69A" />
                  <Text style={styles.renewalPlanName}>{renewalInfo.currentPlan}</Text>
                </View>
                <Text style={styles.renewalExpire}>有效期至 {renewalInfo.expireDate}</Text>
              </View>
              <TouchableOpacity style={styles.renewalSettings}>
                <Ionicons name="settings-outline" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.renewalDetails}>
              <View style={styles.renewalItem}>
                <Text style={styles.renewalLabel}>自动续费</Text>
                <View style={styles.renewalToggle}>
                  <View style={[styles.toggle, renewalInfo.autoRenew && styles.toggleActive]}>
                    <View style={[styles.toggleDot, renewalInfo.autoRenew && styles.toggleDotActive]} />
                  </View>
                  <Text style={styles.renewalValue}>{renewalInfo.autoRenew ? '已开启' : '已关闭'}</Text>
                </View>
              </View>
              <View style={styles.renewalItem}>
                <Text style={styles.renewalLabel}>下次扣费</Text>
                <Text style={styles.renewalValue}>{renewalInfo.nextPayment}</Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.renewalButton}>
              <Text style={styles.renewalButtonText}>立即续费</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 打卡积分制 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>打卡积分</Text>
            <View style={styles.pointsDisplay}>
              <FontAwesome6 name="coins" size={16} color="#FFD700" />
              <Text style={styles.pointsValue}>1280</Text>
              <TouchableOpacity>
                <Text style={styles.pointsRule}>规则</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.tasksCard}>
            <View style={styles.tasksHeader}>
              <Text style={styles.tasksTitle}>今日任务</Text>
              <Text style={styles.tasksProgress}>4/6</Text>
            </View>
            <View style={styles.tasksGrid}>
              {pointTasks.map((task) => (
                <View 
                  key={task.id} 
                  style={[styles.taskItem, task.completed && styles.taskItemCompleted]}
                >
                  <View style={[styles.taskIcon, task.completed && styles.taskIconCompleted]}>
                    <FontAwesome6 
                      name={task.icon as any} 
                      size={16} 
                      color={task.completed ? '#FFFFFF' : '#26A69A'} 
                    />
                  </View>
                  <Text style={[styles.taskName, task.completed && styles.taskNameCompleted]}>
                    {task.name}
                  </Text>
                  <Text style={styles.taskPoints}>+{task.points}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* 用户成长体系 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>用户成长</Text>
          <View style={styles.growthCard}>
            <View style={styles.growthHeader}>
              <View style={[styles.levelBadge, { backgroundColor: '#E0F2F1' }]}>
                <Text style={styles.levelText}>LV.{userGrowth.level}</Text>
              </View>
              <View style={styles.growthInfo}>
                <Text style={styles.growthTitle}>{userGrowth.title}</Text>
                <View style={styles.expProgressBar}>
                  <View style={[styles.expProgressFill, { width: `${userGrowth.expProgress}%` }]} />
                </View>
                <Text style={styles.expText}>
                  {userGrowth.currentExp} / {userGrowth.nextLevelExp} 经验值
                </Text>
              </View>
            </View>
            
            <View style={styles.levelRewards}>
              <Text style={styles.levelRewardsTitle}>等级权益</Text>
              <View style={styles.levelRewardsList}>
                {userGrowth.benefits.map((benefit) => (
                  <View 
                    key={benefit.level} 
                    style={[styles.levelRewardItem, !benefit.unlocked && styles.levelRewardLocked]}
                  >
                    <View style={[styles.levelRewardBadge, { 
                      backgroundColor: benefit.unlocked ? '#26A69A20' : '#F3F4F6' 
                    }]}>
                      <FontAwesome6 
                        name={benefit.unlocked ? 'check' : 'lock'} 
                        size={12} 
                        color={benefit.unlocked ? '#26A69A' : '#D1D5DB'} 
                      />
                    </View>
                    <Text style={[styles.levelRewardText, !benefit.unlocked && styles.levelRewardTextLocked]}>
                      LV{benefit.level} {benefit.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* 游戏化运营系统 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>成就系统</Text>
          <View style={styles.achievementOverview}>
            {achievements.ranks.map((rank) => (
              <View key={rank.id} style={styles.rankItem}>
                <View style={[styles.rankIcon, { backgroundColor: rank.color + '20' }]}>
                  <FontAwesome6 name={rank.icon as any} size={18} color={rank.color} />
                </View>
                <Text style={styles.rankValue}>{rank.value}</Text>
                <Text style={styles.rankName}>{rank.name}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.badgeSection}>
            <Text style={styles.badgeSectionTitle}>我的徽章</Text>
            <View style={styles.badgeGrid}>
              {achievements.badges.map((badge) => (
                <View 
                  key={badge.id} 
                  style={[styles.badgeItem, !badge.unlocked && styles.badgeLocked]}
                >
                  <View style={[styles.badgeIcon, { 
                    backgroundColor: badge.unlocked ? badge.color + '20' : '#F3F4F6' 
                  }]}>
                    <FontAwesome6 
                      name={badge.icon as any} 
                      size={20} 
                      color={badge.unlocked ? badge.color : '#D1D5DB'} 
                    />
                  </View>
                  <Text style={[styles.badgeName, !badge.unlocked && styles.badgeNameLocked]}>
                    {badge.name}
                  </Text>
                  {!badge.unlocked && (
                    <View style={styles.badgeLockOverlay}>
                      <Ionicons name="lock-closed" size={12} color="#9CA3AF" />
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
          
          <TouchableOpacity style={styles.moreAchievements}>
            <Text style={styles.moreAchievementsText}>查看更多成就</Text>
            <Ionicons name="chevron-forward" size={16} color="#26A69A" />
          </TouchableOpacity>
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
  benefitsOverview: {
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
  overviewTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 16,
  },
  benefitsGrid: {
    gap: 16,
  },
  benefitCategory: {
    marginBottom: 8,
  },
  benefitCategoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 10,
  },
  benefitList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '45%',
    gap: 8,
  },
  benefitIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  benefitText: {
    fontSize: 13,
    color: '#1a1a2e',
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
    marginBottom: 12,
  },
  tiersContainer: {
    gap: 16,
  },
  tierCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
  },
  tierCardSelected: {
    shadowColor: '#26A69A',
    shadowOpacity: 0.15,
  },
  tierTag: {
    position: 'absolute',
    top: -8,
    right: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  tierTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  tierIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  tierName: {
    fontSize: 16,
    fontWeight: '700',
  },
  tierPrice: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  tierPriceValue: {
    fontSize: 28,
    fontWeight: '800',
  },
  tierPricePeriod: {
    fontSize: 14,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  tierOriginalPrice: {
    fontSize: 13,
    color: '#D1D5DB',
    textDecorationLine: 'line-through',
    marginBottom: 4,
  },
  tierSavings: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
  },
  tierSavingsText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tierFeatures: {
    marginTop: 12,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  featureText: {
    fontSize: 13,
    color: '#1a1a2e',
  },
  featureItemUnavailable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  featureTextUnavailable: {
    fontSize: 13,
    color: '#D1D5DB',
  },
  tierButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  tierButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
  renewalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  renewalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  renewalInfo: {
    flex: 1,
  },
  renewalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  renewalPlanName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#26A69A',
    marginLeft: 6,
  },
  renewalExpire: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  renewalSettings: {
    padding: 4,
  },
  renewalDetails: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  renewalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  renewalLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  renewalValue: {
    fontSize: 14,
    color: '#1a1a2e',
    fontWeight: '600',
  },
  renewalToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#26A69A',
  },
  toggleDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  toggleDotActive: {
    alignSelf: 'flex-end',
  },
  renewalButton: {
    backgroundColor: '#26A69A',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  renewalButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pointsDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pointsValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  pointsRule: {
    fontSize: 13,
    color: '#26A69A',
    marginLeft: 8,
  },
  tasksCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  tasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tasksTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  tasksProgress: {
    fontSize: 14,
    color: '#26A69A',
    fontWeight: '600',
  },
  tasksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  taskItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  taskItemCompleted: {
    backgroundColor: '#E8F5F3',
  },
  taskIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  taskIconCompleted: {
    backgroundColor: '#26A69A',
  },
  taskName: {
    flex: 1,
    fontSize: 13,
    color: '#1a1a2e',
  },
  taskNameCompleted: {
    color: '#26A69A',
  },
  taskPoints: {
    fontSize: 12,
    color: '#FF9800',
    fontWeight: '600',
  },
  growthCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  growthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  levelBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  levelText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#26A69A',
  },
  growthInfo: {
    flex: 1,
  },
  growthTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 10,
  },
  expProgressBar: {
    height: 8,
    backgroundColor: '#E0F2F1',
    borderRadius: 4,
    marginBottom: 6,
  },
  expProgressFill: {
    height: '100%',
    backgroundColor: '#26A69A',
    borderRadius: 4,
  },
  expText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  levelRewards: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
  },
  levelRewardsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
  },
  levelRewardsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  levelRewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  levelRewardLocked: {
    backgroundColor: '#F3F4F6',
  },
  levelRewardBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  levelRewardText: {
    fontSize: 12,
    color: '#26A69A',
    fontWeight: '600',
  },
  levelRewardTextLocked: {
    color: '#D1D5DB',
  },
  achievementOverview: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  rankItem: {
    flex: 1,
    alignItems: 'center',
  },
  rankIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  rankValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  rankName: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  badgeSection: {
    marginBottom: 12,
  },
  badgeSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
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
    position: 'relative',
  },
  badgeLocked: {
    opacity: 0.6,
  },
  badgeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 12,
    color: '#1a1a2e',
    textAlign: 'center',
  },
  badgeNameLocked: {
    color: '#D1D5DB',
  },
  badgeLockOverlay: {
    position: 'absolute',
    top: 8,
    right: '20%',
  },
  moreAchievements: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  moreAchievementsText: {
    fontSize: 14,
    color: '#26A69A',
    fontWeight: '600',
    marginRight: 4,
  },
});
