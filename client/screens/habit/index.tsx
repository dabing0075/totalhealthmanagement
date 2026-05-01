import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Screen } from '@/components/Screen';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';

const DEFAULT_HABITS = [
  { id: '1', name: '早起', icon: 'sunrise', color: '#FF9800', bgColor: '#FFF3E0', completed: true },
  { id: '2', name: '喝水8杯', icon: 'glass-water', color: '#2196F3', bgColor: '#E3F2FD', completed: true },
  { id: '3', name: '午休20分钟', icon: 'coffee', color: '#795548', bgColor: '#EFEBE9', completed: false },
  { id: '4', name: '晚餐清淡', icon: 'utensils', color: '#26A69A', bgColor: '#E0F2F1', completed: false },
  { id: '5', name: '睡前阅读', icon: 'book', color: '#9C27B0', bgColor: '#F3E5F5', completed: false },
  { id: '6', name: '不熬夜', icon: 'moon', color: '#9C27B0', bgColor: '#F3E5F5', completed: false },
  { id: '7', name: '运动30分钟', icon: 'person-running', color: '#FF6B6B', bgColor: '#FFEBEE', completed: false },
  { id: '8', name: '冥想10分钟', icon: 'brain', color: '#2196F3', bgColor: '#E3F2FD', completed: false },
];

const REMINDERS = [
  { id: '1', time: '08:00', habit: '早起', enabled: true },
  { id: '2', time: '09:00', habit: '喝水', enabled: true },
  { id: '3', time: '12:00', habit: '午休', enabled: false },
  { id: '4', time: '18:00', habit: '运动', enabled: true },
  { id: '5', time: '21:00', habit: '睡前阅读', enabled: true },
];

const HABIT_STATS = [
  { id: '1', label: '连续打卡', value: '28', unit: '天', color: '#FF9800' },
  { id: '2', label: '本周完成', value: '15', unit: '次', color: '#26A69A' },
  { id: '3', label: '完成率', value: '85', unit: '%', color: '#2196F3' },
];

