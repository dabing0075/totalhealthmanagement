import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const EMOTION_OVERVIEW = {
  score: 75,
  weekAvg: 72,
  currentState: '平静',
  stability: 78,
};

const EMOTION_LIST = [
  { id: '1', icon: 'face-grin-stars', color: '#FFD700', label: '很开心' },
  { id: '2', icon: 'face-smile', color: '#4CAF50', label: '开心' },
  { id: '3', icon: 'face-meh', color: '#26A69A', label: '平静' },
  { id: '4', icon: 'face-meh-blank', color: '#9E9E9E', label: '一般' },
  { id: '5', icon: 'face-frown', color: '#FF9800', label: '焦虑' },
  { id: '6', icon: 'face-sad-tear', color: '#F44336', label: '难过' },
];

const WEEK_TREND = [
  { day: '周一', score: 68 },
  { day: '周二', score: 75, energy: 75 },
  { day: '周五', score: 72 },
  { day: '周日', score: 80 },
];

const BREATH_STEPS = [
  { step: 1, text: '吸气4秒', color: '#81D4FA' },
  { step: 2, text: '屏息7秒', color: '#CE93D8' },
  { step: 3, text: '呼气8秒', color: '#F8BBD9' },
];

const MENTAL_ACTIVITIES = [
  {
    id: '1',
    title: '正念冥想',
    desc: '通过专注当下，减少焦虑和压力',
    duration: '预计时长:10-20分钟',
    items: [
      { name: '初级冥想 10分钟', tag: '入门', tagColor: '#C8E6C9' },
      { name: '深度冥想 20分钟', tag: '进阶', tagColor: '#F8BBD9' },
      { name: '行走冥想 15分钟', tag: '中级', tagColor: '#FFF9C4' },
    ],
    bgColor: '#F3E5F5',
    iconColor: '#9C27B0',
    icon: 'brain',
  },
  {
    id: '2',
    title: '呼吸训练',
    desc: '通过控制呼吸节奏，调节情绪状态',
    duration: '预计时长:5-15分钟',
    items: [
      { name: '4-7-8呼吸法 5分钟', tag: '入门', tagColor: '#C8E6C9' },
      { name: '箱式呼吸 10分钟', tag: '中级', tagColor: '#FFF9C4' },
      { name: '腹式呼吸 15分钟', tag: '进阶', tagColor: '#F8BBD9' },
    ],
    bgColor: '#E3F2FD',
    iconColor: '#2196F3',
    icon: 'wind',
  },
  {
    id: '3',
    title: '瑜伽',
    desc: '结合身体和心念的练习，提升整体福祉',
    duration: '预计时长:15-45分钟',
    items: [
      { name: '晨间瑜伽 15分钟', tag: '入门', tagColor: '#C8E6C9' },
      { name: '减压瑜伽 30分钟', tag: '中级', tagColor: '#FFF9C4' },
      { name: '力量瑜伽 45分钟', tag: '进阶', tagColor: '#F8BBD9' },
    ],
    bgColor: '#E8F5E9',
    iconColor: '#4CAF50',
    icon: 'person',
  },
];

const TIPS = [
  '减轻焦虑和压力',
  '改善睡眠质量',
  '提高专注力',
  '调节情绪状态',
];

