import { registerRootComponent } from "expo";

import App from "./App";
import { defineTask } from "expo-task-manager";
import { registerTaskAsync } from "expo-notifications";

// Background task
// https://github.com/expo/expo/tree/main/packages/expo-notifications#handling-incoming-notifications-when-the-app-is-not-in-the-foreground-not-supported-in-expo-go
const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND-NOTIFICATION-TASK";
defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error }) => {
  console.log(
    `${Platform.OS} BACKGROUND-NOTIFICATION-TASK: App in ${AppState.currentState} state.`,
  );

  if (error) {
    console.log(`${Platform.OS} BACKGROUND-NOTIFICATION-TASK: Error! ${JSON.stringify(error)}`);

    return;
  }

  if (AppState.currentState.match(/inactive|background/) === null) {
    console.log(
      `${Platform.OS} BACKGROUND-NOTIFICATION-TASK: App not in background state, skipping task.`,
    );

    return;
  }

  console.log(
    `${
      Platform.OS
    } BACKGROUND-NOTIFICATION-TASK: Received a notification in the background! ${JSON.stringify(
      data,
      null,
      2,
    )}`,
  );
});

registerTaskAsync(BACKGROUND_NOTIFICATION_TASK)
  .then(() => {
    console.log(`Notifications.registerTaskAsync success: ${BACKGROUND_NOTIFICATION_TASK}`);
  })
  .catch((reason) => {
    console.log(`Notifications registerTaskAsync failed: ${reason}`);
  });

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
