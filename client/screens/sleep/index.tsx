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
import { LinearGradient } from 'expo-linear-gradient';

const SLEEP_OVERVIEW = {
  duration: 7.5,
  quality: 85,
  sleepTime: '23:30',
  wakeTime: '07:00',
};

const SLEEP_STAGES = [
  { name: '深睡眠', value: 2.1, percent: 28, color: '#7B1FA2' },
  { name: '浅睡眠', value: 3.8, percent: 51, color: '#9C27B0' },
  { name: 'REM睡眠', value: 1.6, percent: 21, color: '#CE93D8' },
];

const SLEEP_QUALITY = {
  total: 85,
  deep: 2.1,
  light: 3.8,
  rem: 1.6,
  label: '优秀',
};

const WEEK_TREND = [
  { day: '一', hours: 6.5, quality: 72 },
  { day: '二', hours: 7.2, quality: 78 },
  { day: '三', hours: 7.0, quality: 75 },
  { day: '四', hours: 8.0, quality: 88 },
  { day: '五', hours: 7.5, quality: 82 },
  { day: '六', hours: 7.8, quality: 85 },
  { day: '日', hours: 7.5, quality: 85 },
];

const SLEEP_TIPS = {
  suggestTime: '22:30',
  targetDuration: '8小时',
  description: '根据您的睡眠数据分析，为您推荐最佳的睡眠方案',
};

