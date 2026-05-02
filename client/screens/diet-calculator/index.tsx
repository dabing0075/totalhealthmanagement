import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
} from 'react-native';
import { Screen } from '@/components/Screen';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome6, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useRouter } from 'expo-router';

interface UserData {
  birthDate: string;
  weight: string;
  height: string;
  gender: 'male' | 'female';
  targetWeight: string;
  sleepHours: string;
  dailySteps: string;
  activityLevel: string;
  weeklyGoal: string;
}

// 计算年龄
const calculateAge = (birthDate: string): number => {
  if (!birthDate) return 0;
  
  // 尝试解析日期，支持多种格式
  const date = new Date(birthDate);
  
  // 如果日期无效，尝试其他格式
  if (isNaN(date.getTime())) {
    // 尝试 YYYY/MM/DD 格式
    const parts = birthDate.split(/[-/]/);
    if (parts.length === 3) {
      const [year, month, day] = parts.map(p => parseInt(p, 10));
      const parsedDate = new Date(year, month - 1, day);
      if (!isNaN(parsedDate.getTime())) {
        const today = new Date();
        let age = today.getFullYear() - parsedDate.getFullYear();
        const monthDiff = today.getMonth() - parsedDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < parsedDate.getDate())) {
          age--;
        }
        return Math.max(0, age);
      }
    }
    return 0;
  }
  
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age--;
  }
  return Math.max(0, age);
};

// 计算BMI
const calculateBMI = (weight: number, height: number): number => {
  if (!weight || !height || height <= 0) return 0;
  return weight / (height * height);
};

// 获取BMI状态
const getBMIStatus = (bmi: number): { label: string; color: string; description: string } => {
  if (bmi < 18.5) return { label: '偏瘦', color: '#2196F3', description: '建议适当增加营养摄入' };
  if (bmi < 24) return { label: '正常', color: '#26A69A', description: '继续保持健康生活方式' };
  if (bmi < 28) return { label: '超重', color: '#FF9800', description: '建议适当控制热量摄入' };
  return { label: '肥胖', color: '#FF5722', description: '建议制定科学的减重计划' };
};

// 计算体脂率
const calculateBodyFat = (bmi: number, age: number, gender: 'male' | 'female'): number => {
  if (!bmi || bmi <= 0 || !age || age <= 0) return 0;
  if (gender === 'male') {
    return Math.max(0, 1.2 * bmi + 0.23 * age - 16.2);
  }
  return Math.max(0, 1.2 * bmi + 0.23 * age - 5.4);
};

// 计算基础代谢率 (BMR)
const calculateBMR = (weight: number, height: number, age: number, gender: 'male' | 'female'): number => {
  if (!weight || !height || height <= 0 || !age || age <= 0) return 0;
  const heightCm = height * 100; // 将身高从米转换为厘米
  if (gender === 'male') {
    return 10 * weight + 6.25 * heightCm - 5 * age + 5;
  }
  return 10 * weight + 6.25 * heightCm - 5 * age - 161;
};

// 计算TDEE
const calculateTDEE = (bmr: number, activityLevel: string): number => {
  const activityFactors: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  };
  return bmr * (activityFactors[activityLevel] || 1.2);
};

// 计算每日摄入热量
const calculateDailyIntake = (tdee: number, weeklyGoal: string): number => {
  const deficit = weeklyGoal === '1' ? 500 : 300;
  return tdee - deficit;
};

// 计算达到目标的时间（周）
const calculateWeeksToGoal = (currentWeight: number, targetWeight: number, weeklyGoal: string): number => {
  if (currentWeight <= targetWeight) return 0;
  return (currentWeight - targetWeight) / (weeklyGoal === '1' ? 1 : 0.5);
};

// 计算营养配比
const calculateNutrition = (weight: number, dailyCalories: number): {
  protein: { grams: number; calories: number; percentage: number };
  carbs: { grams: number; calories: number; percentage: number };
  fat: { grams: number; calories: number; percentage: number };
  fiber: { grams: number };
} => {
  const proteinGrams = weight * 2.2; // 2.2g/kg
  const proteinCalories = proteinGrams * 4;
  const proteinPercentage = Math.round((proteinCalories / dailyCalories) * 100);

  const fatCalories = dailyCalories * 0.25;
  const fatGrams = fatCalories / 9;
  const fatPercentage = 25;

  const carbsCalories = dailyCalories - proteinCalories - fatCalories;
  const carbsGrams = carbsCalories / 4;
  const carbsPercentage = 100 - proteinPercentage - fatPercentage;

  const fiberGrams = 30;

  return {
    protein: { grams: Math.round(proteinGrams), calories: Math.round(proteinCalories), percentage: proteinPercentage },
    carbs: { grams: Math.round(carbsGrams), calories: Math.round(carbsCalories), percentage: carbsPercentage },
    fat: { grams: Math.round(fatGrams), calories: Math.round(fatCalories), percentage: fatPercentage },
    fiber: { grams: fiberGrams },
  };
};

