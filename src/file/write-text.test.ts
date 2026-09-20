import { fsTest } from "@test/context";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { assert, describe, expect } from "vitest";

import { DEFAULT_CHARACTER_ENCODING } from "@/constants";
import { writeTextFile } from "@/file/write-text";

// Success cases
describe("writeTextFile function should succeed", async () => {
  fsTest("when used to write text data to disk", async ({ tempDirPath }) => {
    const path = join(tempDirPath, "hello.txt");
    const text = "Hello there!";

    const writeResult = await writeTextFile({ path, text });
    assert(writeResult.success);
    expect(writeResult.data).toBeUndefined();

    const readText = await readFile(path, {
      encoding: DEFAULT_CHARACTER_ENCODING,
    });
    expect(readText).toBe(text);
  });
});