const SLEEP_MUSIC = [
  { id: '1', title: '森林雨声', subTitle: '深度助眠', cover: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200', duration: '30分钟' },
  { id: '2', title: '海浪轻拍', subTitle: '放松冥想', cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200', duration: '45分钟' },
  { id: '3', title: '白噪音', subTitle: '专注助眠', cover: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=200', duration: '60分钟' },
  { id: '4', title: '雨夜咖啡馆', subTitle: '舒缓放松', cover: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=200', duration: '40分钟' },
];

export default function SleepScreen() {
  const renderPieChart = () => {
    let startAngle = 0;
    return (
      <View style={styles.pieChartContainer}>
        <View style={styles.pieChart}>
          {SLEEP_STAGES.map((stage, index) => {
            const angle = (stage.percent / 100) * 360;
            const item = (
              <View key={stage.name}>
                <View
                  style={[
                    styles.pieSegment,
                    {
                      backgroundColor: stage.color,
                      transform: [
                        { rotate: `${startAngle - 90}deg` },
                      ],
                    },
                  ]}
                />
                <View
                  style={[
                    styles.pieSegment,
                    styles.pieSegmentMask,
                    {
                      transform: [
                        { rotate: `${startAngle + angle - 90}deg` },
                      ],
                    },
                  ]}
                />
              </View>
            );
            startAngle += angle;
            return item;
          })}
          <View style={styles.pieCenter} />
        </View>
        <View style={styles.pieLegend}>
          {SLEEP_STAGES.map((stage) => (
            <View key={stage.name} style={styles.pieLegendItem}>
              <View style={[styles.pieLegendDot, { backgroundColor: stage.color }]} />
              <Text style={styles.pieLegendName}>{stage.name}</Text>
              <Text style={styles.pieLegendValue}>{stage.value}h</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const maxHours = Math.max(...WEEK_TREND.map((d) => d.hours));

  return (
    <Screen>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* 昨夜睡眠概览 */}
        <LinearGradient
          colors={['#7B1FA2', '#9C27B0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.overviewCard}
        >
          <View style={styles.overviewHeader}>
            <Text style={styles.overviewTitle}>昨夜睡眠概览</Text>
            <Ionicons name="moon" size={22} color="#FFFFFF" />
          </View>
          <View style={styles.overviewGrid}>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewValue}>{SLEEP_OVERVIEW.duration}h</Text>
              <Text style={styles.overviewLabel}>睡眠时长</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewValue}>{SLEEP_OVERVIEW.quality}%</Text>
              <Text style={styles.overviewLabel}>睡眠质量</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewValue}>{SLEEP_OVERVIEW.sleepTime}</Text>
              <Text style={styles.overviewLabel}>入睡时间</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewValue}>{SLEEP_OVERVIEW.wakeTime}</Text>
              <Text style={styles.overviewLabel}>起床时间</Text>
            </View>
          </View>
        </LinearGradient>

        {/* 睡眠详细指标 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>睡眠详细指标</Text>

          {/* 睡眠阶段分布 */}
          <View style={styles.detailCard}>
            <Text style={styles.detailCardTitle}>睡眠阶段分布</Text>
            <View style={styles.sleepStagesContainer}>
              <View style={styles.sleepStagesChart}>
                <View style={styles.sleepStagesPie}>
                  <View style={[styles.pieBg, { backgroundColor: '#F3E5F5' }]} />
                  <View style={[styles.pieSlice, { backgroundColor: '#7B1FA2', width: '40%', height: '100%' }]} />
                  <View style={[styles.pieSlice, { backgroundColor: '#9C27B0', width: '40%', height: '100%', transform: [{ rotate: '150deg' }] }]} />
                  <View style={[styles.pieSlice, { backgroundColor: '#CE93D8', width: '20%', height: '100%', transform: [{ rotate: '240deg' }] }]} />
                  <View style={styles.pieCenterDot} />
                </View>
              </View>
              <View style={styles.sleepStagesList}>
                {SLEEP_STAGES.map((stage) => (
                  <View key={stage.name} style={styles.sleepStageItem}>
                    <View style={[styles.sleepStageDot, { backgroundColor: stage.color }]} />
                    <Text style={styles.sleepStageName}>{stage.name}</Text>
                    <Text style={styles.sleepStageTime}>{stage.value}h</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* 睡眠质量评估 */}
          <View style={styles.detailCard}>
            <Text style={styles.detailCardTitle}>睡眠质量评估</Text>
            <View style={styles.qualityHeader}>
              <Text style={styles.qualityLabel}>总体质量</Text>
              <View style={styles.qualityBadge}>
                <Text style={styles.qualityBadgeValue}>{SLEEP_QUALITY.total}%</Text>
                <Text style={styles.qualityBadgeTag}>优秀</Text>
              </View>
            </View>
            <View style={styles.qualityList}>
              <View style={styles.qualityItem}>
                <Text style={styles.qualityItemLabel}>深睡眠</Text>
                <Text style={styles.qualityItemValue}>{SLEEP_QUALITY.deep}h</Text>
              </View>
              <View style={styles.qualityItem}>
                <Text style={styles.qualityItemLabel}>浅睡眠</Text>
                <Text style={styles.qualityItemValue}>{SLEEP_QUALITY.light}h</Text>
              </View>
              <View style={styles.qualityItem}>
                <Text style={styles.qualityItemLabel}>REM睡眠</Text>
                <Text style={styles.qualityItemValue}>{SLEEP_QUALITY.rem}h</Text>
              </View>
            </View>
          </View>

          {/* 本周睡眠趋势 */}
          <View style={styles.detailCard}>
            <Text style={styles.detailCardTitle}>本周睡眠趋势</Text>
            <View style={styles.trendChart}>
              {WEEK_TREND.map((item, index) => (
                <View key={item.day} style={styles.trendBarWrap}>
                  <View style={styles.trendBarContainer}>
                    <View
                      style={[
                        styles.trendBar,
                        {
                          height: `${(item.hours / maxHours) * 100}%`,
                          backgroundColor: index === 5 ? '#E91E63' : '#9C27B0',
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.trendDay}>{item.day}</Text>
                  <Text style={styles.trendHours}>{item.hours}h</Text>
                </View>
              ))}
            </View>
            <View style={styles.trendLegend}>
              <View style={styles.trendLegendItem}>
                <View style={[styles.trendLegendDot, { backgroundColor: '#9C27B0' }]} />
                <Text style={styles.trendLegendText}>睡眠时长</Text>
              </View>
              <View style={styles.trendLegendItem}>
                <View style={[styles.trendLegendDot, { backgroundColor: '#E91E63' }]} />
                <Text style={styles.trendLegendText}>今日</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 今晚睡眠建议 */}
        <LinearGradient
          colors={['#7B1FA2', '#9C27B0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.tipsCard}
        >
          <Text style={styles.tipsTitle}>今晚睡眠建议</Text>
          <Text style={styles.tipsDesc}>{SLEEP_TIPS.description}</Text>
          <View style={styles.tipsContent}>
            <View style={styles.tipItem}>
              <View style={styles.tipItemIcon}>
                <Ionicons name="time-outline" size={20} color="#9C27B0" />
              </View>
              <Text style={styles.tipItemLabel}>建议入睡时间</Text>
              <Text style={styles.tipItemValue}>{SLEEP_TIPS.suggestTime}</Text>
            </View>
            <View style={styles.tipDivider} />
            <View style={styles.tipItem}>
              <View style={styles.tipItemIcon}>
                <FontAwesome6 name="bed" size={20} color="#9C27B0" />
              </View>
              <Text style={styles.tipItemLabel}>目标睡眠时长</Text>
              <Text style={styles.tipItemValue}>{SLEEP_TIPS.targetDuration}</Text>
            </View>
          </View>
        </LinearGradient>

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
    backgroundColor: '#F5F7FA',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  // 昨夜睡眠概览
  overviewCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
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
    color: '#FFFFFF',
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  overviewItem: {
    width: '50%',
    paddingVertical: 10,
  },
  overviewValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  // 睡眠详细指标
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  detailCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 16,
  },
  // 睡眠阶段分布
  sleepStagesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sleepStagesChart: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  sleepStagesPie: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F3E5F5',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  pieBg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  pieSlice: {
    position: 'absolute',
    width: '50%',
    height: '50%',
    top: 0,
    right: 0,
    borderTopRightRadius: 100,
  },
  pieCenterDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
  },
  sleepStagesList: {
    flex: 1,
  },
  sleepStageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sleepStageDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  sleepStageName: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  sleepStageTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  // 睡眠质量评估
  qualityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  qualityLabel: {
    fontSize: 15,
    color: '#6B7280',
  },
  qualityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  qualityBadgeValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10B981',
  },
  qualityBadgeTag: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  qualityList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  qualityItem: {
    alignItems: 'center',
    flex: 1,
  },
  qualityItemLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  qualityItemValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  // 本周睡眠趋势
  trendChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 12,
  },
  trendBarWrap: {
    alignItems: 'center',
    flex: 1,
  },
  trendBarContainer: {
    width: 20,
    height: 100,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginBottom: 6,
  },
  trendBar: {
    width: '100%',
    borderRadius: 10,
    minHeight: 10,
  },
  trendDay: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  trendHours: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  trendLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  trendLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trendLegendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  trendLegendText: {
    fontSize: 12,
    color: '#6B7280',
  },
  // 今晚睡眠建议
  tipsCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  tipsDesc: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 20,
    lineHeight: 20,
  },
  tipsContent: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 16,
  },
  tipItem: {
    flex: 1,
    alignItems: 'center',
  },
  tipItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  tipItemLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 4,
  },
  tipItemValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tipDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 16,
  },
  // 催眠音乐
  moreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  moreBtnText: {
    fontSize: 14,
    color: '#26A69A',
  },
  musicScroll: {
    paddingRight: 16,
  },
  musicCard: {
    width: 140,
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
  musicImage: {
    width: '100%',
    height: 90,
    backgroundColor: '#F3F4F6',
  },
  musicOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(38, 166, 154, 0.85)',
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
    marginBottom: 4,
  },
  musicSubTitle: {
    fontSize: 12,
    color: '#9C27B0',
    marginBottom: 6,
  },
  musicDuration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  musicDurationText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  // 记录睡眠按钮
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9C27B0',
    borderRadius: 30,
    paddingVertical: 16,
    marginHorizontal: 20,
    marginBottom: 24,
    gap: 8,
  },
  recordButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // 饼图辅助样式
  pieChartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pieChart: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  pieSegment: {
    position: 'absolute',
    width: '50%',
    height: '50%',
    borderTopRightRadius: 100,
  },
  pieSegmentMask: {
    backgroundColor: '#FFFFFF',
  },
  pieCenter: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
  },
  pieLegend: {
    flex: 1,
    marginLeft: 16,
  },
  pieLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  pieLegendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  pieLegendName: {
    fontSize: 13,
    color: '#6B7280',
    flex: 1,
  },
  pieLegendValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a2e',
  },
});
