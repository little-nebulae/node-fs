import { readdir } from "node:fs/promises";

import { DEFAULT_CHARACTER_ENCODING } from "@/constants";

export async function readDirectory({
  path,
  recursive = false,
}: {
  path: string;
  recursive?: boolean;
}) {
  const entryPaths = await readdir(path, {
    encoding: DEFAULT_CHARACTER_ENCODING,
    recursive,
  });
  return entryPaths;
}
