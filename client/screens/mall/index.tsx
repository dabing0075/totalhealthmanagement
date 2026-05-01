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
import { Ionicons } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;

const CATEGORIES = [
  { key: 'all', label: '全部' },
  { key: 'food', label: '健康食品' },
  { key: 'equipment', label: '运动装备' },
  { key: 'supplement', label: '营养补剂' },
  { key: 'device', label: '健康监测' },
];

const PRODUCTS = [
  { id: '1', name: '有机奇亚籽代餐粉 低卡饱腹', price: 89, originalPrice: 129, image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=400', sales: 2580, rating: 4.9, badge: '热销' },
  { id: '2', name: '智能体脂秤 精准测量28项数据', price: 159, originalPrice: 299, image: 'https://images.unsplash.com/photo-1576675784432-0eb9e0e8a0d7?w=400', sales: 1860, rating: 4.8, badge: '爆款' },
  { id: '3', name: '乳清蛋白粉 增肌减脂必备', price: 268, originalPrice: 368, image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400', sales: 3250, rating: 4.9 },
  { id: '4', name: '运动瑜伽垫 加厚防滑静音', price: 79, originalPrice: 119, image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400', sales: 4200, rating: 4.7 },
  { id: '5', name: '智能手环 运动心率监测', price: 199, originalPrice: 299, image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400', sales: 1580, rating: 4.8, badge: '新品' },
  { id: '6', name: '天然椰子油 冷榨护肤食用', price: 68, originalPrice: 98, image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400', sales: 980, rating: 4.6 },
];

const BANNERS = [
  { id: '1', title: '健康生活节', subtitle: '全场低至5折起', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600' },
  { id: '2', title: '春季焕新', subtitle: '新品上市优惠多', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600' },
];

export default function MallScreen() {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = selectedCategory === 'all' 
    ? PRODUCTS 
    : PRODUCTS.slice(0, 3);

  const renderProduct = ({ item }: { item: typeof PRODUCTS[0] }) => (
    <TouchableOpacity style={styles.productCard}>
      <View style={styles.productImageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        {item.badge && (
          <View style={[styles.badge, item.badge === '新品' && styles.badgeNew]}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={12} color="#FF9800" />
          <Text style={styles.rating}>{item.rating}</Text>
          <Text style={styles.sales}>已售{item.sales}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.price}>¥{item.price}</Text>
          <Text style={styles.originalPrice}>¥{item.originalPrice}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <Screen>
      <View style={styles.container}>
        {/* 搜索栏 */}
        <View style={styles.header}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#9CA3AF" />
            <TextInput style={styles.searchInput} placeholder="搜索商品" placeholderTextColor="#9CA3AF" value={searchText} onChangeText={setSearchText} />
          </View>
          <TouchableOpacity style={styles.cartBtn}>
            <Ionicons name="cart" size={24} color="#1a1a2e" />
            <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>2</Text></View>
          </TouchableOpacity>
        </View>

        {/* 分类标签栏 - 固定 */}
        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity key={cat.key} style={[styles.categoryItem, selectedCategory === cat.key && styles.categoryItemActive]} onPress={() => setSelectedCategory(cat.key)}>
                <Text style={[styles.categoryLabel, selectedCategory === cat.key && styles.categoryLabelActive]}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 滚动内容区域 - Banner和商品 */}
        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContentContainer}>
          {/* Banner轮播 */}
          <View>
            <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bannerScroll}>
              {BANNERS.map((banner) => (
                <TouchableOpacity key={banner.id} style={styles.bannerCard}>
                  <Image source={{ uri: banner.image }} style={styles.bannerImage} />
                  <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.bannerOverlay}>
                    <Text style={styles.bannerTitle}>{banner.title}</Text>
                    <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* 商品网格 */}
          <View style={styles.productGrid}>
            {filteredProducts.map((item) => (
              <View key={item.id} style={styles.productWrapper}>
                {renderProduct({ item })}
              </View>
            ))}
          </View>

          <View style={styles.footer}><Text style={styles.footerText}>- 没有更多了 -</Text></View>
        </ScrollView>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10, gap: 10 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8, gap: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  searchInput: { flex: 1, fontSize: 14, color: '#1a1a2e' },
  cartBtn: { width: 40, height: 40, backgroundColor: '#FFFFFF', borderRadius: 20, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1, position: 'relative' },
  cartBadge: { position: 'absolute', top: 2, right: 2, backgroundColor: '#EF4444', borderRadius: 10, minWidth: 16, height: 16, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4 },
  cartBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  scrollContent: { flex: 1 },
  scrollContentContainer: { paddingBottom: 100 },
  categoryScroll: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  categoryItem: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16, backgroundColor: '#FFFFFF', marginRight: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  categoryItemActive: { backgroundColor: '#26A69A' },
  categoryLabel: { fontSize: 13, color: '#6B7280' },
  categoryLabelActive: { color: '#FFFFFF', fontWeight: '600' },
  bannerScroll: { paddingHorizontal: 16 },
  bannerCard: { width: SCREEN_WIDTH - 32, height: 140, borderRadius: 16, overflow: 'hidden', marginRight: 12 },
  bannerImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  bannerOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end', padding: 16 },
  bannerTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },
  bannerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginTop: 4 },
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, paddingTop: 16, justifyContent: 'space-between' },
  productWrapper: { width: '48%', marginBottom: 14 },
  productCard: { backgroundColor: '#FFFFFF', borderRadius: 14, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  productImageContainer: { position: 'relative' },
  productImage: { width: '100%', height: 140, resizeMode: 'cover' },
  badge: { position: 'absolute', top: 8, left: 8, backgroundColor: '#FF9800', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeNew: { backgroundColor: '#26A69A' },
  badgeText: { fontSize: 10, fontWeight: '600', color: '#FFFFFF' },
  productInfo: { padding: 12 },
  productName: { fontSize: 13, color: '#1a1a2e', lineHeight: 18, marginBottom: 8, height: 36 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  rating: { fontSize: 12, color: '#FF9800', fontWeight: '600', marginLeft: 2 },
  sales: { fontSize: 11, color: '#9CA3AF', marginLeft: 6 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline' },
  price: { fontSize: 16, fontWeight: '700', color: '#EF4444' },
  originalPrice: { fontSize: 12, color: '#9CA3AF', marginLeft: 4, textDecorationLine: 'line-through' },
  footer: { alignItems: 'center', paddingVertical: 30 },
  footerText: { fontSize: 12, color: '#9CA3AF' },
});
