import type { AbortedErrorCause, AbortError } from "@little-nebulae/error";
import type { Result } from "@little-nebulae/result";

import {
  AbortedError,
  composeErrorMessage,
  isAbortError,
  isTimeoutError,
  TimedOutError,
  UnexpectedError,
} from "@little-nebulae/error";
import { fail, succeed } from "@little-nebulae/result";
import {
  AccessDeniedSystemError,
  FileTooBigSystemError,
  IsDirectorySystemError,
  isErrnoException,
  NameTooLongSystemError,
  NoEntrySystemError,
  NotDirectorySystemError,
  OutOfMemorySystemError,
  OverflowSystemError,
  PermissionDeniedSystemError,
  SYSTEM_ERROR_RECORD,
} from "@little-nebulae/system-error";
import { readFile } from "node:fs/promises";

import { DEFAULT_CHARACTER_ENCODING } from "@/constants";

export async function readTextFile({
  path,
  signal,
}: {
  path: string;
  signal?: AbortSignal;
}): Promise<
  Result<
    string,
    | AbortedError<
        AbortedErrorCause,
        | {
            abortReason: any;
          }
        | { caughtError: unknown }
      >
    | TimedOutError<{ abortError: AbortError }>
    | AccessDeniedSystemError
    | FileTooBigSystemError
    | IsDirectorySystemError
    | NameTooLongSystemError
    | NoEntrySystemError
    | NotDirectorySystemError
    | OutOfMemorySystemError
    | OverflowSystemError
    | PermissionDeniedSystemError
    | UnexpectedError
  >
> {
  try {
    const text = await readFile(path, {
      encoding: DEFAULT_CHARACTER_ENCODING,
      signal,
    });
    return succeed(text);
  } catch (error) {
    const operation = "read text file";

    if (signal) {
      const { aborted, reason } = signal;
      if (aborted) {
        const abortMessage = composeErrorMessage({
          operation,
          reason: "abort signal",
        });
        if (isAbortError(error)) {
          const originalError = error.cause;
          if (isTimeoutError(originalError)) {
            const timeoutMessage = composeErrorMessage({
              operation,
              reason: "timeout",
            });
            return fail(
              new TimedOutError({
                message: timeoutMessage,
                cause: originalError,
                meta: { abortError: error },
              }),
            );
          }
          return fail(
            new AbortedError({
              message: abortMessage,
              cause: error,
              meta: { abortReason: signal?.reason },
            }),
          );
        }
        return fail(
          new AbortedError({
            message: abortMessage,
            cause: { reason },
            meta: { caughtError: error },
          }),
        );
      }
    }

    if (isErrnoException(error)) {
      const errno = -(error.errno ?? 0);
      switch (errno) {
        case SYSTEM_ERROR_RECORD.PERMISSION_DENIED_SYSTEM_ERROR.errno.number: {
          return fail(
            new PermissionDeniedSystemError({
              message: `The operation to read file at ${path} was prevented by a file seal.`,
              cause: error,
              meta: null,
            }),
          );
        }
        case SYSTEM_ERROR_RECORD.NO_ENTRY_SYSTEM_ERROR.errno.number: {
          return fail(
            new NoEntrySystemError({
              message: `${path} does not exist or is a
              dangling symbolic link.`,
              cause: error,
              meta: null,
            }),
          );
        }
        case SYSTEM_ERROR_RECORD.OUT_OF_MEMORY_SYSTEM_ERROR.errno.number: {
          return fail(
            new OutOfMemorySystemError({
              message: "Insufficient kernel memory was available.",
              cause: error,
              meta: null,
            }),
          );
        }
        case SYSTEM_ERROR_RECORD.ACCESS_DENIED_SYSTEM_ERROR.errno.number: {
          return fail(
            new AccessDeniedSystemError({
              message: `The requested access to the file is not allowed, or search permission is denied for one of the directories in the path prefix of ${path}`,
              cause: error,
              meta: null,
            }),
          );
        }
        case SYSTEM_ERROR_RECORD.NOT_DIRECTORY_SYSTEM_ERROR.errno.number: {
          return fail(
            new NotDirectorySystemError({
              message: `A component used as a directory in ${path} is not a directory.`,
              cause: error,
              meta: null,
            }),
          );
        }
        case SYSTEM_ERROR_RECORD.IS_DIRECTORY_SYSTEM_ERROR.errno.number: {
          return fail(
            new IsDirectorySystemError({
              message: `${path} is a directory, not a file.`,
              cause: error,
              meta: null,
            }),
          );
        }
        case SYSTEM_ERROR_RECORD.FILE_TOO_BIG_SYSTEM_ERROR.errno.number: {
          return fail(
            new FileTooBigSystemError({
              message: `${path} refers to a file that is too big to be opened.`,
              cause: error,
              meta: null,
            }),
          );
        }
        case SYSTEM_ERROR_RECORD.NAME_TOO_LONG_SYSTEM_ERROR.errno.number: {
          return fail(
            new NameTooLongSystemError({
              message: `${path} or one of its components is too long.`,
              cause: error,
              meta: null,
            }),
          );
        }
        case SYSTEM_ERROR_RECORD.OVERFLOW_SYSTEM_ERROR.errno.number: {
          return fail(
            new OverflowSystemError({
              message: `${path} refers to a regular file that is too large to be opened.`,
              cause: error,
              meta: null,
            }),
          );
        }
      }
    }

    return fail(
      new UnexpectedError({
        message: composeErrorMessage({
          operation,
          reason: "some unexpected error",
        }),
        cause: error,
        meta: null,
      }),
    );
  }
}
