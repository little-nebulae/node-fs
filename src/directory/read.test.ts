import { fsTest } from "@test/context";
import { writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { assert, describe, expect } from "vitest";

import { readDirectory } from "@/directory/read";

// Success cases
describe("readDirectory function should succeed", async () => {
  fsTest("the specified directory does exist", async ({ tempDirPath }) => {
    const content = "Hello there!";
    const path = join(tempDirPath, "hello.txt");
    await writeFile(path, content);

    const readResult = await readDirectory({ path: tempDirPath });
    assert(readResult.success);
    const entryPaths = readResult.data;
    expect(entryPaths).toHaveLength(1);
    expect(entryPaths[0]).toBe(relative(tempDirPath, path));
  });
});
