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

const EMOTION_ITEMS = [
  { id: '1', name: '开心', icon: 'face-smile', color: '#FFD700', bgColor: '#FFFDE7', score: 85 },
  { id: '2', name: '平静', icon: 'face-meh', color: '#26A69A', bgColor: '#E0F2F1', score: 72 },
  { id: '3', name: '焦虑', icon: 'face-frown', color: '#FF9800', bgColor: '#FFF3E0', score: 35 },
  { id: '4', name: '压力', icon: 'brain', color: '#F44336', bgColor: '#FFEBEE', score: 45 },
];

const MINDFULNESS_ITEMS = [
  { id: '1', title: '正念冥想入门', cover: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=200', duration: '10分钟', category: '冥想' },
  { id: '2', title: '呼吸训练法', cover: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=200', duration: '5分钟', category: '呼吸' },
  { id: '3', title: '瑜伽放松术', cover: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200', duration: '15分钟', category: '瑜伽' },
  { id: '4', title: '情绪日记', cover: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=200', duration: '自由', category: '记录' },
];

const MOOD_HISTORY = [
  { date: '今天', score: 72, trend: 'up' },
  { date: '昨天', score: 65, trend: 'up' },
  { date: '前天', score: 58, trend: 'down' },
  { date: '周二', score: 70, trend: 'up' },
  { date: '周一', score: 62, trend: 'down' },
];

export default function EmotionScreen() {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

  return (
    <Screen>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* 情绪概览 */}
        <View style={styles.overviewCard}>
          <View style={styles.overviewHeader}>
            <Text style={styles.overviewTitle}>今日情绪状态</Text>
            <View style={styles.emotionScoreBadge}>
              <Text style={styles.emotionScoreValue}>72</Text>
              <Text style={styles.emotionScoreLabel}>分</Text>
            </View>
          </View>
          <View style={styles.emotionGauge}>
            <View style={[styles.emotionGaugeFill, { width: '72%' }]} />
          </View>
          <Text style={styles.emotionDesc}>整体状态良好，继续保持积极心态</Text>
        </View>

        {/* 情绪选择 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>记录当前情绪</Text>
          <View style={styles.emotionGrid}>
            {EMOTION_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.emotionCard, selectedEmotion === item.id && styles.emotionCardSelected]}
                onPress={() => setSelectedEmotion(item.id)}
              >
                <View style={[styles.emotionIconWrap, { backgroundColor: item.bgColor }]}>
                  <FontAwesome6 name={item.icon as any} size={28} color={item.color} />
                </View>
                <Text style={styles.emotionName}>{item.name}</Text>
                <Text style={[styles.emotionScore, { color: item.color }]}>{item.score}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 情绪趋势 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>本周情绪趋势</Text>
          <View style={styles.trendCard}>
            <View style={styles.trendChart}>
              {MOOD_HISTORY.map((item, index) => (
                <View key={item.date} style={styles.trendItem}>
                  <View style={[styles.trendDot, { backgroundColor: item.score >= 60 ? '#26A69A' : '#FF9800' }]} />
                  <Text style={styles.trendScore}>{item.score}</Text>
                  <Text style={styles.trendDate}>{item.date}</Text>
                  {item.trend === 'up' ? (
                    <Ionicons name="arrow-up" size={10} color="#26A69A" />
                  ) : (
                    <Ionicons name="arrow-down" size={10} color="#FF9800" />
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* 正念放松 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>正念放松</Text>
          <View style={styles.mindfulnessGrid}>
            <TouchableOpacity style={styles.mindfulnessCard}>
              <View style={[styles.mindfulnessIcon, { backgroundColor: '#9C27B0' }]}>
                <FontAwesome6 name="brain" size={28} color="#FFFFFF" />
              </View>
              <Text style={styles.mindfulnessTitle}>正念冥想</Text>
              <Text style={styles.mindfulnessDesc}>引导式冥想练习，平静内心</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mindfulnessCard}>
              <View style={[styles.mindfulnessIcon, { backgroundColor: '#2196F3' }]}>
                <FontAwesome6 name="wind" size={28} color="#FFFFFF" />
              </View>
              <Text style={styles.mindfulnessTitle}>呼吸训练</Text>
              <Text style={styles.mindfulnessDesc}>科学呼吸方法，缓解焦虑</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mindfulnessCard}>
              <View style={[styles.mindfulnessIcon, { backgroundColor: '#26A69A' }]}>
                <FontAwesome6 name="person" size={28} color="#FFFFFF" />
              </View>
              <Text style={styles.mindfulnessTitle}>瑜伽</Text>
              <Text style={styles.mindfulnessDesc}>身心放松练习，舒缓压力</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 推荐练习 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>推荐练习</Text>
            <TouchableOpacity style={styles.moreBtn}>
              <Text style={styles.moreBtnText}>全部</Text>
              <Ionicons name="chevron-forward" size={12} color="#26A69A" />
            </TouchableOpacity>
          </View>
          <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tutorialScroll}>
              {MINDFULNESS_ITEMS.map((item) => (
                <TouchableOpacity key={item.id} style={styles.tutorialCard}>
                  <Image source={{ uri: item.cover }} style={styles.tutorialImage} />
                  <View style={styles.tutorialOverlay}>
                    <View style={styles.playIcon}>
                      <Ionicons name="play" size={20} color="#FFFFFF" />
                    </View>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>{item.category}</Text>
                    </View>
                  </View>
                  <View style={styles.tutorialInfo}>
                    <Text style={styles.tutorialTitle}>{item.title}</Text>
                    <View style={styles.tutorialMeta}>
                      <FontAwesome6 name="clock" size={10} color="#9CA3AF" />
                      <Text style={styles.tutorialDuration}>{item.duration}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* 情绪小贴士 */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Ionicons name="bulb" size={20} color="#FF9800" />
            <Text style={styles.tipsTitle}>情绪调节建议</Text>
          </View>
          <Text style={styles.tipsContent}>
            当感到焦虑时，可以尝试深呼吸4-7-8法则：吸气4秒，屏气7秒，呼气8秒，重复3-4次可有效缓解焦虑情绪。
          </Text>
        </View>

        {/* 记录情绪按钮 */}
        {selectedEmotion && (
          <TouchableOpacity style={styles.recordButton}>
            <FontAwesome6 name="check" size={20} color="#FFFFFF" />
            <Text style={styles.recordButtonText}>记录情绪</Text>
          </TouchableOpacity>
        )}
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
  overviewCard: {
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
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  emotionScoreBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  emotionScoreValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FF9800',
  },
  emotionScoreLabel: {
    fontSize: 14,
    color: '#FF9800',
    marginLeft: 2,
  },
  emotionGauge: {
    height: 12,
    backgroundColor: '#FFF3E0',
    borderRadius: 6,
    marginBottom: 12,
  },
  emotionGaugeFill: {
    height: '100%',
    backgroundColor: '#FF9800',
    borderRadius: 6,
  },
  emotionDesc: {
    fontSize: 14,
    color: '#666666',
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
  emotionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  emotionCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  emotionCardSelected: {
    borderColor: '#FF9800',
    backgroundColor: '#FFF3E0',
  },
  emotionIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  emotionName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  emotionScore: {
    fontSize: 18,
    fontWeight: '700',
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
  },
  trendItem: {
    alignItems: 'center',
    gap: 4,
  },
  trendDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 6,
  },
  trendScore: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  trendDate: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  mindfulnessGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  mindfulnessCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  mindfulnessIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  mindfulnessTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  mindfulnessDesc: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 4,
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
    height: 110,
  },
  tutorialOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  playIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#FFFFFF',
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
    alignItems: 'center',
    gap: 4,
  },
  tutorialDuration: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  tipsCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FF9800',
  },
  tipsContent: {
    fontSize: 14,
    color: '#1a1a2e',
    lineHeight: 22,
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FF9800',
    borderRadius: 25,
    paddingVertical: 14,
    marginBottom: 20,
  },
  recordButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
