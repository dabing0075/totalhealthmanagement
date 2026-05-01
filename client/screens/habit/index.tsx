import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const TODAY_HABITS = [
  {
    id: '1',
    name: '晨起喝水',
    desc: '每天早上起床后喝一杯水',
    icon: 'droplet',
    iconColor: '#2196F3',
    reminder: '07:00',
    frequency: 80,
    days: 5,
    completed: true,
    bgColor: '#E0F2F1',
  },
  {
    id: '2',
    name: '12点前睡觉',
    desc: '每天晚上12点前入睡',
    icon: 'moon',
    iconColor: '#9C27B0',
    reminder: '23:30',
    frequency: 90,
    days: 12,
    completed: true,
    bgColor: '#F3E5F5',
  },
  {
    id: '3',
    name: '健康饮食',
    desc: '保持营养均衡的饮食',
    icon: 'utensils',
    iconColor: '#26A69A',
    reminder: '12:00',
    frequency: 75,
    days: 20,
    completed: false,
    bgColor: '#FFFFFF',
  },
  {
    id: '4',
    name: '运动锻炼',
    desc: '每天进行至少30分钟运动',
    icon: 'person-running',
    iconColor: '#FF6B6B',
    reminder: '17:00',
    frequency: 85,
    days: 0,
    completed: false,
    bgColor: '#FFFFFF',
  },
];

const HABIT_MANAGEMENT = [
  {
    id: '1',
    name: '晨起喝水',
    category: '健康',
    desc: '每天早上起床后喝一杯水',
    icon: 'droplet',
    iconColor: '#2196F3',
    bgColor: '#E3F2FD',
    enabled: true,
  },
  {
    id: '2',
    name: '12点前睡觉',
    category: '睡眠',
    desc: '每天晚上12点前入睡',
    icon: 'moon',
    iconColor: '#9C27B0',
    bgColor: '#F3E5F5',
    enabled: true,
  },
  {
    id: '3',
    name: '健康饮食',
    category: '饮食',
    desc: '保持营养均衡的饮食',
    icon: 'utensils',
    iconColor: '#26A69A',
    bgColor: '#E0F2F1',
    enabled: true,
  },
  {
    id: '4',
    name: '运动锻炼',
    category: '运动',
    desc: '每天进行至少30分钟运动',
    icon: 'person-running',
    iconColor: '#FF6B6B',
    bgColor: '#FFEBEE',
    enabled: true,
  },
  {
    id: '5',
    name: '阅读学习',
    category: '成长',
    desc: '每天阅读30分钟',
    icon: 'book',
    iconColor: '#FF9800',
    bgColor: '#FFF3E0',
    enabled: false,
  },
  {
    id: '6',
    name: '冥想放松',
    category: '心理',
    desc: '每天进行10分钟冥想',
    icon: 'brain',
    iconColor: '#4ECDC4',
    bgColor: '#E0F7F4',
    enabled: false,
  },
];

const WEEK_STATS = [
  { day: '一', completed: 4, total: 4 },
  { day: '二', completed: 4, total: 4 },
  { day: '三', completed: 2, total: 4 },
  { day: '四', completed: 3, total: 4 },
  { day: '五', completed: 4, total: 4 },
  { day: '六', completed: 4, total: 4 },
  { day: '日', completed: 1, total: 4 },
];

const REMINDERS = [
  { id: '1', name: '晨起喝水', time: '07:00', icon: 'droplet', iconColor: '#2196F3', enabled: true },
  { id: '2', name: '12点前睡觉', time: '23:30', icon: 'moon', iconColor: '#9C27B0', enabled: true },
  { id: '3', name: '健康饮食', time: '12:00', icon: 'utensils', iconColor: '#26A69A', enabled: true },
  { id: '4', name: '运动锻炼', time: '17:00', icon: 'person-running', iconColor: '#FF6B6B', enabled: true },
];

const ACHIEVEMENTS = [
  { id: '1', title: '坚持达人', desc: '连续打卡7天', icon: 'fire', color: '#FF6B6B' },
  { id: '2', title: '完美主义', desc: '完成率100%', icon: 'star', color: '#FFD700' },
  { id: '3', title: '习惯大师', desc: '管理5个习惯', icon: 'crown', color: '#FF9800' },
];

