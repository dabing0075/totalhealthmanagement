import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Screen } from '@/components/Screen';
import { FontAwesome6 } from '@expo/vector-icons';
import { useSafeRouter } from '@/hooks/useSafeRouter';

const { width } = Dimensions.get('window');

export default function BodyDataScreen() {
  const router = useSafeRouter();
  const [selectedTab, setSelectedTab] = useState('body');

  // 身体数据
  const bodyMetrics = [
    {
      label: 'BMI',
      value: 22.5,
      unit: '',
      range: [18.5, 24],
      status: 'normal',
      description: '身体质量指数',
      history: [22.0, 22.2, 22.4, 22.5],
    },
    {
      label: '体脂率',
      value: 18.5,
      unit: '%',
      range: [10, 25],
      status: 'low',
      description: '脂肪占体重比例',
      history: [20.0, 19.5, 19.0, 18.5],
    },
    {
      label: '肌肉量',
      value: 42.5,
      unit: 'kg',
      range: [35, 50],
      status: 'normal',
      description: '肌肉总重量',
      history: [41.0, 41.5, 42.0, 42.5],
    },
    {
      label: '水分率',
      value: 55,
      unit: '%',
      range: [45, 60],
      status: 'normal',
      description: '体内水分占比',
      history: [54, 54.5, 55, 55],
    },
    {
      label: '骨量',
      value: 3.2,
      unit: 'kg',
      range: [2.5, 4.0],
      status: 'normal',
      description: '骨骼重量',
      history: [3.1, 3.15, 3.2, 3.2],
    },
    {
      label: '基础代谢',
      value: 1450,
      unit: 'kcal',
      range: [1300, 1600],
      status: 'normal',
      description: '每日基础消耗',
      history: [1430, 1440, 1450, 1450],
    },
  ];

  // 体重数据
  const weightMetrics = [
    { label: '当前体重', value: 68.5, unit: 'kg', trend: '-0.5', trendUp: false },
    { label: '目标体重', value: 65.0, unit: 'kg', trend: '3.5', trendUp: true },
    { label: '初始体重', value: 72.0, unit: 'kg' },
    { label: '体脂重量', value: 12.7, unit: 'kg' },
  ];

  // 围度数据
  const circumferenceData = [
    { label: '胸围', value: 88, unit: 'cm', change: '+1' },
    { label: '腰围', value: 72, unit: 'cm', change: '-2' },
    { label: '臀围', value: 92, unit: 'cm', change: '0' },
    { label: '大腿围', value: 52, unit: 'cm', change: '-1' },
    { label: '小腿围', value: 36, unit: 'cm', change: '-0.5' },
    { label: '手臂围', value: 28, unit: 'cm', change: '+0.5' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return '#26A69A';
      case 'low': return '#FF9800';
      case 'high': return '#FF6B6B';
      default: return '#26A69A';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal': return '正常';
      case 'low': return '偏低';
      case 'high': return '偏高';
      default: return '正常';
    }
  };

  const renderMiniChart = (history: number[], color: string) => {
    const max = Math.max(...history);
    const min = Math.min(...history);
    const range = max - min || 1;

    return (
      <View style={styles.miniChart}>
        {history.map((value, index) => {
          const height = ((value - min) / range) * 24 + 4;
          return (
            <View
              key={index}
              style={[
                styles.miniChartBar,
                {
                  height,
                  backgroundColor: index === history.length - 1 ? color : color + '60',
                },
              ]}
            />
          );
        })}
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
        {/* 核心指标卡片 */}
        <View style={styles.coreCard}>
          <View style={styles.coreHeader}>
            <View>
              <Text style={styles.coreTitle}>综合健康评分</Text>
              <View style={styles.coreScore}>
                <Text style={styles.scoreValue}>85</Text>
                <Text style={styles.scoreUnit}>分</Text>
              </View>
            </View>
            <View style={styles.scoreIndicator}>
              <Text style={styles.scoreText}>良好</Text>
              <View style={styles.scoreBar}>
                <View style={[styles.scoreProgress, { width: '85%' }]} />
              </View>
            </View>
          </View>
          <View style={styles.coreSummary}>
            <View style={styles.summaryItem}>
              <FontAwesome6 name="circle-check" size={16} color="#26A69A" />
              <Text style={styles.summaryText}>多项指标正常</Text>
            </View>
            <View style={styles.summaryItem}>
              <FontAwesome6 name="arrow-trend-down" size={16} color="#26A69A" />
              <Text style={styles.summaryText}>体重持续下降</Text>
            </View>
          </View>
        </View>

        {/* Tab切换 */}
        <View style={styles.tabContainer}>
          {[
            { key: 'body', label: '身体数据', icon: 'person' },
            { key: 'weight', label: '体重管理', icon: 'scale-balanced' },
            { key: 'measure', label: '围度测量', icon: 'ruler' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, selectedTab === tab.key && styles.tabActive]}
              onPress={() => setSelectedTab(tab.key)}
            >
              <FontAwesome6
                name={tab.icon as any}
                size={16}
                color={selectedTab === tab.key ? '#26A69A' : '#9CA3AF'}
              />
              <Text style={[styles.tabText, selectedTab === tab.key && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 身体数据 */}
        {selectedTab === 'body' && (
          <View style={styles.metricsGrid}>
            {bodyMetrics.map((metric) => (
              <TouchableOpacity key={metric.label} style={styles.metricCard}>
                <View style={styles.metricHeader}>
                  <Text style={styles.metricLabel}>{metric.label}</Text>
                  <View style={[styles.statusDot, { backgroundColor: getStatusColor(metric.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(metric.status) }]}>
                      {getStatusText(metric.status)}
                    </Text>
                  </View>
                </View>
                <View style={styles.metricValueRow}>
                  <Text style={[styles.metricValue, { color: getStatusColor(metric.status) }]}>
                    {metric.value}
                  </Text>
                  <Text style={styles.metricUnit}>{metric.unit}</Text>
                </View>
                <Text style={styles.metricDesc}>{metric.description}</Text>
                {renderMiniChart(metric.history, getStatusColor(metric.status))}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* 体重管理 */}
        {selectedTab === 'weight' && (
          <View style={styles.weightContainer}>
            {/* 体重趋势图区域 */}
            <View style={styles.weightChartCard}>
              <View style={styles.chartHeader}>
                <Text style={styles.chartTitle}>体重趋势</Text>
                <View style={styles.periodSelector}>
                  {['周', '月', '年'].map((period) => (
                    <TouchableOpacity
                      key={period}
                      style={[styles.periodBtn, period === '月' && styles.periodBtnActive]}
                    >
                      <Text style={[styles.periodText, period === '月' && styles.periodTextActive]}>
                        {period}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View style={styles.chartArea}>
                {/* 模拟图表 */}
                <View style={styles.chartLines}>
                  {[80, 70, 60].map((line) => (
                    <View key={line} style={styles.chartLine}>
                      <Text style={styles.chartLineText}>{line}kg</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.chartContent}>
                  <View style={styles.chartDots}>
                    {['72', '71', '70', '69.5', '69', '68.5'].map((w, i) => (
                      <View key={i} style={styles.chartDotItem}>
                        <View style={[styles.dot, { bottom: (parseFloat(w) - 60) * 3 }]} />
                        <Text style={styles.dotLabel}>{w}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.chartLineOverlay}>
                    <View style={styles.targetLine}>
                      <Text style={styles.targetLabel}>目标: 65kg</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* 体重数据 */}
            <View style={styles.weightMetricsCard}>
              <Text style={styles.cardTitle}>体重数据</Text>
              {weightMetrics.map((item, index) => (
                <View
                  key={item.label}
                  style={[styles.weightMetricItem, index < weightMetrics.length - 1 && styles.border]}
                >
                  <Text style={styles.weightMetricLabel}>{item.label}</Text>
                  <View style={styles.weightMetricRight}>
                    <Text style={styles.weightMetricValue}>
                      {item.value}
                      <Text style={styles.weightMetricUnit}>{item.unit}</Text>
                    </Text>
                    {item.trend && (
                      <View style={[
                        styles.trendBadge,
                        { backgroundColor: item.trendUp ? '#FF980020' : '#26A69A20' }
                      ]}>
                        <FontAwesome6
                          name={item.trendUp ? 'arrow-up' : 'arrow-down'}
                          size={10}
                          color={item.trendUp ? '#FF9800' : '#26A69A'}
                        />
                        <Text style={[styles.trendText, {
                          color: item.trendUp ? '#FF9800' : '#26A69A'
                        }]}>
                          {item.trend}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 围度测量 */}
        {selectedTab === 'measure' && (
          <View style={styles.measureContainer}>
            <View style={styles.measureCard}>
              <Text style={styles.cardTitle}>身体围度</Text>
              {circumferenceData.map((item, index) => (
                <View
                  key={item.label}
                  style={[styles.measureItem, index < circumferenceData.length - 1 && styles.border]}
                >
                  <Text style={styles.measureLabel}>{item.label}</Text>
                  <View style={styles.measureRight}>
                    <Text style={styles.measureValue}>
                      {item.value}
                      <Text style={styles.measureUnit}>{item.unit}</Text>
                    </Text>
                    <View style={[
                      styles.changeBadge,
                      {
                        backgroundColor: item.change.startsWith('+')
                          ? '#FF980020'
                          : item.change === '0'
                          ? '#9CA3AF20'
                          : '#26A69A20'
                      }
                    ]}>
                      <Text style={[
                        styles.changeText,
                        {
                          color: item.change.startsWith('+')
                            ? '#FF9800'
                            : item.change === '0'
                            ? '#9CA3AF'
                            : '#26A69A'
                        }
                      ]}>
                        {item.change}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* 身材对比 */}
            <View style={styles.compareCard}>
              <Text style={styles.cardTitle}>身材对比</Text>
              <View style={styles.compareVisual}>
                <View style={styles.compareFigure}>
                  <View style={styles.figureHead} />
                  <View style={styles.figureBody}>
                    <View style={styles.figureChest} />
                    <View style={styles.figureWaist} />
                    <View style={styles.figureHip} />
                  </View>
                  <View style={styles.figureLegs} />
                </View>
                <View style={styles.compareLabels}>
                  <Text style={styles.compareLabel}>您的身材</Text>
                  <Text style={styles.compareLabel}>标准参考</Text>
                </View>
              </View>
              <Text style={styles.compareTip}>继续保持，您的身材比例良好</Text>
            </View>
          </View>
        )}

        {/* 记录按钮 */}
        <TouchableOpacity style={styles.recordButton}>
          <FontAwesome6 name="plus" size={18} color="#FFFFFF" />
          <Text style={styles.recordButtonText}>记录新数据</Text>
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
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  coreCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  coreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  coreTitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  coreScore: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '800',
    color: '#26A69A',
  },
  scoreUnit: {
    fontSize: 16,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  scoreIndicator: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 14,
    color: '#26A69A',
    fontWeight: '600',
    marginBottom: 6,
  },
  scoreBar: {
    width: 80,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
  },
  scoreProgress: {
    height: '100%',
    backgroundColor: '#26A69A',
    borderRadius: 3,
  },
  coreSummary: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  summaryText: {
    fontSize: 13,
    color: '#6B7280',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 6,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  tabActive: {
    backgroundColor: '#E8F5F3',
  },
  tabText: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  tabTextActive: {
    color: '#26A69A',
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  metricCard: {
    width: (width - 44) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  statusDot: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  metricValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: '800',
  },
  metricUnit: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 2,
  },
  metricDesc: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  miniChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 28,
    gap: 3,
  },
  miniChartBar: {
    width: 8,
    borderRadius: 4,
  },
  weightContainer: {
    gap: 16,
  },
  weightChartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
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
  periodSelector: {
    flexDirection: 'row',
    gap: 4,
  },
  periodBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  periodBtnActive: {
    backgroundColor: '#26A69A',
  },
  periodText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  periodTextActive: {
    color: '#FFFFFF',
  },
  chartArea: {
    height: 180,
    flexDirection: 'row',
  },
  chartLines: {
    width: 40,
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  chartLine: {
    justifyContent: 'center',
  },
  chartLineText: {
    fontSize: 10,
    color: '#D1D5DB',
  },
  chartContent: {
    flex: 1,
    position: 'relative',
  },
  chartDots: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 140,
    paddingBottom: 20,
  },
  chartDotItem: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#26A69A',
    marginBottom: 4,
  },
  dotLabel: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  chartLineOverlay: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
  },
  targetLine: {
    borderTopWidth: 2,
    borderTopColor: '#FF9800',
    borderStyle: 'dashed',
  },
  targetLabel: {
    position: 'absolute',
    right: 0,
    top: -16,
    fontSize: 10,
    color: '#FF9800',
  },
  weightMetricsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 16,
  },
  weightMetricItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  weightMetricLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  weightMetricRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  weightMetricValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  weightMetricUnit: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '400',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '600',
  },
  measureContainer: {
    gap: 16,
  },
  measureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  measureItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  measureLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  measureRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  measureValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  measureUnit: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '400',
  },
  changeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    minWidth: 36,
    alignItems: 'center',
  },
  changeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  compareCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  compareVisual: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  compareFigure: {
    alignItems: 'center',
    marginRight: 40,
  },
  figureHead: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#26A69A30',
    marginBottom: 4,
  },
  figureBody: {
    alignItems: 'center',
    gap: 4,
  },
  figureChest: {
    width: 40,
    height: 30,
    backgroundColor: '#26A69A30',
    borderRadius: 6,
  },
  figureWaist: {
    width: 32,
    height: 24,
    backgroundColor: '#26A69A50',
    borderRadius: 6,
  },
  figureHip: {
    width: 44,
    height: 24,
    backgroundColor: '#26A69A30',
    borderRadius: 6,
  },
  figureLegs: {
    width: 36,
    height: 50,
    backgroundColor: '#26A69A30',
    borderRadius: 6,
    marginTop: 4,
  },
  compareLabels: {
    flex: 1,
  },
  compareLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  compareTip: {
    fontSize: 13,
    color: '#26A69A',
    textAlign: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F9FAFB',
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#26A69A',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
    gap: 8,
  },
  recordButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
