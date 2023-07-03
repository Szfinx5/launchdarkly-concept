import express from "express";
import { launchDarklyQuery } from "./launchDarkly.js";

const router = express.Router();
router.use(express.json());

router.get("/", async function (req, res) {
  res.json({
    success: true,
    message: "Please provide a category ID",
  });
});

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
    res.json({
      success: launchDarklyResult.success,
      error: launchDarklyResult.error,
    });
  } else {
    const isCategoryCollapsed =
      launchDarklyResult.split(",").filter((e) => e === id).length > 0;

    res.json({
      success: true,
      isCategoryCollapsed,
    });
  }
});

export default router;
