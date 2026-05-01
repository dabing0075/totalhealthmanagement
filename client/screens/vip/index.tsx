import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen } from '@/components/Screen';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';

// VIP基础会员套餐
const VIP_BASIC_PLANS = [
  {
    id: 'year',
    name: '年卡',
    subtitle: '买一送一',
    price: '128',
    period: '24个月',
    originalPrice: '216元/年',
    features: ['加赠主题皮肤', '0.1元加购体重秤'],
    badge: '最划算',
    badgeColor: '#FF9800',
  },
  {
    id: 'quarter',
    name: '季卡',
    price: '45',
    period: '3个月',
    features: [],
    badge: '',
    badgeColor: '',
  },
  {
    id: 'month',
    name: '月卡',
    subtitle: '首购买一送一',
    price: '18',
    period: '月',
    originalPrice: '',
    features: [],
    badge: '',
    badgeColor: '',
  },
];

// VIP进阶会员套餐
const VIP_ADVANCED_PLANS = [
  {
    id: 'advanced-year',
    name: '首年卡',
    price: '398',
    period: '年',
    originalPrice: '598元/年',
    gift: '赠送监测指环',
    features: ['血压监测', '睡眠监测', '血糖监测', '步数监测', '趋势图分析', '量身定制食谱'],
  },
  {
    id: 'advanced-quarter',
    name: '首季卡',
    price: '198',
    period: '3个月',
    originalPrice: '368元/季',
    gift: '赠送监测指环',
    features: ['血压监测', '睡眠监测', '血糖监测', '步数监测'],
  },
];

// 打卡挑战
const CHECKIN_CHALLENGE = {
  fee: '45元',
  period: '93天',
  goal: '连续30天打卡',
  refund: '全额返还',
  extra: '6份随单控卡小食权益',
};

// 基础权益列表
const BASIC_RIGHTS = [
  { icon: 'utensils', text: '定制减重方案', color: '#26A69A' },
  { icon: 'wand-magic-sparkles', text: 'AI算热量', color: '#9C27B0' },
  { icon: 'chart-line', text: '每周减重小结', color: '#2196F3' },
  { icon: 'user-doctor', text: '1V1人工减重服务', color: '#FF9800' },
  { icon: 'gift', text: '0元领零食(每月2份)', color: '#E91E63' },
  { icon: 'tag', text: '全场88折', color: '#4CAF50' },
];

// 进阶权益列表
const ADVANCED_RIGHTS = [
  { icon: 'heart-pulse', text: '血压/睡眠/血糖监测', color: '#9C27B0' },
  { icon: 'chart-simple', text: '多维度记录分析', color: '#2196F3' },
  { icon: 'bowl-food', text: '控糖限油食谱', color: '#4CAF50' },
  { icon: 'users', text: '进阶社群', color: '#FF9800' },
  { icon: 'calendar-check', text: '21天养成营', color: '#E91E63' },
  { icon: 'ring', text: '价值700元监测指环', color: '#26A69A' },
];

