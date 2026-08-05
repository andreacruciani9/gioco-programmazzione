import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'it.codeforge.academy',
  appName: 'CodeForge Academy',
  webDir: 'www',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
    iosScheme: 'capacitor'
  },
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_codeforge',
      iconColor: '#22d3ee'
    }
  },
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile'
  },
  android: {
    allowMixedContent: false,
    captureInput: true
  }
};

export default config;
