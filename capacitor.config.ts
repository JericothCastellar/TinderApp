import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tinderapp.app',
  appName: 'TinderApp',
  webDir: 'www',
  plugins: {
    FilePicker: {
      multiple: false,
      types: ['image/*']
    }
  }
};

export default config;
