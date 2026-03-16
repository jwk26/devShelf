export type ActionResult<T> = {
  data: T;
  error?: string;
};

export function ok<T>(data: T): ActionResult<T> {
  return { data };
}

export function fail<T>(error: string): ActionResult<T> {
  return { data: null as T, error };
}