export default function VipScreen() {
  const [selectedBasicPlan, setSelectedBasicPlan] = useState<string>('year');
  const [selectedAdvancedPlan, setSelectedAdvancedPlan] = useState<string>('advanced-year');

  // 用户会员数据
  const userData = {
    isVip: true,
    vipType: 'VIP基础会员',
    expireDate: '2026年5月1日',
    memberSince: '2025年1月1日',
    remainingDays: 365,
  };

  return (
    <Screen>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* 会员状态卡片 */}
        <LinearGradient
          colors={['#F5A623', '#E07B00']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.vipStatusCard}
        >
          <View style={styles.memberStatusHeader}>
            <View style={styles.memberStatusLeft}>
              <FontAwesome6 name="crown" size={28} color="#FFD700" />
              <View style={styles.memberStatusInfo}>
                <Text style={styles.memberStatusType}>{userData.vipType}</Text>
                <Text style={styles.memberStatusSince}>开通时间: {userData.memberSince}</Text>
              </View>
            </View>
            <View style={styles.memberStatusRight}>
              <Text style={styles.memberRemainingDays}>{userData.remainingDays}</Text>
              <Text style={styles.memberRemainingLabel}>剩余天数</Text>
            </View>
          </View>
          <View style={styles.memberStatusFooter}>
            <Text style={styles.memberExpireText}>有效期至 {userData.expireDate}</Text>
            <TouchableOpacity style={styles.memberRenewBtn}>
              <Text style={styles.memberRenewBtnText}>立即续费</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* VIP基础会员 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>VIP基础会员</Text>
          <Text style={styles.sectionSubtitle}>减重 / 日常健康管理</Text>
          
          <View style={styles.plansGrid}>
            {VIP_BASIC_PLANS.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planCard,
                  selectedBasicPlan === plan.id && styles.planCardSelected,
                ]}
                onPress={() => setSelectedBasicPlan(plan.id)}
              >
                {plan.badge && (
                  <View style={[styles.planBadge, { backgroundColor: plan.badgeColor }]}>
                    <Text style={styles.planBadgeText}>{plan.badge}</Text>
                  </View>
                )}
                <Text style={styles.planName}>{plan.name}</Text>
                {plan.subtitle && (
                  <Text style={styles.planSubtitle}>{plan.subtitle}</Text>
                )}
                <View style={styles.planPriceRow}>
                  <Text style={styles.planPrice}>¥{plan.price}</Text>
                  <Text style={styles.planPeriod}>/{plan.period}</Text>
                </View>
                {plan.originalPrice && (
                  <Text style={styles.planOriginalPrice}>{plan.originalPrice}</Text>
                )}
                {plan.features.length > 0 && (
                  <View style={styles.planFeatures}>
                    {plan.features.map((feature, idx) => (
                      <Text key={idx} style={styles.planFeatureText}>• {feature}</Text>
                    ))}
                  </View>
                )}
                {selectedBasicPlan === plan.id && (
                  <View style={styles.planSelected}>
                    <Ionicons name="checkmark-circle" size={24} color="#26A69A" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* VIP基础会员核心权益 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>核心权益</Text>
          <View style={styles.rightsGrid}>
            {BASIC_RIGHTS.map((right) => (
              <View key={right.text} style={styles.rightItem}>
                <View style={[styles.rightIconWrap, { backgroundColor: right.color + '15' }]}>
                  <FontAwesome6 name={right.icon as any} size={16} color={right.color} />
                </View>
                <Text style={styles.rightText}>{right.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* VIP进阶会员 */}
        <View style={styles.section}>
          <View style={styles.advancedHeader}>
            <View>
              <Text style={styles.sectionTitle}>VIP进阶会员</Text>
              <Text style={styles.sectionSubtitle}>监测指环版</Text>
            </View>
            <View style={styles.advancedTag}>
              <FontAwesome6 name="ring" size={14} color="#FFFFFF" />
              <Text style={styles.advancedTagText}>含价值700元指环</Text>
            </View>
          </View>
          
          <View style={styles.advancedPlans}>
            {VIP_ADVANCED_PLANS.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.advancedPlanCard,
                  selectedAdvancedPlan === plan.id && styles.advancedPlanCardSelected,
                ]}
                onPress={() => setSelectedAdvancedPlan(plan.id)}
              >
                <View style={styles.advancedPlanHeader}>
                  <Text style={styles.advancedPlanName}>{plan.name}</Text>
                  <View style={styles.advancedPlanGift}>
                    <FontAwesome6 name="gift" size={12} color="#E91E63" />
                    <Text style={styles.advancedPlanGiftText}>{plan.gift}</Text>
                  </View>
                </View>
                
                <View style={styles.advancedPlanPriceRow}>
                  <Text style={styles.advancedPlanPrice}>¥{plan.price}</Text>
                  <Text style={styles.advancedPlanPeriod}>/{plan.period}</Text>
                  <Text style={styles.advancedPlanOriginal}>原价{plan.originalPrice}</Text>
                </View>
                
                <View style={styles.advancedPlanFeatures}>
                  {plan.features.slice(0, 4).map((feature, idx) => (
                    <View key={idx} style={styles.advancedFeatureItem}>
                      <View style={styles.advancedFeatureDot} />
                      <Text style={styles.advancedFeatureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
                
                {selectedAdvancedPlan === plan.id && (
                  <View style={styles.advancedPlanSelected}>
                    <Ionicons name="checkmark-circle" size={24} color="#9C27B0" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* VIP进阶专属权益 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>进阶会员专属权益</Text>
          <View style={styles.advancedRightsList}>
            {ADVANCED_RIGHTS.map((right) => (
              <View key={right.text} style={styles.advancedRightItem}>
                <View style={[styles.advancedRightIcon, { backgroundColor: right.color + '15' }]}>
                  <FontAwesome6 name={right.icon as any} size={16} color={right.color} />
                </View>
                <Text style={styles.advancedRightText}>{right.text}</Text>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              </View>
            ))}
          </View>
        </View>

        {/* 打卡挑战 */}
        <View style={styles.challengeSection}>
          <View style={styles.challengeHeader}>
            <Text style={styles.challengeTitle}>打卡挑战免费得会员</Text>
            <View style={styles.challengeBadge}>
              <FontAwesome6 name="fire" size={14} color="#FF6B6B" />
              <Text style={styles.challengeBadgeText}>限时活动</Text>
            </View>
          </View>
          
          <View style={styles.challengeCard}>
            <View style={styles.challengeMain}>
              <View style={styles.challengeItem}>
                <Text style={styles.challengeValue}>¥{CHECKIN_CHALLENGE.fee.replace('元', '')}</Text>
                <Text style={styles.challengeLabel}>报名费</Text>
              </View>
              <View style={styles.challengeArrow}>
                <FontAwesome6 name="arrow-right" size={20} color="#26A69A" />
              </View>
              <View style={styles.challengeItem}>
                <Text style={styles.challengeValue}>{CHECKIN_CHALLENGE.period}</Text>
                <Text style={styles.challengeLabel}>VIP会员</Text>
              </View>
              <View style={styles.challengeArrow}>
                <FontAwesome6 name="arrow-right" size={20} color="#26A69A" />
              </View>
              <View style={styles.challengeItem}>
                <Text style={[styles.challengeValue, { color: '#4CAF50' }]}>{CHECKIN_CHALLENGE.refund}</Text>
                <Text style={styles.challengeLabel}>返还</Text>
              </View>
            </View>
            
            <View style={styles.challengeRule}>
              <View style={styles.challengeRuleItem}>
                <FontAwesome6 name="bullseye" size={14} color="#FF9800" />
                <Text style={styles.challengeRuleText}>目标：{CHECKIN_CHALLENGE.goal}</Text>
              </View>
              <View style={styles.challengeRuleItem}>
                <FontAwesome6 name="gift" size={14} color="#E91E63" />
                <Text style={styles.challengeRuleText}>额外：{CHECKIN_CHALLENGE.extra}</Text>
              </View>
            </View>
            
            <View style={styles.challengeWarning}>
              <Ionicons name="information-circle" size={14} color="#9CA3AF" />
              <Text style={styles.challengeWarningText}>不支持补卡，当日未打卡则挑战失败</Text>
            </View>
          </View>
        </View>


      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentContainer: {
    padding: 16,
  },
  // 会员状态卡片
  vipStatusCard: {
    borderRadius: 20,
    padding: 20,
  },
  memberStatusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  memberStatusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  memberStatusInfo: {
    gap: 4,
  },
  memberStatusType: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  memberStatusSince: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  memberStatusRight: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
  },
  memberRemainingDays: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFD700',
  },
  memberRemainingLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  memberStatusFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  memberExpireText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },
  memberRenewBtn: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  memberRenewBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  vipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  vipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  vipBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF9800',
  },
  vipExpireText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  vipStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  vipStatItem: {
    alignItems: 'center',
  },
  vipStatValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  vipStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  vipStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
  },
  levelProgress: {
    marginTop: 8,
  },
  levelInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  levelHint: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  levelBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  levelBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  // 通用section
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  // VIP基础会员套餐
  plansGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  planCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  planCardSelected: {
    borderColor: '#26A69A',
    backgroundColor: '#E8F5E9',
  },
  planBadge: {
    position: 'absolute',
    top: -8,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  planBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  planName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 2,
  },
  planSubtitle: {
    fontSize: 10,
    color: '#FF9800',
    marginBottom: 8,
  },
  planPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#26A69A',
  },
  planPeriod: {
    fontSize: 12,
    color: '#6B7280',
  },
  planOriginalPrice: {
    fontSize: 11,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  planFeatures: {
    marginTop: 8,
  },
  planFeatureText: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 2,
  },
  planSelected: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  // 基础权益
  rightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  rightItem: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  rightIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightText: {
    flex: 1,
    fontSize: 12,
    color: '#1a1a2e',
  },
  // VIP进阶会员
  advancedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  advancedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#9C27B0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  advancedTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  advancedPlans: {
    gap: 12,
  },
  advancedPlanCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  advancedPlanCardSelected: {
    borderColor: '#9C27B0',
    backgroundColor: '#F3E5F5',
  },
  advancedPlanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  advancedPlanName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  advancedPlanGift: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FCE4EC',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  advancedPlanGiftText: {
    fontSize: 11,
    color: '#E91E63',
    fontWeight: '600',
  },
  advancedPlanPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  advancedPlanPrice: {
    fontSize: 28,
    fontWeight: '700',
    color: '#9C27B0',
  },
  advancedPlanPeriod: {
    fontSize: 14,
    color: '#6B7280',
  },
  advancedPlanOriginal: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 8,
    textDecorationLine: 'line-through',
  },
  advancedPlanFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  advancedFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  advancedFeatureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#9C27B0',
  },
  advancedFeatureText: {
    fontSize: 12,
    color: '#6B7280',
  },
  advancedPlanSelected: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  // 进阶权益
  advancedRightsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  advancedRightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  advancedRightIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  advancedRightText: {
    flex: 1,
    fontSize: 13,
    color: '#1a1a2e',
  },
  // 打卡挑战
  challengeSection: {
    marginTop: 24,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  challengeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  challengeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  challengeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  challengeMain: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 16,
  },
  challengeItem: {
    alignItems: 'center',
  },
  challengeValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  challengeLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
  },
  challengeArrow: {
    paddingHorizontal: 8,
  },
  challengeRule: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    gap: 8,
  },
  challengeRuleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  challengeRuleText: {
    fontSize: 13,
    color: '#1a1a2e',
  },
  challengeWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  challengeWarningText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
