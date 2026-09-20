import { composeErrorMessage, UnexpectedError } from "@little-nebulae/error";
import { fail, succeed } from "@little-nebulae/result";
import { rm } from "node:fs/promises";

export async function removeFsEntry({
  path,
  recursive = false,
  force = false,
  retry = { enabled: false },
}: {
  path: string;
  recursive?: boolean;
  force?: boolean;
  retry?:
    | {
        enabled: false;
      }
    | {
        enabled: true;
        maxTimes: number;
        delay: number;
      };
}) {
  try {
    await rm(path, {
      recursive,
      force,
      maxRetries: retry.enabled ? retry.maxTimes : undefined,
      retryDelay: retry.enabled ? retry.delay : undefined,
    });
    return succeed(undefined);
  } catch (error) {
    return fail(
      new UnexpectedError({
        message: composeErrorMessage({
          operation: `remove fs entry at ${path}`,
          reason: "some unexpected error",
        }),
        cause: error,
        meta: null,
      }),
    );
  }
}
