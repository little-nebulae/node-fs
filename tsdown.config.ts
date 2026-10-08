import { defineConfig } from "tsdown";

export default defineConfig({
  // Build options
  exports: true,
  dts: true,
  // Lint options
  publint: true,
  attw: true,
});
