import express from "express";
import { launchDarklyQuery } from "./launchdarkly.js";

const router = express.Router();
router.use(express.json());

router.get("/:id", async function (req, res) {
  const { id } = req.params;
  const featureFlagKey = "categoriesToCollapse";
  const context = {
    kind: "user",
    key: "example-context-key",
    name: "Sandy",
  };

  const launchDarklyResult = await launchDarklyQuery({
    featureFlagKey,
    context,
  });

  if (launchDarklyResult.error) {
    console.log("***error****");
    console.log(launchDarklyResult);
    res.json({
      success: launchDarklyResult.success,
      error: launchDarklyResult.error,
    });
  } else {
    console.log(id);
    console.log(launchDarklyResult);
    const isCategoryCollapsed =
      launchDarklyResult.split(",").filter((e) => e === id).length > 0;

    res.json({
      success: true,
      isCategoryCollapsed,
    });
  }

  //
  //     .then(function () {
  //       ldClient.variation(
  //         featureFlagKey,
  //         context,
  //         false,
  //         function (err, flagValue) {
  //           categoriesToCollapse = flagValue.split(",");
  //           console.log(categoriesToCollapse);
  //           res.json({
  //             success: true,
  //             payload: "Feature flag '" + featureFlagKey + "' is " + flagValue,
  //           });

  //           ldClient.flush(function () {
  //             ldClient.close();
  //           });
  //         }
  //       );
  //     })
  //     .catch(function (error) {
  //       res.json({
  //         success: false,
  //         payload: "SDK failed to initialize: " + error,
  //       });
  //       process.exit(1);
  //     });
});

export default router;
