import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Screen } from '@/components/Screen';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useSafeRouter } from '@/hooks/useSafeRouter';

export default function EditProfileScreen() {
  const router = useSafeRouter();

  const [formData, setFormData] = useState({
    name: '健康达人',
    signature: '追求健康生活，享受美好人生',
    age: '28',
    gender: '女',
    height: '175',
    region: '北京',
    email: 'health@example.com',
    phone: '138****8888',
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // 调用API保存
    Alert.alert('保存成功', '您的资料已更新', [
      { text: '确定', onPress: () => router.back() },
    ]);
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Screen>
      {/* 返回键行 */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>编辑资料</Text>
        <View style={styles.headerRight} />
      </View>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={[styles.contentContainer, { paddingBottom: 100 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* 头像区域 */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200' }}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.cameraButton}>
                <FontAwesome6 name="camera" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.avatarTip}>点击更换头像</Text>
          </View>

          {/* 基本信息 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>基本信息</Text>
            <View style={styles.card}>
              <View style={[styles.formItem, styles.formItemBorder]}>
                <Text style={styles.formLabel}>昵称</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.name}
                  onChangeText={(value) => updateField('name', value)}
                  placeholder="请输入昵称"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <View style={styles.formItem}>
                <Text style={styles.formLabel}>性别</Text>
                <View style={styles.genderSelector}>
                  {['男', '女'].map((gender) => (
                    <TouchableOpacity
                      key={gender}
                      style={[
                        styles.genderOption,
                        formData.gender === gender && styles.genderOptionActive,
                      ]}
                      onPress={() => updateField('gender', gender)}
                    >
                      <Text
                        style={[
                          styles.genderText,
                          formData.gender === gender && styles.genderTextActive,
                        ]}
                      >
                        {gender}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </View>

          {/* 个人签名 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>个人签名</Text>
            <View style={styles.card}>
              <View style={styles.signatureContainer}>
                <TextInput
                  style={styles.signatureInput}
                  value={formData.signature}
                  onChangeText={(value) => updateField('signature', value)}
                  placeholder="介绍一下自己吧"
                  placeholderTextColor="#9CA3AF"
                  multiline
                  maxLength={100}
                />
                <Text style={styles.wordCount}>{formData.signature.length}/100</Text>
              </View>
            </View>
          </View>

          {/* 详细信息 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>详细信息</Text>
            <View style={styles.card}>
              <View style={[styles.formItem, styles.formItemBorder]}>
                <Text style={styles.formLabel}>年龄</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.age}
                  onChangeText={(value) => updateField('age', value)}
                  placeholder="请输入年龄"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.formItem, styles.formItemBorder]}>
                <Text style={styles.formLabel}>身高</Text>
                <View style={styles.unitInput}>
                  <TextInput
                    style={styles.formInput}
                    value={formData.height}
                    onChangeText={(value) => updateField('height', value)}
                    placeholder="请输入身高"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                  />
                  <Text style={styles.unit}>cm</Text>
                </View>
              </View>
              <View style={styles.formItem}>
                <Text style={styles.formLabel}>地区</Text>
                <TouchableOpacity style={styles.pickerButton}>
                  <Text style={styles.pickerText}>{formData.region}</Text>
                  <Ionicons name="chevron-down" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* 联系方式 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>联系方式</Text>
            <View style={styles.card}>
              <View style={[styles.formItem, styles.formItemBorder]}>
                <Text style={styles.formLabel}>邮箱</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.email}
                  onChangeText={(value) => updateField('email', value)}
                  placeholder="请输入邮箱"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              <View style={styles.formItem}>
                <Text style={styles.formLabel}>手机号</Text>
                <View style={styles.phoneRow}>
                  <Text style={styles.phoneText}>{formData.phone}</Text>
                  <TouchableOpacity>
                    <Text style={styles.changeText}>更换</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* 健康目标 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>健康目标</Text>
            <View style={styles.card}>
              <View style={[styles.formItem, styles.formItemBorder]}>
                <View style={styles.formLabelRow}>
                  <Text style={styles.formLabel}>当前体重</Text>
                  <View style={styles.currentBadge}>
                    <Text style={styles.currentBadgeText}>当前</Text>
                  </View>
                </View>
                <View style={styles.unitInput}>
                  <TextInput
                    style={styles.formInput}
                    value="68.5"
                    placeholder="kg"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="decimal-pad"
                  />
                  <Text style={styles.unit}>kg</Text>
                </View>
              </View>
              <View style={[styles.formItem, styles.formItemBorder]}>
                <View style={styles.formLabelRow}>
                  <Text style={styles.formLabel}>目标体重</Text>
                  <View style={styles.targetBadge}>
                    <Text style={styles.targetBadgeText}>目标</Text>
                  </View>
                </View>
                <View style={styles.unitInput}>
                  <TextInput
                    style={styles.formInput}
                    value="65"
                    placeholder="kg"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="decimal-pad"
                  />
                  <Text style={styles.unit}>kg</Text>
                </View>
              </View>
              <View style={styles.formItem}>
                <Text style={styles.formLabel}>目标描述</Text>
                <TouchableOpacity style={styles.pickerButton}>
                  <Text style={styles.pickerText}>减脂增肌</Text>
                  <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* 底部保存按钮 */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>保存修改</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 80,
  },
  headerRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#F9FAFB',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerRight: {
    width: 32,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#26A69A',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#26A69A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarTip: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 10,
    paddingLeft: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  formItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  formItemBorder: {
    
    borderBottomColor: '#F9FAFB',
  },
  formLabel: {
    fontSize: 15,
    color: '#1a1a2e',
    minWidth: 70,
  },
  formLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  formInput: {
    flex: 1,
    fontSize: 15,
    color: '#1a1a2e',
    textAlign: 'right',
  },
  genderSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  genderOption: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  genderOptionActive: {
    backgroundColor: '#26A69A',
  },
  genderText: {
    fontSize: 14,
    color: '#6B7280',
  },
  genderTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  signatureContainer: {
    padding: 16,
  },
  signatureInput: {
    fontSize: 15,
    color: '#1a1a2e',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  wordCount: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
    marginTop: 8,
  },
  unitInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  unit: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pickerText: {
    fontSize: 15,
    color: '#1a1a2e',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  phoneText: {
    fontSize: 15,
    color: '#6B7280',
  },
  changeText: {
    fontSize: 14,
    color: '#26A69A',
    fontWeight: '600',
  },
  currentBadge: {
    backgroundColor: '#FF980020',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  currentBadgeText: {
    fontSize: 10,
    color: '#FF9800',
  },
  targetBadge: {
    backgroundColor: '#26A69A20',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  targetBadgeText: {
    fontSize: 10,
    color: '#26A69A',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 34,
    backgroundColor: '#F9FAFB',
  },
  saveButton: {
    backgroundColor: '#26A69A',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
