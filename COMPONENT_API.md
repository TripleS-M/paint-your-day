# Component API Reference

## DayStrip

Horizontal scrollable display of 24 hourly time blocks with pinned time labels.

### Props

```typescript
interface DayStripProps {
  day: Day;                                           // Day data to display
  selectedCategory?: string | null;                   // Currently selected category ID
  onBlockUpdate?: (hour: number, categoryId: string | null) => void; // Update handler
}
```

### Example Usage

```tsx
import DayStrip from '@/components/DayStrip';
import { dataService } from '@/constants/dataService';

const day = await dataService.getOrCreateDay('2026-01-07');

<DayStrip 
  day={day}
  selectedCategory={'work'}
  onBlockUpdate={async (hour, categoryId) => {
    await dataService.updateBlock('2026-01-07', hour, categoryId);
  }}
/>
```

### Behavior

- Renders 24 blocks in a horizontal scroll
- Each block shows hour with fade animation on color change
- Time labels (HH:00 - HH:00) pinned below blocks
- Centered vertically in flex container
- Gap of 16px between blocks

---

## TimeBlock

Individual hourly block with visual feedback and animations.

### Props

```typescript
interface TimeBlockProps {
  block: TimeBlock;              // TimeBlock object with hour and categoryId
  isSelected?: boolean;          // Whether this block's category is selected
  onPress?: () => void;          // Tap handler
}
```

### Example Usage

```tsx
import TimeBlock from '@/components/TimeBlock';

const block = { hour: 9, categoryId: 'work' };

<TimeBlock 
  block={block}
  isSelected={selectedCategory === 'work'}
  onPress={() => handleBlockPress(block.hour)}
/>
```

### Visual Feedback

