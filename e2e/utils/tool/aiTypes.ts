export type AiQuery = (request: string) => Promise<string>;

// Return/message/opts are library-specific; keep them generic to align broadly
export type AiAssert = (
  assertion: string,
  msg?: string,
  opt?: unknown
) => Promise<unknown>;