import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Dimensions,
} from 'react-native';
import { Screen } from '@/components/Screen';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useSafeRouter } from '@/hooks/useSafeRouter';

// 获取屏幕宽度用于适配
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 根据屏幕宽度计算合适的尺寸
const getAdaptiveSize = (baseSize: number) => {
  if (SCREEN_WIDTH < 375) {
    return Math.round(baseSize * 0.8);
  } else if (SCREEN_WIDTH < 414) {
    return baseSize;
  } else {
    return Math.round(baseSize * 1.05);
  }
};

// 预计算适配后的尺寸
const ADAPTED = {
  // 快捷操作
  quickActionIconSize: getAdaptiveSize(20),
  quickActionContainerSize: getAdaptiveSize(38),
  // 健康模块
  moduleIconSize: getAdaptiveSize(22),
  moduleIconContainerSize: getAdaptiveSize(44),
  // 头部按钮
  headerBtnSize: getAdaptiveSize(40),
  // 四叶草
  cloverLeafIconSize: getAdaptiveSize(14),
  cloverLeafIconContainerSize: getAdaptiveSize(32),
};

export default function HomeScreen() {
  const router = useSafeRouter();
  const [searchText, setSearchText] = useState('');

  // 健康模块入口
  const healthModules = [
    { id: 'dashboard', name: '推荐', icon: 'house', iconColor: '#26A69A', bgColor: '#E0F2F1' },
    { id: 'data', name: '数据看板', icon: 'chart-bar', iconColor: '#2196F3', bgColor: '#E3F2FD' },
    { id: 'food', name: '食物分析', icon: 'camera', iconColor: '#FF9800', bgColor: '#FFF3E0' },
    { id: 'exercise', name: '运动', icon: 'person-running', iconColor: '#FF6B6B', bgColor: '#FFEBEE' },
    { id: 'sleep', name: '睡眠', icon: 'moon', iconColor: '#9C27B0', bgColor: '#F3E5F5' },
    { id: 'emotion', name: '情绪', icon: 'face-smile', iconColor: '#FF9800', bgColor: '#FFF3E0' },
    { id: 'habit', name: '习惯', icon: 'leaf', iconColor: '#26A69A', bgColor: '#E0F2F1' },
    { id: 'member', name: '会员', icon: 'crown', iconColor: '#FFD700', bgColor: '#FFF8E1' },
  ];

  // 快捷操作
  const quickActions = [
    { icon: 'camera', label: '拍照识食', color: '#FF9800', bg: '#FFF3E0' },
    { icon: 'weight-scale', label: '记录体重', color: '#26A69A', bg: '#E0F2F1' },
    { icon: 'person-walking', label: '运动打卡', color: '#2196F3', bg: '#E3F2FD' },
    { icon: 'face-smile', label: '情绪记录', color: '#FF9800', bg: '#FFF3E0' },
    { icon: 'leaf', label: '习惯打卡', color: '#26A69A', bg: '#E0F2F1' },
  ];

  const handleModulePress = (moduleId: string) => {
    const routes: Record<string, string> = {
      dashboard: '/', 
      data: '/dashboard', 
      food: '/food-analysis',
      exercise: '/exercise', 
      sleep: '/sleep', 
      emotion: '/emotion', 
      habit: '/habit', 
      member: '/vip',
    };
    if (routes[moduleId]) {
      if (moduleId === 'dashboard') {
        router.replace(routes[moduleId]);
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
            <TextInput style={styles.searchInput} placeholder="搜索健康知识" placeholderTextColor="#9CA3AF" value={searchText} onChangeText={setSearchText} />
          </View>
          <TouchableOpacity style={[styles.headerBtn, { width: ADAPTED.headerBtnSize, height: ADAPTED.headerBtnSize }]}>
            <FontAwesome6 name="clock-rotate-left" size={16} color="#26A69A" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.headerBtn, { width: ADAPTED.headerBtnSize, height: ADAPTED.headerBtnSize }]}>
            <Ionicons name="notifications-outline" size={20} color="#1a1a2e" />
            <View style={styles.notifBadge}><Text style={styles.notifBadgeText}>3</Text></View>
          </TouchableOpacity>
        </View>

        {/* 健康管理子导航 - 紧贴搜索栏 */}
        <View style={styles.subNavSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.subNavContent}
          >
            {healthModules.map((module) => (
              <TouchableOpacity
                key={module.id}
                style={styles.subNavItem}
                onPress={() => handleModulePress(module.id)}
              >
                <View style={[styles.subNavIcon, { backgroundColor: module.bgColor }]}>
                  <FontAwesome6 name={module.icon as any} size={14} color={module.iconColor} />
                </View>
                <Text style={styles.subNavText}>{module.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 欢迎横幅 */}
        <LinearGradient colors={['#26A69A', '#00897B']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.welcomeBanner}>
          <View style={styles.welcomeRow}>
            <View>
              <Text style={styles.welcomeTitle}>欢迎回来，健康生活</Text>
              <Text style={styles.welcomeSubtitle}>今日已打卡，连续28天坚持</Text>
            </View>
            <View style={styles.streakBadge}>
              <FontAwesome6 name="fire" size={16} color="#FF9800" />
              <Text style={styles.streakNumber}>28</Text>
            </View>
          </View>
          <View style={styles.todayStats}>
            <View style={styles.statItem}><Text style={styles.statValue}>68.5</Text><Text style={styles.statLabel}>kg</Text></View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}><Text style={styles.statValue}>1560</Text><Text style={styles.statLabel}>kcal</Text></View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}><Text style={styles.statValue}>8500</Text><Text style={styles.statLabel}>步</Text></View>
          </View>
        </LinearGradient>

        {/* 快捷操作 */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>快捷操作</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity key={index} style={styles.quickActionCard}>
                <View style={[styles.quickActionIcon, { backgroundColor: action.bg, width: ADAPTED.quickActionContainerSize, height: ADAPTED.quickActionContainerSize, borderRadius: ADAPTED.quickActionContainerSize / 2 }]}>
                  <FontAwesome6 name={action.icon as any} size={ADAPTED.quickActionIconSize} color={action.color} />
                </View>
                <Text style={styles.quickActionTitle} numberOfLines={1}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 靓健四叶草 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>靓健四叶草</Text>
            <TouchableOpacity><Text style={styles.moreText}>详情</Text></TouchableOpacity>
          </View>
          <View style={styles.cloverContainer}>
            <View style={styles.cloverCenter}>
              <Text style={styles.cloverCenterValue}>76</Text>
              <Text style={styles.cloverCenterLabel}>综合</Text>
            </View>
            {[
              { pos: styles.cloverTL, bg: '#FFF3E0', icon: 'utensils', color: '#FF9800', label: '饮食', value: 75 },
              { pos: styles.cloverTR, bg: '#F3E5F5', icon: 'moon', color: '#9C27B0', label: '睡眠', value: 88 },
              { pos: styles.cloverBL, bg: '#E0F2F1', icon: 'person-running', color: '#26A69A', label: '运动', value: 60 },
              { pos: styles.cloverBR, bg: '#E3F2FD', icon: 'brain', color: '#2196F3', label: '心态', value: 82 },
            ].map((item, i) => (
              <View key={i} style={[styles.cloverLeaf, item.pos]}>
                <View style={[styles.cloverCard, { backgroundColor: item.bg }]}>
                  <View style={[styles.cloverIcon, { backgroundColor: item.color, width: ADAPTED.cloverLeafIconContainerSize, height: ADAPTED.cloverLeafIconContainerSize, borderRadius: ADAPTED.cloverLeafIconContainerSize / 2 }]}>
                    <FontAwesome6 name={item.icon as any} size={ADAPTED.cloverLeafIconSize} color="#FFFFFF" />
                  </View>
                  <Text style={[styles.cloverLabel, { color: item.color }]}>{item.label}</Text>
                  <View style={styles.cloverProgress}><View style={[styles.cloverProgressFill, { width: `${item.value}%`, backgroundColor: item.color }]} /></View>
                  <Text style={styles.cloverValue}>{item.value}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 健康提示 */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Ionicons name="bulb" size={18} color="#FF9800" />
            <Text style={styles.tipsTitle}>今日建议</Text>
          </View>
          <Text style={styles.tipsContent}>您的午餐热量摄入略高，建议晚餐减少主食份量，增加蔬菜和蛋白质摄入。</Text>
        </View>

        {/* 靓健圈 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>靓健圈</Text>
            <TouchableOpacity><Text style={styles.moreText}>更多</Text></TouchableOpacity>
          </View>
          <View style={styles.feedCard}>
            {[
              { id: '1', name: '健康达人小王', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', content: '完成了今日的5公里跑步', type: '运动', time: '刚刚' },
              { id: '2', name: '减脂日记', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', content: '午餐吃得很有营养', type: '饮食', time: '10分钟前' },
            ].map((feed, index) => (
              <View key={feed.id} style={[styles.feedItem, index === 0 && styles.feedItemBorder]}>
                <Image source={{ uri: feed.avatar }} style={styles.feedAvatar} />
                <View style={styles.feedContent}>
                  <View style={styles.feedHeader}>
                    <Text style={styles.feedUserName}>{feed.name}</Text>
                    <View style={[styles.feedTypeBadge, { backgroundColor: '#E0F2F1' }]}><Text style={[styles.feedTypeText, { color: '#26A69A' }]}>{feed.type}</Text></View>
                  </View>
                  <Text style={styles.feedText}>{feed.content}</Text>
                  <Text style={styles.feedTime}>{feed.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 商城精选 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>商城精选</Text>
            <TouchableOpacity><Text style={styles.moreText}>更多</Text></TouchableOpacity>
          </View>
          <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productScroll}>
            {[
              { id: '1', name: '智能体脂秤', price: '¥199', cover: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=200', tag: '爆款' },
              { id: '2', name: '运动手环', price: '¥149', cover: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=200', tag: '热卖' },
              { id: '3', name: '瑜伽垫套装', price: '¥89', cover: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200', tag: '新品' },
            ].map((product) => (
              <TouchableOpacity key={product.id} style={styles.productCard}>
                <View style={styles.productImageWrap}>
                  <Image source={{ uri: product.cover }} style={styles.productImage} />
                  <View style={styles.productTag}><Text style={styles.productTagText}>{product.tag}</Text></View>
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
                  <Text style={styles.productPrice}>{product.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
            </ScrollView>
          </View>
        </View>

        {/* 知识库 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}><Ionicons name="book" size={16} color="#26A69A" /><Text style={styles.sectionTitle}>知识库更新</Text></View>
            <TouchableOpacity onPress={() => router.push('/knowledge')}><Text style={styles.moreText}>更多</Text></TouchableOpacity>
          </View>
          <View style={styles.knowledgeCard}>
            {[
              { id: '1', title: '如何科学减脂：专家推荐的饮食方案', category: '减脂指南', categoryColor: '#FF6B6B', cover: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=200', views: '2.3万', time: '2小时前' },
              { id: '2', title: '睡眠质量提升的10个技巧', category: '睡眠健康', categoryColor: '#9C27B0', cover: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=200', views: '1.5万', time: '5小时前' },
            ].map((article, index) => (
              <TouchableOpacity key={article.id} style={[styles.articleItem, index === 0 && styles.articleItemBorder]} onPress={() => router.push('/knowledge')}>
                <Image source={{ uri: article.cover }} style={styles.articleCover} />
                <View style={styles.articleInfo}>
                  <View style={[styles.articleCategory, { backgroundColor: article.categoryColor + '15' }]}><Text style={[styles.articleCategoryText, { color: article.categoryColor }]}>{article.category}</Text></View>
                  <Text style={styles.articleTitle} numberOfLines={2}>{article.title}</Text>
                  <View style={styles.articleMeta}>
                    <Text style={styles.articleMetaText}>{article.views}</Text>
                    <Text style={styles.articleMetaText}>{article.time}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.footer}><Text style={styles.footerText}>靓健生活 健康相伴</Text></View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  contentContainer: { paddingHorizontal: 16, paddingTop: 12 },
  headerSection: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 10, gap: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  searchInput: { flex: 1, fontSize: 14, color: '#1a1a2e' },
  headerBtn: { backgroundColor: '#FFFFFF', borderRadius: 20, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1, position: 'relative' },
  notifBadge: { position: 'absolute', top: 4, right: 4, backgroundColor: '#EF4444', borderRadius: 8, minWidth: 14, height: 14, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 3 },
  notifBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  welcomeBanner: { borderRadius: 16, padding: 16, marginBottom: 16 },
  welcomeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  welcomeTitle: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 2 },
  welcomeSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.85)' },
  streakBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 4 },
  streakNumber: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
  todayStats: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: 12 },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.3)' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a2e', marginBottom: 10 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  moreText: { fontSize: 12, color: '#26A69A' },
  quickActionsSection: { marginBottom: 16 },
  quickActionsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  quickActionCard: { alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 8, width: '18%', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  quickActionIcon: { justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  quickActionTitle: { fontSize: 10, fontWeight: '600', color: '#1a1a2e', textAlign: 'center' },
  subNavSection: { marginBottom: 12 },
  subNavContent: { paddingRight: 16, gap: 8 },
  subNavItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#FFFFFF', borderRadius: 16, shadowColor: '#26A69A', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 1, gap: 6, borderWidth: 1, borderColor: '#E0F2F1' },
  subNavIcon: { width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center' },
  subNavText: { fontSize: 13, fontWeight: '500', color: '#374151' },
  section: { marginBottom: 16 },
  cloverContainer: { height: 200, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, position: 'relative', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  cloverCenter: { position: 'absolute', width: 60, height: 60, borderRadius: 30, backgroundColor: '#26A69A', justifyContent: 'center', alignItems: 'center', zIndex: 10, shadowColor: '#26A69A', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 4 },
  cloverCenterValue: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  cloverCenterLabel: { fontSize: 9, color: 'rgba(255,255,255,0.8)' },
  cloverLeaf: { position: 'absolute', width: 85 },
  cloverTL: { top: 16, left: 12 },
  cloverTR: { top: 16, right: 12 },
  cloverBL: { bottom: 16, left: 12 },
  cloverBR: { bottom: 16, right: 12 },
  cloverCard: { borderRadius: 12, padding: 8, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  cloverIcon: { justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  cloverLabel: { fontSize: 10, fontWeight: '600', marginBottom: 2 },
  cloverProgress: { width: '100%', height: 3, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 2, marginBottom: 2 },
  cloverProgressFill: { height: '100%', borderRadius: 2 },
  cloverValue: { fontSize: 14, fontWeight: '700', color: '#1a1a2e' },
  tipsCard: { backgroundColor: '#FFF3E0', borderRadius: 12, padding: 12, marginBottom: 16 },
  tipsHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  tipsTitle: { fontSize: 13, fontWeight: '700', color: '#FF9800' },
  tipsContent: { fontSize: 12, color: '#1a1a2e', lineHeight: 18 },
  feedCard: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  feedItem: { flexDirection: 'row', paddingVertical: 10 },
  feedItemBorder: { borderBottomWidth: 1, borderBottomColor: '#F9FAFB' },
  feedAvatar: { width: 36, height: 36, borderRadius: 18 },
  feedContent: { flex: 1, marginLeft: 10 },
  feedHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  feedUserName: { fontSize: 13, fontWeight: '600', color: '#1a1a2e' },
  feedTypeBadge: { paddingHorizontal: 5, paddingVertical: 1, borderRadius: 4 },
  feedTypeText: { fontSize: 9, fontWeight: '500' },
  feedText: { fontSize: 12, color: '#6B7280', lineHeight: 16, marginBottom: 2 },
  feedTime: { fontSize: 10, color: '#9CA3AF' },
  productScroll: { paddingRight: 16, gap: 12 },
  productCard: { width: 120, backgroundColor: '#FFFFFF', borderRadius: 12, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  productImageWrap: { position: 'relative' },
  productImage: { width: '100%', height: 90 },
  productTag: { position: 'absolute', top: 6, left: 6, backgroundColor: '#FF6B6B', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  productTagText: { fontSize: 9, fontWeight: '600', color: '#FFFFFF' },
  productInfo: { padding: 10 },
  productName: { fontSize: 12, fontWeight: '600', color: '#1a1a2e', marginBottom: 4 },
  productPrice: { fontSize: 14, fontWeight: '700', color: '#FF6B6B' },
  knowledgeCard: { backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  articleItem: { flexDirection: 'row', padding: 12 },
  articleItemBorder: { borderBottomWidth: 1, borderBottomColor: '#F9FAFB' },
  articleCover: { width: 70, height: 70, borderRadius: 10, marginRight: 12, backgroundColor: '#F3F4F6' },
  articleInfo: { flex: 1, justifyContent: 'space-between' },
  articleCategory: { alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginBottom: 4 },
  articleCategoryText: { fontSize: 10, fontWeight: '600' },
  articleTitle: { fontSize: 13, fontWeight: '600', color: '#1a1a2e', lineHeight: 18, marginBottom: 4 },
  articleMeta: { flexDirection: 'row', gap: 10 },
  articleMetaText: { fontSize: 11, color: '#9CA3AF' },
  footer: { alignItems: 'center', paddingVertical: 24 },
  footerText: { fontSize: 12, color: '#9CA3AF' },
});
