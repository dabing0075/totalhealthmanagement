import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  FlatList,
  Dimensions,
} from 'react-native';
import { Screen } from '@/components/Screen';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome6, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface Article {
  id: string;
  title: string;
  category: string;
  cover: string;
  views: number;
  likes: number;
  duration: string;
}

const CATEGORIES = [
  { key: 'all', label: '全部', icon: 'sparkles' },
  { key: 'nutrition', label: '营养饮食', icon: 'utensils' },
  { key: 'exercise', label: '运动健身', icon: 'dumbbell' },
  { key: 'sleep', label: '睡眠健康', icon: 'moon' },
  { key: 'mental', label: '心理健康', icon: 'brain' },
  { key: 'habit', label: '习惯养成', icon: 'calendar-check' },
];

const ARTICLES: Article[] = [
  {
    id: '1',
    title: '如何科学计算每日所需热量',
    category: 'nutrition',
    cover: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400',
    views: 12580,
    likes: 856,
    duration: '8分钟',
  },
  {
    id: '2',
    title: 'HIIT训练燃脂效果真的更好吗',
    category: 'exercise',
    cover: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    views: 8960,
    likes: 621,
    duration: '6分钟',
  },
  {
    id: '3',
    title: '睡眠质量自查：你的睡眠达标了吗',
    category: 'sleep',
    cover: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400',
    views: 15230,
    likes: 1102,
    duration: '10分钟',
  },
  {
    id: '4',
    title: '压力管理与情绪调节的10个技巧',
    category: 'mental',
    cover: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400',
    views: 21045,
    likes: 1567,
    duration: '12分钟',
  },
  {
    id: '5',
    title: '21天习惯养成计划的正确打开方式',
    category: 'habit',
    cover: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400',
    views: 9870,
    likes: 789,
    duration: '9分钟',
  },
  {
    id: '6',
    title: '蛋白质摄入指南：减脂期怎么吃',
    category: 'nutrition',
    cover: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400',
    views: 7890,
    likes: 543,
    duration: '7分钟',
  },
];

const FEATURED_ARTICLES = [
  {
    id: 'f1',
    title: '春季减肥计划：3个月科学减重15斤完整攻略',
    cover: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
    tag: '热门推荐',
    tagColor: '#FF9800',
  },
  {
    id: 'f2',
    title: '揭秘：为什么你总是减肥失败？心理学家告诉你真相',
    cover: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=800',
    tag: '深度好文',
    tagColor: '#26A69A',
  },
];

