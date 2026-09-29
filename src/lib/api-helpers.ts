import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

/** Wraps a route handler body, turning zod/parse errors into clean 400s and
 * anything else into a generic 500 (never leaking internals to the client). */
export async function withErrorHandling(
  fn: () => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof ZodError) {
      return jsonError(
        err.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "),
        422
      );
    }
    if (err instanceof SyntaxError) {
      return jsonError("Malformed JSON body", 400);
    }
    console.error(err);
    return jsonError("Something went wrong. Please try again.", 500);
  }
}
