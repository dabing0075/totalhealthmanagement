import { Tabs } from 'expo-router';
import { Platform, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome6, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useCSSVariable } from 'uniwind';

// 获取屏幕宽度用于适配
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 根据屏幕宽度计算图标大小
const getTabIconSize = () => {
  if (SCREEN_WIDTH < 375) {
    // 小屏幕手机 (iPhone SE)
    return 22;
  } else if (SCREEN_WIDTH < 414) {
    // 标准手机 (iPhone X/11/12/13)
    return 24;
  } else {
    // 大屏手机 (iPhone Plus/Max)
    return 26;
  }
};

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const [background, muted, accent, border] = useCSSVariable([
    '--color-background',
    '--color-muted',
    '--color-accent',
    '--color-border',
  ]) as string[];

  const iconSize = getTabIconSize();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: background,
          borderTopWidth: 1,
          borderTopColor: border,
          height: Platform.OS === 'web' ? 60 : 56 + insets.bottom,
          paddingTop: 6,
          paddingBottom: Platform.OS === 'web' ? 6 : insets.bottom > 0 ? insets.bottom : 6,
        },
        tabBarActiveTintColor: accent,
        tabBarInactiveTintColor: muted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '首页',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="house" size={iconSize} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="knowledge"
        options={{
          title: '知识',
          tabBarIcon: ({ color }) => (
            <Ionicons name="book-outline" size={iconSize} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: '社区',
          tabBarIcon: ({ color }) => (
            <Ionicons name="people" size={iconSize} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mall"
        options={{
          title: '商城',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="bag-shopping" size={iconSize - 2} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="member"
        options={{
          title: '我的',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="user" size={iconSize} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
