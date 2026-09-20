import type { Result } from "@little-nebulae/result";

import { composeErrorMessage, UnexpectedError } from "@little-nebulae/error";
import { fail, succeed } from "@little-nebulae/result";
import { writeFile } from "node:fs/promises";

import { DEFAULT_CHARACTER_ENCODING } from "@/constants";

export async function writeTextFile({
  path,
  text,
}: {
  path: string;
  text: string;
}): Promise<Result<undefined, UnexpectedError>> {
  try {
    await writeFile(path, text, { encoding: DEFAULT_CHARACTER_ENCODING });
    return succeed(undefined);
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
