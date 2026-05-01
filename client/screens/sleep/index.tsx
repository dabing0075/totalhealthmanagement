import React from 'react';
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

const SLEEP_MUSIC = [
  { id: '1', title: '森林雨声', subTitle: '深度助眠', cover: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200', duration: '30分钟' },
  { id: '2', title: '海浪轻拍', subTitle: '放松冥想', cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200', duration: '45分钟' },
  { id: '3', title: '白噪音', subTitle: '专注助眠', cover: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=200', duration: '60分钟' },
  { id: '4', title: '雨夜咖啡馆', subTitle: '舒缓放松', cover: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=200', duration: '40分钟' },
];

export default function SleepScreen() {
  return (
    <Screen>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* 睡眠概览卡片 */}
        <View style={styles.overviewCard}>
          <View style={styles.overviewHeader}>
            <Text style={styles.overviewTitle}>今日睡眠</Text>
            <View style={styles.sleepScoreBadge}>
              <FontAwesome6 name="moon" size={14} color="#9C27B0" />
              <Text style={styles.sleepScoreText}>85分</Text>
            </View>
          </View>
          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <View style={[styles.metricIcon, { backgroundColor: '#9C27B0' }]}>
                <FontAwesome6 name="clock" size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.metricLabel}>睡眠时长</Text>
              <Text style={styles.metricValue}>7.5<Text style={styles.metricUnit}>h</Text></Text>
              <Text style={styles.metricTarget}>目标 8h</Text>
            </View>
            <View style={styles.metricItem}>
              <View style={[styles.metricIcon, { backgroundColor: '#E91E63' }]}>
                <FontAwesome6 name="heart-pulse" size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.metricLabel}>深度睡眠</Text>
              <Text style={styles.metricValue}>2.1<Text style={styles.metricUnit}>h</Text></Text>
              <Text style={styles.metricTarget}>目标 2.5h</Text>
            </View>
            <View style={styles.metricItem}>
              <View style={[styles.metricIcon, { backgroundColor: '#2196F3' }]}>
                <FontAwesome6 name="brain" size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.metricLabel}>睡眠质量</Text>
              <Text style={styles.metricValue}>85<Text style={styles.metricUnit}>分</Text></Text>
              <Text style={styles.metricTarget}>目标 90分</Text>
            </View>
          </View>
        </View>

        {/* 睡眠时间线 */}
        <View style={styles.timelineCard}>
          <Text style={styles.cardTitle}>睡眠时间线</Text>
          <View style={styles.timeline}>
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: '#9C27B0' }]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineLabel}>入睡时间</Text>
                <Text style={styles.timelineValue}>22:30</Text>
              </View>
            </View>
            <View style={styles.timelineLine} />
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: '#E91E63' }]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineLabel}>深度睡眠</Text>
                <Text style={styles.timelineValue}>00:30 - 02:45</Text>
              </View>
            </View>
            <View style={styles.timelineLine} />
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: '#2196F3' }]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineLabel}>起床时间</Text>
                <Text style={styles.timelineValue}>06:00</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 本周睡眠趋势 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>本周睡眠趋势</Text>
          <View style={styles.trendCard}>
            <View style={styles.trendChart}>
              {['一', '二', '三', '四', '五', '六', '日'].map((day, index) => {
                const heights = [65, 75, 70, 80, 72, 85, 78];
                const colors = ['#9C27B0', '#9C27B0', '#9C27B0', '#9C27B0', '#9C27B0', '#E91E63', '#9C27B0'];
                return (
                  <View key={day} style={styles.trendBarWrap}>
                    <View style={[styles.trendBar, { height: heights[index] * 0.6, backgroundColor: colors[index] }]} />
                    <Text style={styles.trendDay}>{day}</Text>
                    <Text style={styles.trendHours}>{heights[index] / 10}h</Text>
                  </View>
                );
              })}
            </View>
            <View style={styles.trendSummary}>
              <View style={styles.trendSummaryItem}>
                <Text style={styles.trendSummaryValue}>7.5h</Text>
                <Text style={styles.trendSummaryLabel}>平均时长</Text>
              </View>
              <View style={styles.trendSummaryItem}>
                <Text style={styles.trendSummaryValue}>85分</Text>
                <Text style={styles.trendSummaryLabel}>平均质量</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 催眠音乐 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>催眠音乐</Text>
            <TouchableOpacity style={styles.moreBtn}>
              <Text style={styles.moreBtnText}>全部</Text>
              <Ionicons name="chevron-forward" size={12} color="#26A69A" />
            </TouchableOpacity>
          </View>
          <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.musicScroll}>
              {SLEEP_MUSIC.map((music) => (
                <TouchableOpacity key={music.id} style={styles.musicCard}>
                  <Image source={{ uri: music.cover }} style={styles.musicImage} />
                  <View style={styles.musicOverlay}>
                    <View style={styles.playIcon}>
                      <Ionicons name="play" size={16} color="#FFFFFF" />
                    </View>
                  </View>
                  <View style={styles.musicInfo}>
                    <Text style={styles.musicTitle}>{music.title}</Text>
                    <Text style={styles.musicSubTitle}>{music.subTitle}</Text>
                    <View style={styles.musicDuration}>
                      <FontAwesome6 name="clock" size={10} color="#9CA3AF" />
                      <Text style={styles.musicDurationText}>{music.duration}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* 睡眠建议 */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Ionicons name="bulb" size={20} color="#9C27B0" />
            <Text style={styles.tipsTitle}>睡眠建议</Text>
          </View>
          <Text style={styles.tipsContent}>
            您的深度睡眠时长略低于目标值，建议睡前1小时避免使用电子设备，可尝试听一些舒缓的音乐帮助入睡。
          </Text>
        </View>

        {/* 记录睡眠 */}
        <TouchableOpacity style={styles.recordButton}>
          <FontAwesome6 name="plus" size={20} color="#FFFFFF" />
          <Text style={styles.recordButtonText}>记录睡眠</Text>
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
    marginBottom: 20,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  sleepScoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  sleepScoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9C27B0',
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    marginHorizontal: 4,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  metricLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  metricUnit: {
    fontSize: 12,
    fontWeight: '400',
  },
  metricTarget: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 4,
  },
  timelineCard: {
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
  timeline: {
    paddingLeft: 10,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 16,
  },
  timelineContent: {
    flex: 1,
  },
  timelineLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  timelineValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  timelineLine: {
    width: 2,
    height: 20,
    backgroundColor: '#E5E7EB',
    marginLeft: 5,
    marginBottom: 16,
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
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  trendBarWrap: {
    alignItems: 'center',
  },
  trendBar: {
    width: 28,
    borderRadius: 8,
    marginBottom: 8,
  },
  trendDay: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  trendHours: {
    fontSize: 10,
    color: '#9C27B0',
    marginTop: 4,
  },
  trendSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  trendSummaryItem: {
    alignItems: 'center',
  },
  trendSummaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#9C27B0',
  },
  trendSummaryLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  musicScroll: {
    paddingRight: 20,
    gap: 12,
  },
  musicCard: {
    width: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  musicImage: {
    width: '100%',
    height: 100,
  },
  musicOverlay: {
    position: 'absolute',
    top: 30,
    left: 50,
  },
  playIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  musicInfo: {
    padding: 12,
  },
  musicTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 2,
  },
  musicSubTitle: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 6,
  },
  musicDuration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  musicDurationText: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  tipsCard: {
    backgroundColor: '#F3E5F5',
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
    color: '#9C27B0',
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
    backgroundColor: '#9C27B0',
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
