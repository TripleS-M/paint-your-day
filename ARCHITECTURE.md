# Paint Your Day - App Architecture

## Overview

Paint Your Day is a minimalist time-visualization app where users assign activities (categories) to hourly time blocks, creating visual patterns that represent how their day was spent.

**Core Philosophy**: No timers, no productivity guilt, no instructions needed. Just interaction → meaning.

## Data Structure

### Core Types (`constants/types.ts`)

```typescript
interface Category {
  id: string;
  name: string;
  color: string;
  darkColor?: string;
}

interface TimeBlock {
  hour: number; // 0-23
  categoryId: string | null;
}

interface Day {
  date: string; // YYYY-MM-DD format
  blocks: TimeBlock[];
}

interface AppData {
  categories: Category[];
  days: Record<string, Day>;
}
```

### Default Categories
- Rest (Purple)
- Work (Blue)
- Movement (Tan)
- Connection (Pink)
- Learning (Green)
- Creative (Yellow)

## Data Management

### Data Service (`constants/dataService.ts`)

Singleton service handling all app data operations:

**Key Methods:**
- `initialize()` - Loads data from AsyncStorage or creates new
- `getOrCreateDay(dateString)` - Gets or creates a day's data
- `updateBlock(dateString, hour, categoryId)` - Updates a specific hour
- `addCategory(category)` - Adds new custom category
- `deleteCategory(categoryId)` - Removes category and clears it from all blocks
- `getCategory(categoryId)` - Retrieves category by ID
- `getInsights()` - Calculates statistics for analytics

**Storage**: AsyncStorage with key `paint_your_day_data`

## Component Architecture

### Today Screen (`app/(tabs)/today.tsx`)

Main interaction screen for painting today's day.

**Features:**
- Shows current date
- Horizontal scrollable category selector (always visible)
- 24-hour time blocks (displayed as 12 x 2-hour blocks)
- Time labels pinned to each block
- Clear button to toggle between paint/erase modes
- Data persists on selection

**Data Flow:**
1. Loads today's day data on focus
2. User selects category
3. User taps blocks to assign/clear categories
4. Changes immediately saved to AsyncStorage

### DayStrip Component (`components/DayStrip.tsx`)

Reusable horizontal scrollable time block display.

**Props:**
- `day: Day` - The day data to display
- `selectedCategory?: string | null` - Currently selected category
- `onBlockUpdate: (hour, categoryId) => void` - Update handler

**Renders:**
- Time blocks with fade-in animation for colors
- Time labels below blocks (pinned)

### TimeBlock Component (`components/TimeBlock.tsx`)

Individual hour block with visual feedback.

**Features:**
- Fade animation when color assigned
- Darkening overlay for selected state
- Border highlight on selection
- Smooth opacity transitions

### Mosaic Screen (`app/(tabs)/mosaic.tsx`)

Calendar view showing color patterns for each day.

**Features:**
- Month view with navigation
- Each day shows dominant color from its blocks
- Click "Today" to jump to current month
- Previous/Next month navigation
- Grid layout with day labels

**Data Usage:**
- Reads all stored days
- Calculates dominant color per day
- Shows empty/untracked days as default color

### Categories Screen (`app/(tabs)/categories.tsx`)

Manage available categories.

**Features:**
- List all categories with their colors
- Add new custom categories
- Color picker (12 preset colors)
- Delete custom categories (default categories cannot be deleted)
- Category ID display

**Workflow:**
1. Press "+ Add New Category"
2. Enter name
3. Select color from palette
4. Confirm addition

### Insights Screen (`app/(tabs)/insights.tsx`)

Analytics and reflection dashboard.

**Displays:**
- Total days reflected on
- Most used category with color
- Category usage breakdown with progress bars
- Total hours tracked
- Categories used count
- Emptiness message if no data yet

**Data Calculations:**
- Category frequency analysis
- Usage percentages
- Dominant activity detection

## Key Design Decisions

### 1. Efficiency & Code Reuse
- **Singleton DataService**: Single source of truth, prevents data inconsistencies
- **Reusable Components**: DayStrip and TimeBlock work with any Day object
- **Centralized Theme**: All colors defined in theme.ts, easy dark mode support

### 2. Data Persistence
- AsyncStorage for offline-first experience
- Automatic save on every block update
- No explicit save button needed
- Data survives app restart

### 3. Performance
- Only loads necessary data on screen focus
- useFocusEffect for efficient refresh
- No real-time sync overhead
- Minimal re-renders with proper component boundaries

### 4. User Experience
- No learning curve - tap color then tap blocks
- Visual feedback on every interaction
- Smooth animations (fade, opacity)
- Persistent selection throughout session

## Navigation

```
RootLayout (_layout.tsx)
├── Tabs Layout
│   ├── Today Screen
│   ├── Mosaic Screen
│   ├── Categories Screen
│   └── Insights Screen
└── Modal
```

## How to Extend

### Add a New Category
```typescript
await dataService.addCategory({
  name: 'Exercise',
  color: '#FFB6C1',
  darkColor: '#FF69B4'
});
```

### Add Custom Week View
1. Create `app/(tabs)/week.tsx`
2. Use `dataService.getDays()` to get date range
3. Reuse TimeBlock component for consistency
4. Add to tabs in `app/(tabs)/_layout.tsx`

### Modify Color Scheme
Edit `constants/theme.ts` to update:
- Category colors
- Default block color
- Light/dark mode colors

## File Structure

```
PaintYourDay/
├── app/
│   ├── _layout.tsx (initializes dataService)
│   ├── (tabs)/
│   │   ├── _layout.tsx (navigation config)
│   │   ├── today.tsx (main paint screen)
│   │   ├── mosaic.tsx (calendar view)
│   │   ├── categories.tsx (category manager)
│   │   └── insights.tsx (analytics)
│   └── modal.tsx
├── components/
│   ├── DayStrip.tsx (reusable block strip)
│   ├── TimeBlock.tsx (single block)
│   └── [other UI components]
├── constants/
│   ├── types.ts (data interfaces)
│   ├── dataService.ts (state management)
│   ├── theme.ts (visual theme)
│   └── ...
└── hooks/
```

## Testing the App

1. **Today Screen**
   - Select category → tap blocks → verify color fills
   - Tap block again → verify color persists
   - Switch to another category → old blocks keep their color
   - Restart app → colors are still there

2. **Mosaic Screen**
   - Add colors to today → mosaic shows dominant color
   - Navigate months → see pattern over time
   - Click "Today" → jumps to current month

3. **Categories Screen**
   - Add custom category → shows in today selector
   - Delete custom category → removes from blocks

4. **Insights Screen**
   - Select categories all day → see usage stats
   - Most used category highlights
   - Progress bars show relative usage

## Performance Notes

- App data grows linearly with days tracked
- Average day = ~1KB of JSON
- 365 days ≈ 365KB
- No performance issues expected for years of data
- AsyncStorage handles up to ~10MB on most devices

## Future Enhancements (Without Breaking MVP)

- Week view layout option
- Export/share day visualizations
- Recurring pattern detection
- Weekly reflections prompt
- Custom time block sizes
- Multiple people/families support
- Sync across devices (optional)
