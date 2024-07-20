async function asyncFilter<T>(
  arr: T[],
  predicate: (value: T) => Promise<boolean>,
): Promise<T[]> {
  const results = await Promise.all(arr.map(predicate))

  return arr.filter((_v, index) => results[index])
}

export default asyncFilter