export default function EmotionScreen() {
  const router = useRouter();
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathCount, setBreathCount] = useState(4);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

  const handleStartBreathing = () => {
    setIsBreathing(true);
    let count = 4;
    let phase: 'inhale' | 'hold' | 'exhale' = 'inhale';
    
    const interval = setInterval(() => {
      count--;
      if (count <= 0) {
        if (phase === 'inhale') {
          phase = 'hold';
          count = 7;
          setBreathPhase('hold');
        } else if (phase === 'hold') {
          phase = 'exhale';
          count = 8;
          setBreathPhase('exhale');
        } else {
          phase = 'inhale';
          count = 4;
          setBreathPhase('inhale');
        }
      }
      setBreathCount(count);
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      setIsBreathing(false);
      setBreathCount(4);
      setBreathPhase('inhale');
    }, 20000);
  };

  const getBreathText = () => {
    switch (breathPhase) {
      case 'inhale':
        return '吸气';
      case 'hold':
        return '屏息';
      case 'exhale':
        return '呼气';
    }
  };

  return (
    <Screen>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.contentContainer, styles.contentPadding, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* 当前情绪状态卡片 */}
        <LinearGradient
          colors={['#E91E63', '#F06292']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.overviewCard}
        >
          <TouchableOpacity style={styles.favoriteBtn}>
            <Ionicons name="heart-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.overviewContent}>
            <View style={styles.overviewLeft}>
              <Text style={styles.overviewValue}>{EMOTION_OVERVIEW.score}</Text>
              <Text style={styles.overviewLabel}>情绪评分</Text>
              <View style={styles.overviewDivider} />
              <Text style={styles.overviewValue2}>{EMOTION_OVERVIEW.weekAvg}</Text>
              <Text style={styles.overviewLabel}>周平均</Text>
            </View>
            <View style={styles.overviewRight}>
              <Text style={styles.overviewState}>{EMOTION_OVERVIEW.currentState}</Text>
              <Text style={styles.overviewLabel}>当前状态</Text>
              <View style={styles.overviewDivider} />
              <Text style={styles.overviewValue2}>{EMOTION_OVERVIEW.stability}%</Text>
              <Text style={styles.overviewLabel}>情绪稳定性</Text>
            </View>
          </View>
        </LinearGradient>

        {/* 记录当前情绪 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>记录当前情绪</Text>
          <View style={styles.emotionGrid}>
            {EMOTION_LIST.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.emotionCard,
                  selectedEmotion === item.id && styles.emotionCardSelected,
                ]}
                onPress={() => setSelectedEmotion(item.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.emotionIconWrap, { backgroundColor: `${item.color}20` }]}>
                  <FontAwesome6 name={item.icon as any} size={32} color={item.color} />
                </View>
                <Text
                  style={[
                    styles.emotionLabel,
                    selectedEmotion === item.id && styles.emotionLabelSelected,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 情绪趋势分析 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>情绪趋势分析</Text>
            <TouchableOpacity style={styles.moreBtn}>
              <Ionicons name="arrow-up" size={14} color="#26A69A" />
            </TouchableOpacity>
          </View>
          <View style={styles.trendCard}>
            <View style={styles.trendChart}>
              {WEEK_TREND.map((item, index) => (
                <View key={item.day} style={styles.trendItem}>
                  <View style={styles.trendBarContainer}>
                    <View
                      style={[
                        styles.trendBar,
                        { height: `${item.score}%` },
                        index === 1 && styles.trendBarHighlight,
                      ]}
                    />
                  </View>
                  <Text style={styles.trendDay}>{item.day}</Text>
                  <Text style={styles.trendScore}>{item.score}</Text>
                </View>
              ))}
            </View>
            <View style={styles.trendTooltip}>
              <Text style={styles.trendTooltipTitle}>周三</Text>
              <View style={styles.trendTooltipRow}>
                <Text style={styles.trendTooltipLabel}>情绪评分:</Text>
                <Text style={styles.trendTooltipValue}>75</Text>
              </View>
              <View style={styles.trendTooltipRow}>
                <Text style={styles.trendTooltipLabel}>能量水平:</Text>
                <Text style={[styles.trendTooltipValue, { color: '#FF9800' }]}>75</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 呼吸训练 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>呼吸训练</Text>
          <View style={styles.breathCard}>
            <View style={styles.breathCircleContainer}>
              <LinearGradient
                colors={isBreathing ? ['#81D4FA', '#4FC3F7'] : ['#E3F2FD', '#BBDEFB']}
                style={styles.breathCircle}
              >
                <Text style={styles.breathCount}>{breathCount}</Text>
                <Text style={styles.breathText}>{getBreathText()}</Text>
              </LinearGradient>
            </View>
            <TouchableOpacity
              style={[styles.breathStartBtn, isBreathing && styles.breathStartBtnActive]}
              onPress={handleStartBreathing}
              disabled={isBreathing}
              activeOpacity={0.8}
            >
              <Text style={styles.breathStartText}>
                {isBreathing ? '训练中...' : '开始呼吸训练'}
              </Text>
            </TouchableOpacity>

            <View style={styles.breathMethod}>
              <Text style={styles.breathMethodTitle}>4-7-8呼吸法</Text>
              <View style={styles.breathSteps}>
                {BREATH_STEPS.map((step) => (
                  <View key={step.step} style={styles.breathStep}>
                    <View style={[styles.breathStepDot, { backgroundColor: step.color }]}>
                      <Text style={styles.breathStepNum}>{step.step}</Text>
                    </View>
                    <Text style={styles.breathStepText}>{step.text}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.breathTips}>
              {TIPS.map((tip, index) => (
                <Text key={index} style={styles.breathTip}>
                  · {tip}
                </Text>
              ))}
            </View>
          </View>
        </View>

        {/* 心理健康活动 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>心理健康活动</Text>
          {MENTAL_ACTIVITIES.map((activity) => (
            <View key={activity.id} style={styles.activityCard}>
              <View style={[styles.activityIconWrap, { backgroundColor: activity.bgColor }]}>
                <FontAwesome6 name={activity.icon as any} size={24} color={activity.iconColor} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityDesc}>{activity.desc}</Text>
                <Text style={styles.activityDuration}>{activity.duration}</Text>
                <View style={styles.activityTags}>
                  {activity.items.map((item, index) => (
                    <View key={index} style={styles.activityTag}>
                      <Text style={styles.activityTagText}>{item.name}</Text>
                      <View style={[styles.activityTagBadge, { backgroundColor: item.tagColor }]}>
                        <Text style={styles.activityTagBadgeText}>{item.tag}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* 今日情绪提升建议 */}
        <LinearGradient
          colors={['#E91E63', '#9C27B0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.tipsCard}
        >
          <Text style={styles.tipsTitle}>今日情绪提升建议</Text>
          <Text style={styles.tipsDesc}>
            根据您今日的情绪数据分析，建议您进行15-20分钟的正念冥想练习，有助于稳定情绪、提升专注力。
          </Text>
        </LinearGradient>
      </ScrollView>

      {/* 固定顶部导航栏 */}
      <View style={styles.fixedHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <FontAwesome6 name="chevron-left" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>情绪</Text>
        <View style={styles.headerRight} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    zIndex: 100,
  },
  contentPadding: {
    paddingTop: 55,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerRight: {
    width: 40,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
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
  moreBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  // 当前情绪状态卡片
  overviewCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    position: 'relative',
  },
  favoriteBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  overviewContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overviewLeft: {
    alignItems: 'center',
    flex: 1,
  },
  overviewRight: {
    alignItems: 'center',
    flex: 1,
  },
  overviewValue: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  overviewValue2: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  overviewLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 4,
  },
  overviewState: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  overviewDivider: {
    width: 60,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginVertical: 12,
  },
  // 记录当前情绪
  emotionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  emotionCard: {
    width: '30%',
    marginHorizontal: '1.5%',
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  emotionCardSelected: {
    backgroundColor: '#FCE4EC',
    borderWidth: 2,
    borderColor: '#E91E63',
  },
  emotionIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  emotionLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  emotionLabelSelected: {
    color: '#E91E63',
    fontWeight: '600',
  },
  // 情绪趋势分析
  trendCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  trendChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 20,
  },
  trendItem: {
    alignItems: 'center',
    flex: 1,
  },
  trendBarContainer: {
    width: 30,
    height: 100,
    backgroundColor: '#F3F4F6',
    borderRadius: 15,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginBottom: 8,
  },
  trendBar: {
    width: '100%',
    backgroundColor: '#FF9800',
    borderRadius: 15,
    minHeight: 10,
  },
  trendBarHighlight: {
    backgroundColor: '#9C27B0',
    borderWidth: 2,
    borderColor: '#E91E63',
    borderRadius: 15,
  },
  trendDay: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  trendScore: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  trendTooltip: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  trendTooltipTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  trendTooltipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  trendTooltipLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  trendTooltipValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E91E63',
  },
  // 呼吸训练
  breathCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  breathCircleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  breathCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  breathCount: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  breathText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 4,
  },
  breathStartBtn: {
    backgroundColor: '#26A69A',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 24,
  },
  breathStartBtnActive: {
    backgroundColor: '#BDBDBD',
  },
  breathStartText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  breathMethod: {
    marginBottom: 20,
  },
  breathMethodTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 16,
    textAlign: 'center',
  },
  breathSteps: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  breathStep: {
    alignItems: 'center',
  },
  breathStepDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  breathStepNum: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  breathStepText: {
    fontSize: 13,
    color: '#6B7280',
  },
  breathTips: {
    backgroundColor: '#E0F2F1',
    borderRadius: 12,
    padding: 16,
  },
  breathTip: {
    fontSize: 13,
    color: '#1a1a2e',
    lineHeight: 24,
  },
  // 心理健康活动
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  activityIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 6,
  },
  activityDesc: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  activityDuration: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 10,
  },
  activityTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  activityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
  },
  activityTagText: {
    fontSize: 11,
    color: '#6B7280',
  },
  activityTagBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  activityTagBadgeText: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
  },
  // 今日情绪提升建议
  tipsCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  tipsDesc: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 22,
  },
});
