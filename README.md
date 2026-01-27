# Paint Your Day 🎨

Paint Your Day is a minimalist time-visualization app designed to help you track your day with color and meaning, rather than strict schedules and timers. By assigning categories (like Work, Rest, Creative) to time blocks, you create a visual pattern of your life, offering insights into how you spend your most valuable resource.

> **Philosophy**: No timers, no productivity guilt, no instructions needed. Just interaction → meaning.

## ✨ Features

### 📅 Today: Paint Your Day
The core of the app.
- **Interactive Grid**: A 24-hour grid where each block represents an hour of your day.
- **Paint with Color**: Select a category (e.g., Creative, Work, Rest) and tap time blocks to "paint" them.
- **Intuitive Interface**: Single tap to paint, tap again to modify.
- **Real-time Saving**: Your data is saved instantly as you paint.

### 🧩 Mosaic: The Big Picture
See your life in pixels.
- **Calendar View**: View your month as a colorful mosaic.
- **Dominant Moods**: Each day in the calendar reflects the dominant category/color of that day.
- **Navigation**: Easily browse through past months and years to see long-term patterns.

### 📊 Insights: Deep Analytics
Understand your habits.
- **Usage Breakdown**: See exactly how much time you spend on each category.
- **Visual Stats**: Progress bars and color-coded statistics helps you visualize balance (or imbalance).
- **Reflection**: Tracks total days logged and highlights your most frequent activities.

### 🎨 Fully Customizable
Make it yours.
- **Custom Categories**: Create your own categories with custom names and colors.
- **Manage**: Add, edit, or delete categories to fit your changing lifestyle.

---

## 🚀 How It Works

1.  **Select a Category**: Tap a color from the category strip at the top (e.g., "Work" in Blue).
2.  **Paint Time Blocks**: Tap the hour blocks for the times you spent working.
3.  **Review**: Watch your day fill up with color.
4.  **Reflect**: Check the Mosaic and Insights tabs to see trends over time.

---

## 🛠️ Tech Stack

-   **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native)
-   **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/)
-   **Storage**: AsyncStorage (Local persistence)
-   **Icons**: FontAwesome & Expo Symbols

---

## 🏃‍♂️ Getting Started

### Prerequisites
Please see [REQUIREMENTS.md](./REQUIREMENTS.md) for a list of tools you need installed on your machine.

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/paintyourday.git
    cd paintyourday
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

### Running the App

Start the development server:

```bash
npx expo start
```

This will display a QR code in your terminal.
-   **Physical Device**: Scan the QR code with the **Expo Go** app (Android/iOS).
-   **Emulator**: Press `a` to open in Android Emulator or `i` to open in iOS Simulator (requires setup, see Requirements).

---

## 📂 Project Structure

```
PaintYourDay/
├── app/                 # Main application code (Expo Router)
│   ├── (tabs)/          # Tab navigation screens (Today, Mosaic, etc.)
│   └── _layout.tsx      # Root layout and navigation setup
├── components/          # Reusable UI components (DayStrip, TimeBlock)
├── constants/           # Data services, themes, and types
├── assets/              # Images and fonts
└── hooks/               # Custom React hooks
```
