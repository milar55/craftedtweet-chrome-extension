require('dotenv').config();

module.exports = {
  expo: {
    name: 'FitAI',
    slug: 'FitAI',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'fitai',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    splash: {
      image: './assets/images/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-camera',
        {
          cameraPermission: 'Allow FitAI to take photos of your meals for nutrition tracking',
        },
      ],
      [
        'expo-image-picker',
        {
          photosPermission: 'Allow FitAI to access your photo library',
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      // Explicitly pass env into the app runtime. This avoids relying on Metro's
      // EXPO_PUBLIC_* injection, which is currently not working in this setup.
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    },
  },
};

