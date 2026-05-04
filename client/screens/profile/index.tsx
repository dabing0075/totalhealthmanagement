import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Screen } from '@/components/Screen';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileScreen() {
  const router = useSafeRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [aiModalVisible, setAiModalVisible] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{id: string; text: string; isUser: boolean; time: Date}>>([
    { id: '1', text: '您好！我是您的AI健康管家小轻，有什么关于减脂饮食、运动计划的问题都可以问我哦！', isUser: false, time: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [msgCounter, setMsgCounter] = useState(1);

  const quickQuestions = [
    '今日三餐怎么搭配？',
    '做什么运动最燃脂？',
    '如何突破减肥平台期？',
  ];

  const handleSendMessage = useCallback(() => {
    if (!inputText.trim()) return;
    const newCounter = msgCounter + 1;
    const userMessage = { id: `msg_${newCounter}`, text: inputText, isUser: true, time: new Date() };
    setChatMessages(prev => [...prev, userMessage]);
    setInputText('');
    setMsgCounter(newCounter);
    // 模拟AI回复
    setTimeout(() => {
      const aiResponse = {
        id: `msg_${newCounter + 1}`,
        text: '感谢您的提问！根据您的情况，我建议您...（AI正在分析中）',
        isUser: false,
        time: new Date()
      };
      setChatMessages(prev => [...prev, aiResponse]);
      setMsgCounter(newCounter + 1);
    }, 1000);
  }, [inputText, msgCounter]);

  const handleQuickQuestion = useCallback((question: string) => {
    const newCounter = msgCounter + 1;
    const userMessage = { id: `msg_${newCounter}`, text: question, isUser: true, time: new Date() };
    setChatMessages(prev => [...prev, userMessage]);
    setMsgCounter(newCounter);
    // 模拟AI回复
    setTimeout(() => {
      const aiResponse = {
        id: `msg_${newCounter + 1}`,
        text: '好的！' + question + '...（AI正在分析中）',
        isUser: false,
        time: new Date()
      };
      setChatMessages(prev => [...prev, aiResponse]);
      setMsgCounter(newCounter + 1);
    }, 1000);
  }, [msgCounter]);

  // 如果未登录，显示登录入口
  if (!isAuthenticated) {
    return (
      <Screen>
        <View style={styles.loginContainer}>
          <View style={styles.loginHeader}>
            <FontAwesome6 name="user" size={80} color="#D1D5DB" />
            <Text style={styles.loginTitle}>登录后可同步健康数据</Text>
            <Text style={styles.loginSubtitle}>登录后您的健康数据将在云端备份</Text>
          </View>

          <TouchableOpacity 
            style={styles.loginBtn}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.loginBtnText}>手机号登录</Text>
          </TouchableOpacity>

          <View style={styles.loginFeatures}>
            <View style={styles.loginFeatureItem}>
              <Ionicons name="cloud-done" size={24} color="#26A69A" />
              <Text style={styles.loginFeatureText}>数据云同步</Text>
            </View>
            <View style={styles.loginFeatureItem}>
              <Ionicons name="lock-closed" size={24} color="#26A69A" />
              <Text style={styles.loginFeatureText}>隐私安全</Text>
            </View>
            <View style={styles.loginFeatureItem}>
              <Ionicons name="gift" size={24} color="#26A69A" />
              <Text style={styles.loginFeatureText}>会员特权</Text>
            </View>
          </View>
        </View>
      </Screen>
    );
  }

  // 用户已登录，显示用户信息
  const profileItems = user ? [
    { label: '性别', value: user.gender || '未设置' },
    { label: '身高', value: user.height ? `${user.height}cm` : '未设置' },
    { label: '体重', value: user.weight ? `${user.weight}kg` : '未设置' },
  ] : [];

  const handleLogout = () => {
    Alert.alert(
      '提示',
      '确定要退出登录吗？',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '确定', 
          onPress: async () => {
            await logout();
          }
        },
      ]
    );
  };

  return (
    <Screen>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* 头部信息卡 */}
        <View style={styles.headerCard}>
          <Image 
            source={{ uri: user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400' }} 
            style={styles.avatar} 
          />
          <Text style={styles.userName}>{user?.nickname || '健康达人'}</Text>
          {user?.vipLevel && user.vipLevel > 0 ? (
            <View style={styles.vipBadge}>
              <FontAwesome6 name="crown" size={12} color="#FFD700" />
              <Text style={styles.vipText}>月度会员</Text>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.upgradeVipBadge}
              onPress={() => router.push('/vip')}
            >
              <FontAwesome6 name="crown" size={12} color="#9CA3AF" />
              <Text style={styles.upgradeVipText}>升级会员</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.signature}>{user?.signature || '追求健康生活，享受美好人生'}</Text>
          <Text style={styles.phoneText}>{user?.phone ? `${user.phone.slice(0, 3)}****${user.phone.slice(-4)}` : ''}</Text>

          {/* 数据统计 */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user?.points || 0}</Text>
              <Text style={styles.statLabel}>积分</Text>
            </View>
            <View style={styles.statDivider} />
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>关注</Text>
            </TouchableOpacity>
            <View style={styles.statDivider} />
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>粉丝</Text>
            </TouchableOpacity>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>获赞</Text>
            </View>
          </View>

          {/* 编辑资料按钮 */}
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push('/edit-profile')}
          >
            <FontAwesome6 name="pencil" size={14} color="#26A69A" />
            <Text style={styles.editButtonText}>编辑资料</Text>
          </TouchableOpacity>
        </View>

        {/* AI健康管家弹窗 */}
        <Modal visible={aiModalVisible} animationType="slide" onRequestClose={() => setAiModalVisible(false)}>
          <View style={styles.aiModalContainer}>
            {/* 顶部导航 */}
            <View style={styles.aiModalHeader}>
              <View style={styles.aiModalHeaderLeft}>
                <View style={[styles.aiAvatar, { width: 36, height: 36 }]}>
                  <FontAwesome6 name="robot" size={18} color="#FFFFFF" />
                </View>
                <View style={styles.aiInfo}>
                  <Text style={styles.aiTitle}>AI健康管家</Text>
                  <Text style={styles.aiSubtitle}>小轻·在线</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setAiModalVisible(false)} style={styles.aiCloseBtn}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* 快捷问题 */}
            <View style={styles.quickQuestions}>
              <Text style={styles.quickQuestionsTitle}>快捷问题</Text>
              <View style={styles.quickQuestionsScroll}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={{ flexDirection: 'row', gap: 10, paddingRight: 16 }}>
                    {quickQuestions.map((q, idx) => (
                      <TouchableOpacity
                        key={idx}
                        style={styles.quickQuestionBtn}
                        onPress={() => handleQuickQuestion(q)}
                      >
                        <Text style={styles.quickQuestionText}>{q}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            </View>

            {/* 聊天内容 */}
            <ScrollView style={styles.chatContainer} contentContainerStyle={styles.chatContent}>
              {chatMessages.map((msg) => (
                <View key={msg.id} style={[styles.chatBubble, msg.isUser ? styles.userBubble : styles.aiBubble]}>
                  {!msg.isUser && (
                    <View style={[styles.aiBubbleAvatar]}>
                      <FontAwesome6 name="robot" size={14} color="#FFFFFF" />
                    </View>
                  )}
                  <Text style={[styles.chatText, msg.isUser && styles.userChatText]}>{msg.text}</Text>
                </View>
              ))}
            </ScrollView>

            {/* 输入区 */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="输入您的问题..."
                placeholderTextColor="#9CA3AF"
                value={inputText}
                onChangeText={setInputText}
                multiline
              />
              <TouchableOpacity style={styles.sendBtn} onPress={handleSendMessage}>
                <Ionicons name="paper-plane" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* 科学体重管理方案 */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.weightPlanCard}>
            <View style={styles.weightPlanLeft}>
              <View style={styles.weightPlanIcon}>
                <FontAwesome6 name="utensils" size={22} color="#FFFFFF" />
              </View>
              <View style={styles.weightPlanInfo}>
                <Text style={styles.weightPlanTitle}>科学体重管理方案</Text>
                <Text style={styles.weightPlanDesc}>个性化饮食+运动指导</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#26A69A" />
          </TouchableOpacity>
        </View>

        {/* AI健康管家小轻 */}
        <TouchableOpacity style={styles.aiAssistantCard} onPress={() => setAiModalVisible(true)}>
          <View style={styles.aiHeader}>
            <View style={styles.aiAvatar}>
              <FontAwesome6 name="robot" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.aiInfo}>
              <Text style={styles.aiTitle}>AI健康管家</Text>
              <Text style={styles.aiSubtitle}>小轻·在线</Text>
            </View>
            <View style={styles.aiArrow}>
              <Ionicons name="chevron-forward" size={20} color="#26A69A" />
            </View>
          </View>
          <Text style={styles.aiDescription}>减脂饮食、运动计划，问我吧！</Text>
        </TouchableOpacity>

        {/* 个人信息 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>个人信息</Text>
          <View style={styles.card}>
            {profileItems.map((item, index) => (
              <View
                key={item.label}
                style={[styles.profileItem, index < profileItems.length - 1 && styles.profileItemBorder]}
              >
                <Text style={styles.profileLabel}>{item.label}</Text>
                <View style={styles.profileValueRow}>
                  <Text style={styles.profileValue}>{item.value}</Text>
                  <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 健康数据 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>健康数据</Text>
          <View style={styles.card}>
            {[
              { label: 'BMI指数', value: '22.5', status: '正常', color: '#26A69A' },
              { label: '体脂率', value: '18.5%', status: '偏低', color: '#FF9800' },
              { label: '基础代谢', value: '1450', status: 'kcal', color: '#2196F3' },
              { label: '水分率', value: '55%', status: '正常', color: '#26A69A' },
            ].map((item, index) => (
              <View
                key={item.label}
                style={[styles.profileItem, index < 3 && styles.profileItemBorder]}
              >
                <Text style={styles.profileLabel}>{item.label}</Text>
                <View style={styles.profileValueRow}>
                  <Text style={styles.profileValue}>{item.value}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: item.color + '20' }]}>
                    <Text style={[styles.statusText, { color: item.color }]}>{item.status}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 生活方式 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>生活方式</Text>
          <View style={styles.card}>
            {[
              { label: '运动频率', value: '每周3-4次', icon: 'person-running' },
              { label: '饮食习惯', value: '均衡饮食', icon: 'utensils' },
              { label: '睡眠习惯', value: '早睡早起', icon: 'moon' },
              { label: '目标设定', value: '减脂增肌', icon: 'target' },
            ].map((item, index) => (
              <View
                key={item.label}
                style={[styles.profileItem, index < 3 && styles.profileItemBorder]}
              >
                <View style={styles.profileLabelRow}>
                  <View style={styles.lifeIcon}>
                    <FontAwesome6 name={item.icon as any} size={14} color="#26A69A" />
                  </View>
                  <Text style={styles.profileLabel}>{item.label}</Text>
                </View>
                <View style={styles.profileValueRow}>
                  <Text style={styles.profileValue}>{item.value}</Text>
                  <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 账号设置 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>账号设置</Text>
          <View style={styles.card}>
            {[
              { label: '账号安全', icon: 'shield-halved' },
              { label: '隐私设置', icon: 'lock' },
              { label: '通知设置', icon: 'bell' },
              { label: '清除缓存', icon: 'trash' },
            ].map((item, index) => (
              <TouchableOpacity
                key={item.label}
                style={[styles.profileItem, index < 3 && styles.profileItemBorder]}
              >
                <View style={styles.profileLabelRow}>
                  <View style={styles.lifeIcon}>
                    <FontAwesome6 name={item.icon as any} size={14} color="#9CA3AF" />
                  </View>
                  <Text style={styles.profileLabel}>{item.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
              </TouchableOpacity>
            ))}
            
            {/* 退出登录 */}
            <TouchableOpacity
              style={[styles.profileItem, styles.logoutItem]}
              onPress={handleLogout}
            >
              <View style={styles.profileLabelRow}>
                <View style={[styles.lifeIcon, { backgroundColor: '#FEE2E2' }]}>
                  <Ionicons name="log-out-outline" size={14} color="#EF4444" />
                </View>
                <Text style={[styles.profileLabel, { color: '#EF4444' }]}>退出登录</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 我的徽章 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>我的徽章</Text>
          <View style={styles.badgeGrid}>
            <View style={styles.badgeItem}>
              <View style={[styles.badgeIcon, { backgroundColor: '#FEF3C7' }]}>
                <FontAwesome6 name="dumbbell" size={20} color="#F59E0B" />
              </View>
              <Text style={styles.badgeName}>运动达人</Text>
            </View>
            <View style={styles.badgeItem}>
              <View style={[styles.badgeIcon, { backgroundColor: '#DCFCE7' }]}>
                <FontAwesome6 name="apple-whole" size={20} color="#22C55E" />
              </View>
              <Text style={styles.badgeName}>健康饮食</Text>
            </View>
            <View style={styles.badgeItem}>
              <View style={[styles.badgeIcon, { backgroundColor: '#DBEAFE' }]}>
                <FontAwesome6 name="moon" size={20} color="#3B82F6" />
              </View>
              <Text style={styles.badgeName}>早睡早起</Text>
            </View>
            <View style={styles.badgeItem}>
              <View style={[styles.badgeIcon, { backgroundColor: '#FEE2E2' }]}>
                <FontAwesome6 name="heart" size={20} color="#EF4444" />
              </View>
              <Text style={styles.badgeName}>坚持打卡</Text>
            </View>
            <View style={styles.badgeItem}>
              <View style={[styles.badgeIcon, { backgroundColor: '#F3E8FF', borderWidth: 1, borderColor: '#D946EF', borderStyle: 'dashed' }]}>
                <FontAwesome6 name="lock" size={20} color="#D946EF" />
              </View>
              <Text style={[styles.badgeName, { color: '#9CA3AF' }]}>更多待解锁</Text>
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
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  // 未登录样式
  loginContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loginHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  loginTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 24,
  },
  loginSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
  },
  loginBtn: {
    backgroundColor: '#26A69A',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 25,
    marginBottom: 40,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loginFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  loginFeatureItem: {
    alignItems: 'center',
  },
  loginFeatureText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
  },
  // 已登录样式
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E7EB',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 12,
  },
  vipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
    gap: 4,
  },
  upgradeVipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
    gap: 4,
  },
  vipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D97706',
  },
  upgradeVipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  signature: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  phoneText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E7EB',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 16,
    gap: 6,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#26A69A',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  profileItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  profileLabel: {
    fontSize: 15,
    color: '#374151',
  },
  profileValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  profileValue: {
    fontSize: 15,
    color: '#9CA3AF',
  },
  profileLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  lifeIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  logoutItem: {
    marginTop: 8,
  },
  // 科学体重管理方案样式
  weightPlanCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  weightPlanLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weightPlanIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#26A69A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  weightPlanInfo: {
    justifyContent: 'center',
  },
  weightPlanTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  weightPlanDesc: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  // 我的徽章样式
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  badgeItem: {
    width: '20%',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  badgeName: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
  },
  // AI健康管家样式
  aiAssistantCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#26A69A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiInfo: {
    flex: 1,
    marginLeft: 12,
  },
  aiTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1F2937',
  },
  aiSubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 2,
  },
  aiArrow: {
    padding: 4,
  },
  aiDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 12,
    marginLeft: 60,
  },
  // AI Modal样式
  aiModalContainer: {
    flex: 1,
    backgroundColor: '#F0FDF4',
  },
  aiModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#26A69A',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  aiModalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiCloseBtn: {
    padding: 8,
  },
  quickQuestions: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  quickQuestionsTitle: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 10,
  },
  quickQuestionsScroll: {
    minHeight: 40,
  },
  quickQuestionBtn: {
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  quickQuestionText: {
    fontSize: 13,
    color: '#26A69A',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#F0FDF4',
  },
  chatContent: {
    padding: 16,
    paddingBottom: 100,
  },
  chatBubble: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    maxWidth: '80%',
  },
  aiBubble: {
    alignSelf: 'flex-start',
  },
  userBubble: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  aiBubbleAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#26A69A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  chatText: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  userChatText: {
    backgroundColor: '#26A69A',
    color: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  input: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
    color: '#1F2937',
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#26A69A',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});
