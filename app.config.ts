import { ConfigContext, ExpoConfig } from "expo/config";

const IS_DEV = process.env.APP_VARIANT === "development";
const IS_PREVIEW = process.env.APP_VARIANT === "preview";

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return "com.rezipehub.app.dev";
  }

  if (IS_PREVIEW) {
    return "com.rezipehub.app.preview";
  }

  return "com.rezipehub.app";
};

const getAppName = () => {
  if (IS_DEV) {
    return "RezipeHub (Dev)";
  }

  if (IS_PREVIEW) {
    return "RezipeHub (Preview)";
  }

  return "RezipeHub";
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: getAppName(),
  slug: "rezipehub",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icons/ios-light.png",
  scheme: "yumhub-frontend",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/icons/splash-icon-light.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: getUniqueIdentifier(),
    infoPlist: {
      LSApplicationQueriesSchemes: ["instagram", "linkedin"],
    },
    config: {
      usesNonExemptEncryption: false,
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: getUniqueIdentifier(),
    googleServicesFile: "./google-services.json",
    permissions: ["android.permission.RECORD_AUDIO"],
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-build-properties",
      {
        android: {
          usesCleartextTraffic: true,
        },
      },
    ],
    "expo-font",
    "expo-secure-store",
    [
      "expo-image-picker",
      {
        photosPermission: "The app accesses your photos to let you share them with your friends.",
      },
    ],
    [
      "expo-notifications",
      {
        enableBackgroundRemoteNotifications: true,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: "ea0d53b5-ee50-4700-bbb4-640b3dfbd0ae",
    },
  },
  runtimeVersion: {
    policy: "appVersion",
  },
  updates: {
    url: "https://u.expo.dev/1b605a41-9a9a-48fe-81db-fbe1ed52d5f7",
  },
  owner: "ryokko",
});
