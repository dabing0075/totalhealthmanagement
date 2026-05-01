import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { Screen } from '@/components/Screen';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome6, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface WeightRecord {
  date: string;
  weight: number;
  change: number;
}

interface BodyMetric {
  label: string;
  value: string;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

export default function WeightScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [currentWeight, setCurrentWeight] = useState(68.5);
  const [targetWeight, setTargetWeight] = useState(65.0);
  const [isLoggedToday, setIsLoggedToday] = useState(false);

  // 模拟体重记录数据
  const weightRecords: WeightRecord[] = [
    { date: '03/08', weight: 69.2, change: 0.3 },
    { date: '03/09', weight: 68.8, change: -0.4 },
    { date: '03/10', weight: 68.6, change: -0.2 },
    { date: '03/11', weight: 68.7, change: 0.1 },
    { date: '03/12', weight: 68.5, change: -0.2 },
    { date: '03/13', weight: 68.4, change: -0.1 },
    { date: '03/14', weight: 68.5, change: 0.1 },
  ];

  const bodyMetrics: BodyMetric[] = [
    { label: 'BMI', value: '23.2', unit: '', trend: 'stable', color: '#26A69A' },
    { label: '体脂率', value: '21.5', unit: '%', trend: 'down', color: '#26A69A' },
    { label: '肌肉量', value: '42.8', unit: 'kg', trend: 'up', color: '#10B981' },
    { label: '基础代谢', value: '1480', unit: 'kcal', trend: 'stable', color: '#6B7280' },
    { label: '内脏脂肪', value: '8', unit: '', trend: 'down', color: '#26A69A' },
    { label: '水分率', value: '55.2', unit: '%', trend: 'stable', color: '#2196F3' },
  ];

