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
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    height: 50,
    zIndex: 10,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerRight: {
    width: 32,
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  contentContainer: {
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: 20,
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
    borderColor: '#FFFFFF',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarTip: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 4,
  },
  formItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  formItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  formLabel: {
    fontSize: 15,
    color: '#374151',
    width: 50,
  },
  formInput: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
    textAlign: 'right',
  },
  genderSelector: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  genderOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginLeft: 8,
  },
  genderOptionActive: {
    backgroundColor: '#10B981',
  },
  genderText: {
    fontSize: 14,
    color: '#6B7280',
  },
  genderTextActive: {
    color: '#FFFFFF',
  },
  signatureContainer: {
    padding: 16,
  },
  signatureInput: {
    fontSize: 15,
    color: '#1F2937',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  wordCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
  },
});
