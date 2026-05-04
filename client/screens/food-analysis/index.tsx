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

interface NutritionData {
  protein: number;
  carbs: number;
  fat: number;
}

interface RecipeItem {
  id: number;
  name: string;
  calories: number;
  time: string;
  tags: string[];
  image: string;
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
  const [showRecipeModal, setShowRecipeModal] = useState(false);

  // 今日营养数据
  const todayNutrition: NutritionData = {
    protein: 68,
    carbs: 185,
    fat: 52,
  };
  const todayCalories = todayNutrition.protein * 4 + todayNutrition.carbs * 4 + todayNutrition.fat * 9;
  const calorieGoal = 1800;
  const caloriePercent = Math.round((todayCalories / calorieGoal) * 100);

  // 营养素比例
  const proteinCal = todayNutrition.protein * 4;
  const carbsCal = todayNutrition.carbs * 4;
  const fatCal = todayNutrition.fat * 9;
  const totalNutritionCal = proteinCal + carbsCal + fatCal;
  const proteinPercent = Math.round((proteinCal / totalNutritionCal) * 100);
  const carbsPercent = Math.round((carbsCal / totalNutritionCal) * 100);
  const fatPercent = 100 - proteinPercent - carbsPercent;

  // 减脂食谱库
  const recipeList: RecipeItem[] = [
    { id: 1, name: '鸡胸肉沙拉', calories: 320, time: '15分钟', tags: ['高蛋白', '低脂'], image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400' },
    { id: 2, name: '清蒸鲈鱼', calories: 280, time: '20分钟', tags: ['高蛋白', '清淡'], image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400' },
    { id: 3, name: '西兰花炒虾仁', calories: 260, time: '12分钟', tags: ['高蛋白', '低卡'], image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400' },
    { id: 4, name: '番茄牛肉汤', calories: 350, time: '40分钟', tags: ['高蛋白', '暖身'], image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400' },
    { id: 5, name: '凉拌黄瓜鸡丝', calories: 290, time: '10分钟', tags: ['低脂', '清爽'], image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=400' },
    { id: 6, name: '紫薯燕麦粥', calories: 240, time: '25分钟', tags: ['粗粮', '饱腹'], image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400' },
  ];

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
        {/* 今日摄入总热量卡片 */}
        <View style={styles.section}>
          <View style={styles.calorieSummaryCard}>
            <LinearGradient
              colors={['#26A69A', '#00897B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.calorieSummaryGradient}
            >
              <View style={styles.calorieHeader}>
                <Text style={styles.calorieHeaderTitle}>今日摄入</Text>
                <Text style={styles.calorieHeaderSub}>已记录 {caloriePercent}%</Text>
              </View>
              <View style={styles.calorieMain}>
                <View style={styles.calorieValueContainer}>
                  <Text style={styles.calorieValue}>{todayCalories}</Text>
                  <Text style={styles.calorieUnit}>kcal</Text>
                </View>
                <Text style={styles.calorieGoal}>/ {calorieGoal} kcal</Text>
              </View>
              <View style={styles.calorieProgressBar}>
                <View style={[styles.calorieProgressFill, { width: `${caloriePercent}%` }]} />
              </View>
            </LinearGradient>

            {/* 三大营养素饼图 */}
            <View style={styles.nutritionSection}>
              <Text style={styles.nutritionTitle}>三大营养素构成</Text>
              <View style={styles.nutritionContent}>
                {/* 饼图 */}
                <View style={styles.pieChartContainer}>
                  <View style={styles.pieChart}>
                    <View style={[styles.pieProtein, { transform: [{ rotate: '0deg' }] }]} />
                    <View style={[styles.pieCarbs, { transform: [{ rotate: `${proteinPercent * 3.6}deg` }] }]} />
                    <View style={[styles.pieFat, { transform: [{ rotate: `${(proteinPercent + carbsPercent) * 3.6}deg` }] }]} />
                    <View style={styles.pieCenter}>
                      <Text style={styles.pieCenterText}>{totalNutritionCal}</Text>
                      <Text style={styles.pieCenterLabel}>千卡</Text>
                    </View>
                  </View>
                </View>

                {/* 营养素详情 */}
                <View style={styles.nutritionList}>
                  <View style={styles.nutritionItem}>
                    <View style={[styles.nutritionDot, { backgroundColor: '#26A69A' }]} />
                    <Text style={styles.nutritionLabel}>蛋白质</Text>
                    <Text style={styles.nutritionValue}>{todayNutrition.protein}g</Text>
                    <Text style={styles.nutritionPercent}>{proteinPercent}%</Text>
                  </View>
                  <View style={styles.nutritionItem}>
                    <View style={[styles.nutritionDot, { backgroundColor: '#FF9800' }]} />
                    <Text style={styles.nutritionLabel}>碳水</Text>
                    <Text style={styles.nutritionValue}>{todayNutrition.carbs}g</Text>
                    <Text style={styles.nutritionPercent}>{carbsPercent}%</Text>
                  </View>
                  <View style={styles.nutritionItem}>
                    <View style={[styles.nutritionDot, { backgroundColor: '#2196F3' }]} />
                    <Text style={styles.nutritionLabel}>脂肪</Text>
                    <Text style={styles.nutritionValue}>{todayNutrition.fat}g</Text>
                    <Text style={styles.nutritionPercent}>{fatPercent}%</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

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

        {/* 减脂食谱库 */}
        <View style={styles.section}>
          <View style={styles.recipeHeader}>
            <Text style={styles.sectionTitle}>减脂食谱库</Text>
            <TouchableOpacity onPress={() => setShowRecipeModal(true)}>
              <Text style={styles.recipeMore}>查看全部</Text>
            </TouchableOpacity>
          </View>
          <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recipeScrollView}>
            {recipeList.map((recipe) => (
              <TouchableOpacity
                key={recipe.id}
                style={styles.recipeCard}
                onPress={() => setShowRecipeModal(true)}
              >
                <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
                <View style={styles.recipeOverlay}>
                  <View style={styles.recipeTags}>
                    {recipe.tags.map((tag, index) => (
                      <View key={index} style={styles.recipeTag}>
                        <Text style={styles.recipeTagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View style={styles.recipeInfo}>
                  <Text style={styles.recipeName} numberOfLines={1}>{recipe.name}</Text>
                  <View style={styles.recipeMeta}>
                    <View style={styles.recipeMetaItem}>
                      <Ionicons name="flame-outline" size={14} color="#FF9800" />
                      <Text style={styles.recipeMetaText}>{recipe.calories}kcal</Text>
                    </View>
                    <View style={styles.recipeMetaItem}>
                      <Ionicons name="time-outline" size={14} color="#6B7280" />
                      <Text style={styles.recipeMetaText}>{recipe.time}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
            </ScrollView>
          </View>
        </View>

        {/* 食谱详情弹窗 */}
        <Modal
          visible={showRecipeModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowRecipeModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { maxHeight: '85%' }]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>减脂食谱库</Text>
                <TouchableOpacity onPress={() => setShowRecipeModal(false)}>
                  <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
                {recipeList.map((recipe) => (
                  <TouchableOpacity key={recipe.id} style={styles.recipeListItem}>
                    <Image source={{ uri: recipe.image }} style={styles.recipeListImage} />
                    <View style={styles.recipeListInfo}>
                      <Text style={styles.recipeListName}>{recipe.name}</Text>
                      <View style={styles.recipeListTags}>
                        {recipe.tags.map((tag, index) => (
                          <Text key={index} style={styles.recipeListTag}>{tag}</Text>
                        ))}
                      </View>
                      <View style={styles.recipeListMeta}>
                        <Text style={styles.recipeListCal}>{recipe.calories} kcal</Text>
                        <Text style={styles.recipeListTime}>{recipe.time}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

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
    backgroundColor: '#F9FAFB',
    paddingTop: 5,
    paddingBottom: 5,
    paddingHorizontal: 16,
    zIndex: 100,
  },
  contentPadding: {
    paddingTop: 48,
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
  section: {
    marginBottom: 20,
  },
  // 今日摄入热量卡片样式
  calorieSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  calorieSummaryGradient: {
    padding: 20,
  },
  calorieHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  calorieHeaderTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
  },
  calorieHeaderSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
  },
  calorieMain: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  calorieValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  calorieValue: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  calorieUnit: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 6,
  },
  calorieGoal: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginLeft: 8,
  },
  calorieProgressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  calorieProgressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  // 营养素部分样式
  nutritionSection: {
    padding: 16,
  },
  nutritionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 16,
  },
  nutritionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // 饼图样式
  pieChartContainer: {
    width: 100,
    height: 100,
    marginRight: 20,
  },
  pieChart: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
    position: 'relative',
  },
  pieProtein: {
    position: 'absolute',
    width: 50,
    height: 100,
    backgroundColor: '#26A69A',
    left: 0,
    top: 0,
  },
  pieCarbs: {
    position: 'absolute',
    width: 50,
    height: 100,
    backgroundColor: '#FF9800',
    right: 0,
    top: 0,
  },
  pieFat: {
    position: 'absolute',
    width: 50,
    height: 100,
    backgroundColor: '#2196F3',
    left: 50,
    top: 0,
  },
  pieCenter: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    top: 20,
    left: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pieCenterText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  pieCenterLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
  // 营养素列表
  nutritionList: {
    flex: 1,
  },
  nutritionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  nutritionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  nutritionLabel: {
    fontSize: 13,
    color: '#6B7280',
    width: 44,
  },
  nutritionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a2e',
    flex: 1,
  },
  nutritionPercent: {
    fontSize: 13,
    color: '#9CA3AF',
    width: 36,
    textAlign: 'right',
  },
  // 减脂食谱库样式
  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recipeMore: {
    fontSize: 13,
    color: '#26A69A',
  },
  recipeScrollView: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  recipeCard: {
    width: 160,
    marginRight: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  recipeImage: {
    width: '100%',
    height: 100,
    backgroundColor: '#F3F4F6',
  },
  recipeOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  recipeTags: {
    flexDirection: 'row',
    gap: 4,
  },
  recipeTag: {
    backgroundColor: 'rgba(38,166,154,0.85)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  recipeTagText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  recipeInfo: {
    padding: 12,
  },
  recipeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 6,
  },
  recipeMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  recipeMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recipeMetaText: {
    fontSize: 12,
    color: '#6B7280',
  },
  // 食谱列表弹窗样式
  recipeListItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  recipeListImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
  },
  recipeListInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  recipeListName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 6,
  },
  recipeListTags: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  recipeListTag: {
    fontSize: 11,
    color: '#26A69A',
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  recipeListMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  recipeListCal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF9800',
  },
  recipeListTime: {
    fontSize: 12,
    color: '#6B7280',
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