export default function KnowledgeScreen() {
  const insets = useSafeAreaInsets();
  const router = useSafeRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchText, setSearchText] = useState('');

  const filteredArticles =
    selectedCategory === 'all'
      ? ARTICLES
      : ARTICLES.filter((a) => a.category === selectedCategory);

  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万';
    }
    return num.toString();
  };

  return (
    <Screen>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* 搜索栏 */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="搜索健康知识"
              placeholderTextColor="#9CA3AF"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        {/* 知识Banner */}
        <View style={styles.bannerSection}>
          <View style={styles.bannerCard}>
            <LinearGradient
              colors={['#26A69A', '#00897B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.bannerGradient}
            >
              <View style={styles.bannerContent}>
                <MaterialCommunityIcons name="book-open-variant" size={32} color="#FFFFFF" />
                <View style={styles.bannerText}>
                  <Text style={styles.bannerTitle}>健康知识库</Text>
                  <Text style={styles.bannerSubtitle}>1000+ 篇专业健康文章</Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* 科学瘦身计算器入口 */}
        <TouchableOpacity style={styles.calculatorBanner} onPress={() => router.push('/diet-calculator')}>
          <LinearGradient
            colors={['#FF9800', '#FFB74D']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.calculatorGradient}
          >
            <View style={styles.calculatorContent}>
              <View style={styles.calculatorIcon}>
                <FontAwesome6 name="calculator" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.calculatorText}>
                <Text style={styles.calculatorTitle}>科学瘦身计算器</Text>
                <Text style={styles.calculatorSubtitle}>输入数据，获取个性化减脂方案</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* 分类导航 */}
        <View style={styles.categorySection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.key}
                style={[
                  styles.categoryItem,
                  selectedCategory === cat.key && styles.categoryItemActive,
                ]}
                onPress={() => setSelectedCategory(cat.key)}
              >
                <FontAwesome6
                  name={cat.icon as any}
                  size={18}
                  color={selectedCategory === cat.key ? '#FFFFFF' : '#6B7280'}
                />
                <Text
                  style={[
                    styles.categoryLabel,
                    selectedCategory === cat.key && styles.categoryLabelActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 精选文章 */}
        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>精选文章</Text>
          <FlatList
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            data={FEATURED_ARTICLES}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.featuredCard}>
                <Image source={{ uri: item.cover }} style={styles.featuredImage} />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.featuredOverlay}
                >
                  <View style={[styles.featuredTag, { backgroundColor: item.tagColor }]}>
                    <Text style={styles.featuredTagText}>{item.tag}</Text>
                  </View>
                  <Text style={styles.featuredTitle}>{item.title}</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.featuredList}
          />
        </View>

        {/* 文章列表 */}
        <View style={styles.articlesSection}>
          <View style={styles.articlesHeader}>
            <Text style={styles.sectionTitle}>热门文章</Text>
            <TouchableOpacity style={styles.moreBtn}>
              <Text style={styles.moreBtnText}>查看更多</Text>
              <Ionicons name="chevron-forward" size={16} color="#26A69A" />
            </TouchableOpacity>
          </View>

          {filteredArticles.map((article) => (
            <TouchableOpacity key={article.id} style={styles.articleCard}>
              <Image source={{ uri: article.cover }} style={styles.articleImage} />
              <View style={styles.articleInfo}>
                <View style={styles.articleCategory}>
                  <Text style={styles.articleCategoryText}>
                    {CATEGORIES.find((c) => c.key === article.category)?.label}
                  </Text>
                </View>
                <Text style={styles.articleTitle} numberOfLines={2}>
                  {article.title}
                </Text>
                <View style={styles.articleMeta}>
                  <View style={styles.articleMetaItem}>
                    <Ionicons name="eye-outline" size={14} color="#9CA3AF" />
                    <Text style={styles.articleMetaText}>{formatNumber(article.views)}</Text>
                  </View>
                  <View style={styles.articleMetaItem}>
                    <Ionicons name="heart-outline" size={14} color="#9CA3AF" />
                    <Text style={styles.articleMetaText}>{formatNumber(article.likes)}</Text>
                  </View>
                  <View style={styles.articleMetaItem}>
                    <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                    <Text style={styles.articleMetaText}>{article.duration}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
  searchSection: {
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1a1a2e',
  },
  bannerSection: {
    marginBottom: 20,
  },
  bannerCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#26A69A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  bannerGradient: {
    padding: 20,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
  },
  calculatorBanner: {
    marginBottom: 16,
  },
  calculatorGradient: {
    borderRadius: 16,
    padding: 16,
  },
  calculatorContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calculatorIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  calculatorText: {
    flex: 1,
  },
  calculatorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  calculatorSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryScroll: {
    paddingRight: 20,
    gap: 10,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  categoryItemActive: {
    backgroundColor: '#26A69A',
  },
  categoryLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  categoryLabelActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  featuredSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 12,
  },
  featuredList: {
    paddingRight: 20,
  },
  featuredCard: {
    width: SCREEN_WIDTH - 60,
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 16,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: 16,
  },
  featuredTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 8,
  },
  featuredTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 22,
  },
  articlesSection: {
    marginBottom: 20,
  },
  articlesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
  articleCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  articleImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
  },
  articleInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  articleCategory: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  articleCategoryText: {
    fontSize: 11,
    color: '#26A69A',
    fontWeight: '500',
  },
  articleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a2e',
    lineHeight: 20,
  },
  articleMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  articleMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  articleMetaText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
