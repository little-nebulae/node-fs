import type { Result } from "@little-nebulae/result";

import { composeErrorMessage, UnexpectedError } from "@little-nebulae/error";
import { fail, succeed } from "@little-nebulae/result";
import { readdir } from "node:fs/promises";

import { DEFAULT_CHARACTER_ENCODING } from "@/constants";

export async function readDirectory({
  path,
  recursive = false,
}: {
  path: string;
  recursive?: boolean;
}): Promise<Result<string[], UnexpectedError>> {
  try {
    const entryPaths = await readdir(path, {
      encoding: DEFAULT_CHARACTER_ENCODING,
      recursive,
    });
    return succeed(entryPaths);
  } catch (error) {
    return fail(
      new UnexpectedError({
        message: composeErrorMessage({
          operation: "read directory",
          reason: "some unexpected error",
        }),
        cause: error,
        meta: null,
      }),
    );
  }
}
