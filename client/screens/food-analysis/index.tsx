import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome6, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';

const MEAL_TYPES = [
  { key: 'breakfast', label: '早餐', icon: 'sunrise', color: '#FF9800' },
  { key: 'lunch', label: '午餐', icon: 'sun', color: '#26A69A' },
  { key: 'dinner', label: '晚餐', icon: 'moon', color: '#2196F3' },
  { key: 'snack', label: '加餐', icon: 'cookie', color: '#9C27B0' },
];

interface FoodItem {
  name: string;
  calories: number;
  weight: string;
  unit: string;
}

interface AnalysisResult {
  mealType: string;
  foods: FoodItem[];
  totalCalories: number;
  nutritionAdvice: string;
  imageUri: string;
}

const createFormDataFile = (uri: string, name: string, type: string) => {
  const fileUri = uri.startsWith('file://') ? uri : `file://${uri}`;
  return {
    uri: fileUri,
    name,
    type,
  };
};

export default function FoodAnalysisScreen() {
  const router = useRouter();
  const [selectedMeal, setSelectedMeal] = useState('lunch');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<AnalysisResult[]>([]);

  // 请求相机权限
  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('权限提示', '需要相机权限才能拍照，请前往设置开启');
      return false;
    }
    return true;
  };

  // 请求相册权限
  const requestLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('权限提示', '需要相册权限才能选择照片，请前往设置开启');
      return false;
    }
    return true;
  };

  // 拍照
  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      setAnalysisResult(null);
    }
  };

  // 从相册选择
  const handleChooseFromLibrary = async () => {
    const hasPermission = await requestLibraryPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      setAnalysisResult(null);
    }
  };

  // 显示选择图片弹窗
  const showImagePicker = () => {
    Alert.alert(
      '选择图片来源',
      '请选择图片来源',
      [
        { text: '拍照', onPress: handleTakePhoto },
        { text: '相册', onPress: handleChooseFromLibrary },
        { text: '取消', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  // 模拟AI分析
  const analyzeImage = async () => {
    if (!imageUri) {
      Alert.alert('提示', '请先选择图片');
      return;
    }

    setIsAnalyzing(true);

    try {
      // 模拟API调用
      const formData = new FormData();
      formData.append('image', createFormDataFile(imageUri, 'food.jpg', 'image/jpeg') as any);
      formData.append('mealType', selectedMeal);

      // 模拟分析结果
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockResults: Record<string, FoodItem[]> = {
        breakfast: [
          { name: '全麦面包', calories: 180, weight: '100', unit: 'g' },
          { name: '煎蛋', calories: 196, weight: '80', unit: 'g' },
          { name: '牛奶', calories: 135, weight: '250', unit: 'ml' },
          { name: '苹果', calories: 95, weight: '180', unit: 'g' },
        ],
        lunch: [
          { name: '米饭', calories: 348, weight: '200', unit: 'g' },
          { name: '红烧肉', calories: 478, weight: '150', unit: 'g' },
          { name: '炒青菜', calories: 68, weight: '200', unit: 'g' },
          { name: '番茄蛋汤', calories: 56, weight: '200', unit: 'ml' },
        ],
        dinner: [
          { name: '糙米饭', calories: 218, weight: '150', unit: 'g' },
          { name: '清蒸鱼', calories: 186, weight: '120', unit: 'g' },
          { name: '凉拌黄瓜', calories: 42, weight: '150', unit: 'g' },
          { name: '紫菜蛋汤', calories: 48, weight: '150', unit: 'ml' },
        ],
        snack: [
          { name: '坚果', calories: 186, weight: '30', unit: 'g' },
          { name: '酸奶', calories: 98, weight: '100', unit: 'ml' },
        ],
      };

      const mealFoods = mockResults[selectedMeal] || mockResults.lunch;
      const totalCalories = mealFoods.reduce((sum, food) => sum + food.calories, 0);

      const adviceMap: Record<string, string> = {
        breakfast: '早餐营养较为均衡，建议减少煎蛋的用油量，牛奶可选择低脂版本。',
        lunch: '午餐热量偏高，红烧肉油脂较多，建议下次减少肉类份量，增加蔬菜比例。',
        dinner: '晚餐搭配合理，清蒸方式健康，建议保持。主食可适当减少50g。',
        snack: '加餐热量适中，建议选择坚果时控制在一小把（约30g），酸奶可选择无糖版本。',
      };

      const result: AnalysisResult = {
        mealType: selectedMeal,
        foods: mealFoods,
        totalCalories,
        nutritionAdvice: adviceMap[selectedMeal],
        imageUri: imageUri,
      };

      setAnalysisResult(result);
      setHistory((prev) => [result, ...prev].slice(0, 10));
    } catch (error) {
      Alert.alert('分析失败', '图片分析过程中出现错误，请重试');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Screen>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.contentContainer, styles.contentPadding]}
        showsVerticalScrollIndicator={false}
      >
        {/* 餐次选择 */}
        <View style={styles.mealTypeSection}>
          <Text style={styles.sectionTitle}>选择餐次</Text>
          <View style={styles.mealTypeGrid}>
            {MEAL_TYPES.map((meal) => (
              <TouchableOpacity
                key={meal.key}
                style={[
                  styles.mealTypeCard,
                  selectedMeal === meal.key && {
                    borderColor: meal.color,
                    backgroundColor: `${meal.color}10`,
                  },
                ]}
                onPress={() => setSelectedMeal(meal.key)}
              >
                <View style={[styles.mealIconContainer, { backgroundColor: `${meal.color}20` }]}>
                  <FontAwesome6
                    name={meal.icon as any}
                    size={22}
                    color={meal.color}
                  />
                </View>
                <Text
                  style={[
                    styles.mealTypeLabel,
                    selectedMeal === meal.key && { color: meal.color, fontWeight: '600' },
                  ]}
                >
                  {meal.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 图片上传区域 */}
        <View style={styles.uploadSection}>
          <Text style={styles.sectionTitle}>拍摄或选择食物照片</Text>
          <TouchableOpacity
            style={styles.uploadArea}
            onPress={showImagePicker}
            activeOpacity={0.7}
          >
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
            ) : (
              <View style={styles.uploadPlaceholder}>
                <View style={styles.uploadIconContainer}>
                  <FontAwesome6 name="camera" size={32} color="#26A69A" />
                </View>
                <Text style={styles.uploadTitle}>点击上传食物图片</Text>
                <Text style={styles.uploadSubtitle}>
                  支持拍照或从相册选择
                </Text>
              </View>
            )}
            <View style={styles.uploadActions}>
              <TouchableOpacity style={styles.uploadActionBtn} onPress={handleTakePhoto}>
                <Ionicons name="camera" size={20} color="#FFFFFF" />
                <Text style={styles.uploadActionText}>拍照</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.uploadActionBtn, styles.uploadActionBtnSecondary]}
                onPress={handleChooseFromLibrary}
              >
                <Ionicons name="images" size={20} color="#FFFFFF" />
                <Text style={styles.uploadActionText}>相册</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>

        {/* 分析按钮 */}
        <TouchableOpacity
          style={[styles.analyzeBtn, !imageUri && styles.analyzeBtnDisabled]}
          onPress={analyzeImage}
          disabled={!imageUri || isAnalyzing}
        >
          <LinearGradient
            colors={!imageUri || isAnalyzing ? ['#9CA3AF', '#6B7280'] : ['#26A69A', '#00897B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.analyzeBtnGradient}
          >
            {isAnalyzing ? (
              <>
                <ActivityIndicator color="#FFFFFF" size="small" />
                <Text style={styles.analyzeBtnText}>AI分析中...</Text>
              </>
            ) : (
              <>
                <FontAwesome6 name="wand-magic-sparkles" size={20} color="#FFFFFF" />
                <Text style={styles.analyzeBtnText}>开始AI分析</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* 分析结果 */}
        {analysisResult && (
          <View style={styles.resultSection}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>
                {MEAL_TYPES.find((m) => m.key === analysisResult.mealType)?.label}分析结果
              </Text>
            </View>

            {/* 食物列表 */}
            <View style={styles.foodListCard}>
              <View style={styles.foodListHeader}>
                <Text style={styles.foodListTitle}>识别食物</Text>
                <Text style={styles.foodListTotal}>
                  总计: {analysisResult.totalCalories} kcal
                </Text>
              </View>

              {analysisResult.foods.map((food, index) => (
                <View key={index} style={styles.foodItem}>
                  <View style={styles.foodInfo}>
                    <Text style={styles.foodName}>{food.name}</Text>
                    <Text style={styles.foodWeight}>
                      {food.weight}{food.unit}
                    </Text>
                  </View>
                  <Text style={styles.foodCalories}>{food.calories} kcal</Text>
                </View>
              ))}

              {/* 热量分布图 */}
              <View style={styles.calorieChart}>
                <Text style={styles.calorieChartTitle}>热量分布</Text>
                <View style={styles.calorieBar}>
                  {analysisResult.foods.map((food, index) => (
                    <View
                      key={index}
                      style={[
                        styles.calorieSegment,
                        {
                          flex: food.calories,
                          backgroundColor: ['#26A69A', '#FF9800', '#2196F3', '#9C27B0'][index % 4],
                        },
                      ]}
                    />
                  ))}
                </View>
              </View>
            </View>

            {/* 营养建议 */}
            <View style={styles.adviceCard}>
              <View style={styles.adviceHeader}>
                <Ionicons name="bulb" size={20} color="#FF9800" />
                <Text style={styles.adviceTitle}>营养建议</Text>
              </View>
              <Text style={styles.adviceContent}>{analysisResult.nutritionAdvice}</Text>
            </View>

            {/* 记录到今日饮食 */}
            <TouchableOpacity style={styles.recordBtn}>
              <LinearGradient
                colors={['#FF9800', '#F57C00']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.recordBtnGradient}
              >
                <MaterialCommunityIcons name="plus" size={20} color="#FFFFFF" />
                <Text style={styles.recordBtnText}>添加到今日饮食记录</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* 历史记录入口 */}
        {history.length > 0 && (
          <TouchableOpacity
            style={styles.historyBtn}
            onPress={() => setShowHistory(true)}
          >
            <Ionicons name="time" size={20} color="#26A69A" />
            <Text style={styles.historyBtnText}>查看历史记录 ({history.length})</Text>
            <Ionicons name="chevron-forward" size={18} color="#26A69A" />
          </TouchableOpacity>
        )}

        {/* 历史记录弹窗 */}
        <Modal
          visible={showHistory}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowHistory(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>历史记录</Text>
                <TouchableOpacity onPress={() => setShowHistory(false)}>
                  <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.historyList}>
                {history.map((item, index) => (
                  <View key={index} style={styles.historyItem}>
                    <Image source={{ uri: item.imageUri }} style={styles.historyImage} />
                    <View style={styles.historyInfo}>
                      <Text style={styles.historyMealType}>
                        {MEAL_TYPES.find((m) => m.key === item.mealType)?.label}
                      </Text>
                      <Text style={styles.historyCalories}>{item.totalCalories} kcal</Text>
                      <Text style={styles.historyFoodCount}>{item.foods.length} 种食物</Text>
                    </View>
                    <TouchableOpacity style={styles.historyAction}>
                      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </ScrollView>

      {/* 固定顶部导航栏 */}
      <View style={styles.fixedHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <FontAwesome6 name="chevron-left" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>食物分析</Text>
        <View style={styles.headerRight} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    zIndex: 100,
  },
  contentPadding: {
    paddingTop: 55,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerRight: {
    width: 40,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 12,
  },
  mealTypeSection: {
    marginBottom: 20,
  },
  mealTypeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mealTypeCard: {
    width: '23%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  mealIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealTypeLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  uploadSection: {
    marginBottom: 20,
  },
  uploadArea: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  previewImage: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  uploadPlaceholder: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  uploadIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  uploadSubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  uploadActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  uploadActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#26A69A',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  uploadActionBtnSecondary: {
    backgroundColor: '#FF9800',
  },
  uploadActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  analyzeBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#26A69A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  analyzeBtnDisabled: {
    shadowOpacity: 0.1,
  },
  analyzeBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  analyzeBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  resultSection: {
    marginBottom: 20,
  },
  resultHeader: {
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  foodListCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  foodListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  foodListTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  foodListTotal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#26A69A',
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a2e',
  },
  foodWeight: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  foodCalories: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  calorieChart: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  calorieChartTitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  calorieBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  calorieSegment: {
    height: '100%',
  },
  adviceCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  adviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  adviceTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FF9800',
  },
  adviceContent: {
    fontSize: 14,
    color: '#1a1a2e',
    lineHeight: 22,
  },
  recordBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#FF9800',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  recordBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  recordBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  historyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  historyBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#26A69A',
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    paddingBottom: 34,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  historyList: {
    paddingHorizontal: 20,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  historyImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
  },
  historyInfo: {
    flex: 1,
    marginLeft: 12,
  },
  historyMealType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  historyCalories: {
    fontSize: 13,
    color: '#26A69A',
    fontWeight: '600',
    marginTop: 2,
  },
  historyFoodCount: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  historyAction: {
    padding: 8,
  },
});
