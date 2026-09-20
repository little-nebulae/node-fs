import { composeErrorMessage, UnexpectedError } from "@little-nebulae/error";
import { fail } from "@little-nebulae/result";
import { writeFile } from "node:fs/promises";

import { DEFAULT_CHARACTER_ENCODING } from "@/constants";

export async function writeTextFile({
  path,
  text,
}: {
  path: string;
  text: string;
}) {
  try {
    await writeFile(path, text, { encoding: DEFAULT_CHARACTER_ENCODING });
  } catch (error) {
    return fail(
      new UnexpectedError({
        message: composeErrorMessage({
          operation: "write text file",
          reason: "some unexpected error",
        }),
        cause: error,
        meta: null,
      }),
    );
  }
}
