import Purchases from "react-native-purchases";
import RevenueCatUI from "react-native-purchases-ui";

export const checkSubscription = async () => {
  const customerInfo = await Purchases.getCustomerInfo();

  const hasSubscription = customerInfo.entitlements.active["Pro"];

  if (hasSubscription) {
    return true;
  }

  await RevenueCatUI.presentPaywallIfNeeded({
    requiredEntitlementIdentifier: "Pro",
    displayCloseButton: false,
  });

  return false;
};
