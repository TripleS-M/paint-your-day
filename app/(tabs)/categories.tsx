import { dataService } from '@/constants/dataService';
import { useTheme } from '@/constants/theme';
import type { Category } from '@/constants/types';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View, Modal, TextInput } from 'react-native';

const PASTEL_COLOR_OPTIONS = [
  '#D4C5F9', '#ADD5F7', '#F5E6D3', '#F7D4E0',
  '#D4F7E3', '#F7F0D4', '#E8D4F7', '#D4E8F7',
  '#F7E8D4', '#E8F7D4', '#F7D4D4', '#D4F7F7',
  '#F0D4F7', '#D4F7E8', '#E8E8D4', '#D4D4E8',
];

export default function CategoriesScreen() {
  const theme = useTheme();
  const [categories, setCategories] = useState<Category[]>([]);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(PASTEL_COLOR_OPTIONS[0]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadCategories();
      return () => {};
    }, [])
  );

  const loadCategories = () => {
    try {
      const allCategories = dataService.data.categories;
      setCategories(allCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleAddCategory = async () => {
    if (!newName.trim()) {
      Alert.alert('Error', 'Category name cannot be empty');
      return;
    }

    if (categories.length >= 8) {
      Alert.alert('Limit Reached', 'You can have a maximum of 8 categories');
      return;
    }

    try {
      await dataService.addCategory({ name: newName.trim(), color: newColor });
      setNewName('');
      setNewColor(PASTEL_COLOR_OPTIONS[0]);
      setShowNewForm(false);
      loadCategories();
    } catch (error) {
      console.error('Error adding category:', error);
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
      <ScrollView style={{ flex: 1, paddingHorizontal: 24 }} showsVerticalScrollIndicator={false}>
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
            
            {!category.id.startsWith('custom_') ? null : (
              <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                <Pressable
                  onPress={() => {
                    setEditingId(category.id);
                    setNewName(category.name);
                    setNewColor(category.color);
                  }}
                  style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                >
                  <Text style={{ fontSize: 14, color: '#000', fontWeight: '600' }}>Edit</Text>
                </Pressable>
                
                <Pressable
                  onPress={() => handleDeleteCategory(category.id)}
                  style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                >
                  <Text style={{ fontSize: 20, color: '#000', fontWeight: '600' }}>×</Text>
                </Pressable>
              </View>
            )}
          </View>
        ))}

        {/* Spacer */}
        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Add Category Button - Only show if less than 8 categories */}
      {categories.length < 8 && (
        <View style={{ paddingHorizontal: 24, paddingBottom: 28 }}>
          <Pressable
            onPress={() => {
              setShowNewForm(true);
              setEditingId(null);
              setNewName('');
              setNewColor(PASTEL_COLOR_OPTIONS[0]);
            }}
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

      {/* New Category Modal */}
      <Modal
        visible={showNewForm}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowNewForm(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16, width: '100%' }}>
            <Text style={{ fontSize: 20, fontWeight: '700', color: '#000', marginBottom: 12 }}>
              New category
            </Text>

            {/* Name Input */}
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#000', marginBottom: 6 }}>
              Name
            </Text>
            <TextInput
              placeholder="Category name"
              placeholderTextColor="#B0A8B9"
              value={newName}
              onChangeText={setNewName}
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

            {/* Pastel Color Options */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
              {PASTEL_COLOR_OPTIONS.map((color) => (
                <Pressable
                  key={color}
                  onPress={() => setNewColor(color)}
                  style={{
                    width: '29%',
                    height: 55,
                    backgroundColor: color,
                    borderRadius: 12,
                    borderWidth: 3,
                    borderColor: newColor === color ? '#000' : '#ddd',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                />
              ))}
            </View>

            {/* Action Buttons */}
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Pressable
                onPress={() => {
                  setShowNewForm(false);
                  setNewName('');
                  setNewColor(PASTEL_COLOR_OPTIONS[0]);
                  setEditingId(null);
                }}
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
                onPress={handleAddCategory}
                style={({ pressed }) => ({
                  flex: 1,
                  backgroundColor: '#1a1a2e',
                  paddingVertical: 10,
                  borderRadius: 12,
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <Text style={{ color: '#fff', fontWeight: '600', textAlign: 'center', fontSize: 16 }}>
                  Create
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
