/** @type {import('expo/config').ExpoConfig} */

const appName = process.env.EXPO_PUBLIC_APP_NAME ?? 'Guitar Trainer';
const androidPackage =
  process.env.EXPO_PUBLIC_ANDROID_PACKAGE ?? 'com.guitar_trainer';

/** @param {import('expo/config').ConfigContext} param0 */
module.exports = ({ config }) => ({
  ...config,
  name: appName,
  slug: 'guitar-trainer',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  backgroundColor: '#1c1917',
  scheme: 'guitartrainer',
  ios: {
    supportsTablet: true,
  },
  android: {
    package: androidPackage,
    versionCode: 1,
    permissions: ['INTERNET', 'VIBRATE'],
    blockedPermissions: [
      'android.permission.SYSTEM_ALERT_WINDOW',
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.WRITE_EXTERNAL_STORAGE',
    ],
    adaptiveIcon: {
      backgroundColor: '#1c1917',
      foregroundImage: './assets/android-icon-foreground.png',
      monochromeImage: './assets/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: [
    'expo-sqlite',
    [
      'expo-splash-screen',
      {
        image: './assets/splash-icon.png',
        resizeMode: 'contain',
        backgroundColor: '#1c1917',
      },
    ],
    [
      'expo-build-properties',
      {
        android: {
          compileSdkVersion: 36,
          targetSdkVersion: 36,
          minSdkVersion: 24,
          buildToolsVersion: '36.0.0',
        },
      },
    ],
  ],
  extra: {
    ...config?.extra,
    eas: {
      ...config?.extra?.eas,
      projectId:
        process.env.EAS_PROJECT_ID ?? '05b233bc-5256-4353-aad6-dfa30c9cba92',
    },
  },
});
