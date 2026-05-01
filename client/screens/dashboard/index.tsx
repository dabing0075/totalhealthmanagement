import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { Screen } from '@/components/Screen';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome6, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ScoreData {
  label: string;
  value: number;
  max: number;
  color: string;
  trend: 'up' | 'down' | 'stable';
}

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  unit: string;
  trend?: string;
  trendValue?: string;
  trendUp?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  title,
  value,
  unit,
  trend,
  trendValue,
  trendUp,
}) => (
  <View style={styles.metricCard}>
    <View style={styles.metricIcon}>{icon}</View>
    <Text style={styles.metricTitle}>{title}</Text>
    <View style={styles.metricValueRow}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricUnit}>{unit}</Text>
    </View>
    {trend && (
      <View style={styles.trendContainer}>
        <Ionicons
          name={trendUp ? 'arrow-up' : trend === 'stable' ? 'remove' : 'arrow-down'}
          size={12}
          color={trendUp ? '#10B981' : '#EF4444'}
        />
        <Text style={[styles.trendValue, { color: trendUp ? '#10B981' : '#EF4444' }]}>
          {trendValue}
        </Text>
      </View>
    )}
  </View>
);

interface ProgressRingProps {
  score: number;
  maxScore: number;
  color: string;
  size: number;
  label: string;
  subLabel: string;
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  score,
  maxScore,
  color,
  size,
  label,
  subLabel,
}) => {
  const progress = score / maxScore;

  return (
    <View style={[styles.progressRing, { width: size, height: size }]}>
      <View
        style={[
          styles.progressRingOuter,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: `${color}30`,
          },
        ]}
      >
        <View
          style={[
            styles.progressRingInner,
            {
              width: size - 16,
              height: size - 16,
              borderRadius: (size - 16) / 2,
              backgroundColor: `${color}15`,
            },
          ]}
        >
          <Text style={[styles.progressRingScore, { color }]}>{score}</Text>
          <Text style={styles.progressRingLabel}>{label}</Text>
          <Text style={styles.progressRingSubLabel}>{subLabel}</Text>
        </View>
      </View>
      <View
        style={[
          styles.progressArc,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderTopColor: color,
            borderRightColor: progress > 0.25 ? color : 'transparent',
            borderBottomColor: progress > 0.5 ? color : 'transparent',
            borderLeftColor: progress > 0.75 ? color : 'transparent',
            transform: [{ rotate: '-45deg' }],
          },
        ]}
      />
    </View>
  );
};

