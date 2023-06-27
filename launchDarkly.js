import * as LaunchDarkly from "launchdarkly-node-server-sdk";

export const launchDarklyQuery = async ({ featureFlagKey, context }) => {
  const sdkKey = process.env.LAUNCH_DARKLY_SDK_KEY;

  if (sdkKey == "") {
    return {
      success: false,
      error: "The LaunchDarkly SDK key is missing",
    };
  }

  try {
    const ldClient = LaunchDarkly.init(sdkKey);
    await ldClient.waitForInitialization();
    const flagValue = await ldClient.variation(featureFlagKey, context, {
      success: false,
      error: "Invalid featureFlag key",
    });

    ldClient.flush(() => {
      ldClient.close();
    });
    return flagValue;
  } catch (error) {
    return {
      success: false,
      error: "SDK failed to initialize: " + error,
    };
  }
};
