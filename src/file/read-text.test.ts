import { NoEntrySystemError } from "@little-nebulae/system-error";
import { fsTest } from "@test/context";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { assert, describe, expect } from "vitest";

import { readTextFile } from "@/file/read-text";

// Success cases
describe("readTextFile function should succeed when", async () => {
  fsTest(
    "a text file does exist at the specified path",
    async ({ tempDirPath }) => {
      const content = "Hello there!";
      const path = join(tempDirPath, "hello.txt");
      await writeFile(path, content);

      const readResult = await readTextFile({ path });
      assert(readResult.success);
      expect(readResult.data).toBe(content);
    },
  );
});

// Failure cases
describe("readTextFile function should fail", async () => {
  fsTest(
    "with a NotDirectorySystemError when the specified path doesn't exist",
    async ({ tempDirPath }) => {
      const path = join(tempDirPath, "hello.txt");

      const readResult = await readTextFile({ path });
      assert(readResult.success === false);
      expect(readResult.error).toBeInstanceOf(NoEntrySystemError);
    },
  );
});
