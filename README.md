# Budjet Tracker

## Android

The Android Studio project is in `android/`. It wraps the existing React app
with Capacitor, so the web app remains the source of the interface and features.

### Requirements

- Node.js and npm
- Android Studio with the Android SDK installed
- Java 21

### Open and build

1. Install JavaScript dependencies with `npm install`.
2. Build the web app and copy it into Android with `npm run android:sync`.
3. Open the project in Android Studio with `npm run android:open`, or open the
   `android/` folder directly.
4. In Android Studio, select an emulator or connected device and run the app.

Run `npm run android:sync` again after changing the web app to update the
Android project with the latest build.
