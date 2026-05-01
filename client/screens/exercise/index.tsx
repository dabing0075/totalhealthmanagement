import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const EXERCISE_OVERVIEW = {
  steps: 8524,
  calories: 342,
  distance: 6.2,
  minutes: 85,
};

const EXERCISE_RINGS = {
  activity: { current: 85, target: 100, unit: '分钟', percent: 85 },
  exercise: { current: 65, target: 100, unit: '分钟', percent: 65 },
  stand: { current: 9, target: 12, unit: '小时', percent: 75 },
};

const SPORTS = [
  { 
    id: '1', 
    name: '跑步', 
    icon: 'person-running', 
    color: '#FF6B6B', 
    bgColor: '#FFEBEE',
    description: '有氧运动，提高心肺功能'
  },
  { 
    id: '2', 
    name: '步行', 
    icon: 'person-walking', 
    color: '#26A69A', 
    bgColor: '#E0F2F1',
    description: '低强度，适合日常健身'
  },
  { 
    id: '3', 
    name: '游泳', 
    icon: 'water', 
    color: '#2196F3', 
    bgColor: '#E3F2FD',
    description: '全身运动，保护关节'
  },
  { 
    id: '4', 
    name: '瑜伽', 
    icon: 'person', 
    color: '#9C27B0', 
    bgColor: '#F3E5F5',
    description: '柔韧训练，身心放松'
  },
  { 
    id: '5', 
    name: '健身操', 
    icon: 'dumbbell', 
    color: '#FF9800', 
    bgColor: '#FFF3E0',
    description: '燃脂塑形，节奏感强'
  },
  { 
    id: '6', 
    name: '骑行', 
    icon: 'bicycle', 
    color: '#4ECDC4', 
    bgColor: '#E0F7F4',
    description: '户外骑行，增强体质'
  },
  { 
    id: '7', 
    name: '高尔夫', 
    icon: 'flag', 
    color: '#8BC34A', 
    bgColor: '#F1F8E9',
    description: '社交运动，修身养性'
  },
  { 
    id: '8', 
    name: '跳绳', 
    icon: 'a', 
    color: '#F44336', 
    bgColor: '#FFEBEE',
    description: '高效燃脂，简单有趣'
  },
];

