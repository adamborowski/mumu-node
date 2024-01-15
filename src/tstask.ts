type ResultMapper<T extends object> = {
  [K in keyof T as `${K & string}Result`]: T[K] extends (...args: any[]) => any
    ? ReturnType<T[K]>
    : never;
};

export function tsTask<T extends object>(obj: T): ResultMapper<T> {
  const result = {} as ResultMapper<T>;
  for (const key in obj) {
    let executor = obj[key];
    if (typeof executor === "function") {
      result[key + "Result"] = executor();
    }
  }
  return result;
}
