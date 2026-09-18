import type { Failure, Success } from "@/types";

export function succeed<TData>(data: TData): Success<TData> {
  return { success: true, data };
}

export function fail<TError extends Error>(error: TError): Failure<TError> {
  return { success: false, error };
}