- **Unassigned**: Light gray (#e0e0e0) with thin border
- **Assigned**: 
  - Fade-in color animation (400ms)
  - Darkening overlay (20% opacity)
  - Border highlight with darker shade (40% opacity)
- **Press State**: 90% opacity
- **Dimensions**: 60px width × 180px height, 14px border-radius

### Animations

- **Color Fade In**: 400ms timing when color assigned
- **Color Fade Out**: 300ms timing when color cleared
- Uses `useNativeDriver: false` for color interpolation

---

## DataService

Centralized singleton managing all app data with AsyncStorage persistence.

### Initialization

```typescript
import { dataService } from '@/constants/dataService';

// Called automatically in app root, but can be called manually
await dataService.initialize();
```

### Core Methods

#### `getOrCreateDay(dateString: string): Promise<Day>`

Gets existing day or creates empty day with 24 unassigned blocks.

```typescript
const day = await dataService.getOrCreateDay('2026-01-07');
// Returns: { date: '2026-01-07', blocks: [...24 blocks...] }
```

#### `updateBlock(dateString: string, hour: number, categoryId: string | null): Promise<void>`

Updates a specific block's category assignment.

```typescript
// Assign block to 'work'
await dataService.updateBlock('2026-01-07', 9, 'work');

// Clear block
await dataService.updateBlock('2026-01-07', 9, null);
```

#### `getCategory(categoryId: string): Category | undefined`

Retrieves category object by ID.

```typescript
const category = dataService.getCategory('work');
// Returns: { id: 'work', name: 'Work', color: '#ADD5F7', darkColor: '#7EB7E8' }
```

#### `addCategory(category: Omit<Category, 'id'>): Promise<Category>`

Adds new custom category. ID auto-generated with timestamp.

```typescript
const newCategory = await dataService.addCategory({
  name: 'Sports',
  color: '#FF6B6B'
});
// Generated ID: 'custom_1672531200000'
```

#### `updateCategory(categoryId: string, updates: Partial<Omit<Category, 'id'>>): Promise<void>`

Updates existing category properties.

```typescript
await dataService.updateCategory('work', { 
  name: 'Employment',
  color: '#6BCB77'
});
```

#### `deleteCategory(categoryId: string): Promise<void>`

Deletes category and removes it from all blocks.

```typescript
await dataService.deleteCategory('custom_1672531200000');
// Also sets categoryId to null for all blocks assigned to this category
```

#### `getDays(): Record<string, Day>`

Returns all stored days.

```typescript
const allDays = dataService.getDays();
// Returns: { '2026-01-07': {...}, '2026-01-08': {...}, ... }
```

#### `getInsights(): InsightsData`

Calculates analytics from stored days.

```typescript
const insights = dataService.getInsights();
// Returns: {
//   totalDaysTracked: 47,
//   totalBlocksAssigned: 156,
//   mostUsedCategory: Category,
//   categoryUsage: [{ category: Category, count: 42 }, ...]
// }
```

### Data Access

```typescript
// Access cached data directly (must be initialized first)
const appData = dataService.data;
console.log(appData.categories);
```

### Utility Methods

#### `clearAll(): Promise<void>`

Resets app to initial state (for testing only).

```typescript
await dataService.clearAll();
```

---

## Type Definitions

### Day

```typescript
interface Day {
  date: string;              // 'YYYY-MM-DD'
  blocks: TimeBlock[];       // 24 blocks (one per hour)
}
```

### TimeBlock

```typescript
interface TimeBlock {
  hour: number;              // 0-23
  categoryId: string | null; // null = unassigned
}
```

### Category

```typescript
interface Category {
  id: string;                // unique identifier
  name: string;              // display name
  color: string;             // hex color for light mode
  darkColor?: string;        // hex color for dark overlay
}
```

### AppData

```typescript
interface AppData {
  categories: Category[];
  days: Record<string, Day>; // key is YYYY-MM-DD
}
```

---

## Utility Functions

### Date Helpers

```typescript
import { formatDate, getTodayString, getDateString } from '@/constants/types';

// Format Date object to 'YYYY-MM-DD'
const dateStr = formatDate(new Date());

// Get today as 'YYYY-MM-DD'
const today = getTodayString();

// Get date string with offset (positive or negative days)
const yesterday = getDateString(-1);
const nextWeek = getDateString(7);
```

### Constants

```typescript
import { DEFAULT_CATEGORIES } from '@/constants/types';

// Access default categories
console.log(DEFAULT_CATEGORIES); // Array of 6 default categories
```

---

## Hooks

### useFocusEffect

Used to refresh data when screen comes into focus.

```tsx
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

useFocusEffect(
  useCallback(() => {
    loadData();
    return () => {}; // cleanup
  }, [])
);
```

---

## Storage Schema

Data stored in AsyncStorage under key: `paint_your_day_data`

```json
{
  "categories": [
    {
      "id": "rest",
      "name": "Rest",
      "color": "#D4C5F9",
      "darkColor": "#9B8FD9"
    }
  ],
  "days": {
    "2026-01-07": {
      "date": "2026-01-07",
      "blocks": [
        { "hour": 0, "categoryId": null },
        { "hour": 1, "categoryId": "rest" }
      ]
    }
  }
}
```

---

## Best Practices

### In Components

✅ **Do:**
- Call `dataService.initialize()` in app root
- Use `useFocusEffect` to reload data when screen appears
- Handle errors gracefully with try/catch

❌ **Don't:**
- Call `dataService.initialize()` in multiple places
- Assume data is loaded without awaiting
- Modify `dataService.data` directly; use provided methods

### When Adding Screens

1. Add navigation entry in `app/(tabs)/_layout.tsx`
2. Call `useFocusEffect` to reload relevant data
3. Handle loading/error states
4. Use `dataService.getDays()` or `getInsights()` for read operations
5. Use `updateBlock()` for single updates, `updateCategory()` for bulk changes

### Performance

- Data service caches all data in memory
- AsyncStorage persists to disk asynchronously
- No real-time sync - changes are local-first
- For 1000+ days of data, consider filtering by date range before display
