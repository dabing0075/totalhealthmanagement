import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Screen } from '@/components/Screen';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome6 } from '@expo/vector-icons';
import { useSafeRouter } from '@/hooks/useSafeRouter';

const EXPO_PUBLIC_BACKEND_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_BASE_URL || 'http://localhost:9091';

interface LoginResponse {
  success: boolean;
  token?: string;
  user?: {
    id: number;
    phone: string;
    nickname: string;
    avatar: string;
    gender: string;
    birthday: string;
    height: number;
    weight: number;
    signature: string;
    vipLevel: number;
    vipExpireDate: string;
    points: number;
  };
  error?: string;
  devCode?: string;
}

export default function LoginScreen() {
  const router = useSafeRouter();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [devCode, setDevCode] = useState<string | null>(null);
  const [showDevHint, setShowDevHint] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // 倒计时
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // 发送验证码
  const handleSendCode = async () => {
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      Alert.alert('错误', '请输入正确的手机号');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/auth/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data: LoginResponse = await response.json();

      if (data.success) {
        setCountdown(60);
        // 开发环境显示验证码
        if (data.devCode) {
          setDevCode(data.devCode);
          setShowDevHint(true);
          setTimeout(() => setShowDevHint(false), 10000);
        }
        Alert.alert('发送成功', '验证码已发送，请查收');
      } else {
        Alert.alert('发送失败', data.error || '验证码发送失败');
      }
    } catch (error) {
      Alert.alert('发送失败', '网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 登录
  const handleLogin = async () => {
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      Alert.alert('错误', '请输入正确的手机号');
      return;
    }

    if (!code || code.length !== 6) {
      Alert.alert('错误', '请输入6位验证码');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code }),
      });

      const data: LoginResponse = await response.json();

      if (data.success && data.token && data.user) {
        // 保存登录信息
        await saveLoginData(data.token, data.user);
        // 跳转回上一页或首页
        router.back();
      } else {
        Alert.alert('登录失败', data.error || '验证码错误');
      }
    } catch (error) {
      Alert.alert('登录失败', '网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 保存登录数据
  const saveLoginData = async (token: string, user: LoginResponse['user']) => {
    try {
      await AsyncStorage.setItem('auth_token', token);
      await AsyncStorage.setItem('user_data', JSON.stringify(user));
    } catch (error) {
      console.error('保存登录数据失败:', error);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          {/* 背景渐变 */}
          <LinearGradient
            colors={['#26A69A', '#00897B', '#00796B']}
            style={styles.headerGradient}
          >
            <TouchableOpacity 
              style={styles.backBtn} 
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <View style={styles.headerContent}>
              <FontAwesome6 name="user" size={64} color="#FFFFFF" />
              <Text style={styles.headerTitle}>手机号登录</Text>
              <Text style={styles.headerSubtitle}>未注册的手机号将自动创建账号</Text>
            </View>
          </LinearGradient>

          {/* 表单 */}
          <Animated.View 
            style={[
              styles.formContainer,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            {/* 手机号 */}
            <View style={styles.inputContainer}>
              <View style={styles.phonePrefix}>
                <Text style={styles.prefixText}>+86</Text>
              </View>
              <TextInput
                style={styles.phoneInput}
                placeholder="请输入手机号"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                maxLength={11}
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            {/* 验证码 */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.codeInput}
                placeholder="请输入验证码"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                maxLength={6}
                value={code}
                onChangeText={setCode}
              />
              <TouchableOpacity
                style={[styles.sendCodeBtn, countdown > 0 && styles.sendCodeBtnDisabled]}
                onPress={handleSendCode}
                disabled={countdown > 0 || loading}
              >
                <Text style={[styles.sendCodeText, countdown > 0 && styles.sendCodeTextDisabled]}>
                  {countdown > 0 ? `${countdown}s` : '获取验证码'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* 开发环境验证码提示 */}
            {showDevHint && devCode && (
              <View style={styles.devHint}>
                <Ionicons name="code-slash" size={16} color="#FF9800" />
                <Text style={styles.devHintText}>开发模式验证码: {devCode}</Text>
              </View>
            )}

            {/* 登录按钮 */}
            <TouchableOpacity
              style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              <LinearGradient
                colors={loading ? ['#9E9E9E', '#9E9E9E'] : ['#26A69A', '#00897B']}
                style={styles.loginBtnGradient}
              >
                <Text style={styles.loginBtnText}>
                  {loading ? '登录中...' : '立即登录'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* 用户协议 */}
            <View style={styles.agreementContainer}>
              <Text style={styles.agreementText}>
                登录即表示同意
                <Text style={styles.agreementLink}>《用户协议》</Text>
                和
                <Text style={styles.agreementLink}>《隐私政策》</Text>
              </Text>
            </View>
          </Animated.View>

          {/* 其他登录方式 */}
          <View style={styles.otherMethods}>
            <View style={styles.dividerLine}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>其他登录方式</Text>
              <View style={styles.divider} />
            </View>
            <View style={styles.methodsContainer}>
              <TouchableOpacity style={styles.methodItem}>
                <View style={styles.methodIcon}>
                  <FontAwesome6 name="comment" size={24} color="#07C160" />
                </View>
                <Text style={styles.methodText}>微信</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.methodItem}>
                <View style={[styles.methodIcon, { backgroundColor: '#F5F5F5' }]}>
                  <FontAwesome6 name="apple" size={24} color="#000000" />
                </View>
                <Text style={styles.methodText}>Apple</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  headerContent: {
    alignItems: 'center',
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 16,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
  },
  formContainer: {
    paddingHorizontal: 24,
    marginTop: -20,
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  phonePrefix: {
    justifyContent: 'center',
    paddingLeft: 16,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    marginRight: 12,
  },
  prefixText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  phoneInput: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: '#374151',
  },
  codeInput: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: '#374151',
    paddingLeft: 16,
  },
  sendCodeBtn: {
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderLeftWidth: 1,
    borderLeftColor: '#E5E7EB',
  },
  sendCodeBtnDisabled: {
    opacity: 0.6,
  },
  sendCodeText: {
    fontSize: 14,
    color: '#26A69A',
    fontWeight: '600',
  },
  sendCodeTextDisabled: {
    color: '#9CA3AF',
  },
  devHint: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7E6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  devHintText: {
    fontSize: 13,
    color: '#FF9800',
  },
  loginBtn: {
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  loginBtnDisabled: {
    opacity: 0.8,
  },
  loginBtnGradient: {
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginBtnText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  agreementContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  agreementText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  agreementLink: {
    color: '#26A69A',
  },
  otherMethods: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    paddingHorizontal: 40,
  },
  dividerLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 12,
    color: '#9CA3AF',
  },
  methodsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 48,
  },
  methodItem: {
    alignItems: 'center',
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F9F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  methodText: {
    fontSize: 12,
    color: '#374151',
  },
});