  const checkInDays = Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    const isPast = day <= 14;
    const isCheckedIn = isPast && [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].includes(day);
    return { day, isPast, isCheckedIn };
  });

  const periodOptions = [
    { key: 'week', label: '近7天' },
    { key: 'month', label: '近30天' },
    { key: 'quarter', label: '近90天' },
  ];

  const progress = ((currentWeight - targetWeight) / (75.0 - targetWeight)) * 100;
  const remaining = (currentWeight - targetWeight).toFixed(1);

  return (
    <Screen>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* 顶部目标进度卡片 */}
        <LinearGradient
          colors={['#26A69A', '#00897B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.goalCard}
        >
          <View style={styles.goalHeader}>
            <View>
              <Text style={styles.goalTitle}>体重目标</Text>
              <Text style={styles.goalSubtitle}>
                {currentWeight}kg → {targetWeight}kg
              </Text>
            </View>
            <TouchableOpacity style={styles.editGoalBtn}>
              <FontAwesome6 name="pencil" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* 进度条 */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <LinearGradient
                colors={['#FFFFFF', 'rgba(255,255,255,0.6)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressBar, { width: `${Math.max(progress, 5)}%` }]}
              />
              <View style={[styles.progressIndicator, { left: `${Math.max(progress, 5)}%` }]}>
                <View style={styles.indicatorDot} />
              </View>
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressLabel}>75.0kg</Text>
              <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
              <Text style={styles.progressLabel}>65.0kg</Text>
            </View>
          </View>

          {/* 剩余重量 */}
          <View style={styles.remainingContainer}>
            <Text style={styles.remainingValue}>{remaining}</Text>
            <Text style={styles.remainingUnit}>kg</Text>
            <Text style={styles.remainingLabel}>距离目标还差</Text>
          </View>
        </LinearGradient>

        {/* 体重趋势图 */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>体重趋势</Text>
            <View style={styles.periodTabs}>
              {periodOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[styles.periodTab, selectedPeriod === option.key && styles.periodTabActive]}
                  onPress={() => setSelectedPeriod(option.key)}
                >
                  <Text
                    style={[
                      styles.periodTabText,
                      selectedPeriod === option.key && styles.periodTabTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 简化的趋势图表 */}
          <View style={styles.chartContainer}>
            <View style={styles.chartYAxis}>
              <Text style={styles.chartYLabel}>70</Text>
              <Text style={styles.chartYLabel}>69</Text>
              <Text style={styles.chartYLabel}>68</Text>
              <Text style={styles.chartYLabel}>67</Text>
            </View>
            <View style={styles.chartArea}>
              {/* 绘制趋势线 */}
              <View style={styles.trendLine}>
                {weightRecords.map((record, index) => {
                  const height = ((record.weight - 67) / 3) * 100;
                  return (
                    <View key={index} style={styles.dataPoint}>
                      <View
                        style={[
                          styles.pointDot,
                          {
                            bottom: `${height}%`,
                            backgroundColor:
                              record.change > 0 ? '#EF4444' : record.change < 0 ? '#10B981' : '#9CA3AF',
                          },
                        ]}
                      />
                      <Text style={styles.pointLabel}>{record.date}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>

          {/* 统计摘要 */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>平均</Text>
              <Text style={styles.statValue}>68.7</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>最低</Text>
              <Text style={styles.statValue}>68.4</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>本周变化</Text>
              <Text style={[styles.statValue, { color: '#10B981' }]}>-0.7</Text>
            </View>
          </View>
        </View>

        {/* 身体指标 */}
        <View style={styles.metricsCard}>
          <View style={styles.metricsHeader}>
            <Text style={styles.metricsTitle}>身体指标</Text>
            <TouchableOpacity style={styles.moreBtn}>
              <Text style={styles.moreBtnText}>查看全部</Text>
              <Ionicons name="chevron-forward" size={16} color="#26A69A" />
            </TouchableOpacity>
          </View>

          <View style={styles.metricsGrid}>
            {bodyMetrics.map((metric, index) => (
              <View key={index} style={styles.metricItem}>
                <View style={styles.metricHeader}>
                  <Text style={styles.metricLabel}>{metric.label}</Text>
                  <Ionicons
                    name={metric.trend === 'up' ? 'arrow-up' : metric.trend === 'down' ? 'arrow-down' : 'remove'}
                    size={14}
                    color={metric.trend === 'up' ? '#EF4444' : metric.trend === 'down' ? '#10B981' : '#9CA3AF'}
                  />
                </View>
                <Text style={[styles.metricValue, { color: metric.color }]}>
                  {metric.value}
                  <Text style={styles.metricUnit}>{metric.unit}</Text>
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* 打卡日历 */}
        <View style={styles.checkInCard}>
          <View style={styles.checkInHeader}>
            <Text style={styles.checkInTitle}>3月打卡</Text>
            <View style={styles.checkInStreak}>
              <FontAwesome6 name="fire" size={16} color="#FF9800" />
              <Text style={styles.checkInStreakText}>连续14天</Text>
            </View>
          </View>

          <View style={styles.calendarGrid}>
            {['日', '一', '二', '三', '四', '五', '六'].map((day, index) => (
              <View key={index} style={styles.weekdayCell}>
                <Text style={styles.weekdayText}>{day}</Text>
              </View>
            ))}
            {/* 空单元格 */}
            {[...Array(2)].map((_, index) => (
              <View key={`empty-${index}`} style={styles.calendarCell} />
            ))}
            {checkInDays.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.calendarCell,
                  item.isCheckedIn && styles.calendarCellChecked,
                  item.isPast && !item.isCheckedIn && styles.calendarCellMissed,
                ]}
              >
                <Text
                  style={[
                    styles.calendarDay,
                    item.isCheckedIn && styles.calendarDayChecked,
                    item.isPast && !item.isCheckedIn && styles.calendarDayMissed,
                  ]}
                >
                  {item.day}
                </Text>
                {item.isCheckedIn && (
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={12}
                    color="#FFFFFF"
                    style={styles.checkIcon}
                  />
                )}
              </View>
            ))}
          </View>

          <View style={styles.calendarLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#26A69A' }]} />
              <Text style={styles.legendText}>已打卡</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#FEE2E2' }]} />
              <Text style={styles.legendText}>未打卡</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#E5E7EB', borderWidth: 1, borderColor: '#D1D5DB' }]} />
              <Text style={styles.legendText}>未到</Text>
            </View>
          </View>
        </View>

        {/* 快速记录按钮 */}
        <TouchableOpacity
          style={[styles.recordBtn, isLoggedToday && styles.recordBtnDisabled]}
          disabled={isLoggedToday}
        >
          <LinearGradient
            colors={isLoggedToday ? ['#9CA3AF', '#6B7280'] : ['#26A69A', '#00897B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.recordBtnGradient as any}
          >
            <Ionicons
              name={isLoggedToday ? 'checkmark-circle' : 'add-circle'}
              size={24}
              color="#FFFFFF"
            />
            <Text style={styles.recordBtnText}>
              {isLoggedToday ? '今日已记录' : '记录今日体重'}
            </Text>
          </LinearGradient>
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
    paddingBottom: 100,
  },
  goalCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  goalTitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 4,
  },
  goalSubtitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  editGoalBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBackground: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 4,
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  progressIndicator: {
    position: 'absolute',
    top: -6,
    transform: [{ translateX: -8 }],
  },
  indicatorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#26A69A',
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  progressLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
  },
  progressPercent: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  remainingContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: 6,
  },
  remainingValue: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  remainingUnit: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
  },
  remainingLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    marginLeft: 8,
  },
  chartCard: {
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
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  periodTabs: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 3,
  },
  periodTab: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 7,
  },
  periodTabActive: {
    backgroundColor: '#FFFFFF',
  },
  periodTabText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  periodTabTextActive: {
    color: '#26A69A',
    fontWeight: '600',
  },
  chartContainer: {
    flexDirection: 'row',
    height: 160,
    marginBottom: 16,
  },
  chartYAxis: {
    justifyContent: 'space-between',
    paddingRight: 8,
    paddingVertical: 10,
  },
  chartYLabel: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  chartArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 12,
    position: 'relative',
  },
  trendLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '100%',
    position: 'relative',
  },
  dataPoint: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  pointDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: 'absolute',
    bottom: 50,
  },
  pointLabel: {
    fontSize: 9,
    color: '#9CA3AF',
    marginTop: 4,
    position: 'absolute',
    bottom: 0,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E5E7EB',
  },
  metricsCard: {
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
  metricsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  metricsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
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
  },
  metricItem: {
    width: '33.33%',
    paddingVertical: 8,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  metricUnit: {
    fontSize: 12,
    fontWeight: '400',
  },
  checkInCard: {
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
  checkInHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkInTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  checkInStreak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  checkInStreakText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF9800',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  weekdayCell: {
    width: `${100 / 7}%`,
    alignItems: 'center',
    paddingVertical: 4,
  },
  weekdayText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  calendarCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  calendarCellChecked: {
    backgroundColor: '#26A69A',
    borderRadius: 8,
    margin: 2,
    width: 40,
    height: 40,
  },
  calendarCellMissed: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    margin: 2,
    width: 40,
    height: 40,
  },
  calendarDay: {
    fontSize: 12,
    color: '#6B7280',
  },
  calendarDayChecked: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  calendarDayMissed: {
    color: '#EF4444',
  },
  checkIcon: {
    position: 'absolute',
    bottom: 2,
    right: 2,
  },
  calendarLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#6B7280',
  },
  recordBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#26A69A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  recordBtnDisabled: {
    shadowOpacity: 0.1,
  },
  recordBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  recordBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
