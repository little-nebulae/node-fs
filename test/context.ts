// oxlint-disable no-empty-pattern

import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "vitest";

export const fsTest = test.extend("tempDirPath", async ({}, { onCleanup }) => {
  const tempDirPath = await mkdtemp(join(tmpdir(), `test-`));

  onCleanup(async () => {
    await rm(tempDirPath, { recursive: true, force: true });
  });

  return tempDirPath;
});
