export function nameof<T>(key: Extract<keyof T, string>): string  {
  return key;
}

export function assertNever(x: never): never {
  throw new Error('Unexpected object: ' + x);
}
