import { dataService } from '@/constants/dataService';
import { useTheme } from '@/constants/theme';
import type { Category } from '@/constants/types';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';

const COLOR_OPTIONS = [
  '#D4C5F9', '#ADD5F7', '#F5E6D3', '#F7D4E0',
  '#D4F7E3', '#F7F0D4', '#E5E5F2', '#F2E5E5',
  '#E5F2F0', '#F2F0E5', '#F5E5F0', '#E5F0F5',
];

export default function CategoriesScreen() {
  const theme = useTheme();
  const [categories, setCategories] = useState<Category[]>([]);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(COLOR_OPTIONS[0]);

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

    try {
      await dataService.addCategory({ name: newName.trim(), color: newColor });
      setNewName('');
      setNewColor(COLOR_OPTIONS[0]);
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
            <View>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#000' }}>
                {category.name}
              </Text>
              <Text style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                ID: {category.id}
              </Text>
            </View>
            
            {!category.id.startsWith('custom_') ? null : (
              <Pressable
                onPress={() => handleDeleteCategory(category.id)}
                style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
              >
                <Text style={{ fontSize: 20, color: '#666' }}>×</Text>
              </Pressable>
            )}
          </View>
        ))}

        {/* Add New Category Form */}
        {showNewForm && (
          <View style={{ backgroundColor: '#f0f0f0', borderRadius: 12, padding: 16, marginBottom: 12 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.foreground, marginBottom: 12 }}>
              New Category
            </Text>

            {/* Name input placeholder */}
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: '#ddd',
              }}
            >
              <Text style={{ fontSize: 14, color: newName ? theme.foreground : '#999' }}>
                {newName || 'Enter category name'}
              </Text>
            </View>

            {/* Color Picker */}
            <Text style={{ fontSize: 12, color: theme.foreground, opacity: 0.6, marginBottom: 8 }}>
              Select Color
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              {COLOR_OPTIONS.map((color) => (
                <Pressable
                  key={color}
                  onPress={() => setNewColor(color)}
                  style={{
                    width: '23%',
                    aspectRatio: 1,
                    backgroundColor: color,
                    borderRadius: 8,
                    borderWidth: newColor === color ? 3 : 1,
                    borderColor: newColor === color ? '#000' : '#ddd',
                  }}
                />
              ))}
            </View>

            {/* Action Buttons */}
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Pressable
                onPress={handleAddCategory}
                style={({ pressed }) => ({
                  flex: 1,
                  backgroundColor: newColor,
                  paddingVertical: 10,
                  borderRadius: 8,
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <Text style={{ color: '#000', fontWeight: '600', textAlign: 'center' }}>
                  Add
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setShowNewForm(false);
                  setNewName('');
                  setNewColor(COLOR_OPTIONS[0]);
                }}
                style={({ pressed }) => ({
                  flex: 1,
                  backgroundColor: '#ddd',
                  paddingVertical: 10,
                  borderRadius: 8,
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <Text style={{ color: '#666', fontWeight: '600', textAlign: 'center' }}>
                  Cancel
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Add Category Button */}
      {!showNewForm && (
        <View style={{ paddingHorizontal: 24, paddingBottom: 28 }}>
          <Pressable
            onPress={() => setShowNewForm(true)}
            style={({ pressed }) => ({
              backgroundColor: '#f0f0f0',
              paddingVertical: 12,
              borderRadius: 12,
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#666', textAlign: 'center' }}>
              + Add New Category
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
