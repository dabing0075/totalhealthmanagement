import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Screen } from '@/components/Screen';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileScreen() {
  const router = useSafeRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm, setEditForm] = useState({
    nickname: '健康达人',
    gender: '女',
    bio: '追求健康生活，享受美好人生',
  });

  const [aiModalVisible, setAiModalVisible] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, type: 'ai', text: '您好！我是您的AI健康管家小轻，有什么关于减脂饮食、运动计划的问题都可以问我哦！' }
  ]);
  const [inputText, setInputText] = useState('');

  const quickQuestions = [
    '今日三餐怎么搭配？',
    '做什么运动最燃脂？',
    '如何突破减肥平台期？',
  ];

  const msgIdRef = useRef(0);
  
  const handleSendMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    
    const userMsg = { id: ++msgIdRef.current, type: 'user' as const, text };
    setChatMessages(prev => [...prev, userMsg]);
    setInputText('');
    
    // 模拟AI回复
    setTimeout(() => {
      let reply = '这个问题比较专业，建议您咨询专业营养师。';
      if (text.includes('三餐') || text.includes('搭配')) {
        reply = '建议早餐摄入蛋白质，午餐均衡营养，晚餐以蔬菜为主，配合适量蛋白质。';
      } else if (text.includes('运动') || text.includes('燃脂')) {
        reply = 'HIIT和力量训练是燃脂的好选择，建议每周进行3-4次，每次30分钟左右。';
      } else if (text.includes('平台期')) {
        reply = '平台期可以尝试改变运动方式、增加运动强度，或者适当调整饮食结构来突破。';
      }
      
      const aiMsg = { id: ++msgIdRef.current, type: 'ai' as const, text: reply };
      setChatMessages(prev => [...prev, aiMsg]);
    }, 1000);
  }, []);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  if (!isAuthenticated) {
    return (
      <Screen>
        <View style={styles.loginContainer}>
          <View style={styles.loginContent}>
            <View style={styles.loginIcon}>
              <Ionicons name="person-circle-outline" size={80} color="#26A69A" />
            </View>
            <Text style={styles.loginTitle}>登录后查看更多内容</Text>
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.loginButtonText}>立即登录</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Screen>
    );
  }

  const profileItems = [
    {
      icon: 'user-edit',
      title: '编辑资料',
      action: () => setEditModalVisible(true),
    },
    {
      icon: 'history',
      title: '历史记录',
      action: () => router.push('/history'),
    },
  ];

  const healthItems = [
    {
      icon: 'heartbeat',
      title: '健康数据',
      action: () => router.push('/dashboard'),
    },
    {
      icon: 'utensils',
      title: '饮食记录',
      action: () => router.push('/food-analysis'),
    },
    {
      icon: 'running',
      title: '运动记录',
      action: () => router.push('/exercise'),
    },
    {
      icon: 'moon',
      title: '睡眠记录',
      action: () => router.push('/sleep'),
    },
  ];

  const lifestyleItems = [
    {
      icon: 'smile',
      title: '情绪管理',
      action: () => router.push('/emotion'),
    },
    {
      icon: 'check-circle',
      title: '习惯打卡',
      action: () => router.push('/habit'),
    },
  ];

  const accountItems = [
    {
      icon: 'cog',
      title: '设置',
      action: () => {},
    },
    {
      icon: 'question-circle',
      title: '帮助与反馈',
      action: () => {},
    },
  ];

  return (
    <Screen>
      {/* 返回键行 */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft} />
        <Text style={styles.headerTitle}>我的</Text>
        <View style={styles.headerRight} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* 用户成长卡片 */}
          <View style={styles.growthCard}>
            <View style={styles.growthLeft}>
              <Text style={styles.growthScore}>530</Text>
              <Text style={styles.growthLabel}>健康习惯得分</Text>
              <View style={styles.growthBadge}>
                <Text style={styles.growthBadgeText}>优秀阶段</Text>
              </View>
            </View>
            <View style={styles.growthRight}>
              <View style={styles.growthItem}>
                <Text style={styles.growthItemValue}>1,280</Text>
                <Text style={styles.growthItemLabel}>积分</Text>
              </View>
            </View>
          </View>

          {/* AI健康管家卡片 */}
          <TouchableOpacity style={styles.aiCard} onPress={() => setAiModalVisible(true)}>
            <View style={styles.aiHeader}>
              <View style={styles.aiAvatar}>
                <FontAwesome6 name="robot" size={20} color="#26A69A" />
              </View>
              <View style={styles.aiInfo}>
                <Text style={styles.aiTitle}>AI健康管家</Text>
                <Text style={styles.aiSubtitle}>小轻·在线</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </View>
            <Text style={styles.aiDescription}>减脂饮食、运动计划，问我吧！</Text>
          </TouchableOpacity>

          {/* 个人信息卡片 */}
          <View style={styles.profileCard}>
            <TouchableOpacity style={styles.profileHeader} onPress={() => setEditModalVisible(true)}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200' }}
                style={styles.avatar}
              />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{editForm.nickname}</Text>
                <Text style={styles.profileBio}>{editForm.bio}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* 功能列表 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>个人信息</Text>
            <View style={styles.card}>
              {profileItems.map((item, index) => (
                <TouchableOpacity
                  key={item.title}
                  style={[
                    styles.menuItem,
                    index < profileItems.length - 1 && styles.menuItemBorder,
                  ]}
                  onPress={item.action}
                >
                  <View style={styles.menuLeft}>
                    <View style={styles.menuIcon}>
                      <FontAwesome6 name={item.icon as any} size={18} color="#26A69A" />
                    </View>
                    <Text style={styles.menuText}>{item.title}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>健康数据</Text>
            <View style={styles.card}>
              {healthItems.map((item, index) => (
                <TouchableOpacity
                  key={item.title}
                  style={[
                    styles.menuItem,
                    index < healthItems.length - 1 && styles.menuItemBorder,
                  ]}
                  onPress={item.action}
                >
                  <View style={styles.menuLeft}>
                    <View style={styles.menuIcon}>
                      <FontAwesome6 name={item.icon as any} size={18} color="#26A69A" />
                    </View>
                    <Text style={styles.menuText}>{item.title}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>生活方式</Text>
            <View style={styles.card}>
              {lifestyleItems.map((item, index) => (
                <TouchableOpacity
                  key={item.title}
                  style={[
                    styles.menuItem,
                    index < lifestyleItems.length - 1 && styles.menuItemBorder,
                  ]}
                  onPress={item.action}
                >
                  <View style={styles.menuLeft}>
                    <View style={styles.menuIcon}>
                      <FontAwesome6 name={item.icon as any} size={18} color="#26A69A" />
                    </View>
                    <Text style={styles.menuText}>{item.title}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>账号设置</Text>
            <View style={styles.card}>
              {accountItems.map((item, index) => (
                <TouchableOpacity
                  key={item.title}
                  style={[
                    styles.menuItem,
                    index < accountItems.length - 1 && styles.menuItemBorder,
                  ]}
                  onPress={item.action}
                >
                  <View style={styles.menuLeft}>
                    <View style={styles.menuIcon}>
                      <FontAwesome6 name={item.icon as any} size={18} color="#26A69A" />
                    </View>
                    <Text style={styles.menuText}>{item.title}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 我的徽章 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>我的徽章</Text>
            <View style={styles.badgeCard}>
              <View style={styles.badgeGrid}>
                {[
                  { icon: 'running', name: '运动达人', color: '#4CAF50' },
                  { icon: 'utensils', name: '健康饮食', color: '#FF9800' },
                  { icon: 'moon', name: '早睡早起', color: '#2196F3' },
                  { icon: 'check-circle', name: '坚持打卡', color: '#9C27B0' },
                  { icon: 'plus', name: '更多待解锁', color: '#E0E0E0' },
                ].map((badge) => (
                  <View key={badge.name} style={styles.badgeItem}>
                    <View style={[styles.badgeCircle, { backgroundColor: badge.color + '20' }]}>
                      <FontAwesome6 name={badge.icon as any} size={24} color={badge.color} />
                    </View>
                    <Text style={[styles.badgeName, badge.color === '#E0E0E0' && styles.badgeNameGray]}>
                      {badge.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* 退出登录 */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>退出登录</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* 编辑资料Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={modalStyles.container}>
          <View style={modalStyles.header}>
            <TouchableOpacity onPress={() => setEditModalVisible(false)}>
              <Text style={modalStyles.cancelText}>取消</Text>
            </TouchableOpacity>
            <Text style={modalStyles.headerTitle}>编辑资料</Text>
            <TouchableOpacity onPress={() => setEditModalVisible(false)}>
              <Text style={modalStyles.saveText}>保存</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={modalStyles.content}>
            {/* 头像 */}
            <View style={modalStyles.avatarSection}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200' }}
                style={modalStyles.avatar}
              />
              <Text style={modalStyles.avatarTip}>点击更换头像</Text>
            </View>

            {/* 基本信息 */}
            <View style={modalStyles.section}>
              <Text style={modalStyles.sectionTitle}>基本信息</Text>
              <View style={modalStyles.card}>
                <View style={modalStyles.formItem}>
                  <Text style={modalStyles.formLabel}>昵称</Text>
                  <TextInput
                    style={modalStyles.formInput}
                    value={editForm.nickname}
                    onChangeText={(text) => setEditForm(prev => ({ ...prev, nickname: text }))}
                    placeholder="请输入昵称"
                  />
                </View>
                <View style={[modalStyles.formItem, modalStyles.formItemBorder]}>
                  <Text style={modalStyles.formLabel}>性别</Text>
                  <View style={modalStyles.genderSelector}>
                    {['男', '女'].map((gender) => (
                      <TouchableOpacity
                        key={gender}
                        style={[
                          modalStyles.genderOption,
                          editForm.gender === gender && modalStyles.genderOptionActive,
                        ]}
                        onPress={() => setEditForm(prev => ({ ...prev, gender }))}
                      >
                        <Text
                          style={[
                            modalStyles.genderText,
                            editForm.gender === gender && modalStyles.genderTextActive,
                          ]}
                        >
                          {gender}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </View>

            {/* 个人签名 */}
            <View style={modalStyles.section}>
              <Text style={modalStyles.sectionTitle}>个人签名</Text>
              <View style={modalStyles.card}>
                <TextInput
                  style={modalStyles.signatureInput}
                  value={editForm.bio}
                  onChangeText={(text) => setEditForm(prev => ({ ...prev, bio: text }))}
                  placeholder="介绍一下自己吧"
                  multiline
                  maxLength={100}
                />
                <Text style={modalStyles.wordCount}>{editForm.bio.length}/100</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* AI管家Modal */}
      <Modal
        visible={aiModalVisible}
        animationType="slide"
        transparent={false}
      >
        <View style={aiModalStyles.container}>
          <View style={aiModalStyles.header}>
            <View style={aiModalStyles.headerLeft}>
              <View style={aiModalStyles.aiAvatar}>
                <FontAwesome6 name="robot" size={20} color="#FFFFFF" />
              </View>
              <View>
                <Text style={aiModalStyles.headerTitle}>AI健康管家</Text>
                <Text style={aiModalStyles.headerSubtitle}>小轻·在线</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => setAiModalVisible(false)}>
              <Ionicons name="close" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={aiModalStyles.quickSection}>
            <Text style={aiModalStyles.quickTitle}>快捷问题</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {quickQuestions.map((q, i) => (
                <TouchableOpacity
                  key={i}
                  style={aiModalStyles.quickButton}
                  onPress={() => handleSendMessage(q)}
                >
                  <Text style={aiModalStyles.quickText}>{q}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <ScrollView style={aiModalStyles.chatContainer} contentContainerStyle={aiModalStyles.chatContent}>
            {chatMessages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  aiModalStyles.chatBubble,
                  msg.type === 'user' ? aiModalStyles.userBubble : aiModalStyles.aiBubble,
                ]}
              >
                {msg.type === 'ai' && (
                  <View style={aiModalStyles.aiBubbleAvatar}>
                    <FontAwesome6 name="robot" size={16} color="#26A69A" />
                  </View>
                )}
                <Text
                  style={[
                    aiModalStyles.chatText,
                    msg.type === 'user' && aiModalStyles.userChatText,
                  ]}
                >
                  {msg.text}
                </Text>
              </View>
            ))}
          </ScrollView>

          <View style={aiModalStyles.inputContainer}>
            <TextInput
              style={aiModalStyles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="输入您的问题..."
              placeholderTextColor="#9CA3AF"
              multiline
            />
            <TouchableOpacity
              style={aiModalStyles.sendButton}
              onPress={() => handleSendMessage(inputText)}
            >
              <Ionicons name="send" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  contentContainer: {
    paddingBottom: 100,
  },
  headerRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#F9FAFB',
  },
  headerLeft: {
    width: 32,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerRight: {
    width: 32,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loginContent: {
    alignItems: 'center',
  },
  loginIcon: {
    marginBottom: 16,
  },
  loginTitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: '#26A69A',
    paddingHorizontal: 48,
    paddingVertical: 14,
    borderRadius: 25,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  growthCard: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 70,
    padding: 16,
    backgroundColor: '#26A69A',
    borderRadius: 16,
  },
  growthLeft: {
    flex: 1,
  },
  growthScore: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  growthLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  growthBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  growthBadgeText: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  growthRight: {
    justifyContent: 'center',
  },
  growthItem: {
    alignItems: 'flex-end',
  },
  growthItemValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  growthItemLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  aiCard: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
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
    backgroundColor: '#E8F5F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiInfo: {
    flex: 1,
    marginLeft: 12,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  aiSubtitle: {
    fontSize: 13,
    color: '#26A69A',
    marginTop: 2,
  },
  aiDescription: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 12,
  },
  profileCard: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  profileBio: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 4,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 10,
    paddingLeft: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#E8F5F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 15,
    color: '#1F2937',
    marginLeft: 12,
  },
  badgeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  badgeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badgeItem: {
    alignItems: 'center',
    width: 60,
  },
  badgeCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeName: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 6,
    textAlign: 'center',
  },
  badgeNameGray: {
    color: '#9CA3AF',
  },
  logoutButton: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 40,
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutText: {
    fontSize: 15,
    color: '#EF4444',
  },
});

const modalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  cancelText: {
    fontSize: 16,
    color: '#6B7280',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1F2937',
  },
  saveText: {
    fontSize: 16,
    color: '#26A69A',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#26A69A',
  },
  avatarTip: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
  },
  formItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  formItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  formLabel: {
    fontSize: 15,
    color: '#1a1a2e',
    minWidth: 70,
  },
  formInput: {
    flex: 1,
    fontSize: 15,
    color: '#1a1a2e',
    textAlign: 'right',
  },
  genderSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  genderOption: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  genderOptionActive: {
    backgroundColor: '#26A69A',
  },
  genderText: {
    fontSize: 14,
    color: '#6B7280',
  },
  genderTextActive: {
    color: '#FFFFFF',
  },
  signatureInput: {
    fontSize: 15,
    color: '#1a1a2e',
    padding: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  wordCount: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
});

const aiModalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FAF8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 50,
    backgroundColor: '#26A69A',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 12,
  },
  quickSection: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  quickTitle: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 10,
  },
  quickButton: {
    backgroundColor: '#E8F5F3',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  quickText: {
    fontSize: 14,
    color: '#26A69A',
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  chatContent: {
    paddingVertical: 16,
  },
  chatBubble: {
    flexDirection: 'row',
    marginBottom: 12,
    maxWidth: '80%',
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderTopLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#26A69A',
    borderRadius: 16,
    borderTopRightRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  aiBubbleAvatar: {
    marginRight: 8,
    alignSelf: 'flex-start',
  },
  chatText: {
    fontSize: 15,
    color: '#1F2937',
    lineHeight: 22,
  },
  userChatText: {
    color: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  input: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#26A69A',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});
