export function removeDuplicates<T>(array: T[]) {
  return [...new Set(array)]
}
