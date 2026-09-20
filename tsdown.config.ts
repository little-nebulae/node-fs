import { defineConfig } from "tsdown";

export default defineConfig({
  // Build options
  entry: ["./src/index.ts"],
  platform: "node",
  exports: true,
  dts: true,
  // Lint options
  publint: true,
  attw: true,
});
