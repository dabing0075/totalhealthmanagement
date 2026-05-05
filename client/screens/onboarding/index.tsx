import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { Screen } from '@/components/Screen';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/contexts/AuthContext';

const EXPO_PUBLIC_BACKEND_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_BASE_URL || 'http://localhost:9091';

export default function OnboardingScreen() {
  const router = useSafeRouter();
  const { user, updateUser } = useAuth();
  
  const [step, setStep] = useState(1);
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [birthday, setBirthday] = useState('');
  const [height, setHeight] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [age, setAge] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // 根据出生日期计算年龄
  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      calculatedAge--;
    }
    return calculatedAge;
  };

  const handleBirthdayChange = (text: string) => {
    // 格式化日期为 YYYY-MM-DD
    let formatted = text.replace(/\D/g, '');
    if (formatted.length > 4) {
      formatted = formatted.slice(0, 4) + '-' + formatted.slice(4);
    }
    if (formatted.length > 7) {
      formatted = formatted.slice(0, 7) + '-' + formatted.slice(7);
    }
    formatted = formatted.slice(0, 10);
    setBirthday(formatted);
    
    if (formatted.length === 10) {
      const calculatedAge = calculateAge(formatted);
      setAge(calculatedAge);
    } else {
      setAge(null);
    }
  };

  // 计算BMI
  const calculateBMI = () => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(currentWeight);
    if (h > 0 && w > 0) {
      return (w / (h * h)).toFixed(1);
    }
    return null;
  };

  // 计算标准体重范围
  const getStandardWeightRange = () => {
    const h = parseFloat(height);
    if (h > 0) {
      const min = ((h - 100) * 0.9).toFixed(0);
      const max = ((h - 100) * 1.1).toFixed(0);
      return `${min}kg - ${max}kg`;
    }
    return null;
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSave = async () => {
    if (!gender || !birthday || !height || !currentWeight || !targetWeight) {
      return;
    }

    setLoading(true);
    try {
      // 保存到后端
      const token = await AsyncStorage.getItem('auth_token');
      const response = await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          gender,
          birthday,
          height: parseFloat(height),
          weight: parseFloat(currentWeight),
          targetWeight: parseFloat(targetWeight),
        }),
      });

      if (response.ok) {
        // 更新本地用户数据
        updateUser({
          gender,
          birthday,
          height: parseFloat(height),
          weight: parseFloat(currentWeight),
          targetWeight: parseFloat(targetWeight),
        });
        
        // 标记已完成引导
        await AsyncStorage.setItem('onboarding_completed', 'true');
        
        // 跳转到首页
        router.replace('/');
      }
    } catch (error) {
      console.error('保存失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return gender !== '';
      case 2:
        return birthday.length === 10 && age !== null && age > 0 && age < 150;
      case 3:
        return parseFloat(height) > 0 && parseFloat(height) < 300;
      case 4:
        return parseFloat(currentWeight) > 0 && parseFloat(currentWeight) < 300 &&
               parseFloat(targetWeight) > 0 && parseFloat(targetWeight) < 300;
      default:
        return false;
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>选择您的性别</Text>
      <Text style={styles.stepSubtitle}>帮助我们为您制定更准确的健康计划</Text>
      
      <View style={styles.genderContainer}>
        <TouchableOpacity
          style={[styles.genderCard, gender === 'male' && styles.genderCardActive]}
          onPress={() => setGender('male')}
        >
          <View style={[styles.genderIcon, { backgroundColor: '#E8F5E9' }]}>
            <Ionicons name="male" size={40} color="#4CAF50" />
          </View>
          <Text style={[styles.genderText, gender === 'male' && styles.genderTextActive]}>男 生</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.genderCard, gender === 'female' && styles.genderCardActive]}
          onPress={() => setGender('female')}
        >
          <View style={[styles.genderIcon, { backgroundColor: '#FCE4EC' }]}>
            <Ionicons name="female" size={40} color="#E91E63" />
          </View>
          <Text style={[styles.genderText, gender === 'female' && styles.genderTextActive]}>女 生</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>您的出生日期</Text>
      <Text style={styles.stepSubtitle}>用于计算您的年龄和制定健康计划</Text>
      
      <View style={styles.inputContainer}>
        <Ionicons name="calendar-outline" size={24} color="#4CAF50" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="请输入出生日期"
          placeholderTextColor="#999"
          value={birthday}
          onChangeText={handleBirthdayChange}
          keyboardType="numeric"
          maxLength={10}
        />
      </View>
      
      {age !== null && (
        <View style={styles.ageDisplay}>
          <Text style={styles.ageText}>您的年龄：{age} 岁</Text>
        </View>
      )}
      
      <Text style={styles.hint}>格式：YYYY-MM-DD（例如：1995-06-15）</Text>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>您的身高</Text>
      <Text style={styles.stepSubtitle}>准确的身高数据有助于计算BMI指数</Text>
      
      <View style={styles.valueInputContainer}>
        <View style={styles.inputContainer}>
          <Ionicons name="resize-outline" size={24} color="#4CAF50" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="请输入身高"
            placeholderTextColor="#999"
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
            maxLength={3}
          />
          <Text style={styles.unit}>cm</Text>
        </View>
      </View>
      
      {parseFloat(height) > 0 && (
        <View style={styles.standardWeight}>
          <Text style={styles.standardWeightText}>
            您的标准体重范围：{getStandardWeightRange()}
          </Text>
        </View>
      )}
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>体重信息</Text>
      <Text style={styles.stepSubtitle}>记录当前体重和目标体重，开始您的健康之旅</Text>
      
      <View style={styles.weightSection}>
        <Text style={styles.weightLabel}>当前体重</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="scale-outline" size={24} color="#4CAF50" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="请输入当前体重"
            placeholderTextColor="#999"
            value={currentWeight}
            onChangeText={setCurrentWeight}
            keyboardType="numeric"
            maxLength={5}
          />
          <Text style={styles.unit}>kg</Text>
        </View>
      </View>
      
      <View style={styles.weightSection}>
        <Text style={styles.weightLabel}>目标体重</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="flag-outline" size={24} color="#FF9800" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="请输入目标体重"
            placeholderTextColor="#999"
            value={targetWeight}
            onChangeText={setTargetWeight}
            keyboardType="numeric"
            maxLength={5}
          />
          <Text style={styles.unit}>kg</Text>
        </View>
      </View>
      
      {parseFloat(currentWeight) > 0 && parseFloat(targetWeight) > 0 && (
        <View style={styles.bmiDisplay}>
          <Text style={styles.bmiLabel}>您的BMI：{calculateBMI()}</Text>
          <Text style={styles.bmiHint}>
            目标需减重：{(parseFloat(currentWeight) - parseFloat(targetWeight)).toFixed(1)}kg
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <Screen>
      <View style={styles.container}>
        {/* 顶部渐变区域 */}
        <LinearGradient
          colors={['#4CAF50', '#81C784']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Text style={styles.logo}>轻盈生活</Text>
            <Text style={styles.headerSubtitle}>让健康成为习惯</Text>
          </View>
        </LinearGradient>

        {/* 进度指示器 */}
        <View style={styles.progressContainer}>
          {[1, 2, 3, 4].map((s) => (
            <View key={s} style={styles.progressItem}>
              <View
                style={[
                  styles.progressDot,
                  s <= step && styles.progressDotActive,
                ]}
              />
              <View
                style={[
                  styles.progressLine,
                  s < step && styles.progressLineActive,
                ]}
              />
            </View>
          ))}
        </View>

        {/* 内容区域 */}
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </ScrollView>

        {/* 底部按钮 */}
        <View style={styles.footer}>
          {step > 1 && (
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Ionicons name="chevron-back" size={24} color="#666" />
              <Text style={styles.backText}>上一步</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[
              styles.nextButton,
              !canProceed() && styles.nextButtonDisabled,
            ]}
            onPress={step === 4 ? handleSave : handleNext}
            disabled={!canProceed() || loading}
          >
            <LinearGradient
              colors={canProceed() ? ['#4CAF50', '#81C784'] : ['#ccc', '#ddd']}
              style={styles.nextButtonGradient}
            >
              <Text style={styles.nextText}>
                {loading ? '保存中...' : step === 4 ? '完成设置' : '下一步'}
              </Text>
              {!loading && <Ionicons name="arrow-forward" size={20} color="#fff" />}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 5,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    marginHorizontal: 40,
  },
  progressItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E0E0E0',
  },
  progressDotActive: {
    backgroundColor: '#4CAF50',
  },
  progressLine: {
    width: 40,
    height: 3,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  progressLineActive: {
    backgroundColor: '#4CAF50',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  stepContainer: {
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 30,
    textAlign: 'center',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  genderCard: {
    width: 140,
    height: 160,
    backgroundColor: '#fff',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  genderCardActive: {
    borderColor: '#4CAF50',
    backgroundColor: '#F1F8E9',
  },
  genderIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  genderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
  genderTextActive: {
    color: '#4CAF50',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    width: '100%',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: '#333',
  },
  unit: {
    fontSize: 16,
    color: '#999',
    marginLeft: 8,
  },
  ageDisplay: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
  },
  ageText: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: '600',
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginTop: 12,
  },
  valueInputContainer: {
    width: '100%',
  },
  standardWeight: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
  },
  standardWeightText: {
    fontSize: 16,
    color: '#FF9800',
    fontWeight: '500',
  },
  weightSection: {
    width: '100%',
    marginBottom: 20,
  },
  weightLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  bmiDisplay: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  bmiLabel: {
    fontSize: 20,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  bmiHint: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  backText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
  },
  nextButton: {
    flex: 1,
    marginLeft: 20,
  },
  nextButtonDisabled: {
    opacity: 0.6,
  },
  nextButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 28,
    gap: 8,
  },
  nextText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