export default function HabitScreen() {
  const [habits, setHabits] = useState(DEFAULT_HABITS);
  const [reminders, setReminders] = useState(REMINDERS);
  const completedCount = habits.filter(h => h.completed).length;

  const toggleHabit = (id: string) => {
    setHabits(habits.map(h => 
      h.id === id ? { ...h, completed: !h.completed } : h
    ));
  };

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(r => 
      r.id === id ? { ...r, enabled: !r.enabled } : r
    ));
  };

  return (
    <Screen>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* 打卡进度卡片 */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>今日打卡</Text>
            <Text style={styles.progressDate}>2025年1月15日 周三</Text>
          </View>
          <View style={styles.progressContent}>
            <View style={styles.progressLeft}>
              <View style={styles.progressCircle}>
                <Text style={styles.progressPercent}>{Math.round(completedCount / habits.length * 100)}%</Text>
              </View>
              <View style={styles.progressInfo}>
                <Text style={styles.progressCount}>{completedCount}<Text style={styles.progressTotal}>/{habits.length}</Text></Text>
                <Text style={styles.progressLabel}>已完成</Text>
              </View>
            </View>
            <View style={styles.progressStats}>
              {HABIT_STATS.map((stat) => (
                <View key={stat.id} style={styles.statItem}>
                  <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                  <Text style={styles.statUnit}>{stat.unit}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* 习惯列表 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>今日习惯</Text>
            <TouchableOpacity style={styles.addBtn}>
              <Ionicons name="add" size={18} color="#26A69A" />
              <Text style={styles.addBtnText}>添加</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.habitList}>
            {habits.map((habit) => (
              <TouchableOpacity
                key={habit.id}
                style={[styles.habitItem, habit.completed && styles.habitItemCompleted]}
                onPress={() => toggleHabit(habit.id)}
              >
                <View style={[styles.habitIcon, { backgroundColor: habit.bgColor }]}>
                  <FontAwesome6 name={habit.icon as any} size={20} color={habit.color} />
                </View>
                <View style={styles.habitInfo}>
                  <Text style={[styles.habitName, habit.completed && styles.habitNameCompleted]}>
                    {habit.name}
                  </Text>
                  {habit.completed && <Text style={styles.habitCompleteTime}>已完成</Text>}
                </View>
                {habit.completed ? (
                  <View style={styles.habitCheckDone}>
                    <FontAwesome6 name="circle-check" size={24} color="#26A69A" />
                  </View>
                ) : (
                  <TouchableOpacity style={styles.habitCheckBtn} onPress={() => toggleHabit(habit.id)}>
                    <Ionicons name="add-circle-outline" size={26} color="#9CA3AF" />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 提醒设置 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>提醒设置</Text>
            <TouchableOpacity style={styles.addBtn}>
              <Ionicons name="add" size={18} color="#26A69A" />
              <Text style={styles.addBtnText}>添加</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.reminderList}>
            {reminders.map((reminder) => (
              <View key={reminder.id} style={styles.reminderItem}>
                <Ionicons name="notifications" size={20} color="#9CA3AF" />
                <View style={styles.reminderInfo}>
                  <Text style={styles.reminderTime}>{reminder.time}</Text>
                  <Text style={styles.reminderHabit}>{reminder.habit}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.reminderToggle, reminder.enabled && styles.reminderToggleActive]}
                  onPress={() => toggleReminder(reminder.id)}
                >
                  <View style={[styles.reminderToggleDot, reminder.enabled && styles.reminderToggleDotActive]} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* 周习惯概览 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>本周习惯概览</Text>
          <View style={styles.weekCard}>
            <View style={styles.weekHeader}>
              {['一', '二', '三', '四', '五', '六', '日'].map((day, index) => (
                <Text key={day} style={[styles.weekDay, index === 2 && styles.weekDayActive]}>{day}</Text>
              ))}
            </View>
            <View style={styles.weekBars}>
              {[
                { completed: 5, total: 6 },
                { completed: 6, total: 6 },
                { completed: 3, total: 6 },
                { completed: 4, total: 6 },
                { completed: 5, total: 6 },
                { completed: 6, total: 6 },
                { completed: 2, total: 6 },
              ].map((item, index) => (
                <View key={index} style={styles.weekBarWrap}>
                  <View style={styles.weekBarBg}>
                    <View style={[styles.weekBarFill, { height: `${(item.completed / item.total) * 100}%` }]} />
                  </View>
                  <Text style={styles.weekBarText}>{item.completed}/{item.total}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* 习惯建议 */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Ionicons name="bulb" size={20} color="#26A69A" />
            <Text style={styles.tipsTitle}>习惯养成建议</Text>
          </View>
          <Text style={styles.tipsContent}>
            坚持21天可以养成一个新习惯！您已经连续打卡28天，继续保持。建议每天在同一时间完成相同的习惯，更容易坚持。
          </Text>
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
  progressCard: {
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
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  progressDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  progressContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginRight: 20,
  },
  progressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressPercent: {
    fontSize: 22,
    fontWeight: '800',
    color: '#26A69A',
  },
  progressInfo: {
    alignItems: 'flex-start',
  },
  progressCount: {
    fontSize: 28,
    fontWeight: '800',
    color: '#26A69A',
  },
  progressTotal: {
    fontSize: 16,
    fontWeight: '400',
    color: '#9CA3AF',
  },
  progressLabel: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  progressStats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  statUnit: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  statLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
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
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addBtnText: {
    fontSize: 13,
    color: '#26A69A',
  },
  habitList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  habitItemCompleted: {
    backgroundColor: '#E0F2F1',
    marginHorizontal: -16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderBottomWidth: 0,
  },
  habitIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  habitNameCompleted: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  habitCompleteTime: {
    fontSize: 11,
    color: '#26A69A',
    marginTop: 2,
  },
  habitCheckDone: {
    marginLeft: 8,
  },
  habitCheckBtn: {
    padding: 4,
  },
  reminderList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  reminderInfo: {
    flex: 1,
    marginLeft: 12,
  },
  reminderTime: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  reminderHabit: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  reminderToggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  reminderToggleActive: {
    backgroundColor: '#26A69A',
  },
  reminderToggleDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  reminderToggleDotActive: {
    alignSelf: 'flex-end',
  },
  weekCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  weekDay: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  weekDayActive: {
    color: '#26A69A',
    fontWeight: '600',
  },
  weekBars: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 80,
  },
  weekBarWrap: {
    alignItems: 'center',
  },
  weekBarBg: {
    width: 24,
    height: 60,
    backgroundColor: '#E0F2F1',
    borderRadius: 12,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  weekBarFill: {
    backgroundColor: '#26A69A',
    borderRadius: 12,
  },
  weekBarText: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 6,
  },
  tipsCard: {
    backgroundColor: '#E0F2F1',
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
    color: '#26A69A',
  },
  tipsContent: {
    fontSize: 14,
    color: '#1a1a2e',
    lineHeight: 22,
  },
});
