# System Requirements

To develop or run **Paint Your Day** locally, ensure your environment is set up with the following tools.

## core Prerequisites

These are **required** to run the project javascript environment.

1.  **Node.js**:
    -   **Version**: LTS (Long Term Support) recommended (v18.x or newer).
    -   [Download Node.js](https://nodejs.org/)

2.  **package Manager**:
    -   **npm** (comes with Node.js) or **yarn**.

3.  **Git**:
    -   Required for version control.
    -   [Download Git](https://git-scm.com/)

---

## Mobile Development Environment

To run the app on a simulator or physical device, you need the Expo ecosystem.

### Option A: Physical Device (Easiest)
Run the app on your real phone.

*   **Expo Go App**: Download from the App Store (iOS) or Google Play (Android).
*   **connection**: Your phone and computer must be on the **same Wi-Fi network**.

### Option B: Emulators (Advanced)
Run the app on your computer.

#### For iOS (macOS only)
*   **Xcode**: Install from the Mac App Store.
*   **Command Line Tools**: Open Xcode -> Settings -> Locations and select the Command Line Tools.
*   **Simulator**: Open Xcode and launch a Simulator instance.

#### For Android (Windows/macOS/Linux)
*   **Android Studio**: [Download Android Studio](https://developer.android.com/studio).
*   **Android SDK**: Install via Android Studio.
*   **Virtual Device**: Set up an Android Virtual Device (AVD) using the Device Manager in Android Studio.
*   **Environment Variables**: Ensure `ANDROID_HOME` is set and `adb` is in your PATH.

---

## Troubleshooting common Issues

*   **"System limit for number of file watchers reached"**:
    *   On Linux/macOS, you may need to install **Watchman**.
    *   [Watchman Installation Guide](https://facebook.github.io/watchman/docs/install.html)

*   **Network Issues**:
    *   If using Expo Go, ensure you are not blocked by a firewall. You can try running `npx expo start --tunnel` if the LAN connection fails.
