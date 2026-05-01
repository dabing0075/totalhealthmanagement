import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome6 } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';

const { width } = Dimensions.get('window');

interface PeriodDay {
  day: number;
  type: 'period' | 'follicular' | 'ovulation' | 'luteal';
  label: string;
}

const mockCalendarDays: PeriodDay[] = [
  { day: 1, type: 'period', label: '经期' },
  { day: 2, type: 'period', label: '经期' },
  { day: 3, type: 'period', label: '经期' },
  { day: 4, type: 'period', label: '经期' },
  { day: 5, type: 'period', label: '经期' },
  { day: 6, type: 'follicular', label: '卵泡期' },
  { day: 7, type: 'follicular', label: '卵泡期' },
  { day: 8, type: 'follicular', label: '卵泡期' },
  { day: 9, type: 'follicular', label: '卵泡期' },
  { day: 10, type: 'follicular', label: '卵泡期' },
  { day: 11, type: 'follicular', label: '卵泡期' },
  { day: 12, type: 'follicular', label: '卵泡期' },
  { day: 13, type: 'follicular', label: '卵泡期' },
  { day: 14, type: 'ovulation', label: '排卵日' },
  { day: 15, type: 'ovulation', label: '排卵后' },
  { day: 16, type: 'luteal', label: '黄体期' },
  { day: 17, type: 'luteal', label: '黄体期' },
  { day: 18, type: 'luteal', label: '黄体期' },
  { day: 19, type: 'luteal', label: '黄体期' },
  { day: 20, type: 'luteal', label: '黄体期' },
  { day: 21, type: 'luteal', label: '黄体期' },
  { day: 22, type: 'luteal', label: '黄体期' },
  { day: 23, type: 'luteal', label: '黄体期' },
  { day: 24, type: 'luteal', label: '黄体期' },
  { day: 25, type: 'luteal', label: '黄体期' },
  { day: 26, type: 'luteal', label: '黄体期' },
  { day: 27, type: 'luteal', label: '黄体期' },
  { day: 28, type: 'luteal', label: '黄体期' },
];

const mockWeeklyData = [
  { week: '第1周', symptoms: '经期第1-5天', mood: '平静', energy: '60%' },
  { week: '第2周', symptoms: '卵泡期', mood: '愉悦', energy: '85%' },
  { week: '第3周', symptoms: '排卵期', mood: '精力充沛', energy: '90%' },
  { week: '第4周', symptoms: '黄体前期', mood: '良好', energy: '75%' },
];

