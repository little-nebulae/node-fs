import { AbortedError } from "@little-nebulae/error";
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

describe("readTextFile function should fail when", async () => {
  fsTest("its promise is aborted", async ({ tempDirPath }) => {
    // const content = "Hello there!";
    const path = join(tempDirPath, "hello.txt");
    // await writeFile(path, content);
    const controller = new AbortController();
    const signal = controller.signal;
    const abortReason = "Test abort";

    const readPromise = readTextFile({ path, signal });
    controller.abort(abortReason);
    const readResult = await readPromise;
    assert(readResult.success === false);
    const error = readResult.error;
    expect(error).toBeInstanceOf(AbortedError);
    expect(error.cause).toMatchObject({ reason: abortReason });
  });
});
