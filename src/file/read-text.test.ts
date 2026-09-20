import { AbortedError, isAbortError } from "@little-nebulae/error";
import {
  isErrnoException,
  SYSTEM_ERROR_RECORD,
} from "@little-nebulae/system-error";
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
    "with an AbortedError instance whose cause isn't an AbortError instance when its operation is aborted and the specified path doesn't exist",
    async ({ tempDirPath }) => {
      const path = join(tempDirPath, "hello.txt");
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

      expect(error.meta).toBeDefined();
      expect(error.meta).toHaveProperty("caughtError");
      // @ts-expect-error
      const caughtError = error.meta.caughtError;
      assert(isErrnoException(caughtError));
      expect(caughtError.errno).toBe(
        -SYSTEM_ERROR_RECORD.NO_ENTRY_SYSTEM_ERROR.errno.number,
      );
    },
  );

  fsTest(
    "with an AbortedError instance whose cause is an AbortError instance when its operation is aborted and the specified path does exist",
    async ({ tempDirPath }) => {
      const content = "Hello there!";
      const path = join(tempDirPath, "hello.txt");
      await writeFile(path, content);
      const controller = new AbortController();
      const signal = controller.signal;
      const abortReason = "Test abort";

      const readPromise = readTextFile({ path, signal });
      controller.abort(abortReason);
      const readResult = await readPromise;
      assert(readResult.success === false);
      const error = readResult.error;
      expect(error).toBeInstanceOf(AbortedError);
      expect(error.meta).toMatchObject({ abortReason });

      const originalError = error.cause;
      assert(isAbortError(originalError));
      expect(originalError.cause).toBe(abortReason);
    },
  );
});