export default function FemaleScreen() {
  const router = useRouter();
  const [selectedPhase, setSelectedPhase] = useState<number | null>(14); // 默认选中排卵日

  const getPhaseColor = (type: string) => {
    switch (type) {
      case 'period':
        return '#FF6B6B';
      case 'follicular':
        return '#4CAF50';
      case 'ovulation':
        return '#FFD700';
      case 'luteal':
        return '#9C27B0';
      default:
        return '#E0E0E0';
    }
  };

  const getPhaseBgColor = (type: string) => {
    switch (type) {
      case 'period':
        return '#FFEBEE';
      case 'follicular':
        return '#E8F5E9';
      case 'ovulation':
        return '#FFFDE7';
      case 'luteal':
        return '#F3E5F5';
      default:
        return '#F5F5F5';
    }
  };

  const tips = [
    { title: '经期保养', content: '注意保暖，避免受凉，适当进行轻度运动如瑜伽、散步，有助于缓解痛经' },
    { title: '卵泡期调理', content: '这个阶段身体状态较好，适合进行有氧运动和力量训练，饮食上可适当增加蛋白质摄入' },
    { title: '排卵期养护', content: '保持充足睡眠，避免熬夜，注意补充叶酸，可适当食用红枣、枸杞等补血食材' },
    { title: '黄体期注意', content: '可能会有情绪波动和食欲增加，建议少食多餐，避免高热量食物，保持心情愉悦' },
  ];

  return (
    <Screen>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* 经期记录卡片 */}
        <View style={styles.periodCard}>
          <LinearGradient
            colors={['#FF6B6B', '#FF8E8E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.periodGradient}
          >
            <View style={styles.periodHeader}>
              <View style={styles.periodLeft}>
                <FontAwesome6 name="calendar-days" size={24} color="white" />
                <Text style={styles.periodTitle}>经期记录</Text>
              </View>
              <View style={styles.periodBadge}>
                <Text style={styles.periodBadgeText}>当前：第14天</Text>
              </View>
            </View>

            <View style={styles.periodStats}>
              <View style={styles.periodStat}>
                <Text style={styles.periodStatValue}>14</Text>
                <Text style={styles.periodStatLabel}>天</Text>
              </View>
              <View style={styles.periodStat}>
                <Text style={styles.periodStatValue}>6</Text>
                <Text style={styles.periodStatLabel}>天</Text>
              </View>
              <View style={styles.periodStat}>
                <Text style={styles.periodStatValue}>28</Text>
                <Text style={styles.periodStatLabel}>天</Text>
              </View>
            </View>

            <View style={styles.periodLabels}>
              <Text style={styles.periodLabelText}>经期天数</Text>
              <Text style={styles.periodLabelText}>下次经期</Text>
              <Text style={styles.periodLabelText}>周期天数</Text>
            </View>
          </LinearGradient>
        </View>

        {/* 周期阶段说明 */}
        <View style={styles.section}>
          <View style={styles.phaseLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#FF6B6B' }]} />
              <Text style={styles.legendText}>经期</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
              <Text style={styles.legendText}>卵泡期</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#FFD700' }]} />
              <Text style={styles.legendText}>排卵期</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#9C27B0' }]} />
              <Text style={styles.legendText}>黄体期</Text>
            </View>
          </View>
        </View>

        {/* 今日状态 */}
        <View style={styles.todayCard}>
          <View style={styles.todayHeader}>
            <Text style={styles.todayTitle}>今日状态</Text>
            <View style={styles.todayPhase}>
              <View style={[styles.phaseDot, { backgroundColor: '#FFD700' }]} />
              <Text style={styles.todayPhaseText}>排卵期</Text>
            </View>
          </View>
          <Text style={styles.todayDate}>2025年5月14日</Text>
          <View style={styles.todayInfo}>
            <View style={styles.todayInfoItem}>
              <FontAwesome6 name="droplet" size={16} color="#FF6B6B" />
              <Text style={styles.todayInfoText}>经期第1天</Text>
            </View>
            <View style={styles.todayInfoItem}>
              <FontAwesome6 name="clock" size={16} color="#9C27B0" />
              <Text style={styles.todayInfoText}>预计经期5天后</Text>
            </View>
          </View>
        </View>

        {/* 周期日历 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>月经周期日历</Text>
          <View style={styles.calendarCard}>
            <View style={styles.weekDays}>
              {['一', '二', '三', '四', '五', '六', '日'].map((day, index) => (
                <Text key={index} style={styles.weekDayText}>{day}</Text>
              ))}
            </View>
            <View style={styles.calendarGrid}>
              {mockCalendarDays.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.calendarDay,
                    selectedPhase === index && styles.calendarDaySelected,
                    { backgroundColor: getPhaseBgColor(item.type) }
                  ]}
                  onPress={() => setSelectedPhase(index)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.dayCircle, { backgroundColor: getPhaseColor(item.type) }]}>
                    <Text style={styles.dayNumber}>{item.day}</Text>
                  </View>
                  {item.type === 'ovulation' && (
                    <View style={styles.ovulationBadge}>
                      <Text style={styles.ovulationText}>排卵</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* 本月预测 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>本月预测</Text>
          <View style={styles.predictionCard}>
            <View style={styles.predictionItem}>
              <View style={[styles.predictionIcon, { backgroundColor: '#FF6B6B' }]}>
                <FontAwesome6 name="flag" size={16} color="white" />
              </View>
              <View style={styles.predictionContent}>
                <Text style={styles.predictionLabel}>下次经期开始</Text>
                <Text style={styles.predictionValue}>6月10日</Text>
              </View>
            </View>
            <View style={styles.predictionItem}>
              <View style={[styles.predictionIcon, { backgroundColor: '#FF9800' }]}>
                <FontAwesome6 name="baby" size={16} color="white" />
              </View>
              <View style={styles.predictionContent}>
                <Text style={styles.predictionLabel}>易孕期窗口</Text>
                <Text style={styles.predictionValue}>6月24日 - 6月28日</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 周期周记 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>周期周记</Text>
          <View style={styles.weeklyCard}>
            {mockWeeklyData.map((item, index) => (
              <View key={index} style={styles.weeklyItem}>
                <View style={styles.weeklyHeader}>
                  <Text style={styles.weeklyWeek}>{item.week}</Text>
                  <View style={styles.weeklyMood}>
                    <FontAwesome6 name="face-smile" size={14} color="#4CAF50" />
                    <Text style={styles.weeklyMoodText}>{item.mood}</Text>
                  </View>
                </View>
                <View style={styles.weeklyDetails}>
                  <Text style={styles.weeklySymptoms}>{item.symptoms}</Text>
                  <Text style={styles.weeklyEnergy}>精力 {item.energy}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 周期护理建议 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>周期护理建议</Text>
          {tips.map((tip, index) => (
            <View key={index} style={styles.tipCard}>
              <LinearGradient
                colors={['#FFE4EC', '#FFF0F5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.tipGradient}
              >
                <View style={styles.tipHeader}>
                  <View style={[styles.tipIcon, { backgroundColor: '#FF6B6B' }]}>
                    <FontAwesome6 name="heart" size={14} color="white" />
                  </View>
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                </View>
                <Text style={styles.tipContent}>{tip.content}</Text>
              </LinearGradient>
            </View>
          ))}
        </View>

        {/* 记录按钮 */}
        <TouchableOpacity style={styles.recordButton} activeOpacity={0.8}>
          <LinearGradient
            colors={['#FF6B6B', '#FF8E8E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.recordGradient}
          >
            <FontAwesome6 name="pencil" size={18} color="white" />
            <Text style={styles.recordButtonText}>记录经期</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>

    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
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
  periodCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  periodGradient: {
    padding: 20,
  },
  periodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  periodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  periodTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  periodBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  periodBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  periodStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 8,
  },
  periodStat: {
    alignItems: 'center',
  },
  periodStatValue: {
    fontSize: 36,
    fontWeight: '700',
    color: 'white',
  },
  periodStatLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  periodLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  periodLabelText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  phaseLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  todayCard: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
  },
  todayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  todayTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  todayPhase: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  phaseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  todayPhaseText: {
    fontSize: 14,
    color: '#FF9800',
    fontWeight: '500',
  },
  todayDate: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginTop: 8,
  },
  todayInfo: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 20,
  },
  todayInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  todayInfoText: {
    fontSize: 13,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  calendarCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  weekDayText: {
    fontSize: 12,
    color: '#999',
    width: 40,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 4,
  },
  calendarDay: {
    width: (width - 64) / 7,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  calendarDaySelected: {
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayNumber: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  ovulationBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    marginTop: 2,
  },
  ovulationText: {
    fontSize: 8,
    color: '#333',
    fontWeight: '600',
  },
  predictionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  predictionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  predictionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  predictionContent: {
    flex: 1,
  },
  predictionLabel: {
    fontSize: 12,
    color: '#999',
  },
  predictionValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
  },
  weeklyCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  weeklyItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 12,
  },
  weeklyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weeklyWeek: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  weeklyMood: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  weeklyMoodText: {
    fontSize: 12,
    color: '#4CAF50',
  },
  weeklyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  weeklySymptoms: {
    fontSize: 12,
    color: '#666',
  },
  weeklyEnergy: {
    fontSize: 12,
    color: '#FF9800',
  },
  tipCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tipGradient: {
    padding: 16,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  tipIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  tipContent: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  recordButton: {
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  recordGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  recordButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});