const SPORT_TUTORIALS = [
  { id: '1', title: '正确跑步姿势', cover: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200', duration: '5分钟', views: '1.2万' },
  { id: '2', title: '瑜伽入门基础', cover: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200', duration: '10分钟', views: '2.3万' },
  { id: '3', title: 'HIIT燃脂训练', cover: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200', duration: '15分钟', views: '3.5万' },
  { id: '4', title: '游泳技巧教学', cover: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=200', duration: '12分钟', views: '1.8万' },
];

const RING_IMAGES: Record<string, string> = {
  '跑步': 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=100',
  '步行': 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=100',
  '游泳': 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=100',
  '瑜伽': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=100',
  '健身操': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=100',
  '骑行': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100',
  '高尔夫': 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=100',
  '跳绳': 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=100',
};

export default function ExerciseScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedSport, setSelectedSport] = useState<string | null>(null);

  const totalPercent = Math.round(
    (EXERCISE_RINGS.activity.percent + EXERCISE_RINGS.exercise.percent + EXERCISE_RINGS.stand.percent) / 3
  );

  const renderRingProgress = (percent: number, color: string, size: number) => {
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = (percent / 100) * circumference;
    const remaining = circumference - progress;

    return (
      <View style={[styles.ringSvgContainer, { width: size, height: size }]}>
        {/* Background circle */}
        <View
          style={[
            styles.ringCircle,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: strokeWidth,
              borderColor: `${color}20`,
            },
          ]}
        />
        {/* Progress arc - using multiple segments to simulate */}
        <View
          style={[
            styles.ringProgress,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: strokeWidth,
              borderColor: color,
              borderTopColor: percent >= 25 ? color : 'transparent',
              borderRightColor: percent >= 50 ? color : 'transparent',
              borderBottomColor: percent >= 75 ? color : 'transparent',
              borderLeftColor: percent >= 100 ? color : 'transparent',
              transform: [{ rotate: '-45deg' }],
            },
          ]}
        />
      </View>
    );
  };

  return (
    <Screen>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* 今日运动概览 */}
        <View style={styles.overviewCard}>
          <View style={styles.overviewHeader}>
            <Text style={styles.overviewTitle}>今日运动概览</Text>
            <Ionicons name="analytics-outline" size={18} color="#FFFFFF" />
          </View>
          <View style={styles.overviewGrid}>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewValue}>{EXERCISE_OVERVIEW.steps.toLocaleString()}</Text>
              <Text style={styles.overviewLabel}>步数</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewValue}>{EXERCISE_OVERVIEW.calories}</Text>
              <Text style={styles.overviewLabel}>卡路里</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewValue}>{EXERCISE_OVERVIEW.distance}</Text>
              <Text style={styles.overviewLabel}>公里</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewValue}>{EXERCISE_OVERVIEW.minutes}</Text>
              <Text style={styles.overviewLabel}>活动分钟</Text>
            </View>
          </View>
        </View>

        {/* 运动三环 */}
        <View style={styles.ringsCard}>
          <View style={styles.ringsCardHeader}>
            <Text style={styles.ringsCardTitle}>运动三环</Text>
            <TouchableOpacity style={styles.ringsCardAction}>
              <FontAwesome6 name="chart-line" size={14} color="#26A69A" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.ringsMainContent}>
            {/* 环形进度图 */}
            <View style={styles.ringChartContainer}>
              <View style={styles.ringChartBg}>
                {/* Activity ring - Red */}
                <View style={[styles.activityRing, { width: 120, height: 120, borderRadius: 60 }]} />
                {/* Exercise ring - Teal */}
                <View style={[styles.exerciseRing, { width: 100, height: 100, borderRadius: 50 }]} />
                {/* Stand ring - Blue */}
                <View style={[styles.standRing, { width: 80, height: 80, borderRadius: 40 }]} />
                {/* Center */}
                <View style={styles.ringChartCenter}>
                  <Text style={styles.ringPercentValue}>{totalPercent}%</Text>
                  <Text style={styles.ringPercentLabel}>今日完成</Text>
                </View>
              </View>
            </View>

            {/* 三环详细数据 */}
            <View style={styles.ringsDetailList}>
              <View style={styles.ringDetailItem}>
                <View style={[styles.ringDot, { backgroundColor: '#FF6B6B' }]} />
                <View style={styles.ringDetailContent}>
                  <View style={styles.ringDetailHeader}>
                    <Text style={styles.ringDetailName}>活动</Text>
                    <Text style={styles.ringDetailValue}>
                      {EXERCISE_RINGS.activity.current}/{EXERCISE_RINGS.activity.target} {EXERCISE_RINGS.activity.unit}
                    </Text>
                  </View>
                  <View style={styles.ringDetailProgress}>
                    <View style={[styles.ringDetailBar, { width: `${EXERCISE_RINGS.activity.percent}%`, backgroundColor: '#FF6B6B' }]} />
                  </View>
                  <Text style={styles.ringDetailPercent}>{EXERCISE_RINGS.activity.percent}%</Text>
                </View>
              </View>

              <View style={styles.ringDetailItem}>
                <View style={[styles.ringDot, { backgroundColor: '#4ECDC4' }]} />
                <View style={styles.ringDetailContent}>
                  <View style={styles.ringDetailHeader}>
                    <Text style={styles.ringDetailName}>运动</Text>
                    <Text style={styles.ringDetailValue}>
                      {EXERCISE_RINGS.exercise.current}/{EXERCISE_RINGS.exercise.target} {EXERCISE_RINGS.exercise.unit}
                    </Text>
                  </View>
                  <View style={styles.ringDetailProgress}>
                    <View style={[styles.ringDetailBar, { width: `${EXERCISE_RINGS.exercise.percent}%`, backgroundColor: '#4ECDC4' }]} />
                  </View>
                  <Text style={styles.ringDetailPercent}>{EXERCISE_RINGS.exercise.percent}%</Text>
                </View>
              </View>

              <View style={styles.ringDetailItem}>
                <View style={[styles.ringDot, { backgroundColor: '#2196F3' }]} />
                <View style={styles.ringDetailContent}>
                  <View style={styles.ringDetailHeader}>
                    <Text style={styles.ringDetailName}>站立</Text>
                    <Text style={styles.ringDetailValue}>
                      {EXERCISE_RINGS.stand.current}/{EXERCISE_RINGS.stand.target} {EXERCISE_RINGS.stand.unit}
                    </Text>
                  </View>
                  <View style={styles.ringDetailProgress}>
                    <View style={[styles.ringDetailBar, { width: `${EXERCISE_RINGS.stand.percent}%`, backgroundColor: '#2196F3' }]} />
                  </View>
                  <Text style={styles.ringDetailPercent}>{EXERCISE_RINGS.stand.percent}%</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* 选择运动项目 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>选择运动项目</Text>
          <View style={styles.sportGrid}>
            {SPORTS.map((sport) => (
              <TouchableOpacity
                key={sport.id}
                style={[styles.sportCard, selectedSport === sport.id && styles.sportCardSelected]}
                onPress={() => setSelectedSport(sport.id)}
                activeOpacity={0.7}
              >
                <Image
                  source={{ uri: RING_IMAGES[sport.name] }}
                  style={styles.sportImage}
                />
                <Text style={styles.sportName}>{sport.name}</Text>
                <Text style={styles.sportDescription}>{sport.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 开始运动按钮 */}
        {selectedSport && (
          <TouchableOpacity style={styles.startButton} activeOpacity={0.8}>
            <FontAwesome6 name="play" size={20} color="#FFFFFF" />
            <Text style={styles.startButtonText}>开始 {SPORTS.find(s => s.id === selectedSport)?.name}</Text>
          </TouchableOpacity>
        )}

        {/* 示范动作学习 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>示范动作学习</Text>
            <TouchableOpacity style={styles.moreBtn}>
              <Text style={styles.moreBtnText}>全部</Text>
              <Ionicons name="chevron-forward" size={12} color="#26A69A" />
            </TouchableOpacity>
          </View>
          <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tutorialScroll}>
              {SPORT_TUTORIALS.map((tutorial) => (
                <TouchableOpacity key={tutorial.id} style={styles.tutorialCard}>
                  <Image source={{ uri: tutorial.cover }} style={styles.tutorialImage} />
                  <View style={styles.tutorialOverlay}>
                    <View style={styles.playIcon}>
                      <Ionicons name="play" size={20} color="#FFFFFF" />
                    </View>
                  </View>
                  <View style={styles.tutorialInfo}>
                    <Text style={styles.tutorialTitle}>{tutorial.title}</Text>
                    <View style={styles.tutorialMeta}>
                      <Text style={styles.tutorialDuration}>{tutorial.duration}</Text>
                      <Text style={styles.tutorialViews}>{tutorial.views}人学习</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* 运动记录 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>本周运动记录</Text>
          <View style={styles.recordCard}>
            <View style={styles.recordChart}>
              {['一', '二', '三', '四', '五', '六', '日'].map((day, index) => {
                const heights = [60, 80, 45, 70, 55, 90, 65];
                return (
                  <View key={day} style={styles.recordBarWrap}>
                    <View style={[styles.recordBar, { height: heights[index] * 0.5 }]} />
                    <Text style={styles.recordDay}>{day}</Text>
                  </View>
                );
              })}
            </View>
            <View style={styles.recordSummary}>
              <View style={styles.recordSummaryItem}>
                <Text style={styles.recordSummaryValue}>4.2h</Text>
                <Text style={styles.recordSummaryLabel}>本周运动</Text>
              </View>
              <View style={styles.recordSummaryItem}>
                <Text style={styles.recordSummaryValue}>2850</Text>
                <Text style={styles.recordSummaryLabel}>消耗kcal</Text>
              </View>
              <View style={styles.recordSummaryItem}>
                <Text style={styles.recordSummaryValue}>5天</Text>
                <Text style={styles.recordSummaryLabel}>达标天数</Text>
              </View>
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
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  // 今日运动概览
  overviewCard: {
    backgroundColor: '#26A69A',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  overviewItem: {
    width: '50%',
    paddingVertical: 8,
  },
  overviewValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  overviewLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 4,
  },
  // 运动三环
  ringsCard: {
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
  ringsCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  ringsCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  ringsCardAction: {
    padding: 8,
    backgroundColor: '#E0F2F1',
    borderRadius: 8,
  },
  ringsMainContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ringChartContainer: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringChartBg: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  activityRing: {
    position: 'absolute',
    borderWidth: 10,
    borderColor: 'rgba(255, 107, 107, 0.3)',
    backgroundColor: 'transparent',
  },
  exerciseRing: {
    position: 'absolute',
    borderWidth: 10,
    borderColor: 'rgba(78, 205, 196, 0.3)',
    backgroundColor: 'transparent',
  },
  standRing: {
    position: 'absolute',
    borderWidth: 10,
    borderColor: 'rgba(33, 150, 243, 0.3)',
    backgroundColor: 'transparent',
  },
  ringChartCenter: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ringPercentValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
  },
  ringPercentLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
  ringSvgContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringCircle: {
    position: 'absolute',
  },
  ringProgress: {
    position: 'absolute',
  },
  ringsDetailList: {
    flex: 1,
    marginLeft: 20,
  },
  ringDetailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  ringDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
    marginRight: 10,
  },
  ringDetailContent: {
    flex: 1,
  },
  ringDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  ringDetailName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  ringDetailValue: {
    fontSize: 12,
    color: '#6B7280',
  },
  ringDetailProgress: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    marginBottom: 4,
  },
  ringDetailBar: {
    height: '100%',
    borderRadius: 3,
  },
  ringDetailPercent: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  // 选择运动项目
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 16,
  },
  sportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  sportCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: '1.5%',
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  sportCardSelected: {
    borderWidth: 2,
    borderColor: '#26A69A',
    backgroundColor: '#E0F2F1',
  },
  sportImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 12,
    backgroundColor: '#F3F4F6',
  },
  sportName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  sportDescription: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
  },
  // 开始运动按钮
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#26A69A',
    borderRadius: 30,
    paddingVertical: 16,
    marginHorizontal: 20,
    marginBottom: 24,
    gap: 8,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // 示范动作学习
  moreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  moreBtnText: {
    fontSize: 14,
    color: '#26A69A',
  },
  tutorialScroll: {
    paddingRight: 16,
  },
  tutorialCard: {
    width: 160,
    marginRight: 12,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  tutorialImage: {
    width: '100%',
    height: 100,
    backgroundColor: '#F3F4F6',
  },
  tutorialOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(38, 166, 154, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tutorialInfo: {
    padding: 12,
  },
  tutorialTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 6,
  },
  tutorialMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  tutorialDuration: {
    fontSize: 12,
    color: '#26A69A',
  },
  tutorialViews: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  // 运动记录
  recordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  recordChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 20,
    paddingTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  recordBarWrap: {
    alignItems: 'center',
  },
  recordBar: {
    width: 24,
    backgroundColor: '#26A69A',
    borderRadius: 4,
    marginBottom: 8,
  },
  recordDay: {
    fontSize: 12,
    color: '#6B7280',
  },
  recordSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  recordSummaryItem: {
    alignItems: 'center',
  },
  recordSummaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  recordSummaryLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
});
