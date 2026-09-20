import type { Result } from "@little-nebulae/result";

import { composeErrorMessage, UnexpectedError } from "@little-nebulae/error";
import { fail, succeed } from "@little-nebulae/result";
import { realpath } from "node:fs/promises";

import { DEFAULT_CHARACTER_ENCODING } from "@/constants";

export async function resolveRealPath({
  path,
}: {
  path: string;
}): Promise<Result<string, UnexpectedError>> {
  try {
    const realPath = await realpath(path, {
      encoding: DEFAULT_CHARACTER_ENCODING,
    });
    return succeed(realPath);
  } catch (error) {
    return fail(
      new UnexpectedError({
        message: composeErrorMessage({
          operation: "resolve real path",
          reason: "some unexpected error",
        }),
        cause: error,
        meta: null,
      }),
    );
  }
}
