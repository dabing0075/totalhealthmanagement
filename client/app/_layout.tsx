import { Stack } from 'expo-router';
import { LogBox } from 'react-native';
import Toast from 'react-native-toast-message';
import { Provider } from '@/components/Provider';
import { AuthProvider } from '@/contexts/AuthContext';

import '../global.css';

LogBox.ignoreLogs([
  "TurboModuleRegistry.getEnforcing(...): 'RNMapsAirModule' could not be found",
]);

export default function RootLayout() {
  return (
    <AuthProvider>
      <Provider>
        <Stack
          screenOptions={{
            animation: 'slide_from_right',
            gestureEnabled: true,
            gestureDirection: 'horizontal',
            headerShown: false
          }}
        >
          <Stack.Screen name="(tabs)" options={{ title: "" }} />
          <Stack.Screen 
            name="exercise" 
            options={{ 
              title: "运动",
              headerShown: true,
              headerTitle: '',
              headerTransparent: true,
              headerBackTitle: '返回',
              headerTintColor: '#1a1a2e',
              headerTitleAlign: 'center',
            }} 
          />
          <Stack.Screen 
            name="sleep" 
            options={{ 
              title: "睡眠",
              headerShown: true,
              headerTitle: '',
              headerTransparent: true,
              headerBackTitle: '返回',
              headerTintColor: '#1a1a2e',
            }} 
          />
          <Stack.Screen 
            name="emotion" 
            options={{ 
              title: "情绪",
              headerShown: true,
              headerTitle: '',
              headerTransparent: true,
              headerBackTitle: '返回',
              headerTintColor: '#1a1a2e',
            }} 
          />
          <Stack.Screen name="member" options={{ title: "会员" }} />
          <Stack.Screen 
            name="vip" 
            options={{ 
              title: "会员服务",
              headerShown: true,
              headerTitle: '',
              headerTransparent: true,
              headerBackTitle: '返回',
              headerTintColor: '#1a1a2e',
            }} 
          />
          <Stack.Screen 
            name="habit" 
            options={{ 
              title: "习惯",
              headerShown: true,
              headerTitle: '',
              headerTransparent: true,
              headerBackTitle: '返回',
              headerTintColor: '#1a1a2e',
            }} 
          />
          <Stack.Screen 
            name="profile" 
            options={{ 
              title: "个人资料",
              headerShown: true,
              headerTitle: '',
              headerTransparent: true,
              headerBackTitle: '返回',
              headerTintColor: '#1a1a2e',
            }} 
          />
          <Stack.Screen 
            name="edit-profile" 
            options={{ 
              title: "编辑资料",
              headerShown: true,
              headerTitle: '',
              headerTransparent: true,
              headerBackTitle: '返回',
              headerTintColor: '#1a1a2e',
            }} 
          />
          <Stack.Screen 
            name="body-data" 
            options={{ 
              title: "身体数据",
              headerShown: true,
              headerTitle: '',
              headerTransparent: true,
              headerBackTitle: '返回',
              headerTintColor: '#1a1a2e',
            }} 
          />
          <Stack.Screen 
            name="diet-calculator" 
            options={{ 
              title: "科学瘦身计算器",
              headerShown: true,
              headerTitle: '',
              headerTransparent: true,
              headerBackTitle: '返回',
              headerTintColor: '#1a1a2e',
            }} 
          />
          <Stack.Screen 
            name="login" 
            options={{ 
              title: "登录",
              headerShown: false,
            }} 
          />
          <Stack.Screen 
            name="dashboard" 
            options={{ 
              title: "数据看板",
              headerShown: true,
              headerTitle: '',
              headerTransparent: true,
              headerBackTitle: '返回',
              headerTintColor: '#1a1a2e',
            }} 
          />
          <Stack.Screen 
            name="food-analysis" 
            options={{ 
              title: "食物分析",
              headerShown: true,
              headerTitle: '',
              headerTransparent: true,
              headerBackTitle: '返回',
              headerTintColor: '#1a1a2e',
            }} 
          />
        </Stack>
        <Toast />
      </Provider>
    </AuthProvider>
  );
}
