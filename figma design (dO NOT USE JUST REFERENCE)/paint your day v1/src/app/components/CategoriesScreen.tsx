import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, X } from 'lucide-react';
import { AppData, Category } from '../types';

interface CategoriesScreenProps {
  data: AppData;
  onUpdateData: (data: AppData) => void;
}

const presetColors = [
  '#E8D5F2', '#C8E6F5', '#F5E6D3', '#F5D5D8',
  '#D5F5E3', '#F5F0D5', '#E5E5F2', '#F2E5E5',
  '#E5F2F0', '#F2F0E5', '#F5E5F0', '#E5F0F5',
];

export function CategoriesScreen({ data, onUpdateData }: CategoriesScreenProps) {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(presetColors[0]);

  const handleCreateCategory = () => {
    if (!newName.trim()) return;

    const newCategory: Category = {
      id: Date.now().toString(),
      name: newName.trim(),
      color: newColor,
    };

    const updatedData: AppData = {
      ...data,
      categories: [...data.categories, newCategory],
    };

    onUpdateData(updatedData);
    setIsCreating(false);
    setNewName('');
    setNewColor(presetColors[0]);
  };

  const handleUpdateCategory = () => {
    if (!editingCategory || !newName.trim()) return;

    const updatedData: AppData = {
      ...data,
      categories: data.categories.map((c) =>
        c.id === editingCategory.id
          ? { ...c, name: newName.trim(), color: newColor }
          : c
      ),
    };

    onUpdateData(updatedData);
    setEditingCategory(null);
    setNewName('');
    setNewColor(presetColors[0]);
  };

  const handleDeleteCategory = (categoryId: string) => {
    const updatedData: AppData = {
      ...data,
      categories: data.categories.filter((c) => c.id !== categoryId),
    };

    onUpdateData(updatedData);
  };

  const startEditing = (category: Category) => {
    setEditingCategory(category);
    setNewName(category.name);
    setNewColor(category.color);
    setIsCreating(false);
  };

  const startCreating = () => {
    setIsCreating(true);
    setEditingCategory(null);
    setNewName('');
    setNewColor(presetColors[0]);
  };

  const cancelEdit = () => {
    setIsCreating(false);
    setEditingCategory(null);
    setNewName('');
    setNewColor(presetColors[0]);
  };

  return (
    <div className="flex flex-col h-full px-6 py-8">
      <div className="mb-8">
        <h2 className="text-sm uppercase tracking-wider text-gray-400 mb-1">Categories</h2>
        <h1 className="text-2xl text-gray-800">Your color palette</h1>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="space-y-3 mb-6">
          {data.categories.map((category) => (
            <motion.div
              key={category.id}
              className="p-4 rounded-xl flex items-center justify-between"
              style={{ backgroundColor: category.color }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-gray-800">{category.name}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => startEditing(category)}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {!isCreating && !editingCategory && (
          <motion.button
            onClick={startCreating}
            className="w-full p-4 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center gap-2 text-gray-600"
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-5 h-5" />
            <span>Add category</span>
          </motion.button>
        )}

        {(isCreating || editingCategory) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-lg mb-4">
              {isCreating ? 'New category' : 'Edit category'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-gray-400"
                  placeholder="Category name"
                  maxLength={20}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">Color</label>
                <div className="grid grid-cols-6 gap-2">
                  {presetColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewColor(color)}
                      className="w-full aspect-square rounded-lg transition-all"
                      style={{
                        backgroundColor: color,
                        border: newColor === color ? '3px solid #000' : '3px solid transparent',
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={cancelEdit}
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-100 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={isCreating ? handleCreateCategory : handleUpdateCategory}
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white"
                >
                  {isCreating ? 'Create' : 'Save'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}