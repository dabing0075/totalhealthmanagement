import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  TextInput,
} from 'react-native';
import { Screen } from '@/components/Screen';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TABS = [
  { key: 'follow', label: '关注' },
  { key: 'recommend', label: '推荐' },
  { key: 'topic', label: '话题' },
];

interface Post {
  id: string;
  user: {
    name: string;
    avatar: string;
    badge?: string;
  };
  content: string;
  images: string[];
  likes: number;
  comments: number;
  time: string;
  isLiked: boolean;
}

const POSTS: Post[] = [
  {
    id: '1',
    user: {
      name: '健康达人小王',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      badge: '营养师',
    },
    content: '分享我的健康早餐搭配：全麦面包+牛油果+鸡蛋+一杯无糖豆浆，科学配比，营养均衡，开启元气满满的一天！',
    images: [
      'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400',
    ],
    likes: 234,
    comments: 45,
    time: '2小时前',
    isLiked: false,
  },
  {
    id: '2',
    user: {
      name: '跑步爱好者',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    },
    content: '今天完成了5公里慢跑，配速比上周提升了30秒！坚持就是胜利，给自己加油！',
    images: [
      'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400',
    ],
    likes: 156,
    comments: 28,
    time: '4小时前',
    isLiked: true,
  },
  {
    id: '3',
    user: {
      name: '减脂日记',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      badge: '减重达人',
    },
    content: '打卡第30天！从78kg到72kg，阶段性胜利！分享一下我的饮食心得：少油少盐，多吃蔬菜水果，配合适量运动效果真的很明显。',
    images: [
      'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    ],
    likes: 568,
    comments: 89,
    time: '6小时前',
    isLiked: false,
  },
];

const TOPICS = [
  { id: '1', name: '#21天减肥挑战#', count: '2.3万' },
  { id: '2', name: '#健康食谱分享#', count: '1.8万' },
  { id: '3', name: '#每日运动打卡#', count: '1.5万' },
  { id: '4', name: '#睡眠质量改善#', count: '9800' },
];

export default function CommunityScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('recommend');
  const [posts, setPosts] = useState<Post[]>(POSTS);

  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.userName}>{item.user.name}</Text>
            {item.user.badge && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.user.badge}</Text>
              </View>
            )}
          </View>
          <Text style={styles.postTime}>{item.time}</Text>
        </View>
        <TouchableOpacity style={styles.followBtn}>
          <Text style={styles.followBtnText}>+ 关注</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.postContent}>{item.content}</Text>

      {item.images.length > 0 && (
        <View style={[styles.imagesGrid, item.images.length === 1 && styles.singleImage]}>
          {item.images.map((img, index) => (
            <Image
              key={index}
              source={{ uri: img }}
              style={[
                styles.postImage,
                item.images.length === 1 && styles.postImageSingle,
              ]}
            />
          ))}
        </View>
      )}

      <View style={styles.postActions}>
        <TouchableOpacity
          style={styles.actionItem}
          onPress={() => handleLike(item.id)}
        >
          <Ionicons
            name={item.isLiked ? 'heart' : 'heart-outline'}
            size={22}
            color={item.isLiked ? '#EF4444' : '#9CA3AF'}
          />
          <Text style={[styles.actionText, item.isLiked && { color: '#EF4444' }]}>
            {item.likes}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionItem}>
          <Ionicons name="chatbubble-outline" size={20} color="#9CA3AF" />
          <Text style={styles.actionText}>{item.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionItem}>
          <Ionicons name="share-outline" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Screen>
      <View style={styles.container}>
        {/* 顶部搜索栏 */}
        <View style={styles.header}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="搜索用户、话题"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <TouchableOpacity style={styles.publishBtn}>
            <FontAwesome6 name="pencil" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* 标签栏 */}
        <View style={styles.tabBar}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text
                style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 内容区 */}
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderPost}
          contentContainerStyle={[styles.listContent, { paddingBottom: 100 }]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            activeTab === 'topic' ? (
              <View style={styles.topicsSection}>
                <Text style={styles.topicsTitle}>热门话题</Text>
                <View style={styles.topicsGrid}>
                  {TOPICS.map((topic) => (
                    <TouchableOpacity key={topic.id} style={styles.topicItem}>
                      <Text style={styles.topicName}>{topic.name}</Text>
                      <Text style={styles.topicCount}>{topic.count}人参与</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ) : null
          }
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 12,
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
    fontSize: 14,
    color: '#1a1a2e',
  },
  publishBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#26A69A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#26A69A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 16,
  },
  tabActive: {
    backgroundColor: '#26A69A',
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 20,
  },
  topicsSection: {
    marginBottom: 16,
  },
  topicsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 12,
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  topicItem: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  topicName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  topicCount: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  badge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    color: '#FF9800',
    fontWeight: '500',
  },
  postTime: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  followBtn: {
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  followBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#26A69A',
  },
  postContent: {
    fontSize: 14,
    color: '#1a1a2e',
    lineHeight: 22,
    marginBottom: 12,
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 12,
  },
  singleImage: {
    flex: 1,
  },
  postImage: {
    width: '32%',
    aspectRatio: 1,
    borderRadius: 8,
  },
  postImageSingle: {
    width: '100%',
    height: 180,
    aspectRatio: undefined,
  },
  postActions: {
    flexDirection: 'row',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: 24,
  },
  actionText: {
    fontSize: 13,
    color: '#9CA3AF',
    marginLeft: 4,
  },
});
