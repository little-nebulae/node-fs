import { writeFile } from "node:fs/promises";

import { DEFAULT_CHARACTER_ENCODING } from "@/constants";

export async function writeTextFile({
  path,
  text,
}: {
  path: string;
  text: string;
}) {
  await writeFile(path, text, { encoding: DEFAULT_CHARACTER_ENCODING });
}
