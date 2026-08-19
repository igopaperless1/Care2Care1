import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.care2care.app',
  appName: 'Care2Care',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#047857',
      showSpinner: false,
      androidSplashResourceName: 'splash'
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#047857'
    },
    Keyboard: {
      resize: 'body',
      style: 'DARK',
      resizeOnFullScreen: true
    }
  }
};

export default config;
