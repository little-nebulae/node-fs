import { readFile } from "node:fs/promises";

import { DEFAULT_CHARACTER_ENCODING } from "@/constants";

export async function readTextFile({ path }: { path: string }) {
  const text = await readFile(path, { encoding: DEFAULT_CHARACTER_ENCODING });
  return text;
}