export default function DashboardScreen() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const overallScore = 87;
  const maxScore = 100;

  const coreScores: ScoreData[] = [
    { label: '运动', value: 82, max: 100, color: '#26A69A', trend: 'up' },
    { label: '饮食', value: 78, max: 100, color: '#FF9800', trend: 'down' },
    { label: '睡眠', value: 91, max: 100, color: '#9C27B0', trend: 'stable' },
    { label: '压力', value: 68, max: 100, color: '#2196F3', trend: 'up' },
  ];

  const healthMetrics = [
    {
      icon: <FontAwesome6 name="heart-pulse" size={22} color="#EF4444" />,
      title: '心率',
      value: '72',
      unit: 'bpm',
      trend: 'stable',
      trendValue: '0',
      trendUp: true,
    },
    {
      icon: <FontAwesome6 name="lungs" size={22} color="#2196F3" />,
      title: '血氧',
      value: '98',
      unit: '%',
      trend: 'stable',
      trendValue: '+1%',
      trendUp: true,
    },
    {
      icon: <FontAwesome6 name="wind" size={22} color="#10B981" />,
      title: '呼吸率',
      value: '16',
      unit: '/min',
      trend: 'stable',
      trendValue: '-1',
      trendUp: true,
    },
    {
      icon: <MaterialCommunityIcons name="thermometer" size={22} color="#FF9800" />,
      title: '体温',
      value: '36.6',
      unit: '°C',
      trend: 'stable',
      trendValue: '0',
      trendUp: true,
    },
  ];

  const bodyComposition = [
    { label: '体重', value: '68.5', unit: 'kg', trend: 'down' as const, trendValue: '-0.3kg' },
    { label: 'BMI', value: '23.2', unit: '', trend: 'stable' as const, trendValue: '正常' },
    { label: '体脂率', value: '21.5', unit: '%', trend: 'down' as const, trendValue: '-0.8%' },
    { label: '肌肉量', value: '42.8', unit: 'kg', trend: 'up' as const, trendValue: '+0.2kg' },
    { label: '内脏脂肪', value: '8', unit: '', trend: 'down' as const, trendValue: '-1' },
    { label: '水分率', value: '55.2', unit: '%', trend: 'stable' as const, trendValue: '正常' },
  ];

  const exerciseData = [
    { label: '步数', value: '8,500', unit: '步', target: '10,000', progress: 85 },
    { label: '运动时长', value: '45', unit: '分钟', target: '60', progress: 75 },
    { label: '消耗热量', value: '420', unit: 'kcal', target: '500', progress: 84 },
    { label: '站立时长', value: '6', unit: '小时', target: '8', progress: 75 },
  ];

  const sleepData = [
    { label: '睡眠时长', value: '7.5', unit: '小时', target: '8', progress: 94 },
    { label: '深睡时长', value: '2.1', unit: '小时', target: '2.5', progress: 84 },
    { label: '入睡时间', value: '22:30', unit: '', target: '23:00前', progress: 100 },
    { label: '睡眠质量', value: '85', unit: '%', target: '90%', progress: 94 },
  ];

  const weeklyTrend = [
    { day: '一', score: 82 },
    { day: '二', score: 88 },
    { day: '三', score: 76 },
    { day: '四', score: 91 },
    { day: '五', score: 85 },
    { day: '六', score: 93 },
    { day: '日', score: 87 },
  ];

  const monthlySummary = {
    avgWeight: 68.8,
    totalExercise: 315,
    avgSleep: 7.2,
    healthScore: 87,
  };

  return (
    <Screen>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* 综合健康评分 */}
        <View style={styles.overallSection}>
          <View style={styles.overallCard}>
            <LinearGradient
              colors={['#26A69A', '#00897B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.overallGradient}
            >
              <View style={styles.overallHeader}>
                <Text style={styles.overallTitle}>综合健康评分</Text>
                <View style={styles.periodTabs}>
                  {['周', '月', '季'].map((tab) => (
                    <TouchableOpacity
                      key={tab}
                      style={[styles.periodTab, selectedPeriod === tab && styles.periodTabActive]}
                      onPress={() => setSelectedPeriod(tab)}
                    >
                      <Text
                        style={[
                          styles.periodTabText,
                          selectedPeriod === tab && styles.periodTabTextActive,
                        ]}
                      >
                        {tab}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.scoreDisplay}>
                <View style={styles.scoreCircle}>
                  <Text style={styles.scoreValue}>{overallScore}</Text>
                  <Text style={styles.scoreMax}>/{maxScore}</Text>
                </View>
                <View style={styles.scoreLabel}>
                  <Text style={styles.scoreGrade}>优秀</Text>
                  <Text style={styles.scoreDesc}>继续保持</Text>
                </View>
              </View>

              <View style={styles.coreScores}>
                {coreScores.map((item, index) => (
                  <View key={index} style={styles.coreScoreItem}>
                    <View style={[styles.coreScoreDot, { backgroundColor: item.color }]} />
                    <Text style={styles.coreScoreLabel}>{item.label}</Text>
                    <Text style={styles.coreScoreValue}>{item.value}</Text>
                  </View>
                ))}
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* 核心指标 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>生命体征</Text>
          <View style={styles.metricsGrid}>
            {healthMetrics.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </View>
        </View>

        {/* 身体成分 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>身体成分</Text>
          <View style={styles.bodyCompositionCard}>
            {bodyComposition.map((item, index) => (
              <View key={index} style={styles.bodyCompItem}>
                <Text style={styles.bodyCompLabel}>{item.label}</Text>
                <View style={styles.bodyCompValueRow}>
                  <Text style={styles.bodyCompValue}>{item.value}</Text>
                  <Text style={styles.bodyCompUnit}>{item.unit}</Text>
                </View>
                <View style={styles.bodyCompTrend}>
                  <Ionicons
                    name={item.trend === 'up' ? 'arrow-up' : item.trend === 'down' ? 'arrow-down' : 'remove'}
                    size={12}
                    color={item.trend === 'stable' ? '#9CA3AF' : '#10B981'}
                  />
                  <Text
                    style={[
                      styles.bodyCompTrendText,
                      { color: item.trend === 'stable' ? '#9CA3AF' : '#10B981' },
                    ]}
                  >
                    {item.trendValue}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 运动数据 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>运动数据</Text>
            <TouchableOpacity style={styles.moreBtn}>
              <Text style={styles.moreBtnText}>详情</Text>
              <Ionicons name="chevron-forward" size={16} color="#26A69A" />
            </TouchableOpacity>
          </View>
          <View style={styles.exerciseCard}>
            {exerciseData.map((item, index) => (
              <View key={index} style={styles.exerciseItem}>
                <View style={styles.exerciseHeader}>
                  <Text style={styles.exerciseLabel}>{item.label}</Text>
                  <Text style={styles.exerciseValue}>
                    {item.value}
                    <Text style={styles.exerciseUnit}> {item.unit}</Text>
                  </Text>
                </View>
                <View style={styles.exerciseProgressBar}>
                  <View
                    style={[styles.exerciseProgress, { width: `${item.progress}%` }]}
                  />
                </View>
                <Text style={styles.exerciseTarget}>目标: {item.target}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 睡眠分析 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>睡眠分析</Text>
            <TouchableOpacity style={styles.moreBtn}>
              <Text style={styles.moreBtnText}>详情</Text>
              <Ionicons name="chevron-forward" size={16} color="#9C27B0" />
            </TouchableOpacity>
          </View>
          <View style={styles.sleepCard}>
            <View style={styles.sleepChart}>
              {weeklyTrend.map((item, index) => (
                <View key={index} style={styles.sleepBar}>
                  <View
                    style={[
                      styles.sleepBarFill,
                      { height: `${item.score}%`, backgroundColor: '#9C27B0' },
                    ]}
                  />
                  <Text style={styles.sleepDayLabel}>{item.day}</Text>
                </View>
              ))}
            </View>
            <View style={styles.sleepStats}>
              {sleepData.map((item, index) => (
                <View key={index} style={styles.sleepStat}>
                  <Text style={styles.sleepStatLabel}>{item.label}</Text>
                  <Text style={styles.sleepStatValue}>
                    {item.value}
                    <Text style={styles.sleepStatUnit}>{item.unit}</Text>
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* 周趋势图 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>本周趋势</Text>
          <View style={styles.trendCard}>
            <View style={styles.trendChart}>
              {weeklyTrend.map((item, index) => {
                const maxHeight = 120;
                const height = (item.score / 100) * maxHeight;
                return (
                  <View key={index} style={styles.trendBar}>
                    <View style={[styles.trendBarFill, { height }]}>
                      <LinearGradient
                        colors={['#26A69A', '#00897B']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 0, y: 0 }}
                        style={[styles.trendBarGradient, { height }]} />
                    </View>
                    <Text style={styles.trendDayLabel}>{item.day}</Text>
                    <Text style={styles.trendScoreLabel}>{item.score}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* 月度总结 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>月度总结</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryItem}>
              <View style={[styles.summaryIcon, { backgroundColor: '#E0F2F1' }]}>
                <FontAwesome6 name="weight-scale" size={20} color="#26A69A" />
              </View>
              <Text style={styles.summaryValue}>{monthlySummary.avgWeight} kg</Text>
              <Text style={styles.summaryLabel}>平均体重</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <View style={[styles.summaryIcon, { backgroundColor: '#FFF3E0' }]}>
                <FontAwesome6 name="person-walking" size={20} color="#FF9800" />
              </View>
              <Text style={styles.summaryValue}>{monthlySummary.totalExercise} min</Text>
              <Text style={styles.summaryLabel}>总运动</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <View style={[styles.summaryIcon, { backgroundColor: '#F3E5F5' }]}>
                <FontAwesome6 name="moon" size={20} color="#9C27B0" />
              </View>
              <Text style={styles.summaryValue}>{monthlySummary.avgSleep} h</Text>
              <Text style={styles.summaryLabel}>平均睡眠</Text>
            </View>
          </View>
        </View>

        {/* 导出报告按钮 */}
        <TouchableOpacity style={styles.exportBtn}>
          <MaterialCommunityIcons name="file-chart" size={20} color="#26A69A" />
          <Text style={styles.exportBtnText}>导出健康报告</Text>
        </TouchableOpacity>
      </ScrollView>

    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    zIndex: 100,
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
  },
  overallSection: {
    marginBottom: 20,
  },
  overallCard: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#26A69A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  overallGradient: {
    padding: 20,
  },
  overallHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  overallTitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  periodTabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    padding: 3,
  },
  periodTab: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 7,
  },
  periodTabActive: {
    backgroundColor: '#FFFFFF',
  },
  periodTabText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  periodTabTextActive: {
    color: '#26A69A',
    fontWeight: '600',
  },
  scoreDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 20,
  },
  scoreCircle: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreValue: {
    fontSize: 64,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  scoreMax: {
    fontSize: 24,
    color: 'rgba(255,255,255,0.7)',
  },
  scoreLabel: {
    alignItems: 'flex-start',
  },
  scoreGrade: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scoreDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
  },
  coreScores: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 16,
  },
  coreScoreItem: {
    alignItems: 'center',
  },
  coreScoreDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 6,
  },
  coreScoreLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 4,
  },
  coreScoreValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
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
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 12,
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
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  metricTitle: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  metricValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  metricUnit: {
    fontSize: 13,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  trendValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  bodyCompositionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  bodyCompItem: {
    width: '33.33%',
    paddingVertical: 8,
    alignItems: 'center',
  },
  bodyCompLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  bodyCompValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  bodyCompValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  bodyCompUnit: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 2,
  },
  bodyCompTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  bodyCompTrendText: {
    fontSize: 11,
    fontWeight: '600',
  },
  exerciseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  exerciseItem: {
    marginBottom: 16,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  exerciseValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  exerciseUnit: {
    fontSize: 12,
    fontWeight: '400',
    color: '#9CA3AF',
  },
  exerciseProgressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 4,
  },
  exerciseProgress: {
    height: '100%',
    backgroundColor: '#26A69A',
    borderRadius: 4,
  },
  exerciseTarget: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  sleepCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  sleepChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 16,
    paddingBottom: 20,
  },
  sleepBar: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  sleepBarFill: {
    width: 24,
    borderRadius: 4,
    marginBottom: 6,
  },
  sleepDayLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    position: 'absolute',
    bottom: 0,
  },
  sleepScoreLabel: {
    fontSize: 10,
    color: '#9C27B0',
    position: 'absolute',
    top: 0,
  },
  sleepStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  sleepStat: {
    alignItems: 'center',
  },
  sleepStatLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  sleepStatValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  sleepStatUnit: {
    fontSize: 10,
    fontWeight: '400',
    color: '#9CA3AF',
  },
  trendCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
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
    height: 160,
  },
  trendBar: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  trendBarFill: {
    width: 28,
    borderRadius: 6,
    overflow: 'hidden',
  },
  trendBarGradient: {
    width: '100%',
  },
  trendDayLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    position: 'absolute',
    bottom: 16,
  },
  trendScoreLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#26A69A',
    position: 'absolute',
    bottom: 0,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  summaryDivider: {
    width: 1,
    height: 60,
    backgroundColor: '#E5E7EB',
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    marginTop: 8,
  },
  exportBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#26A69A',
  },
  progressRing: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  progressRingOuter: {
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressRingInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressRingScore: {
    fontSize: 32,
    fontWeight: '800',
  },
  progressRingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  progressRingSubLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  progressArc: {
    position: 'absolute',
    borderWidth: 6,
    borderColor: 'transparent',
  },
});
