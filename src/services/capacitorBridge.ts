import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

export function initializeCapacitorBridge() {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  // Hide splash screen smoothly once React mounts
  try {
    SplashScreen.hide().catch(() => {});
  } catch {
    // Ignore if not supported
  }

  // Configure status bar color and dark icons/light background
  try {
    StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
    StatusBar.setBackgroundColor({ color: '#047857' }).catch(() => {});
  } catch {
    // Ignore if not supported
  }

  // Handle hardware Android back button
  try {
    CapApp.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack && window.history.length > 1) {
        window.history.back();
      } else {
        // Exit application if no navigation history
        CapApp.exitApp().catch(() => {});
      }
    });
  } catch {
    // Ignore if not supported
  }
}
