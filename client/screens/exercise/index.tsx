import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Screen } from '@/components/Screen';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SPORTS = [
  { id: '1', name: '跑步', icon: 'person-running', color: '#FF6B6B', bgColor: '#FFEBEE', kcal: 500, duration: 30 },
  { id: '2', name: '步行', icon: 'person-walking', color: '#26A69A', bgColor: '#E0F2F1', kcal: 200, duration: 45 },
  { id: '3', name: '游泳', icon: 'water', color: '#2196F3', bgColor: '#E3F2FD', kcal: 600, duration: 40 },
  { id: '4', name: '瑜伽', icon: 'person', color: '#9C27B0', bgColor: '#F3E5F5', kcal: 150, duration: 30 },
  { id: '5', name: '健身操', icon: 'dumbbell', color: '#FF9800', bgColor: '#FFF3E0', kcal: 400, duration: 25 },
  { id: '6', name: '骑行', icon: 'bicycle', color: '#4ECDC4', bgColor: '#E0F7F4', kcal: 350, duration: 40 },
  { id: '7', name: '高尔夫', icon: 'flag', color: '#8BC34A', bgColor: '#F1F8E9', kcal: 250, duration: 60 },
  { id: '8', name: '跳绳', icon: 'a', color: '#F44336', bgColor: '#FFEBEE', kcal: 450, duration: 20 },
];

const SPORT_TUTORIALS = [
  { id: '1', title: '正确跑步姿势', cover: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200', duration: '5分钟', views: '1.2万' },
  { id: '2', title: '瑜伽入门基础', cover: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200', duration: '10分钟', views: '2.3万' },
  { id: '3', title: 'HIIT燃脂训练', cover: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200', duration: '15分钟', views: '3.5万' },
  { id: '4', title: '游泳技巧教学', cover: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=200', duration: '12分钟', views: '1.8万' },
];

export default function ExerciseScreen() {
  const insets = useSafeAreaInsets();
  const [selectedSport, setSelectedSport] = useState<string | null>(null);

  return (
    <Screen>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* 运动三环概览 */}
        <View style={styles.ringsOverviewCard}>
          <Text style={styles.cardTitle}>今日运动</Text>
          <View style={styles.ringsContainer}>
            <View style={styles.ringsWrapper}>
              <View style={[styles.ringOuter, { width: 160, height: 160, borderRadius: 80, borderColor: '#4ECDC4' }]} />
              <View style={[styles.ringMiddle, { width: 130, height: 130, borderRadius: 65, borderColor: '#26A69A' }]} />
              <View style={[styles.ringInner, { width: 100, height: 100, borderRadius: 50, borderColor: '#FF6B6B' }]}>
                <Text style={styles.ringCenterValue}>420</Text>
                <Text style={styles.ringCenterUnit}>kcal</Text>
              </View>
            </View>
            <View style={styles.ringsStats}>
              <View style={styles.ringStat}>
                <View style={[styles.ringDot, { backgroundColor: '#FF6B6B' }]} />
                <Text style={styles.ringStatLabel}>卡路里</Text>
                <Text style={styles.ringStatValue}>420/500</Text>
              </View>
              <View style={styles.ringStat}>
                <View style={[styles.ringDot, { backgroundColor: '#26A69A' }]} />
                <Text style={styles.ringStatLabel}>时长</Text>
                <Text style={styles.ringStatValue}>45/60min</Text>
              </View>
              <View style={styles.ringStat}>
                <View style={[styles.ringDot, { backgroundColor: '#4ECDC4' }]} />
                <Text style={styles.ringStatLabel}>步数</Text>
                <Text style={styles.ringStatValue}>8500/10000</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 运动项目选择 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>选择运动项目</Text>
          <View style={styles.sportGrid}>
            {SPORTS.map((sport) => (
              <TouchableOpacity
                key={sport.id}
                style={[styles.sportCard, selectedSport === sport.id && styles.sportCardSelected]}
                onPress={() => setSelectedSport(sport.id)}
              >
                <View style={[styles.sportIconWrap, { backgroundColor: sport.bgColor }]}>
                  <FontAwesome6 name={sport.icon as any} size={24} color={sport.color} />
                </View>
                <Text style={styles.sportName}>{sport.name}</Text>
                <Text style={styles.sportInfo}>{sport.kcal}kcal</Text>
                <Text style={styles.sportDuration}>{sport.duration}min</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 开始运动按钮 */}
        {selectedSport && (
          <TouchableOpacity style={styles.startButton}>
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
    backgroundColor: '#F9FAFB',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  ringsOverviewCard: {
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 20,
  },
  ringsContainer: {
    alignItems: 'center',
  },
  ringsWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 180,
    marginBottom: 20,
  },
  ringOuter: {
    position: 'absolute',
    borderWidth: 8,
    borderColor: '#4ECDC440',
  },
  ringMiddle: {
    position: 'absolute',
    borderWidth: 8,
    borderColor: '#26A69A40',
  },
  ringInner: {
    position: 'absolute',
    borderWidth: 10,
    borderColor: '#FF6B6B40',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringCenterValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FF6B6B',
  },
  ringCenterUnit: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  ringsStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  ringStat: {
    alignItems: 'center',
  },
  ringDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginBottom: 6,
  },
  ringStatLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  ringStatValue: {
    fontSize: 14,
    fontWeight: '600',
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
  moreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  moreBtnText: {
    fontSize: 13,
    color: '#26A69A',
  },
  sportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  sportCard: {
    width: '23%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  sportCardSelected: {
    borderColor: '#26A69A',
    backgroundColor: '#E0F2F1',
  },
  sportIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  sportName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  sportInfo: {
    fontSize: 11,
    color: '#FF6B6B',
    fontWeight: '500',
  },
  sportDuration: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#26A69A',
    borderRadius: 25,
    paddingVertical: 14,
    marginBottom: 20,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tutorialScroll: {
    paddingRight: 20,
    gap: 12,
  },
  tutorialCard: {
    width: 180,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  tutorialImage: {
    width: '100%',
    height: 120,
  },
  tutorialOverlay: {
    position: 'absolute',
    top: 40,
    left: 70,
  },
  playIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    justifyContent: 'space-between',
  },
  tutorialDuration: {
    fontSize: 12,
    color: '#26A69A',
  },
  tutorialViews: {
    fontSize: 11,
    color: '#9CA3AF',
  },
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
    height: 100,
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  recordBarWrap: {
    alignItems: 'center',
  },
  recordBar: {
    width: 24,
    backgroundColor: '#26A69A',
    borderRadius: 6,
    marginBottom: 6,
  },
  recordDay: {
    fontSize: 11,
    color: '#9CA3AF',
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
    color: '#26A69A',
  },
  recordSummaryLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
});