export default function HabitScreen() {
  const router = useRouter();
  const [habits, setHabits] = useState(TODAY_HABITS);
  const [management, setManagement] = useState(HABIT_MANAGEMENT);
  const [reminders, setReminders] = useState(REMINDERS);

  const completedCount = habits.filter((h) => h.completed).length;
  const completionRate = Math.round((completedCount / habits.length) * 100);

  const toggleHabit = (id: string) => {
    setHabits(
      habits.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h))
    );
  };

  const toggleReminder = (id: string) => {
    setReminders(
      reminders.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const toggleManagement = (id: string) => {
    setManagement(
      management.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m))
    );
  };

  return (
    <Screen>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* 今日习惯概览 */}
        <LinearGradient
          colors={['#26A69A', '#00897B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.overviewCard}
        >
          <TouchableOpacity style={styles.overviewBadge}>
            <Ionicons name="checkmark" size={16} color="#26A69A" />
          </TouchableOpacity>
          <View style={styles.overviewGrid}>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewValue}>{completedCount}/{habits.length}</Text>
              <Text style={styles.overviewLabel}>已完成</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewValue}>{completionRate}%</Text>
              <Text style={styles.overviewLabel}>完成率</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewValue}>7天</Text>
              <Text style={styles.overviewLabel}>连续打卡</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewValue}>23天</Text>
              <Text style={styles.overviewLabel}>最长记录</Text>
            </View>
          </View>
        </LinearGradient>

        {/* 今日打卡 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>今日打卡</Text>
            <View style={styles.dateTag}>
              <Text style={styles.dateTagText}>2026年5月1日</Text>
            </View>
          </View>
          <View style={styles.todayList}>
            {habits.map((habit) => (
              <TouchableOpacity
                key={habit.id}
                style={[styles.todayCard, habit.completed && styles.todayCardCompleted]}
                onPress={() => toggleHabit(habit.id)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.todayIcon,
                    { backgroundColor: habit.completed ? '#26A69A' : '#F3F4F6' },
                  ]}
                >
                  {habit.completed ? (
                    <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                  ) : (
                    <View style={styles.todayCircle} />
                  )}
                </View>
                <View style={styles.todayContent}>
                  <View style={styles.todayMain}>
                    <View style={[styles.todayHabitIcon, { backgroundColor: habit.bgColor }]}>
                      <FontAwesome6 name={habit.icon as any} size={18} color={habit.iconColor} />
                    </View>
                    <View style={styles.todayInfo}>
                      <Text style={styles.todayName}>{habit.name}</Text>
                      <Text style={styles.todayDesc}>{habit.desc}</Text>
                      <Text style={styles.todayReminder}>提醒:{habit.reminder}</Text>
                    </View>
                  </View>
                  <View style={styles.todayStats}>
                    <Text
                      style={[
                        styles.todayFrequency,
                        { color: habit.completed ? '#26A69A' : '#9CA3AF' },
                      ]}
                    >
                      {habit.frequency}% 月频率
                    </Text>
                    <Text style={styles.todayDays}>已坚持{habit.days}天</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 习惯管理 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>习惯管理</Text>
            <TouchableOpacity style={styles.addBtn}>
              <Ionicons name="add" size={16} color="#26A69A" />
              <Text style={styles.addBtnText}>添加新习惯</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.managementGrid}>
            {management.map((item) => (
              <View
                key={item.id}
                style={[styles.managementCard, item.enabled && styles.managementCardActive]}
              >
                <View style={[styles.managementIcon, { backgroundColor: item.bgColor }]}>
                  <FontAwesome6 name={item.icon as any} size={20} color={item.iconColor} />
                </View>
                <View style={styles.managementContent}>
                  <Text style={styles.managementName}>{item.name}</Text>
                  <View style={styles.managementCategory}>
                    <Text style={styles.managementCategoryText}>{item.category}</Text>
                  </View>
                  <Text style={styles.managementDesc}>{item.desc}</Text>
                </View>
                <TouchableOpacity
                  style={styles.managementToggle}
                  onPress={() => toggleManagement(item.id)}
                >
                  <View
                    style={[
                      styles.managementToggleTrack,
                      item.enabled && styles.managementToggleTrackActive,
                    ]}
                  >
                    <View
                      style={[
                        styles.managementToggleThumb,
                        item.enabled && styles.managementToggleThumbActive,
                      ]}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* 本周习惯统计 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>本周习惯统计</Text>
          <View style={styles.statsCard}>
            <View style={styles.statsLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#26A69A' }]} />
                <Text style={styles.legendText}>已完成</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#E5E7EB' }]} />
                <Text style={styles.legendText}>总目标</Text>
              </View>
            </View>
            <View style={styles.statsChart}>
              {WEEK_STATS.map((item, index) => (
                <View key={item.day} style={styles.statsBarWrap}>
                  <View style={styles.statsBarContainer}>
                    <View
                      style={[
                        styles.statsBarCompleted,
                        { height: `${(item.completed / item.total) * 100}%` },
                      ]}
                    />
                    <View
                      style={[
                        styles.statsBarTotal,
                        { height: `${((item.total - item.completed) / item.total) * 100}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.statsDay}>{item.day}</Text>
                  <Text style={styles.statsCount}>
                    {item.completed}/{item.total}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* 提醒设置 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>提醒设置</Text>
          <View style={styles.reminderCard}>
            {reminders.map((reminder, index) => (
              <View
                key={reminder.id}
                style={[
                  styles.reminderItem,
                  index !== reminders.length - 1 && styles.reminderItemBorder,
                ]}
              >
                <View style={styles.reminderLeft}>
                  <View
                    style={[
                      styles.reminderIcon,
                      { backgroundColor: `${reminder.iconColor}20` },
                    ]}
                  >
                    <FontAwesome6 name={reminder.icon as any} size={16} color={reminder.iconColor} />
                  </View>
                  <View style={styles.reminderInfo}>
                    <Text style={styles.reminderName}>{reminder.name}</Text>
                    <Text style={styles.reminderTime}>{reminder.time}</Text>
                  </View>
                </View>
                <Switch
                  value={reminder.enabled}
                  onValueChange={() => toggleReminder(reminder.id)}
                  trackColor={{ false: '#E5E7EB', true: '#26A69A' }}
                  thumbColor="#FFFFFF"
                />
              </View>
            ))}
          </View>
        </View>

        {/* 习惯成就殿堂 */}
        <LinearGradient
          colors={['#FF9800', '#FF5722', '#F44336']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.achievementCard}
        >
          <Text style={styles.achievementTitle}>习惯成就殿堂</Text>
          <View style={styles.achievementList}>
            {ACHIEVEMENTS.map((achievement) => (
              <View key={achievement.id} style={styles.achievementItem}>
                <View style={[styles.achievementIcon, { backgroundColor: achievement.color }]}>
                  <FontAwesome6 name={achievement.icon as any} size={20} color="#FFFFFF" />
                </View>
                <Text style={styles.achievementName}>{achievement.title}</Text>
                <Text style={styles.achievementDesc}>{achievement.desc}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* 习惯养成建议 */}
        <LinearGradient
          colors={['#26A69A', '#00897B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.tipsCard}
        >
          <View style={styles.tipsHeader}>
            <Ionicons name="leaf" size={20} color="#FFFFFF" />
            <Text style={styles.tipsTitle}>习惯养成建议</Text>
          </View>
          <Text style={styles.tipsContent}>
            坚持21天以上的重复行为会形成习惯。建议从最简单的习惯开始，如每天喝一杯水，逐渐增加难度，保持连贯性，不要轻易中断。
          </Text>
        </LinearGradient>
      </ScrollView>

      {/* 固定顶部导航栏 */}
      <View style={styles.fixedHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <FontAwesome6 name="chevron-left" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>生活习惯</Text>
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
  },
  dateTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  dateTagText: {
    fontSize: 12,
    color: '#6B7280',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  addBtnText: {
    fontSize: 12,
    color: '#26A69A',
    fontWeight: '500',
  },
  // 今日习惯概览
  overviewCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    position: 'relative',
  },
  overviewBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
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
    fontWeight: '800',
    color: '#FFFFFF',
  },
  overviewLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 4,
  },
  // 今日打卡
  todayList: {
    gap: 12,
  },
  todayCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  todayCardCompleted: {
    backgroundColor: '#E0F2F1',
  },
  todayIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  todayCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
  },
  todayContent: {
    flex: 1,
  },
  todayMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  todayHabitIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  todayInfo: {
    flex: 1,
  },
  todayName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 2,
  },
  todayDesc: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  todayReminder: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  todayStats: {
    marginTop: 10,
    paddingLeft: 52,
  },
  todayFrequency: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  todayDays: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  // 习惯管理
  managementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  managementCard: {
    width: '47%',
    marginHorizontal: '1.5%',
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  managementCardActive: {
    backgroundColor: '#E0F2F1',
  },
  managementIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  managementContent: {
    marginBottom: 10,
  },
  managementName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  managementCategory: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  managementCategoryText: {
    fontSize: 10,
    color: '#6B7280',
  },
  managementDesc: {
    fontSize: 11,
    color: '#9CA3AF',
    lineHeight: 16,
  },
  managementToggle: {
    alignSelf: 'flex-end',
  },
  managementToggleTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    padding: 2,
  },
  managementToggleTrackActive: {
    backgroundColor: '#26A69A',
  },
  managementToggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  managementToggleThumbActive: {
    transform: [{ translateX: 20 }],
  },
  // 本周习惯统计
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statsLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#6B7280',
  },
  statsChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  statsBarWrap: {
    alignItems: 'center',
    flex: 1,
  },
  statsBarContainer: {
    width: 24,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginBottom: 8,
  },
  statsBarCompleted: {
    width: '100%',
    backgroundColor: '#26A69A',
    borderRadius: 12,
    minHeight: 4,
  },
  statsBarTotal: {
    width: '100%',
    backgroundColor: '#E5E7EB',
  },
  statsDay: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  statsCount: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  // 提醒设置
  reminderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  reminderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  reminderItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  reminderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reminderInfo: {},
  reminderName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a2e',
    marginBottom: 2,
  },
  reminderTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  // 习惯成就殿堂
  achievementCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  achievementList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  achievementItem: {
    alignItems: 'center',
    flex: 1,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  achievementName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  achievementDesc: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
  },
  // 习惯养成建议
  tipsCard: {
    borderRadius: 16,
    padding: 20,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tipsContent: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 22,
  },
});
