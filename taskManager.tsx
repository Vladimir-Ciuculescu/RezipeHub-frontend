import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";

const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND_NOTIFICATION_TASK";

// Define the background task
TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async ({ data, error, executionInfo }) => {
  if (error) {
    console.error("Background notification task error:", error);
    return;
  }

  // Increment the badge count by +1
  const currentBadgeCount = await Notifications.getBadgeCountAsync();
  await Notifications.setBadgeCountAsync(currentBadgeCount + 1);
});

// Register the background task
export async function registerNotificationTask() {
  try {
    const tasks = await TaskManager.getRegisteredTasksAsync();
    const taskRegistered = tasks.find((task) => task.taskName === BACKGROUND_NOTIFICATION_TASK);

    if (!taskRegistered) {
      await Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
      console.log("Background notification task registered.");
    }
  } catch (err) {
    console.error("Failed to register background notification task:", err);
  }
}
