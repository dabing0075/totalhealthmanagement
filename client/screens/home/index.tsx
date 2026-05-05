/* eslint-disable react-hooks/refs */
import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Dimensions,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { Screen } from '@/components/Screen';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useAuth } from '@/contexts/AuthContext';

// 动画数字组件
const AnimatedNumber = ({ value, style, suffix = '' }: { value: string | number; style: any; suffix?: string }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.08],
  });

  return (
    <Animated.Text style={[style, { transform: [{ scale }] }]}>
      {value}{suffix}
    </Animated.Text>
  );
};

// 脉冲图标组件
const PulseIcon = ({ children }: { children: React.ReactNode }) => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.15,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      {children}
    </Animated.View>
  );
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// AI管家快捷问题
const quickQuestions = [
  '今日三餐怎么搭配？',
  '做什么运动最燃脂？',
  '如何突破减肥平台期？',
];

export default function HomeScreen() {
  const router = useSafeRouter();
  const { user } = useAuth();
  const [searchText, setSearchText] = useState('');
  
  // AI管家状态
  const [aiModalVisible, setAiModalVisible] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: '1', text: '您好！我是您的AI健康管家小轻，有什么关于减脂饮食、运动计划的问题都可以问我哦！', isUser: false },
  ]);
  const [inputText, setInputText] = useState('');
  const [msgCounter, setMsgCounter] = useState(1);
  const chatScrollRef = useRef<ScrollView>(null);

  // AI管家发送消息
  const handleSendMessage = useCallback(() => {
    if (!inputText.trim()) return;
    const newMsg = { id: String(msgCounter + 1), text: inputText.trim(), isUser: true };
    setChatMessages(prev => [...prev, newMsg]);
    setInputText('');
    setMsgCounter(prev => prev + 1);
    
    // 模拟AI回复
    setTimeout(() => {
      const replies = [
        '建议您今日摄入约1500千卡，早餐400千卡、午餐500千卡、晚餐400千卡、零食200千卡。',
        'HIIT燃脂效果最好，每次20分钟，每周3-4次即可。',
        '平台期可以尝试调整饮食结构或增加运动强度，建议记录详细数据。',
        '根据您的目标，建议每天保持500千卡的热量缺口比较健康。',
      ];
      const aiReply = { id: String(msgCounter + 2), text: replies[Math.floor(Math.random() * replies.length)], isUser: false };
      setChatMessages(prev => [...prev, aiReply]);
      setMsgCounter(prev => prev + 2);
      setTimeout(() => chatScrollRef.current?.scrollToEnd({ animated: true }), 100);
    }, 1000);
  }, [inputText, msgCounter]);

  // AI管家快捷问题
  const handleQuickQuestion = useCallback((question: string) => {
    setInputText(question);
    setTimeout(() => handleSendMessage(), 300);
  }, [handleSendMessage]);

  useEffect(() => {
    if (chatMessages.length > 1) {
      setTimeout(() => chatScrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [chatMessages]);

  // 计算BMI
  const calculateBMI = () => {
    if (user?.height && user?.weight && user.height > 0 && user.weight > 0) {
      const heightInM = user.height / 100;
      return (user.weight / (heightInM * heightInM)).toFixed(1);
    }
    return null;
  };

  // 计算标准体重范围
  const getStandardWeightRange = () => {
    if (user?.height && user.height > 0) {
      const min = ((user.height - 100) * 0.9).toFixed(0);
      const max = ((user.height - 100) * 1.1).toFixed(0);
      return `${min}kg - ${max}kg`;
    }
    return null;
  };

  const healthModules = [
    { id: 'dashboard', name: '数据看板', icon: 'chart-bar', iconColor: '#2196F3', bgColor: '#E3F2FD' },
    { id: 'food', name: '食物分析', icon: 'camera', iconColor: '#FF9800', bgColor: '#FFF3E0' },
    { id: 'exercise', name: '运动', icon: 'person-running', iconColor: '#FF6B6B', bgColor: '#FFEBEE' },
    { id: 'sleep', name: '睡眠', icon: 'moon', iconColor: '#9C27B0', bgColor: '#F3E5F5' },
    { id: 'emotion', name: '情绪', icon: 'face-smile', iconColor: '#FF9800', bgColor: '#FFF3E0' },
    { id: 'habit', name: '生活习惯', icon: 'list-check', iconColor: '#26A69A', bgColor: '#E0F2F1' },
    { id: 'member', name: '会员', icon: 'crown', iconColor: '#FFD700', bgColor: '#FFF8E1' },
    { id: 'female', name: '女性生理', icon: 'person-dress', iconColor: '#E91E63', bgColor: '#FCE4EC' },
  ];

  const handleModulePress = (moduleId: string) => {
    const routes: Record<string, string> = {
      female: '/female',
      dashboard: '/dashboard',
      food: '/food-analysis',
      exercise: '/exercise',
      sleep: '/sleep',
      emotion: '/emotion',
      habit: '/habit',
      member: '/vip',
    };
    if (routes[moduleId]) {
      if (moduleId === 'female') {
        router.push(routes[moduleId]);
      } else {
        router.push(routes[moduleId]);
      }
    }
  };

  return (
    <Screen>
      <ScrollView style={styles.container} contentContainerStyle={[styles.contentContainer, { paddingBottom: 100 }]} showsVerticalScrollIndicator={false}>
        {/* 顶部搜索栏 */}
        <View style={styles.headerSection}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#9CA3AF" />
            <TextInput style={styles.searchInput} placeholder="搜索健康知识、食物热量" placeholderTextColor="#9CA3AF" value={searchText} onChangeText={setSearchText} />
          </View>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="refresh" size={18} color="#1a1a2e" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="notifications-outline" size={20} color="#1a1a2e" />
            <View style={styles.notifBadge}><Text style={styles.notifBadgeText}>3</Text></View>
          </TouchableOpacity>
        </View>

        {/* 欢迎横幅 */}
        <LinearGradient colors={['#26A69A', '#00897B']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.welcomeBanner}>
          <Text style={styles.welcomeTitle}>欢迎回来，健康生活每一天</Text>
          <Text style={styles.welcomeSubtitle}>探索您的健康数据、获取个性化推荐，开始美好的一天。</Text>
        </LinearGradient>

        {/* 功能导航 */}
        <View style={styles.navGrid}>
          {healthModules.map((module, index) => (
            <TouchableOpacity
              key={module.id}
              style={styles.navItem}
              onPress={() => handleModulePress(module.id)}
            >
              <View style={[styles.navIconWrap, { backgroundColor: module.bgColor }]}>
                  <FontAwesome6 name={module.icon as any} size={18} color={module.iconColor} />
                </View>
              <Text style={styles.navText}>{module.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 今日热量缺口 */}
        <View style={styles.calorieCard}>
          <View style={styles.cardHeader}>
            <View style={styles.calorieTitleRow}>
              <FontAwesome6 name="fire" size={16} color="#FF9800" />
              <Text style={styles.calorieTitle}>今日热量缺口</Text>
            </View>
            <View style={styles.timeTabs}>
              <TouchableOpacity style={[styles.timeTab, styles.timeTabActive]}><Text style={[styles.timeTabText, styles.timeTabTextActive]}>日</Text></TouchableOpacity>
              <TouchableOpacity style={styles.timeTab}><Text style={styles.timeTabText}>周</Text></TouchableOpacity>
              <TouchableOpacity style={styles.timeTab}><Text style={styles.timeTabText}>月</Text></TouchableOpacity>
              <TouchableOpacity style={styles.timeTab}><Text style={styles.timeTabText}>年</Text></TouchableOpacity>
            </View>
          </View>
          <View style={styles.calorieContent}>
            <View style={styles.gaugeContainer}>
              <View style={styles.gaugeBackground}>
                <View style={styles.gaugeGradient} />
              </View>
              <View style={styles.gaugeOverlay}>
                <PulseIcon><AnimatedNumber value={870} style={styles.gaugeValue} suffix=""/></PulseIcon>
                <Text style={styles.gaugeLabel}>千卡缺口</Text>
              </View>
            </View>
            <View style={styles.calorieStats}>
              <View style={styles.calorieStat}>
                <Text style={[styles.calorieStatValue, { color: '#FF9800' }]}>
                  <AnimatedNumber value={1450} style={styles.calorieStatValue} suffix=""/></Text>
                <Text style={styles.calorieStatLabel}>总摄入</Text>
              </View>
              <View style={styles.calorieStat}>
                <Text style={[styles.calorieStatValue, { color: '#26A69A' }]}>
                  <AnimatedNumber value={2320} style={styles.calorieStatValue} suffix=""/></Text>
                <Text style={styles.calorieStatLabel}>总消耗</Text>
              </View>
              <View style={styles.calorieStat}>
                <Text style={[styles.calorieStatValue, { color: '#666' }]}>
                  <AnimatedNumber value={2000} style={styles.calorieStatValue} suffix=""/></Text>
                <Text style={styles.calorieStatLabel}>目标</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 三餐记录 */}
        <View style={styles.mealCard}>
          <View style={styles.mealHeader}>
            <View style={styles.mealTitleRow}>
              <FontAwesome6 name="utensils" size={16} color="#26A69A" />
              <Text style={styles.mealTitle}>三餐记录</Text>
            </View>
            <Text style={styles.mealSubtitle}>录入三餐，获取热量和营养分析</Text>
            <TouchableOpacity style={styles.addMealBtn}>
              <Text style={styles.addMealBtnText}>+ 加餐</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.mealGrid}>
            <TouchableOpacity style={[styles.mealItem, { backgroundColor: '#FFF3E0' }]}>
              <FontAwesome6 name="sun" size={24} color="#FF9800" />
              <Text style={styles.mealName}>早餐</Text>
              <Text style={styles.mealAdd}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.mealItem, { backgroundColor: '#E0F2F1' }]}>
              <FontAwesome6 name="cloud-sun" size={24} color="#26A69A" />
              <Text style={styles.mealName}>午餐</Text>
              <Text style={styles.mealAdd}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.mealItem, { backgroundColor: '#F3E5F5' }]}>
              <FontAwesome6 name="moon" size={24} color="#9C27B0" />
              <Text style={styles.mealName}>晚餐</Text>
              <Text style={styles.mealAdd}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.cameraBtn}>
            <FontAwesome6 name="camera" size={16} color="#FFFFFF" />
            <Text style={styles.cameraBtnText}>拍照识别</Text>
          </TouchableOpacity>
        </View>

        {/* 体重目标进度 */}
        <View style={styles.weightCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <FontAwesome6 name="circle" size={14} color="#26A69A" />
              <Text style={styles.cardTitle}>体重目标进度</Text>
            </View>
          </View>
          <View style={styles.weightContent}>
            <View style={styles.weightRing}>
              <View style={styles.ringBackground}>
                <View style={[styles.ringProgress, { borderColor: '#26A69A' }]} />
              </View>
              <Text style={styles.ringValue}>88%</Text>
            </View>
            <View style={styles.weightStats}>
              <View style={styles.weightStat}>
                <Text style={styles.weightStatLabel}>当前体重</Text>
                <Text style={styles.weightStatValue}>{user?.weight ? `${user.weight}kg` : '--kg'}</Text>
              </View>
              <View style={styles.weightStat}>
                <Text style={styles.weightStatLabel}>目标体重</Text>
                <Text style={styles.weightStatValue}>{user?.weight ? `${user.weight - 3.5}kg` : '--kg'}</Text>
              </View>
              <View style={styles.weightStat}>
                <Text style={styles.weightStatLabel}>还差</Text>
                <Text style={[styles.weightStatValue, { color: '#26A69A' }]}>{user?.weight ? '3.5kg' : '--kg'}</Text>
              </View>
            </View>
          </View>
          <View style={styles.tipBox}>
            <Text style={styles.tipText}>您已完成了88%的减重目标，继续加油！</Text>
          </View>
        </View>

        {/* 靓健四叶草 */}
        <View style={styles.section}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <FontAwesome6 name="heart" size={14} color="#FF9800" />
              <Text style={styles.cardTitle}>靓健四叶草</Text>
            </View>
          </View>
          <View style={styles.cloverGrid}>
            <View style={styles.cloverItem}>
              <View style={[styles.cloverRing, { borderColor: '#26A69A' }]}>
                <Text style={styles.cloverValue}>75%</Text>
              </View>
              <Text style={styles.cloverLabel}>饮食</Text>
            </View>
            <View style={styles.cloverItem}>
              <View style={[styles.cloverRing, { borderColor: '#2196F3' }]}>
                <Text style={styles.cloverValue}>68%</Text>
              </View>
              <Text style={styles.cloverLabel}>睡眠</Text>
            </View>
            <View style={styles.cloverItem}>
              <View style={[styles.cloverRing, { borderColor: '#FF9800' }]}>
                <Text style={styles.cloverValue}>82%</Text>
              </View>
              <Text style={styles.cloverLabel}>运动</Text>
            </View>
            <View style={styles.cloverItem}>
              <View style={[styles.cloverRing, { borderColor: '#FF6B9D' }]}>
                <Text style={styles.cloverValue}>59%</Text>
              </View>
              <Text style={styles.cloverLabel}>心态</Text>
            </View>
          </View>
          <View style={styles.tipBoxGreen}>
            <Text style={styles.tipTextGreen}>综合健康状况：持续进步中</Text>
            <Text style={styles.tipTextGreenSmall}>关注各项指标，保持健康生活方式！</Text>
          </View>
        </View>

        {/* 运动三环 */}
        <View style={styles.exerciseCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <FontAwesome6 name="person-running" size={14} color="#26A69A" />
              <Text style={styles.cardTitle}>运动三环</Text>
            </View>
          </View>
          <View style={styles.exerciseContent}>
            <View style={styles.exerciseRings}>
              <View style={[styles.exerciseRingOuter, { borderColor: '#26A69A' }]}>
                <View style={[styles.exerciseRingInner, { borderColor: '#FF9800' }]}>
                  <Text style={styles.exerciseValue}>80%</Text>
                </View>
              </View>
            </View>
            <View style={styles.exerciseStats}>
              <View style={styles.exerciseStat}>
                <View style={[styles.exerciseDot, { backgroundColor: '#26A69A' }]} />
                <Text style={styles.exerciseStatText}>活动</Text>
                <Text style={styles.exerciseStatValue}>80%</Text>
              </View>
              <View style={styles.exerciseStat}>
                <View style={[styles.exerciseDot, { backgroundColor: '#FF9800' }]} />
                <Text style={styles.exerciseStatText}>运动</Text>
                <Text style={styles.exerciseStatValue}>65%</Text>
              </View>
              <View style={styles.exerciseStat}>
                <View style={[styles.exerciseDot, { backgroundColor: '#8BC34A' }]} />
                <Text style={styles.exerciseStatText}>站立</Text>
                <Text style={styles.exerciseStatValue}>90%</Text>
              </View>
            </View>
          </View>
          <View style={styles.exerciseTip}>
            <Text style={styles.exerciseTipText}>今日已完成30分钟有氧运动，距离目标还差15分钟</Text>
          </View>
        </View>

        {/* 睡眠 */}
        <View style={styles.miniCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <FontAwesome6 name="moon" size={14} color="#26A69A" />
              <Text style={styles.cardTitle}>睡眠</Text>
            </View>
          </View>
          <View style={styles.miniContent}>
            <View style={styles.miniRing}>
              <Text style={styles.miniValue}>72%</Text>
            </View>
            <View style={styles.miniStats}>
              <Text style={styles.miniMainValue}>7.2小时</Text>
              <Text style={styles.miniSubValue}>目标8小时</Text>
              <Text style={styles.miniSmallValue}>质量72%</Text>
            </View>
          </View>
        </View>

        {/* 饮水 */}
        <View style={styles.miniCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <FontAwesome6 name="droplet" size={14} color="#26A69A" />
              <Text style={styles.cardTitle}>饮水</Text>
            </View>
          </View>
          <View style={styles.miniContent}>
            <View style={styles.miniRing}>
              <Text style={styles.miniValue}>60%</Text>
            </View>
            <View style={styles.miniStats}>
              <Text style={styles.miniMainValue}>1200ml</Text>
              <Text style={styles.miniSubValue}>目标2000ml</Text>
              <Text style={styles.miniSmallValue}>已完成60%</Text>
            </View>
          </View>
        </View>

        {/* 心态 */}
        <View style={styles.miniCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <FontAwesome6 name="face-smile" size={14} color="#26A69A" />
              <Text style={styles.cardTitle}>心态</Text>
            </View>
          </View>
          <View style={styles.miniContent}>
            <View style={[styles.miniRing, { borderColor: '#FF9800' }]}>
              <Text style={styles.miniValue}>65%</Text>
            </View>
            <View style={styles.miniStats}>
              <Text style={styles.miniMainValue}>平静</Text>
              <Text style={styles.miniSubValue}>连续记录2天</Text>
              <View style={styles.tagOrange}>
                <Text style={styles.tagOrangeText}>情绪稳定</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 生理期 */}
        <View style={styles.miniCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <FontAwesome6 name="calendar-days" size={14} color="#26A69A" />
              <Text style={styles.cardTitle}>生理期</Text>
            </View>
          </View>
          <View style={styles.miniContent}>
            <View style={styles.periodCircle}>
              <Text style={styles.periodValue}>12</Text>
            </View>
            <View style={styles.miniStats}>
              <Text style={styles.miniMainValue}>距离下次周期还有</Text>
              <Text style={styles.miniSubValue}>预计6月10日</Text>
              <Text style={styles.miniSmallValue}>当前：排卵期</Text>
            </View>
          </View>
        </View>

        {/* 习惯养成 */}
        <View style={styles.habitCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <FontAwesome6 name="chart-line" size={14} color="#26A69A" />
              <Text style={styles.cardTitle}>习惯养成</Text>
            </View>
            <Text style={styles.habitStreak}>连续7天</Text>
          </View>
          <View style={styles.habitList}>
            <View style={styles.habitItem}>
              <FontAwesome6 name="check" size={16} color="#26A69A" />
              <Text style={styles.habitName}>晨起喝水</Text>
              <Text style={styles.habitStatus}>已完成</Text>
            </View>
            <View style={styles.habitItem}>
              <FontAwesome6 name="check" size={16} color="#26A69A" />
              <Text style={styles.habitName}>12点前睡觉</Text>
              <Text style={styles.habitStatus}>已完成</Text>
            </View>
            <View style={styles.habitItem}>
              <FontAwesome6 name="check" size={16} color="#26A69A" />
              <Text style={styles.habitName}>每日万步走</Text>
              <Text style={styles.habitStatus}>已完成</Text>
            </View>
            <View style={styles.habitItem}>
              <FontAwesome6 name="circle" size={16} color="#9CA3AF" />
              <Text style={styles.habitName}>少喝小甜水</Text>
              <TouchableOpacity><Text style={styles.habitRecord}>打卡记录</Text></TouchableOpacity>
            </View>
            <View style={styles.habitItem}>
              <FontAwesome6 name="circle" size={16} color="#9CA3AF" />
              <Text style={styles.habitName}>记录心情</Text>
              <TouchableOpacity><Text style={styles.habitRecord}>打卡记录</Text></TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 健康圈动态 */}
        <View style={styles.section}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <FontAwesome6 name="users" size={14} color="#26A69A" />
              <Text style={styles.cardTitle}>健康圈动态</Text>
            </View>
            <TouchableOpacity><Text style={styles.moreLink}>查看更多{'>'}</Text></TouchableOpacity>
          </View>
          <View style={styles.feedList}>
            <View style={styles.feedItem}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' }} style={styles.feedAvatar} />
              <View style={styles.feedContent}>
                <View style={styles.feedHeader}>
                  <Text style={styles.feedName}>健康达人</Text>
                  <Text style={styles.feedTime}>1小时前</Text>
                </View>
                <Text style={styles.feedText}>分享我的减脂餐，坚持健康饮食第30天！</Text>
                <View style={styles.feedActions}>
                  <View style={styles.feedAction}>
                    <FontAwesome6 name="heart" size={12} color="#FF6B6B" />
                    <Text style={styles.feedActionText}>224</Text>
                  </View>
                  <View style={styles.feedAction}>
                    <FontAwesome6 name="comment" size={12} color="#666" />
                    <Text style={styles.feedActionText}>8</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={[styles.feedItem, styles.feedItemBorder]}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' }} style={styles.feedAvatar} />
              <View style={styles.feedContent}>
                <View style={styles.feedHeader}>
                  <Text style={styles.feedName}>运动爱好者</Text>
                  <Text style={styles.feedTime}>2小时前</Text>
                </View>
                <Text style={styles.feedText}>完成了今日的5公里跑步挑战，状态满满！</Text>
                <View style={styles.feedActions}>
                  <View style={styles.feedAction}>
                    <FontAwesome6 name="heart" size={12} color="#FF6B6B" />
                    <Text style={styles.feedActionText}>56</Text>
                  </View>
                  <View style={styles.feedAction}>
                    <FontAwesome6 name="comment" size={12} color="#666" />
                    <Text style={styles.feedActionText}>12</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* 知识库更新 */}
        <View style={styles.section}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <FontAwesome6 name="book" size={14} color="#26A69A" />
              <Text style={styles.cardTitle}>知识库更新</Text>
            </View>
            <TouchableOpacity><Text style={styles.moreLink}>查看更多{'>'}</Text></TouchableOpacity>
          </View>
          <View style={styles.articleList}>
            <TouchableOpacity style={styles.articleItem}>
              <View style={[styles.articleTag, { backgroundColor: '#FFF3E0' }]}>
                <Text style={[styles.articleTagText, { color: '#FF9800' }]}>饮食</Text>
              </View>
              <Text style={styles.articleTitle}>科学合理的碳水摄入指南</Text>
              <Text style={styles.articleMeta}>2天前</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.articleItem, styles.articleItemBorder]}>
              <View style={[styles.articleTag, { backgroundColor: '#E0F2F1' }]}>
                <Text style={[styles.articleTagText, { color: '#26A69A' }]}>运动</Text>
              </View>
              <Text style={styles.articleTitle}>居家高效训练：不需要器材的全身运动</Text>
              <Text style={styles.articleMeta}>2天前</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 商城精选 */}
        <View style={styles.section}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <FontAwesome6 name="bag-shopping" size={14} color="#26A69A" />
              <Text style={styles.cardTitle}>商城精选</Text>
            </View>
            <TouchableOpacity><Text style={styles.moreLink}>进入商城{'>'}</Text></TouchableOpacity>
          </View>
          <View style={styles.productGrid}>
            <TouchableOpacity style={styles.productCard}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200' }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>运动服</Text>
                <Text style={styles.productPrice}>¥129.99</Text>
                <View style={styles.productBtn}>
                  <Text style={styles.productBtnText}>查看详情</Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.productCard}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200' }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>运动鞋</Text>
                <Text style={styles.productPrice}>¥249.00</Text>
                <View style={styles.productBtn}>
                  <Text style={styles.productBtnText}>查看详情</Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.productCard}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200' }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>瑜伽课程/器材</Text>
                <Text style={styles.productPrice}>¥89.50</Text>
                <View style={styles.productBtn}>
                  <Text style={styles.productBtnText}>查看详情</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* 底部版权 */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>(c) 2025 体重健康管理</Text>
          <View style={styles.footerLinks}>
            <Text style={styles.footerLink}>隐私政策</Text>
            <Text style={styles.footerLink}>服务条款</Text>
          </View>
        </View>
      </ScrollView>

      {/* AI管家悬浮按钮 */}
      <TouchableOpacity style={styles.floatingAiBtn} onPress={() => setAiModalVisible(true)} activeOpacity={0.8}>
        <LinearGradient colors={['#26A69A', '#00897B']} style={styles.floatingAiGradient}>
          <FontAwesome6 name="robot" size={24} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>

      {/* AI管家Modal */}
      <Modal visible={aiModalVisible} animationType="slide" transparent={true} onRequestClose={() => setAiModalVisible(false)}>
        <KeyboardAvoidingView style={styles.aiModalContainer} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.aiModalContent}>
            {/* Modal头部 */}
            <View style={styles.aiModalHeader}>
              <View style={styles.aiHeaderLeft}>
                <View style={styles.aiAvatarSmall}>
                  <FontAwesome6 name="robot" size={18} color="#26A69A" />
                </View>
                <View>
                  <Text style={styles.aiHeaderTitle}>AI健康管家</Text>
                  <Text style={styles.aiHeaderSubtitle}>小轻·在线</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setAiModalVisible(false)}>
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>

            {/* 快捷问题 */}
            <View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickQuestionScroll}>
                {quickQuestions.map((q, i) => (
                  <TouchableOpacity key={i} style={styles.quickQuestionBtn} onPress={() => handleQuickQuestion(q)}>
                    <Text style={styles.quickQuestionText}>{q}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* 对话内容 */}
            <ScrollView ref={chatScrollRef} style={styles.chatContainer} showsVerticalScrollIndicator={false}>
              {chatMessages.map((msg) => (
                <View key={msg.id} style={[styles.chatBubbleWrapper, msg.isUser && styles.chatBubbleWrapperUser]}>
                  {!msg.isUser && (
                    <View style={styles.aiAvatarBubble}>
                      <FontAwesome6 name="robot" size={14} color="#26A69A" />
                    </View>
                  )}
                  <View style={[styles.chatBubble, msg.isUser ? styles.userBubble : styles.aiBubble]}>
                    <Text style={[styles.chatBubbleText, msg.isUser && styles.userBubbleText]}>{msg.text}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* 输入区域 */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="输入您的问题..."
                placeholderTextColor="#9CA3AF"
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={handleSendMessage}
                returnKeyType="send"
              />
              <TouchableOpacity style={styles.sendBtn} onPress={handleSendMessage}>
                <FontAwesome6 name="paper-plane" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  contentContainer: { paddingHorizontal: 16, paddingTop: 12 },
  headerSection: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 10, gap: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  searchInput: { flex: 1, fontSize: 14, color: '#1a1a2e' },
  headerBtn: { width: 38, height: 38, backgroundColor: '#FFFFFF', borderRadius: 19, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1, position: 'relative' },
  notifBadge: { position: 'absolute', top: 4, right: 4, backgroundColor: '#EF4444', borderRadius: 8, minWidth: 14, height: 14, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 3 },
  notifBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  navGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 12 },
  navItem: { width: '23%', alignItems: 'center', marginBottom: 12, backgroundColor: '#FFFFFF', borderRadius: 16, paddingVertical: 14, paddingHorizontal: 4, shadowColor: '#10B981', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 3, overflow: 'hidden' },
  navIconWrap: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 8, shadowColor: '#10B981', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 6, elevation: 4 },
  navText: { fontSize: 11, color: '#374151', fontWeight: '600', marginTop: 2 },
  welcomeBanner: { borderRadius: 16, padding: 16, marginBottom: 12 },
  welcomeTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  welcomeSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.9)' },
  calorieCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  foodCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginBottom: 12, shadowColor: '#26A69A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 4 },
  calorieTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  calorieTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a2e' },
  timeTabs: { flexDirection: 'row', gap: 4 },
  timeTab: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, backgroundColor: '#F3F4F6' },
  timeTabActive: { backgroundColor: '#E0F2F1' },
  timeTabText: { fontSize: 12, color: '#666' },
  timeTabTextActive: { color: '#26A69A', fontWeight: '600' },
  calorieContent: { flexDirection: 'row', alignItems: 'center' },
  gaugeContainer: { width: 120, height: 80, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  gaugeBackground: { width: 120, height: 60, borderTopLeftRadius: 60, borderTopRightRadius: 60, backgroundColor: '#F3F4F6', overflow: 'hidden', justifyContent: 'flex-end' },
  gaugeGradient: { height: '50%', backgroundColor: '#26A69A' },
  gaugeOverlay: { position: 'absolute', alignItems: 'center' },
  gaugeValue: { fontSize: 32, fontWeight: '800', color: '#1a1a2e' },
  gaugeLabel: { fontSize: 11, color: '#666' },
  calorieStats: { flex: 1 },
  calorieStat: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  calorieStatValue: { fontSize: 15, fontWeight: '700' },
  calorieStatLabel: { fontSize: 12, color: '#666' },
  mealCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  mealHeader: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  mealTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  mealTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a2e' },
  mealSubtitle: { fontSize: 11, color: '#9CA3AF' },
  addMealBtn: { marginLeft: 'auto', backgroundColor: '#E0F2F1', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  addMealBtnText: { fontSize: 11, color: '#26A69A', fontWeight: '600' },
  mealGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  mealItem: { flex: 1, marginHorizontal: 4, alignItems: 'center', paddingVertical: 14, borderRadius: 12 },
  mealName: { fontSize: 12, fontWeight: '600', color: '#333', marginTop: 6 },
  mealAdd: { fontSize: 18, color: '#999', marginTop: 4 },
  cameraBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#26A69A', paddingVertical: 10, borderRadius: 20, gap: 6 },
  cameraBtnText: { fontSize: 13, color: '#FFFFFF', fontWeight: '600' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a2e' },
  weightCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  weightContent: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  weightRing: { width: 80, height: 80, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  ringBackground: { width: 80, height: 80, borderRadius: 40, borderWidth: 8, borderColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  ringProgress: { width: 80, height: 80, borderRadius: 40, borderWidth: 8 },
  ringValue: { fontSize: 20, fontWeight: '800', color: '#26A69A' },
  weightStats: { flex: 1 },
  weightStat: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  weightStatLabel: { fontSize: 12, color: '#666' },
  weightStatValue: { fontSize: 14, fontWeight: '700', color: '#1a1a2e' },
  tipBox: { backgroundColor: '#E0F2F1', padding: 10, borderRadius: 10 },
  tipText: { fontSize: 12, color: '#26A69A' },
  section: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  cloverGrid: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 },
  cloverItem: { alignItems: 'center' },
  cloverRing: { width: 56, height: 56, borderRadius: 28, borderWidth: 5, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  cloverValue: { fontSize: 13, fontWeight: '700', color: '#1a1a2e' },
  cloverLabel: { fontSize: 12, color: '#666' },
  tipBoxGreen: { backgroundColor: '#E0F2F1', padding: 10, borderRadius: 10 },
  tipTextGreen: { fontSize: 12, color: '#26A69A', fontWeight: '600' },
  tipTextGreenSmall: { fontSize: 11, color: '#666', marginTop: 2 },
  exerciseCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  exerciseContent: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  exerciseRings: { width: 80, height: 80, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  exerciseRingOuter: { width: 80, height: 80, borderRadius: 40, borderWidth: 8, borderColor: '#26A69A', justifyContent: 'center', alignItems: 'center' },
  exerciseRingInner: { width: 56, height: 56, borderRadius: 28, borderWidth: 6, borderColor: '#FF9800', justifyContent: 'center', alignItems: 'center' },
  exerciseValue: { fontSize: 14, fontWeight: '700', color: '#1a1a2e' },
  exerciseStats: { flex: 1 },
  exerciseStat: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  exerciseDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  exerciseStatText: { flex: 1, fontSize: 12, color: '#666' },
  exerciseStatValue: { fontSize: 14, fontWeight: '700', color: '#1a1a2e' },
  exerciseTip: { backgroundColor: '#F9FAFB', padding: 10, borderRadius: 10 },
  exerciseTipText: { fontSize: 12, color: '#666' },
  miniCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  miniContent: { flexDirection: 'row', alignItems: 'center' },
  miniRing: { width: 56, height: 56, borderRadius: 28, borderWidth: 5, borderColor: '#26A69A', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  miniValue: { fontSize: 13, fontWeight: '700', color: '#1a1a2e' },
  miniStats: { flex: 1 },
  miniMainValue: { fontSize: 18, fontWeight: '700', color: '#1a1a2e', marginBottom: 2 },
  miniSubValue: { fontSize: 12, color: '#666', marginBottom: 2 },
  miniSmallValue: { fontSize: 11, color: '#26A69A' },
  periodCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#E0F2F1', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  periodValue: { fontSize: 20, fontWeight: '800', color: '#26A69A' },
  tagOrange: { backgroundColor: '#FFF3E0', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, alignSelf: 'flex-start' },
  tagOrangeText: { fontSize: 11, color: '#FF9800' },
  habitCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  habitStreak: { fontSize: 11, color: '#26A69A' },
  habitList: {},
  habitItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  habitName: { flex: 1, fontSize: 13, color: '#1a1a2e', marginLeft: 8 },
  habitStatus: { fontSize: 11, color: '#26A69A' },
  habitRecord: { fontSize: 11, color: '#9CA3AF' },
  feedList: {},
  feedItem: { flexDirection: 'row', paddingVertical: 10 },
  feedItemBorder: { borderTopWidth: 1, borderTopColor: '#F9FAFB' },
  feedAvatar: { width: 36, height: 36, borderRadius: 18 },
  feedContent: { flex: 1, marginLeft: 10 },
  feedHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  feedName: { fontSize: 13, fontWeight: '600', color: '#1a1a2e' },
  feedTime: { fontSize: 11, color: '#9CA3AF' },
  feedText: { fontSize: 12, color: '#666', lineHeight: 18, marginBottom: 6 },
  feedActions: { flexDirection: 'row', gap: 16 },
  feedAction: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  feedActionText: { fontSize: 11, color: '#666' },
  moreLink: { fontSize: 11, color: '#26A69A' },
  articleList: {},
  articleItem: { paddingVertical: 10 },
  articleItemBorder: { borderTopWidth: 1, borderTopColor: '#F9FAFB' },
  articleTag: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginBottom: 6 },
  articleTagText: { fontSize: 10, fontWeight: '600' },
  articleTitle: { fontSize: 13, color: '#1a1a2e', marginBottom: 4 },
  articleMeta: { fontSize: 11, color: '#9CA3AF' },
  productGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  productCard: { width: '31%', backgroundColor: '#FFFFFF', borderRadius: 12, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  productImage: { width: '100%', height: 70 },
  productInfo: { padding: 8 },
  productName: { fontSize: 11, fontWeight: '500', color: '#1a1a2e', marginBottom: 2 },
  productPrice: { fontSize: 12, fontWeight: '700', color: '#FF6B6B', marginBottom: 6 },
  productBtn: { backgroundColor: '#E0F2F1', paddingVertical: 4, borderRadius: 6, alignItems: 'center' },
  productBtnText: { fontSize: 10, color: '#26A69A' },
  footer: { alignItems: 'center', paddingVertical: 20, marginTop: 10 },
  footerText: { fontSize: 11, color: '#9CA3AF', marginBottom: 4 },
  footerLinks: { flexDirection: 'row', gap: 12 },
  footerLink: { fontSize: 11, color: '#26A69A' },
  // AI管家悬浮按钮
  floatingAiBtn: { position: 'absolute', bottom: 100, right: 20, width: 56, height: 56, borderRadius: 28, shadowColor: '#26A69A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  floatingAiGradient: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  // AI管家Modal
  aiModalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  aiModalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, height: '85%' },
  aiModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  aiHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  aiAvatarSmall: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E0F2F1', justifyContent: 'center', alignItems: 'center' },
  aiHeaderTitle: { fontSize: 17, fontWeight: '700', color: '#1a1a2e' },
  aiHeaderSubtitle: { fontSize: 12, color: '#26A69A' },
  quickQuestionScroll: { paddingHorizontal: 16, paddingVertical: 12, maxHeight: 50 },
  quickQuestionBtn: { backgroundColor: '#E0F2F1', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16, marginRight: 8 },
  quickQuestionText: { fontSize: 12, color: '#26A69A', fontWeight: '500' },
  chatContainer: { flex: 1, paddingHorizontal: 16, paddingVertical: 12 },
  chatBubbleWrapper: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 12 },
  chatBubbleWrapperUser: { flexDirection: 'row-reverse' },
  aiAvatarBubble: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#E0F2F1', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  chatBubble: { maxWidth: '75%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16 },
  aiBubble: { backgroundColor: '#F9FAFB', borderBottomLeftRadius: 4 },
  userBubble: { backgroundColor: '#26A69A', borderBottomRightRadius: 4 },
  chatBubbleText: { fontSize: 14, color: '#374151', lineHeight: 20 },
  userBubbleText: { color: '#FFFFFF' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#F3F4F6', gap: 10 },
  input: { flex: 1, backgroundColor: '#F3F4F6', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, color: '#1a1a2e' },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#26A69A', justifyContent: 'center', alignItems: 'center' },
});
