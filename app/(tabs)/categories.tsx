import { dataService } from '@/constants/dataService';
import { useTheme } from '@/constants/theme';
import type { Category } from '@/constants/types';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useRef, useState } from 'react';
import { Alert, Modal, Pressable, RefreshControl, ScrollView, Text, TextInput, View } from 'react-native';

const PASTEL_COLOR_OPTIONS = [
  '#D4C5F9', '#ADD5F7', '#F5E6D3', '#F7D4E0',
  '#D4F7E3', '#F7F0D4', '#E8D4F7', '#D4E8F7',
  '#F7E8D4', '#E8F7D4', '#F7D4D4', '#D4F7F7',
  '#F0D4F7', '#D4F7E8', '#E8E8D4', '#D4D4E8',
];

type ModalMode = 'add' | 'edit';

export default function CategoriesScreen() {
  const theme = useTheme();
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('add');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formColor, setFormColor] = useState(PASTEL_COLOR_OPTIONS[0]);
  const [refreshing, setRefreshing] = useState(false);
  const lastDataVersion = useRef<number>(0);

  useFocusEffect(
    useCallback(() => {
      loadCategories();
      return () => { };
    }, [])
  );

  const loadCategories = (skipVersionCheck = false) => {
    try {
      const currentVersion = dataService.getVersion();

      // Efficient check: if data hasn't changed, skip reload
      if (!skipVersionCheck && currentVersion === lastDataVersion.current && categories.length > 0) {
        return;
      }

      const allCategories = dataService.data.categories;
      // Copy array so React always receives a new reference
      setCategories([...allCategories]);
      lastDataVersion.current = currentVersion;
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Force reload on pull-to-refresh
    loadCategories(true);
    setRefreshing(false);
  };

  const openAddModal = () => {
    setModalMode('add');
    setEditingCategoryId(null);
    setFormName('');
    setFormColor(PASTEL_COLOR_OPTIONS[0]);
    setShowModal(true);
  };

  const openEditModal = (category: Category) => {
    setModalMode('edit');
    setEditingCategoryId(category.id);
    setFormName(category.name);
    // Use the category's actual color so it shows as selected
    setFormColor(category.color);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCategoryId(null);
    setFormName('');
    setFormColor(PASTEL_COLOR_OPTIONS[0]);
  };

  const handleSaveCategory = async () => {
    if (!formName.trim()) {
      Alert.alert('Error', 'Category name cannot be empty');
      return;
    }

    try {
      if (modalMode === 'add') {
        if (categories.length >= 8) {
          Alert.alert('Limit Reached', 'You can have a maximum of 8 categories');
          return;
        }
        await dataService.addCategory({ name: formName.trim(), color: formColor });
      } else {
        // Edit mode - only update if changes were made
        if (!editingCategoryId) return;

        const originalCategory = categories.find(c => c.id === editingCategoryId);
        if (!originalCategory) return;

        const hasChanges =
          formName.trim() !== originalCategory.name ||
          formColor !== originalCategory.color;

        if (hasChanges) {
          await dataService.updateCategory(editingCategoryId, {
            name: formName.trim(),
            color: formColor,
          });
        }
      }

      closeModal();
      loadCategories();
    } catch (error) {
      console.error(`Error ${modalMode === 'add' ? 'adding' : 'updating'} category:`, error);
      Alert.alert('Error', `Failed to ${modalMode === 'add' ? 'add' : 'update'} category`);
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    const category = dataService.getCategory(categoryId);
    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete "${category?.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dataService.deleteCategory(categoryId);
              loadCategories();
            } catch (error) {
              console.error('Error deleting category:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, paddingTop: 60, backgroundColor: theme.background }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 24, paddingBottom: 24 }}>
        <Text style={{ fontSize: 12, fontWeight: '600', color: theme.foreground, opacity: 0.5, letterSpacing: 0.5 }}>
          CATEGORIES
        </Text>
        <Text style={{ fontSize: 28, fontWeight: "bold", color: theme.foreground, marginTop: 4 }}>
          Your palette
        </Text>
      </View>

      {/* Categories List */}
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 24 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {categories.map((category) => (
          <View
            key={category.id}
            style={{
              backgroundColor: category.color,
              borderRadius: 12,
              padding: 16,
              marginBottom: 12,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#000' }}>
              {category.name}
            </Text>

            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
              <Pressable
                onPress={() => openEditModal(category)}
                style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
              >
                <Text style={{ fontSize: 14, color: '#000', fontWeight: '600' }}>Edit</Text>
              </Pressable>

              {/* Only show delete button for custom categories */}
              {category.id.startsWith('custom_') && (
                <Pressable
                  onPress={() => handleDeleteCategory(category.id)}
                  style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                >
                  <Text style={{ fontSize: 20, color: '#000', fontWeight: '600' }}>×</Text>
                </Pressable>
              )}
            </View>
          </View>
        ))}

        {/* Spacer */}
        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Add Category Button - Only show if less than 8 categories */}
      {categories.length < 8 && (
        <View style={{ paddingHorizontal: 24, paddingBottom: 28 }}>
          <Pressable
            onPress={openAddModal}
            style={({ pressed }) => ({
              borderWidth: 2,
              borderStyle: 'dashed',
              borderColor: theme.foreground,
              paddingVertical: 16,
              borderRadius: 12,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text style={{ fontSize: 16, fontWeight: '600', color: theme.foreground, textAlign: 'center', letterSpacing: 0.5 }}>
              + Add category
            </Text>
          </Pressable>
        </View>
      )}

      {/* Category Modal - Handles both Add and Edit */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16, width: '100%' }}>
            <Text style={{ fontSize: 20, fontWeight: '700', color: '#000', marginBottom: 12 }}>
              {modalMode === 'add' ? 'New category' : 'Edit category'}
            </Text>

            {/* Name Input */}
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#000', marginBottom: 6 }}>
              Name
            </Text>
            <TextInput
              placeholder="Category name"
              placeholderTextColor="#B0A8B9"
              value={formName}
              onChangeText={setFormName}
              style={{
                backgroundColor: '#f5f5f5',
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 10,
                fontSize: 16,
                color: '#000',
                marginBottom: 12,
                borderWidth: 1,
                borderColor: '#E0E0E0',
              }}
            />

            {/* Color Label */}
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#000', marginBottom: 10 }}>
              Color
            </Text>

            {/* Color Options - Include current color if not in preset options */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
              {/* Show current color first if editing and color is not in preset options */}
              {modalMode === 'edit' && !PASTEL_COLOR_OPTIONS.includes(formColor) && (
                <Pressable
                  onPress={() => setFormColor(formColor)}
                  style={{
                    width: '29%',
                    height: 55,
                    backgroundColor: formColor,
                    borderRadius: 12,
                    borderWidth: 3,
                    borderColor: '#000',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                />
              )}

              {/* Preset color options */}
              {PASTEL_COLOR_OPTIONS.map((color) => {
                const isSelected = formColor === color;
                return (
                  <Pressable
                    key={color}
                    onPress={() => setFormColor(color)}
                    style={{
                      width: '29%',
                      height: 55,
                      backgroundColor: color,
                      borderRadius: 12,
                      borderWidth: 3,
                      borderColor: isSelected ? '#000' : '#ddd',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  />
                );
              })}
            </View>

            {/* Action Buttons */}
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Pressable
                onPress={closeModal}
                style={({ pressed }) => ({
                  flex: 1,
                  backgroundColor: '#E0E0E0',
                  paddingVertical: 10,
                  borderRadius: 12,
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <Text style={{ color: '#666', fontWeight: '600', textAlign: 'center', fontSize: 16 }}>
                  Cancel
                </Text>
              </Pressable>

              <Pressable
                onPress={handleSaveCategory}
                style={({ pressed }) => ({
                  flex: 1,
                  backgroundColor: '#1a1a2e',
                  paddingVertical: 10,
                  borderRadius: 12,
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <Text style={{ color: '#fff', fontWeight: '600', textAlign: 'center', fontSize: 16 }}>
                  {modalMode === 'add' ? 'Create' : 'Confirm Edits'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
