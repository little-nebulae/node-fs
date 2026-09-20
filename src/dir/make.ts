import type { Result } from "@little-nebulae/result";

import { composeErrorMessage, UnexpectedError } from "@little-nebulae/error";
import { fail, succeed } from "@little-nebulae/result";
import { mkdir } from "node:fs/promises";

export async function makeDirectory({
  path,
}: {
  path: string;
}): Promise<Result<undefined, UnexpectedError>> {
  try {
    await mkdir(path);
    return succeed(undefined);
  } catch (error) {
    return fail(
      new UnexpectedError({
        message: composeErrorMessage({
          operation: "make directory",
          reason: "some unexpected error",
        }),
        cause: error,
        meta: null,
      }),
    );
  }
}
