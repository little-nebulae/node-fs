import type { Result } from "@little-nebulae/result";

import { composeErrorMessage, UnexpectedError } from "@little-nebulae/error";
import { fail, succeed } from "@little-nebulae/result";
import { mkdir } from "node:fs/promises";

export async function makeDirectoryRecursively({
  path,
}: {
  path: string;
}): Promise<Result<string | undefined, UnexpectedError>> {
  try {
    const createdDirPath = await mkdir(path, { recursive: true });
    return succeed(createdDirPath);
  } catch (error) {
    return fail(
      new UnexpectedError({
        message: composeErrorMessage({
          operation: "make directory recursively",
          reason: "some unexpected error",
        }),
        cause: error,
        meta: null,
      }),
    );
  }
}