// 计算每日饮水量
const calculateWaterIntake = (weight: number): number => {
  return weight * 30;
};

export default function DietCalculatorScreen() {
  const router = useSafeRouter();
  const [showResult, setShowResult] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    birthDate: '',
    weight: '',
    height: '',
    gender: 'male',
    targetWeight: '',
    sleepHours: '7',
    dailySteps: '6000',
    activityLevel: 'sedentary',
    weeklyGoal: '0.5',
  });

  const results = useMemo(() => {
    const weight = parseFloat(userData.weight) || 0;
    const height = parseFloat(userData.height) || 0;
    const age = calculateAge(userData.birthDate);
    const bmi = calculateBMI(weight, height);
    const bmiStatus = getBMIStatus(bmi);
    const bodyFat = calculateBodyFat(bmi, age, userData.gender);
    const bmr = calculateBMR(weight, height, age, userData.gender);
    const tdee = calculateTDEE(bmr, userData.activityLevel);
    const dailyIntake = calculateDailyIntake(tdee, userData.weeklyGoal);
    const weeksToGoal = calculateWeeksToGoal(weight, parseFloat(userData.targetWeight) || weight, userData.weeklyGoal);
    const nutrition = calculateNutrition(weight, dailyIntake);
    const waterIntake = calculateWaterIntake(weight);

    return {
      age,
      bmi: bmi.toFixed(1),
      bmiStatus,
      bodyFat: bodyFat.toFixed(1),
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      dailyIntake: Math.round(dailyIntake),
      weeksToGoal: Math.round(weeksToGoal),
      nutrition,
      waterIntake: Math.round(waterIntake),
      deficit: userData.weeklyGoal === '1' ? 500 : 300,
    };
  }, [userData]);

  const activityLabels: Record<string, { label: string; desc: string }> = {
    sedentary: { label: '久坐', desc: '几乎不运动' },
    light: { label: '轻度', desc: '每周1-3天运动' },
    moderate: { label: '中度', desc: '每周3-5天运动' },
    active: { label: '高度', desc: '每周6-7天运动' },
    veryActive: { label: '极高', desc: '每日高强度运动' },
  };

  const handleCalculate = () => {
    // 表单验证
    if (!userData.birthDate) {
      alert('请输入出生日期');
      return;
    }
    
    const age = calculateAge(userData.birthDate);
    if (age <= 0 || age > 120) {
      alert('请输入正确的出生日期（格式如：1990-01-01）');
      return;
    }
    
    if (!userData.weight || parseFloat(userData.weight) <= 0) {
      alert('请输入正确的体重');
      return;
    }
    
    if (!userData.height || parseFloat(userData.height) <= 0) {
      alert('请输入正确的身高');
      return;
    }
    
    if (!userData.targetWeight || parseFloat(userData.targetWeight) <= 0) {
      alert('请输入正确的目标体重');
      return;
    }
    
    setShowResult(true);
  };

  return (
    <>
      {/* 固定顶部导航栏 */}
      <View style={styles.fixedHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#1a1a2e" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>科学体重管理方案</Text>
        <View style={styles.placeholder} />
      </View>

      <Screen>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
          {/* 公式说明 */}
        <View style={styles.formulaCard}>
          <View style={styles.formulaHeader}>
            <Ionicons name="bulb" size={18} color="#FF9800" />
            <Text style={styles.formulaTitle}>科学原理</Text>
          </View>
          <Text style={styles.formulaText}>
            通过热量赤字（消耗热量 {'>'} 摄入热量）实现脂肪分解。
          </Text>
          <Text style={styles.formulaText}>
            体重变化 = 摄入热量 - 消耗热量
          </Text>
        </View>

        {/* 基本信息输入 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>基本信息</Text>
          <View style={styles.card}>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>出生日期</Text>
              <TextInput
                style={styles.input}
                placeholder="如: 1990-01-01"
                placeholderTextColor="#9CA3AF"
                value={userData.birthDate}
                onChangeText={(text) => setUserData({ ...userData, birthDate: text })}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>性别</Text>
              <View style={styles.genderSelector}>
                <TouchableOpacity
                  style={[styles.genderBtn, userData.gender === 'male' && styles.genderBtnActive]}
                  onPress={() => setUserData({ ...userData, gender: 'male' })}
                >
                  <FontAwesome5 name="male" size={16} color={userData.gender === 'male' ? '#FFFFFF' : '#26A69A'} />
                  <Text style={[styles.genderText, userData.gender === 'male' && styles.genderTextActive]}>男</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.genderBtn, userData.gender === 'female' && styles.genderBtnActive]}
                  onPress={() => setUserData({ ...userData, gender: 'female' })}
                >
                  <FontAwesome5 name="female" size={16} color={userData.gender === 'female' ? '#FFFFFF' : '#FF9800'} />
                  <Text style={[styles.genderText, userData.gender === 'female' && styles.genderTextActive]}>女</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>当前体重(kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="如: 70"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={userData.weight}
                onChangeText={(text) => setUserData({ ...userData, weight: text })}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>身高(m)</Text>
              <TextInput
                style={styles.input}
                placeholder="如: 1.70"
                placeholderTextColor="#9CA3AF"
                keyboardType="decimal-pad"
                value={userData.height}
                onChangeText={(text) => setUserData({ ...userData, height: text })}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>目标体重(kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="如: 65"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={userData.targetWeight}
                onChangeText={(text) => setUserData({ ...userData, targetWeight: text })}
              />
            </View>
          </View>
        </View>

        {/* 目标设定 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>目标设定</Text>
          <View style={styles.card}>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>每周减重目标</Text>
              <View style={styles.goalSelector}>
                <TouchableOpacity
                  style={[styles.goalBtn, userData.weeklyGoal === '0.5' && styles.goalBtnActive]}
                  onPress={() => setUserData({ ...userData, weeklyGoal: '0.5' })}
                >
                  <Text style={[styles.goalText, userData.weeklyGoal === '0.5' && styles.goalTextActive]}>0.5kg</Text>
                  <Text style={[styles.goalSubText, userData.weeklyGoal === '0.5' && styles.goalTextActive]}>温和</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.goalBtn, userData.weeklyGoal === '1' && styles.goalBtnActive]}
                  onPress={() => setUserData({ ...userData, weeklyGoal: '1' })}
                >
                  <Text style={[styles.goalText, userData.weeklyGoal === '1' && styles.goalTextActive]}>1kg</Text>
                  <Text style={[styles.goalSubText, userData.weeklyGoal === '1' && styles.goalTextActive]}>激进</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>每日步数</Text>
              <TextInput
                style={styles.input}
                placeholder="如: 6000"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={userData.dailySteps}
                onChangeText={(text) => setUserData({ ...userData, dailySteps: text })}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>睡眠时长(小时)</Text>
              <TextInput
                style={styles.input}
                placeholder="如: 7"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={userData.sleepHours}
                onChangeText={(text) => setUserData({ ...userData, sleepHours: text })}
              />
            </View>
          </View>
        </View>

        {/* 活动水平 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>活动水平</Text>
          <View style={styles.activityGrid}>
            {Object.entries(activityLabels).map(([key, value]) => (
              <TouchableOpacity
                key={key}
                style={[styles.activityCard, userData.activityLevel === key && styles.activityCardActive]}
                onPress={() => setUserData({ ...userData, activityLevel: key })}
              >
                <Text style={[styles.activityLabel, userData.activityLevel === key && styles.activityLabelActive]}>
                  {value.label}
                </Text>
                <Text style={[styles.activityDesc, userData.activityLevel === key && styles.activityDescActive]}>
                  {value.desc}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 计算按钮 */}
        <TouchableOpacity style={styles.calculateBtn} onPress={handleCalculate}>
          <LinearGradient
            colors={['#26A69A', '#00897B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.calculateBtnGradient}
          >
            <Text style={styles.calculateBtnText}>开始计算</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* 结果弹窗 */}
      <Modal visible={showResult} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* 弹窗标题 */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>计算结果</Text>
                <TouchableOpacity onPress={() => setShowResult(false)} style={styles.closeBtn}>
                  <Ionicons name="close" size={24} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              {/* 核心指标 */}
              <View style={styles.resultSection}>
                <Text style={styles.resultSectionTitle}>核心指标</Text>
                <View style={styles.resultGrid}>
                  <View style={styles.resultCard}>
                    <Text style={styles.resultValue}>{results.age > 0 ? results.age : '-'}</Text>
                    <Text style={styles.resultLabel}>年龄(岁)</Text>
                  </View>
                  <View style={styles.resultCard}>
                    <Text style={[styles.resultValue, { color: parseFloat(results.bmi) > 0 ? results.bmiStatus.color : '#9CA3AF' }]}>
                      {parseFloat(results.bmi) > 0 ? results.bmi : '-'}
                    </Text>
                    <Text style={styles.resultLabel}>BMI</Text>
                    {parseFloat(results.bmi) > 0 && (
                      <View style={[styles.bmiBadge, { backgroundColor: results.bmiStatus.color + '20' }]}>
                        <Text style={[styles.bmiBadgeText, { color: results.bmiStatus.color }]}>{results.bmiStatus.label}</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.resultCard}>
                    <Text style={styles.resultValue}>{parseFloat(results.bodyFat) > 0 ? `${results.bodyFat}%` : '-'}</Text>
                    <Text style={styles.resultLabel}>体脂率</Text>
                  </View>
                </View>
              </View>

              {/* 热量计算 */}
              <View style={styles.resultSection}>
                <Text style={styles.resultSectionTitle}>热量计算</Text>
                <View style={styles.calorieCard}>
                  <View style={styles.calorieMain}>
                    <Text style={styles.calorieMainValue}>{results.bmr > 0 ? results.dailyIntake : '-'}</Text>
                    <Text style={styles.calorieMainUnit}>{results.bmr > 0 ? '大卡/天' : ''}</Text>
                  </View>
                  <Text style={styles.calorieDesc}>每日摄入热量建议</Text>
                  <View style={styles.calorieDetail}>
                    <View style={styles.calorieDetailItem}>
                      <Text style={styles.calorieDetailValue}>{results.deficit}</Text>
                      <Text style={styles.calorieDetailLabel}>每日缺口</Text>
                    </View>
                    <View style={styles.calorieDetailDivider} />
                    <View style={styles.calorieDetailItem}>
                      <Text style={styles.calorieDetailValue}>{results.bmr > 0 ? results.bmr : '-'}</Text>
                      <Text style={styles.calorieDetailLabel}>基础代谢</Text>
                    </View>
                    <View style={styles.calorieDetailDivider} />
                    <View style={styles.calorieDetailItem}>
                      <Text style={styles.calorieDetailValue}>{results.tdee > 0 ? results.tdee : '-'}</Text>
                      <Text style={styles.calorieDetailLabel}>总消耗</Text>
                    </View>
                  </View>
                </View>

                {/* 公式说明 */}
                <View style={styles.formulaExplain}>
                  <Text style={styles.formulaExplainTitle}>计算公式</Text>
                  <Text style={styles.formulaExplainText}>
                    • BMI = 体重(kg) ÷ 身高²(m²)
                  </Text>
                  <Text style={styles.formulaExplainText}>
                    • BMR = 10×体重 + 6.25×身高(cm) - 5×年龄 {'±'} 5(男/女)
                  </Text>
                  <Text style={styles.formulaExplainText}>
                    • TDEE = BMR × 活动系数
                  </Text>
                  <Text style={styles.formulaExplainText}>
                    • 每日摄入 = TDEE - 缺口({results.deficit}大卡)
                  </Text>
                </View>
              </View>

              {/* 目标时间 */}
              <View style={styles.resultSection}>
                <Text style={styles.resultSectionTitle}>目标预估</Text>
                <View style={styles.goalCard}>
                  <View style={styles.goalMain}>
                    <FontAwesome6 name="clock" size={24} color="#26A69A" />
                    <Text style={styles.goalMainValue}>{results.weeksToGoal} 周</Text>
                  </View>
                  <Text style={styles.goalDesc}>
                    按当前计划，约 {results.weeksToGoal} 周可达标
                  </Text>
                  <Text style={styles.goalNote}>
                    维持体重：每日摄入 ≈ TDEE ({results.tdee > 0 ? results.tdee : '-'}大卡)
                  </Text>
                </View>
              </View>

              {/* 营养配比 */}
              {results.bmr > 0 && (
              <View style={styles.resultSection}>
                <Text style={styles.resultSectionTitle}>营养配比</Text>
                <View style={styles.nutritionGrid}>
                  <View style={[styles.nutritionCard, { backgroundColor: '#FFEBEE' }]}>
                    <Text style={[styles.nutritionValue, { color: '#FF5722' }]}>{results.nutrition.protein.grams}g</Text>
                    <Text style={styles.nutritionLabel}>蛋白质</Text>
                    <Text style={styles.nutritionPercent}>{results.nutrition.protein.percentage}%</Text>
                    <Text style={styles.nutritionCal}>{results.nutrition.protein.calories}大卡</Text>
                  </View>
                  <View style={[styles.nutritionCard, { backgroundColor: '#FFF3E0' }]}>
                    <Text style={[styles.nutritionValue, { color: '#FF9800' }]}>{results.nutrition.carbs.grams}g</Text>
                    <Text style={styles.nutritionLabel}>碳水</Text>
                    <Text style={styles.nutritionPercent}>{results.nutrition.carbs.percentage}%</Text>
                    <Text style={styles.nutritionCal}>{results.nutrition.carbs.calories}大卡</Text>
                  </View>
                  <View style={[styles.nutritionCard, { backgroundColor: '#E8F5E9' }]}>
                    <Text style={[styles.nutritionValue, { color: '#4CAF50' }]}>{results.nutrition.fat.grams}g</Text>
                    <Text style={styles.nutritionLabel}>脂肪</Text>
                    <Text style={styles.nutritionPercent}>{results.nutrition.fat.percentage}%</Text>
                    <Text style={styles.nutritionCal}>{results.nutrition.fat.calories}大卡</Text>
                  </View>
                </View>

                {/* 营养说明 */}
                <View style={styles.nutritionNote}>
                  <View style={styles.nutritionNoteItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#FF5722" />
                    <Text style={styles.nutritionNoteText}>蛋白质: 1.6~2.2g/kg体重（如鸡胸肉、豆腐）</Text>
                  </View>
                  <View style={styles.nutritionNoteItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#FF9800" />
                    <Text style={styles.nutritionNoteText}>碳水: 低GI食物为主（燕麦、红薯）</Text>
                  </View>
                  <View style={styles.nutritionNoteItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                    <Text style={styles.nutritionNoteText}>脂肪: 健康脂肪（坚果、橄榄油）</Text>
                  </View>
                  <View style={styles.nutritionNoteItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#26A69A" />
                    <Text style={styles.nutritionNoteText}>膳食纤维: 每日 {results.nutrition.fiber.grams}g（西兰花、苹果）</Text>
                  </View>
                </View>
              </View>
              )}

              {/* 饮水建议 */}
              <View style={styles.resultSection}>
                <Text style={styles.resultSectionTitle}>饮水建议</Text>
                <View style={styles.waterCard}>
                  <View style={styles.waterMain}>
                    <Ionicons name="water" size={28} color="#2196F3" />
                    <Text style={styles.waterValue}>{results.waterIntake}ml</Text>
                    <Text style={styles.waterLabel}>每日饮水量</Text>
                  </View>
                  <Text style={styles.waterFormula}>公式: 体重({userData.weight}kg) × 30ml</Text>
                  <Text style={styles.waterTip}>建议: 饭前1杯水可减少进食量</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.doneBtn} onPress={() => setShowResult(false)}>
                <Text style={styles.doneBtnText}>完成</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  contentContainer: { paddingHorizontal: 16, paddingTop: 65, paddingBottom: 100 },
  fixedHeader: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#F9FAFB', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a2e' },
  placeholder: { width: 40 },
  formulaCard: { backgroundColor: '#FFF3E0', borderRadius: 12, padding: 14, marginBottom: 20 },
  formulaHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  formulaTitle: { fontSize: 14, fontWeight: '700', color: '#FF9800' },
  formulaText: { fontSize: 13, color: '#1a1a2e', lineHeight: 20, marginBottom: 4 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a2e', marginBottom: 12 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  inputRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
  inputLabel: { fontSize: 14, color: '#1a1a2e' },
  input: { flex: 1, textAlign: 'right', fontSize: 14, color: '#1a1a2e', marginLeft: 12 },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 4 },
  genderSelector: { flexDirection: 'row', gap: 10 },
  genderBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F3F4F6' },
  genderBtnActive: { backgroundColor: '#26A69A' },
  genderText: { fontSize: 14, fontWeight: '600', color: '#26A69A' },
  genderTextActive: { color: '#FFFFFF' },
  goalSelector: { flexDirection: 'row', gap: 10 },
  goalBtn: { alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, backgroundColor: '#F3F4F6' },
  goalBtnActive: { backgroundColor: '#26A69A' },
  goalText: { fontSize: 14, fontWeight: '700', color: '#1a1a2e' },
  goalSubText: { fontSize: 10, color: '#9CA3AF', marginTop: 2 },
  goalTextActive: { color: '#FFFFFF' },
  activityGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  activityCard: { width: '31%', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  activityCardActive: { backgroundColor: '#26A69A' },
  activityLabel: { fontSize: 13, fontWeight: '700', color: '#1a1a2e', marginBottom: 4 },
  activityLabelActive: { color: '#FFFFFF' },
  activityDesc: { fontSize: 10, color: '#9CA3AF', textAlign: 'center' },
  activityDescActive: { color: 'rgba(255,255,255,0.8)' },
  calculateBtn: { marginTop: 10 },
  calculateBtnGradient: { borderRadius: 24, paddingVertical: 16, alignItems: 'center' },
  calculateBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  bottomPadding: { height: 40 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#1a1a2e' },
  closeBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  resultSection: { marginBottom: 24 },
  resultSectionTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a2e', marginBottom: 12 },
  resultGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  resultCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, alignItems: 'center', marginHorizontal: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  resultValue: { fontSize: 24, fontWeight: '800', color: '#1a1a2e' },
  resultLabel: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },
  bmiBadge: { marginTop: 6, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  bmiBadgeText: { fontSize: 11, fontWeight: '600' },
  calorieCard: { backgroundColor: '#26A69A', borderRadius: 16, padding: 20, alignItems: 'center' },
  calorieMain: { alignItems: 'center' },
  calorieMainValue: { fontSize: 48, fontWeight: '800', color: '#FFFFFF' },
  calorieMainUnit: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  calorieDesc: { fontSize: 13, color: 'rgba(255,255,255,0.9)', marginTop: 8 },
  calorieDetail: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)', width: '100%' },
  calorieDetailItem: { alignItems: 'center' },
  calorieDetailValue: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  calorieDetailLabel: { fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  calorieDetailDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.3)' },
  formulaExplain: { backgroundColor: '#F9FAFB', borderRadius: 12, padding: 14, marginTop: 12 },
  formulaExplainTitle: { fontSize: 13, fontWeight: '700', color: '#1a1a2e', marginBottom: 8 },
  formulaExplainText: { fontSize: 12, color: '#6B7280', lineHeight: 20 },
  goalCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  goalMain: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  goalMainValue: { fontSize: 28, fontWeight: '800', color: '#26A69A' },
  goalDesc: { fontSize: 14, color: '#1a1a2e', marginTop: 8 },
  goalNote: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },
  nutritionGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  nutritionCard: { flex: 1, borderRadius: 12, padding: 12, alignItems: 'center', marginHorizontal: 4 },
  nutritionValue: { fontSize: 20, fontWeight: '800' },
  nutritionLabel: { fontSize: 12, color: '#1a1a2e', marginTop: 2 },
  nutritionPercent: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
  nutritionCal: { fontSize: 10, color: '#9CA3AF', marginTop: 2 },
  nutritionNote: { backgroundColor: '#F9FAFB', borderRadius: 12, padding: 14, marginTop: 12 },
  nutritionNoteItem: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  nutritionNoteText: { flex: 1, fontSize: 12, color: '#6B7280' },
  waterCard: { backgroundColor: '#E3F2FD', borderRadius: 16, padding: 20, alignItems: 'center' },
  waterMain: { alignItems: 'center' },
  waterValue: { fontSize: 28, fontWeight: '800', color: '#2196F3', marginTop: 8 },
  waterLabel: { fontSize: 14, color: '#1a1a2e', marginTop: 4 },
  waterFormula: { fontSize: 12, color: '#6B7280', marginTop: 8 },
  waterTip: { fontSize: 12, color: '#2196F3', marginTop: 4 },
  doneBtn: { backgroundColor: '#26A69A', borderRadius: 24, paddingVertical: 14, alignItems: 'center', marginTop: 20 },
  doneBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});
