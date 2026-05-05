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
          <Stack.Screen name="exercise" options={{ headerShown: false }} />
          <Stack.Screen name="sleep" options={{ headerShown: false }} />
          <Stack.Screen name="emotion" options={{ headerShown: false }} />
          <Stack.Screen name="member" options={{ headerShown: false }} />
          <Stack.Screen name="vip" options={{ headerShown: false }} />
          <Stack.Screen name="habit" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
          <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
          <Stack.Screen name="body-data" options={{ headerShown: false }} />
          <Stack.Screen name="diet-calculator" options={{ headerShown: false }} />
          <Stack.Screen name="female" options={{ headerShown: false }} />
          <Stack.Screen 
            name="login" 
            options={{ 
              title: "登录",
              headerShown: false,
            }} 
          />
          <Stack.Screen name="dashboard" options={{ headerShown: false }} />
          <Stack.Screen name="food-analysis" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        </Stack>
        <Toast />
      </Provider>
    </AuthProvider>
  );
}
